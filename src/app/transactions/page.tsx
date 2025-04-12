"use client";

import { useEffect, useState } from "react";
import { HomeButton } from "@/components/ui/HomeButton";

interface Transaction {
  id: number;
  transaction_date: string;
  transaction_time: string;
  transaction_type: string;
  category_large: string;
  category_small: string;
  description: string;
  amount: number;
  currency: string;
  payment_method: string;
  memo: string;
  source_file: string;
  uploaded_by: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(month);
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;
  
    setLoading(true);
    fetch(`/api/transactions?month=${selectedMonth}`)
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        setTransactions(data);
        setLoading(false);
      });
  }, [selectedMonth]);

  return (
    <div className="p-4">
      <HomeButton />
      <h1 className="text-2xl font-bold mb-4">가계부 내역</h1>
      {/* 📆 월 선택 */}
      <div className="mb-4">
      <label htmlFor="month" className="font-semibold mr-2">조회 월:</label>
      <input
        id="month"
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="border p-1 rounded"
      />
      </div>

      {/* 🔄 로딩 중 */}
      {loading ? (
        <p className="text-center">📦 데이터를 불러오는 중...</p>
      ) : (
        <div className="overflow-x-auto max-h-[70vh] relative rounded border">
          <table className="min-w-[1000px] w-full text-xs sm:text-sm border text-left">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="bg-gray-100">
                <th className="p-2 border whitespace-nowrap">No</th>
                <th className="p-2 border whitespace-nowrap">날짜</th>
                <th className="p-2 border whitespace-nowrap">시간</th>
                <th className="p-2 border whitespace-nowrap">타입</th>
                <th className="p-2 border whitespace-nowrap">대분류</th>
                <th className="p-2 border whitespace-nowrap">소분류</th>
                <th className="p-2 border whitespace-nowrap">내용</th>
                <th className="p-2 border whitespace-nowrap">금액</th>
                <th className="p-2 border whitespace-nowrap">통화</th>
                <th className="p-2 border whitespace-nowrap">결제수단</th>
                <th className="p-2 border whitespace-nowrap">메모</th>
                <th className="p-2 border whitespace-nowrap">엑셀파일</th>
                <th className="p-2 border whitespace-nowrap">업로드한 사람</th> 
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={tx.id} className="even:bg-gray-50">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border whitespace-nowrap">{tx.transaction_date?.split("T")[0] || ""}</td>
                  <td className="p-2 border whitespace-nowrap">{tx.transaction_time}</td>
                  <td className="p-2 border">{tx.transaction_type}</td>
                  <td className="p-2 border">{tx.category_large}</td>
                  <td className="p-2 border">{tx.category_small}</td>
                  <td className="p-2 border">{tx.description}</td>
                  <td className="p-2 border text-right whitespace-nowrap">{tx.amount.toLocaleString()}원</td>
                  <td className="p-2 border">{tx.currency}</td>
                  <td className="p-2 border">{tx.payment_method}</td>
                  <td className="p-2 border">{tx.memo}</td>
                  <td className="p-2 border">{tx.source_file}</td>
                  <td className="p-2 border">{tx.uploaded_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
