import { query } from "@/lib/db/client";
import { Transaction } from "@/model/transaction";

async function selectMaxTransactionDate(uploadedBy: string) {
  const query1 = `
    SELECT MAX(transaction_date) AS latest 
    FROM finance_transactions 
    WHERE uploaded_by = ?
  `;

  return await query(query1, [uploadedBy]);
}

async function insertTransactions(transactions: Transaction[]) {
  const insertQuery = `
    INSERT INTO finance_transactions (
      transaction_date, transaction_time, transaction_type,
      category_large, category_small, description, amount,
      currency, payment_method, memo, source_file, uploaded_by
    ) VALUES ?
  `;

  // 각 행을 배열로 변환
  const values = transactions.map((tx) => [
    tx.transaction_date,
    tx.transaction_time,
    tx.transaction_type,
    tx.category_large,
    tx.category_small,
    tx.description,
    tx.amount,
    tx.currency,
    tx.payment_method,
    tx.memo,
    tx.source_file,
    tx.uploaded_by,
  ]);

  await query(insertQuery, [values]);
}

export {insertTransactions, selectMaxTransactionDate}