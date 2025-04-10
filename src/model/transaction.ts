export interface Transaction {
  transaction_date: string | null;
  transaction_time: string | null;
  transaction_type: string | null;
  category_large: string | null;
  category_small: string | null;
  description: string | null;
  amount: number;
  currency: string | null;
  payment_method: string | null;
  memo: string | null;
  source_file: string;
  uploaded_by: string;
}
