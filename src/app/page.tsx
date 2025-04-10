"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 space-y-4">
      <h1 className="text-3xl font-bold mb-6">가계부 관리 홈</h1>

      <Button onClick={() => router.push("/excel-upload")}>
        엑셀 업로드 하기
      </Button>

      <Button onClick={() => router.push("/uploads")} variant="outline">
        업로드 이력 관리
      </Button>

      <Button onClick={() => router.push("/transactions")}>
        거래내역 보기
      </Button>

      <Button onClick={() => router.push("/summary")} variant="outline">
        요약
      </Button>
    </div>
  );
}
