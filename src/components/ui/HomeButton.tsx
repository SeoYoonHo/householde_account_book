"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Home } from "lucide-react";

function HomeButton() {
  const router = useRouter();

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/")}
        className="flex items-center gap-1"
      >
        <Home size={16} />
        홈으로
      </Button>
    </div>
  );
}

export { HomeButton }
