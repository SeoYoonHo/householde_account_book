import { NextResponse } from "next/server";
import { query } from "@/lib/db/client";

export async function GET() {
  const [rows] = await query(`
    SELECT source_file, uploaded_by, COUNT(*) AS count
    FROM finance_transactions
    GROUP BY source_file, uploaded_by
    ORDER BY source_file DESC, uploaded_by
  `);
  return NextResponse.json(rows);
}
