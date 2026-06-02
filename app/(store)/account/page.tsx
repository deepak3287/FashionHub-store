"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // check auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async () => {
    if (!email) {
      setError("Please enter email first");
      return;
    }
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // LOGGED IN UI
  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>My Account</h2>
        <p>Welcome: {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // LOGIN / SIGNUP UI
  return (
    <div style={{ maxWidth: 350, margin: "auto", padding: 20 }}>
      <h2>{isSignup ? "Create Account" : "Login"}</h2>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {isSignup ? (
        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      )}

      <br /><br />

      <button onClick={googleLogin}>
        Continue with Google
      </button>

      <br /><br />

      <button onClick={forgotPassword}>
        Forgot Password
      </button>

      <p
        style={{ cursor: "pointer", color: "blue", marginTop: 10 }}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup
          ? "Already have an account? Login"
          : "New user? Create account"}
      </p>
    </div>
  );
}