import { NextResponse } from "next/server";
import { pool } from "@/lib/db/pool";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const whereClause = month ? `WHERE DATE_FORMAT(transaction_date, '%Y-%m') = '${month}'` : '';
  const [rows] = await pool.query(`
    SELECT
      transaction_type,
      category_large,
      category_small,
      description,
      SUM(amount) AS total
    FROM finance_transactions
    ${whereClause}
    GROUP BY transaction_type, category_large, category_small, description
    ORDER BY transaction_type, category_large, category_small, description
  `);

  return NextResponse.json(rows);
}