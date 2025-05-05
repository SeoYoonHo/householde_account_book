// components/Login.tsx
"use client";

export default function Login() {
  const handleLogin = () => {
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!
    );
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&scope=openid account_email`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-50 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">로그인이 필요합니다</h1>
      <button
        onClick={handleLogin}
        className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
      >
        카카오 로그인
      </button>
    </div>
  );
}
