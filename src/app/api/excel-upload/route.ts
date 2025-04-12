import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { parseTransactions } from "@/lib/excel/parseTransactions";
import { selectMaxTransactionDate, insertTransactions } from "@/query/excel-upload/query";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("excelFile") as File | null;
    const uploadedBy = formData.get("uploadedBy") as string;
    if (!file || !uploadedBy) {
      return NextResponse.json({ message: "파일 또는 업로더 정보 없음" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = new ExcelJS.Workbook();  
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet("가계부 내역");
    if (!worksheet) return error(`"가계부 내역" 시트를 찾을 수 없습니다.`, 400);

    const result: unknown = await selectMaxTransactionDate(uploadedBy);
    const latestRaw = result?.[0]?.[0]?.latest ?? null;
    const latestDate: string = latestRaw instanceof Date
                                 ? latestRaw.toISOString().split("T")[0]
                                 : "0000-00-00";

    const transactions = parseTransactions(worksheet, file.name, uploadedBy);
    const filtered = transactions.filter((item) => item.transaction_date > latestDate);
    console.log(filtered.length);

    await insertTransactions(filtered);

    return NextResponse.json({ message: `✅ ${file.name} 업로드 성공` });
  } catch (e: unknown) {
    console.error("업로드 에러:", e);
    return error("업로드 실패", 500, e.message);
  }
}

function error(message: string, status: number, detail?: string) {
  return NextResponse.json({ message, detail }, { status });
}
