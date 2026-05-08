export interface Vendor {
  id: string;
  name: string;
  address?: string;
  gstin?: string;
  email?: string;
  avg_invoice_amount: number;
  invoice_count: number;
  created_at: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  vendor_id?: string;
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  line_items: LineItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'flagged';
  file_url?: string;
  parsed_data?: Record<string, unknown>;
  fraud_score: number;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  invoice_id?: string;
  category: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  transaction_date: string;
  created_at: string;
  vendor_name?: string;
  reference_id?: string;
  status?: string;
}

export interface FraudAlert {
  id: string;
  invoice_id?: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  details: string;
  is_resolved: boolean;
  created_at: string;
  invoice_number?: string;
  vendor_name?: string;
}

export interface Reconciliation {
  id: string;
  po_data: ReconciliationDocument;
  grn_data: ReconciliationDocument;
  invoice_id?: string;
  match_status: string;
  mismatches: Mismatch[];
  created_at: string;
}

export interface ReconciliationDocument {
  reference_number: string;
  vendor_name: string;
  items: { description: string; quantity: number; rate: number }[];
  total_amount: number;
  date: string;
}

export interface Mismatch {
  field: string;
  po_value: string | number;
  grn_value: string | number;
  invoice_value: string | number;
  severity: 'low' | 'medium' | 'high';
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  next_due_date: string;
  category: string;
  is_active: boolean;
  created_at: string;
  logo?: string;
}

export interface GSTReport {
  period: string;
  b2b_invoices: number;
  b2c_large: number;
  export_invoices: number;
  total_tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  compliance_score: number;
}

export interface CurrencyRate {
  base: string;
  target: string;
  rate: number;
  timestamp: number;
}

export interface FinancingOffer {
  lender: string;
  advance_amount: number;
  fee_percentage: number;
  fee_amount: number;
  total_repayable: number;
  net_benefit: number;
  processing_time: string;
}

export interface ExpenseSplit {
  participant: string;
  email: string;
  amount: number;
  percentage: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export type AgingBucket = {
  label: string;
  count: number;
  amount: number;
  range: string;
};
