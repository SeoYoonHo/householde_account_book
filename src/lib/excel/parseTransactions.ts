import { Worksheet, CellValue, Row } from "exceljs";
import { Transaction } from "@/lib/models/";
import { toText, formatDate, formatTime } from "../../utils/excelUtils";

export function parseTransactions(worksheet: Worksheet, sourceFileName: string, uploadedBy: string): Transaction[] {
  const transactions: Transaction[] = [];

  worksheet.eachRow((row: Row, rowNumber: number) => {
    if (rowNumber === 1) return;

    const [
      날짜, 시간, 타입, 대분류, 소분류,
      내용, 금액, 화폐, 결제수단, 메모
    ] = row.values.slice(1) as CellValue[];

    transactions.push({
      transaction_date: formatDate(날짜),
      transaction_time: formatTime(시간),
      transaction_type: toText(타입),
      category_large: toText(대분류),
      category_small: toText(소분류),
      description: toText(내용),
      amount: parseInt(금액 as string) || 0,
      currency: toText(화폐),
      payment_method: toText(결제수단),
      memo: toText(메모),
      source_file: sourceFileName,
      uploaded_by: uploadedBy
    });
  });

  return transactions;
}

