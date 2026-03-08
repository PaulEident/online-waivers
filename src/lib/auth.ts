import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
    async jwt({ token, user, trigger }) {
      console.log("[AUTH] jwt callback", { hasUser: !!user, trigger, tokenId: token.id, tokenSub: token.sub });
      // On sign-in: store the user id and fetch role from DB
      // This runs in Node.js runtime (not Edge) during sign-in
      if (user) {
        token.id = user.id;
        // Fetch role at sign-in time (safe: runs in Node.js)
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id as string },
            select: { role: true },
          });
          token.role = dbUser?.role || "USER";
        } catch {
          // Edge runtime - can't use Prisma, use cached role
          token.role = "USER";
        }
      }

      // On update trigger (e.g. after role change), refresh from DB
      if (trigger === "update" && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          token.role = dbUser?.role || "USER";
        } catch {
          // Edge runtime fallback
        }
      }

      return token;
    },
    async session({ session, token }) {
      console.log("[AUTH] session callback", { hasUser: !!session.user, tokenId: token.id, tokenSub: token.sub });
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
  },
});
