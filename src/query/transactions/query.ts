import { query } from "@/lib/db/client";

async function selectTransactions(month: string) {
  const selectQuery = `
    SELECT * FROM finance_transactions
      WHERE DATE_FORMAT(transaction_date, '%Y-%m') = ?
      ORDER BY transaction_date DESC, transaction_time DESC
  `;

  return await query(selectQuery, [month]);
}

export {selectTransactions}