export interface Transaction {
  id: number;
  transaction_date: string;
  transaction_time: string;
  transaction_type: string;
  category_large: string;
  category_small: string;
  description: string;
  amount: number;
  currency: string;
  payment_method: string;
  memo: string;
  source_file: string;
  uploaded_by: string;
}
