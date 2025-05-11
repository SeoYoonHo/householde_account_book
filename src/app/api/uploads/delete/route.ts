// app/api/uploads/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const { source_file, uploaded_by } = await req.json();

  if (!source_file || !uploaded_by) {
    return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
  }

  const [result] = await query(
    `DELETE FROM finance_transactions WHERE source_file = ? AND uploaded_by = ?`,
    [source_file, uploaded_by]
  );

  return NextResponse.json({ message: "삭제 완료", affectedRows: result.affectedRows });
}
