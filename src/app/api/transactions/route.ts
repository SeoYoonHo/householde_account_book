import { NextRequest, NextResponse } from "next/server";
import { selectTransactions } from "@/query/transactions/query";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // 예: 2025-03

  if (!month) {
    return NextResponse.json({ message: "month 파라미터가 필요합니다." }, { status: 400 });
  }

  const [rows] = await selectTransactions(month);
  return NextResponse.json(rows);
}
