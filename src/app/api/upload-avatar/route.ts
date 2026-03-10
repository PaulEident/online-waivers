import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File must be a JPG, PNG, or WebP image" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 2MB" }, { status: 400 });
  }

  // Get current user to check for existing blob avatar
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  // Delete old blob if it exists
  if (user?.image?.includes("blob.vercel-storage.com")) {
    try {
      await del(user.image);
    } catch {
      // Ignore delete errors for old avatars
    }
  }

  // Upload new avatar
  const blob = await put(`avatars/${session.user.id}/${file.name}`, file, {
    access: "public",
  });

  // Update user record
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
  });

  return NextResponse.json({ url: blob.url });
}
