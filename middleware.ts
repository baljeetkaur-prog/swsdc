import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyAdminToken(token: string) {
  if (!JWT_SECRET) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("adminToken")?.value;

  // Allow login page if user is not logged in
  if (pathname === "/admin/login") {
    if (token) {
      const isAdmin = await verifyAdminToken(token);

      if (isAdmin) {
        return NextResponse.redirect(
          new URL("/admin/dashboard", request.url)
        );
      }
    }

    return NextResponse.next();
  }

  // All other admin pages require authentication
  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  const isAdmin = await verifyAdminToken(token);

  if (!isAdmin) {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );

    response.cookies.delete("adminToken");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};