"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Check auth state and redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        router.push("/account");
      }
    });
    return () => unsub();
  }, [router]);

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="premium-container py-16">
      <div className="mx-auto max-w-md">
        <div className="premium-card p-8">
          <h1 className="text-3xl font-black">Login</h1>
          <p className="mt-2 text-sm text-black/60">Sign in to your account</p>

          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {resetEmailSent && (
              <p className="text-sm text-green-600">
                ✓ Password reset email sent to {email}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || resetEmailSent}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-black/60">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={googleLogin}
            disabled={loading}
            className="btn-light w-full"
          >
            {loading ? "Signing in..." : "Google"}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-4 w-full text-sm text-mutedgold hover:underline"
          >
            {resetEmailSent ? "Reset email sent" : "Forgot password?"}
          </button>

          <p className="mt-6 text-center text-sm">
            New user?{" "}
            <Link href="/register" className="font-bold text-mutedgold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
