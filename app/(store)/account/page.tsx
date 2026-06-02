"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { LogOut } from "lucide-react";

import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err: any) {
      console.error("Logout failed:", err.message);
    }
  };

  if (loading) {
    return (
      <main className="premium-container py-16">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  // LOGGED IN UI
  if (user) {
    return (
      <main className="premium-container py-16">
        <div className="mx-auto max-w-2xl">
          <div className="premium-card p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black">My Account</h1>
                <p className="mt-2 text-sm text-black/60">Welcome back!</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-light flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>

            <div className="mt-8 grid gap-6">
              <div className="border-t border-black/10 pt-6">
                <h2 className="text-lg font-bold">Account Information</h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-black/60">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  {user.displayName && (
                    <div>
                      <p className="text-sm text-black/60">Name</p>
                      <p className="font-medium">{user.displayName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-black/60">Account Created</p>
                    <p className="font-medium">
                      {user.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-black/10 pt-6">
                <h2 className="text-lg font-bold">Quick Links</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Link href="/my-orders" className="btn-light">
                    My Orders
                  </Link>
                  <Link href="/wishlist" className="btn-light">
                    Wishlist
                  </Link>
                  <Link href="/shop" className="btn-light">
                    Continue Shopping
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-light text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // NOT LOGGED IN - REDIRECT TO LOGIN
  return (
    <main className="premium-container py-16">
      <div className="mx-auto max-w-md">
        <div className="premium-card p-8 text-center">
          <h1 className="text-3xl font-black">Access Denied</h1>
          <p className="mt-2 text-black/60">Please log in to view your account</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
            <Link href="/register" className="btn-light">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}