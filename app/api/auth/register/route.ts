import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { createToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = registerSchema.parse(await req.json());
    const exists = await User.findOne({ email: body.email });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const user = await User.create({
      name: body.name,
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, 12),
      role: "customer"
    });

    const sessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    setAuthCookie(await createToken(sessionUser));
    return NextResponse.json({ user: sessionUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 });
  }
}
