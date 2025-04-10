"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HomeButton } from "@/components/ui/HomeButton";
import { Card, CardContent } from "@/components/ui/card";

export default function ExcelUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploader, setUploader] = useState("서윤호");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !uploader) {
      alert("파일과 업로더를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("excelFile", file);
    formData.append("uploadedBy", uploader);

    try {
      const res = await fetch("/api/excel-upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setMessage(res.ok ? `✅ ${result.message}` : `❌ ${result.message}`);
    } catch (error) {
      setMessage(`❌ 업로드 중 오류 발생: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <HomeButton />
      <Card className="w-full max-w-md shadow-md border">
        <CardContent className="py-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">엑셀 업로드</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">엑셀 파일</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="uploader">업로드한 사람</Label>
              <select
                id="uploader"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                disabled={isLoading}
                className="w-full border p-2 rounded"
              >
                <option value="서윤호">서윤호</option>
                <option value="이서윤">이서윤</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !file}>
              {isLoading ? "업로드 중..." : "업로드"}
            </Button>

            {message && (
              <p className="text-sm text-center text-muted-foreground mt-2">{message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
