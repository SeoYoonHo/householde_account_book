// src/app/api/auth/kakao/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ message: "Missing code" }, { status: 400 });

  try {
    // 1. 카카오 토큰 요청
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;
    if (!idToken) return NextResponse.json({ message: "Missing id_token" }, { status: 401 });

    // 2. id_token 디코딩
    const decoded = jwt.decode(idToken) as {
      sub: string;
      email?: string;
    };

    const { sub, email } = decoded;

    if (!email) {
      return NextResponse.json({ message: "이메일 정보가 없습니다. 동의 필요." }, { status: 403 });
    }

    // 3. DB 조회: 이메일 기준 사용자 존재 여부
    const [rows]: unknown[] = await query(`
      SELECT * FROM users WHERE email = ?
      `, [email]);
    
    console.log(rows);

    if (!rows.length) {
      return NextResponse.json({ message: "등록되지 않은 사용자입니다." }, { status: 401 });
    }

    // 4. JWT 토큰 발급
    const accessToken = jwt.sign({ email, sub }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("accessToken", accessToken, { httpOnly: true, path: "/", maxAge: 7 * 24 * 3600 });

    return res;
  } catch (err) {
    console.error("카카오 로그인 실패:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
