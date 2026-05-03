import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("fashionhub_token")?.value;
  const user = await verifyToken(token);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user || user.role !== "admin") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if ((pathname.startsWith("/account") || pathname.startsWith("/my-orders")) && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/my-orders/:path*"]
};
