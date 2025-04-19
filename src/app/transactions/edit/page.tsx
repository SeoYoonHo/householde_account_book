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
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [bulkField, setBulkField] = useState<keyof Transaction | "">("");
  const [bulkValue, setBulkValue] = useState("");

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

  const handleBulkApply = () => {
    if (!bulkField) return;
    setTransactions((prev) =>
      prev.map((tx) =>
        selectedIds.includes(tx.id)
          ? { ...tx, [bulkField]: bulkField === "amount" ? Number(bulkValue) : bulkValue }
          : tx
      )
    );
    setShowModal(false);
    setBulkField("");
    setBulkValue("");
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

  const fieldDisplayNames: Record<keyof Transaction, string> = {
    transaction_type: "타입",
    category_large: "대분류",
    category_small: "소분류",
    description: "내용",
    amount: "금액",
    currency: "통화",
    payment_method: "결제수단",
    memo: "메모",
    id: "ID",
    transaction_date: "날짜",
    transaction_time: "시간",
    source_file: "엑셀파일",
    uploaded_by: "업로드한 사람",
  };;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">거래내역 수정</h1>

      {loading ? (
        <p className="text-center">📦 데이터를 불러오는 중...</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            {!bulkMode ? (
              <button
                onClick={() => setBulkMode(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                여러개 수정하기
              </button>
            ) : (
              <div className="space-x-2">
                <button onClick={() => setBulkMode(false)} className="bg-gray-400 text-white px-3 py-1 rounded">
                  취소하기
                </button>
                <button onClick={() => setShowModal(true)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  변경하기
                </button>
                <button onClick={() => setBulkMode(false)} className="bg-green-600 text-white px-3 py-1 rounded">
                  반영완료
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto max-h-[70vh] relative rounded border">
            <table className="min-w-[1000px] w-full text-xs sm:text-sm border text-left">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="bg-gray-100">
                  {bulkMode && <th className="p-2 border">선택</th>}
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
                    {bulkMode && (
                      <td className="p-2 border text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(tx.id)}
                          onChange={(e) => {
                            setSelectedIds((prev) =>
                              e.target.checked ? [...prev, tx.id] : prev.filter((id) => id !== tx.id)
                            );
                          }}
                        />
                      </td>
                    )}
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

          {!bulkMode && (
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
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow w-80">
                <h2 className="text-lg font-semibold mb-2">일괄 수정</h2>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">컬럼 선택</label>
                  <select
                    className="w-full border p-1 rounded"
                    value={bulkField}
                    onChange={(e) => setBulkField(e.target.value as keyof Transaction)}
                  >
                    <option value="">선택</option>
                    {editableFields.map((field) => (
                      <option key={field} value={field}>{fieldDisplayNames[field]}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">값 입력</label>
                  <input
                    type="text"
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-300 rounded">취소</button>
                  <button onClick={handleBulkApply} className="px-3 py-1 bg-blue-600 text-white rounded">확인</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
