"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
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
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // LOGIN
  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // SIGNUP
  const handleSignup = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // FORGOT PASSWORD
  const forgotPassword = async () => {
    await sendPasswordResetEmail(auth, email);
    alert("Reset email sent!");
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // IF LOGGED IN
  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>My Account</h2>
        <p>{user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // LOGIN / SIGNUP UI
  return (
    <div style={{ maxWidth: 350, margin: "auto", padding: 20 }}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {isSignup ? (
        <button onClick={handleSignup}>Sign Up</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      <br /><br />

      <button onClick={googleLogin}>
        Continue with Google
      </button>

      <br /><br />

      <button onClick={forgotPassword}>
        Forgot Password
      </button>

      <br /><br />

      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup
          ? "Already have account? Login"
          : "New user? Create account"}
      </p>
    </div>
  );
}