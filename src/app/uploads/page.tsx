"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/ui/HomeButton";

interface UploadStat {
  source_file: string;
  uploaded_by: string;
  count: number;
}

export default function UploadStatsPage() {
  const [stats, setStats] = useState<UploadStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/uploads")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (file: string, user: string) => {
    const confirm = window.confirm(
      `"${user}"이(가) 업로드한 "${file}"의 데이터를 정말 삭제하시겠습니까?`
    );
    if (!confirm) return;

    const res = await fetch("/api/uploads/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_file: file, uploaded_by: user }),
    });

    const result = await res.json();
    alert(`✅ ${result.message} (${result.affectedRows}건 삭제됨)`);

    // 삭제 후 다시 조회
    setStats((prev) =>
      prev.filter((row) => !(row.source_file === file && row.uploaded_by === user))
    );
  };

  let content; 

  if (loading) {
    content = <p>데이터 불러오는 중...</p>;
  } else if (stats.length === 0) {
    content = <p>업로드된 데이터가 없습니다.</p>;
  } else {
    content = (
      <table className="w-full text-sm border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">No</th>
            <th className="p-2 border">엑셀파일명</th>
            <th className="p-2 border">업로드한 사람</th>
            <th className="p-2 border">업로드 건수</th>
            <th className="p-2 border">삭제</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, idx) => (
            <tr key={`${row.source_file}-${row.uploaded_by}`} className="even:bg-gray-50">
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border">{row.source_file}</td>
              <td className="p-2 border">{row.uploaded_by}</td>
              <td className="p-2 border text-right">{row.count.toLocaleString()} 건</td>
              <td className="p-2 border text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(row.source_file, row.uploaded_by)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="relative p-6">
      <HomeButton />
      <h1 className="text-2xl font-bold mb-4">업로드 이력 관리</h1>
      {content}
    </div>
  );
}
