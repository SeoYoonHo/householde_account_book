export function toText(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (value instanceof Date) return value.toISOString();
  return null; // 객체나 undefined 등은 무시
}

export function formatDate(value: CellValue): string | null {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "string") return value;
  return null;
}

export function formatTime(value: ExcelJS.CellValue): string | null {
  if (value instanceof Date) {
    return value.toTimeString().split(" ")[0]; // 'HH:MM:SS' 추출
  }
  if (typeof value === "string") {
    // "08:38" 같은 경우 그대로 사용, seconds 없을 수도 있음
    return value.length === 5 ? value + ":00" : value;
  }
  return null;
}
