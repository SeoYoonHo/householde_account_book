import { Suspense } from "react";
import EditTransactionsPage from "./EditTransactionsPageInner";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <EditTransactionsPage />
    </Suspense>
  );
}