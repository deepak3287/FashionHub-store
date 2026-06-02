# Quick Code Reference - Authentication System

## 1. Firebase Configuration

**File**: `/lib/firebase.ts`

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // Replace with your Firebase API key
  authDomain: "YOUR_PROJECT.firebaseapp.com",  // Replace with your auth domain
  projectId: "YOUR_PROJECT_ID",              // Replace with your project ID
  appId: "1:123456789:web:abcdef123456"      // Replace with your app ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

**How to get these values**:
1. Go to https://console.firebase.google.com
2. Select your project
3. Click "Project Settings" (gear icon)
4. Find your Web app credentials under "Your apps"
5. Copy the config object

---

## 2. Navbar Link (Header.tsx)

**File**: `/components/Header.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Heart, User } from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-cream/95 backdrop-blur">
      {/* ... rest of header ... */}
      
      {/* THIS LINK WORKS! */}
      <Link href={!loading && user ? "/account" : "/login"}>
        <User size={20} />
      </Link>
    </header>
  );
}
```

**Why it works**:
- ✅ Checks Firebase auth state on client
- ✅ Updates link in real-time
- ✅ No 404 errors - routes exist
- ✅ Redirects logged-in users to `/account`
- ✅ Redirects not-logged-in users to `/login`

---

## 3. Login Page (/app/(store)/login/page.tsx)

```typescript
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

  // Auto-redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        router.push("/account");
      }
    });
    return () => unsub();
  }, [router]);

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

  const handleGoogleLogin = async () => {
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent to " + email);
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

          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <input
              type="email"
              className="input w-full"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn-light w-full mt-4"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-4 w-full text-sm text-mutedgold hover:underline"
          >
            Forgot password?
          </button>

          <p className="mt-6 text-center text-sm">
            New user?{" "}
            <Link href="/register" className="font-bold text-mutedgold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
```

**Features**:
- ✅ Email/password login
- ✅ Google OAuth login
- ✅ Forgot password
- ✅ Auto-redirect if already logged in
- ✅ Error handling

---

## 4. Account Page (/app/(store)/account/page.tsx)

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  if (loading) {
    return <main className="premium-container py-16"><div>Loading...</div></main>;
  }

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
              <button onClick={handleLogout} className="btn-light flex items-center gap-2">
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
                </div>
              </div>

              <div className="border-t border-black/10 pt-6">
                <h2 className="text-lg font-bold">Quick Links</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Link href="/my-orders" className="btn-light">My Orders</Link>
                  <Link href="/wishlist" className="btn-light">Wishlist</Link>
                  <Link href="/shop" className="btn-light">Continue Shopping</Link>
                  <button onClick={handleLogout} className="btn-light text-red-600">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Not logged in
  return (
    <main className="premium-container py-16">
      <div className="mx-auto max-w-md">
        <div className="premium-card p-8 text-center">
          <h1 className="text-3xl font-black">Access Denied</h1>
          <p className="mt-2 text-black/60">Please log in to view your account</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/login" className="btn-primary">Sign In</Link>
            <Link href="/register" className="btn-light">Create Account</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
```

**Features**:
- ✅ Shows account info if logged in
- ✅ Logout functionality
- ✅ Quick links to orders, wishlist, etc.
- ✅ Shows login prompt if not authenticated
- ✅ Loading state handling

---

## 5. Registration Page (/app/(store)/register/page.tsx)

```typescript
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Success
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="premium-container py-16">
      <div className="mx-auto max-w-md">
        <div className="premium-card p-8">
          <h1 className="text-3xl font-black">Create Account</h1>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
              type="text"
              className="input w-full"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              className="input w-full"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              className="input w-full"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-mutedgold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
```

**Features**:
- ✅ Name, email, password fields
- ✅ Client-side validation
- ✅ Server-side registration
- ✅ Error handling

---

## Testing Checklist

```bash
# Start dev server
npm run dev

# Navigate to http://localhost:3000

# Test 1: Not logged in
# Click account icon → Should go to /login

# Test 2: Login
# Fill credentials → Click Sign In → Should go to /account

# Test 3: Already logged in
# Click account icon → Should go to /account (not /login)

# Test 4: Logout
# Click Logout on /account → Should go to home
# Click account icon → Should go to /login again

# Test 5: Google OAuth (if configured)
# Click "Continue with Google" on /login
# Should show Google popup
# After auth → Should go to /account
```

---

## Environment Variables for Vercel

Add these to your Vercel project settings under "Environment Variables":

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then update `/lib/firebase.ts` to use them:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
```

---

That's it! Your authentication system is now ready! 🚀
