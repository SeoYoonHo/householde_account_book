"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Transaction } from "@/model/transaction";

export default function EditTransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const month = searchParams.get("month") || "";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [originalData, setOriginalData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!month) return;
    setLoading(true);
    fetch(`/api/transactions?month=${month}`)
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        setTransactions(data);
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setLoading(false);
      });
  }, [month]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    field: keyof Transaction
  ) => {
    const newValue = field === "amount" ? Number(e.target.value) : e.target.value;
    setTransactions((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: newValue };
      return updated;
    });
  };

  const hasChanged = (rowIndex: number, field: keyof Transaction): boolean => {
    return transactions[rowIndex][field] !== originalData[rowIndex][field];
  };

  const handleSave = async () => {
    if (!confirm("수정하시겠습니까?")) return;

    const modified = transactions.filter((tx, idx) => JSON.stringify(tx) !== JSON.stringify(originalData[idx]));
    const res = await fetch("/api/transactions/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modified),
    });

    if (res.ok) {
      alert("수정 완료!");
      router.push("/transactions");
    } else {
      alert("수정 실패");
    }
  };

  const handleCancel = () => {
    if (confirm("수정을 취소하고 돌아가시겠습니까?")) {
      router.push("/transactions");
    }
  };

  const editableFields: (keyof Transaction)[] = [
    "transaction_type",
    "category_large",
    "category_small",
    "description",
    "amount",
    "currency",
    "payment_method",
    "memo",
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">거래내역 수정</h1>

      {loading ? (
        <p className="text-center">📦 데이터를 불러오는 중...</p>
      ) : (
        <>
          <div className="overflow-x-auto max-h-[70vh] relative rounded border">
            <table className="min-w-[1000px] w-full text-xs sm:text-sm border text-left">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="bg-gray-100">
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">날짜</th>
                  <th className="p-2 border">시간</th>
                  <th className="p-2 border">타입</th>
                  <th className="p-2 border">대분류</th>
                  <th className="p-2 border">소분류</th>
                  <th className="p-2 border">내용</th>
                  <th className="p-2 border">금액</th>
                  <th className="p-2 border">통화</th>
                  <th className="p-2 border">결제수단</th>
                  <th className="p-2 border">메모</th>
                  <th className="p-2 border">엑셀파일</th>
                  <th className="p-2 border">업로드한 사람</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={tx.id} className="even:bg-gray-50">
                    <td className="p-2 border text-center">{idx + 1}</td>
                    <td className="p-2 border">{tx.transaction_date?.split("T")[0]}</td>
                    <td className="p-2 border">{tx.transaction_time}</td>

                    {editableFields.map((field) => (
                      <td className="p-2 border" key={field}>
                        <input
                          type={field === "amount" ? "number" : "text"}
                          value={tx[field] ?? ""}
                          onChange={(e) => handleInputChange(e, idx, field)}
                          className={`w-full p-1 rounded border ${
                            hasChanged(idx, field) ? "bg-yellow-100" : "bg-white"
                          }`}
                        />
                      </td>
                    ))}

                    <td className="p-2 border">{tx.source_file}</td>
                    <td className="p-2 border">{tx.uploaded_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right space-x-2">
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded shadow"
            >
              취소하기
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              수정하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}