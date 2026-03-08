"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/volntir_app_icon.svg"
            alt=""
            width={28}
            height={28}
            priority
            className="rounded-md"
          />
          <span className="font-bold text-brand-dark text-lg tracking-tight hidden sm:inline">
            Volntir
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-brand font-medium transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-7 h-7 rounded-full ring-2 ring-gray-100"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="text-sm text-gray-700 hidden sm:inline font-medium">
                  {session.user.name || session.user.email}
                </span>
              </div>
              <button
                onClick={() => signOut({ redirectTo: "/" })}
                className="text-sm text-gray-400 hover:text-gray-600 ml-1 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm bg-brand hover:bg-brand-hover text-white px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
