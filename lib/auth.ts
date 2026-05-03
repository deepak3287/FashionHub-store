import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
};

export async function createToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token?: string): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionUser;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const token = cookies().get("fashionhub_token")?.value;
  return verifyToken(token);
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("fashionhub_token")?.value;
  return verifyToken(token);
}

export function setAuthCookie(token: string) {
  cookies().set("fashionhub_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  cookies().delete("fashionhub_token");
}
