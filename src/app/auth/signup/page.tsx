"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { signUp } from "@/lib/actions";

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const result = await signUp({ name, email, password });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <a href="/">
          <Image src="/volntir_logo_light.svg" alt="Volntir" width={160} height={40} className="mx-auto" priority />
        </a>
        <p className="text-gray-500 mt-3 text-sm">Create your account</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full flex items-center justify-center gap-3 bg-brand hover:bg-brand-hover text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">or create with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
          )}
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark hover:bg-gray-900 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Already have an account?{" "}
        <a href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-brand hover:text-brand-hover">
          Sign in
        </a>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </main>
  );
}
