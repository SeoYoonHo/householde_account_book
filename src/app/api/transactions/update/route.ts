import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db/pool"; // 너가 사용하는 DB 커넥션 풀 위치

// 수정 가능한 필드만 정의
const editableFields = [
  "transaction_type",
  "category_large",
  "category_small",
  "description",
  "amount",
  "currency",
  "payment_method",
  "memo",
];

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      for (const tx of updates) {
        const fieldsToUpdate = editableFields.filter((field) => field in tx);

        if (fieldsToUpdate.length === 0) continue;

        const setClause = fieldsToUpdate.map((field) => `${field} = ?`).join(", ");
        const values = fieldsToUpdate.map((field) => tx[field]);

        const query = `
          UPDATE finance_transactions
          SET ${setClause}
          WHERE id = ?
        `;

        await conn.execute(query, [...values, tx.id]);
      }

      await conn.commit();
      conn.release();

      return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("Update failed:", err);
      return NextResponse.json({ message: "Update failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
