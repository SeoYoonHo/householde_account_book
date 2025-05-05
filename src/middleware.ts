import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  processAuth(req);
}

function processAuth(req: NextRequest){
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

   // 1. ✅ public path는 무조건 통과
  const isPublicPath = [
    "/login",
    "/api/auth",
    "/api/auth/kakao/callback",
    "/favicon.ico",
  ].some((path) => pathname.startsWith(path));

  if(isPublicPath){
    return NextResponse.next();
  }

  // 2. ❌ 토큰이 없으면 인증 실패
  if (!token) {
    return handleUnauthorized(pathname, "Access token missing");
  }

  // 3. ✅ 토큰이 있으면 검증
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // ✅ 통과
  } catch (err) {
    console.error("JWT 검증 실패:", err);
    return handleUnauthorized(pathname, "Invalid or expired token");
  }
}

function handleUnauthorized(pathname: string, message: string) {
  if (pathname.startsWith("/api/")) {
    return new NextResponse(JSON.stringify({ message }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const loginUrl = new URL("/login", "http://localhost:3000"); // 또는 req.nextUrl.origin 사용
  return NextResponse.redirect(loginUrl);
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};