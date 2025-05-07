import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  return processAuth(req);
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
    return handleUnauthorized(req, "Access token missing");
  }

  // 3. ✅ 토큰이 있으면 검증
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // ✅ 통과
  } catch (err) {
    console.error("JWT 검증 실패:", err);
    return handleUnauthorized(req, "Invalid or expired token");
  }
}

function handleUnauthorized(req: NextRequest, message: string) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    return new NextResponse(JSON.stringify({ message }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login"; // 현재 origin 유지
  return NextResponse.redirect(loginUrl);
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};