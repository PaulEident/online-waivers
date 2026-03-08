"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/volntir_logo_light.svg"
            alt="Volntir"
            width={120}
            height={32}
            priority
            className="dark:hidden"
          />
          <Image
            src="/volntir_logo_dark.svg"
            alt="Volntir"
            width={120}
            height={32}
            priority
            className="hidden dark:block"
          />
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-brand-dark"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-7 h-7 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <button
                onClick={() => signOut({ redirectTo: "/" })}
                className="text-sm text-gray-500 hover:text-gray-700 ml-1"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm bg-brand hover:bg-brand-hover text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
