import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/register", "/login", "/forgot-password"];
const STATIC_PATHS = ["/_next", "/favicon"];
const PUBLIC_API_PATHS = ["/api/auth"];
const PROTECTED_API_PREFIX = "/api/";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (STATIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith(PROTECTED_API_PREFIX)) {
    if (PUBLIC_API_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!token) {
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/register", req.url));
  }

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};