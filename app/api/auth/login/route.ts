import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { createToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    await connectDB();
    const raw = await req.json();
    const body = loginSchema.parse(raw);

    const user = await User.findOne({ email: body.email });
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    if (user.blocked) return NextResponse.json({ error: "Account is blocked" }, { status: 403 });

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    if (raw.adminOnly && user.role !== "admin") {
      return NextResponse.json({ error: "Only admin can access dashboard" }, { status: 403 });
    }

    const sessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    setAuthCookie(await createToken(sessionUser));
    return NextResponse.json({ user: sessionUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 400 });
  }
}
