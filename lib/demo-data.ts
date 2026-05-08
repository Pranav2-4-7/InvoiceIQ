import { Invoice, LedgerEntry, FraudAlert, Subscription, Vendor, Reconciliation, AgingBucket } from '@/types';

export const demoVendors: Vendor[] = [
  { id: 'v1', name: 'Tata Consultancy Services', address: 'TCS House, Fort, Mumbai 400001', gstin: '27AAACT2727Q1ZV', email: 'billing@tcs.com', avg_invoice_amount: 245000, invoice_count: 12, created_at: '2024-01-15' },
  { id: 'v2', name: 'Infosys Limited', address: 'Electronics City, Bangalore 560100', gstin: '29AABCI1234F1ZP', email: 'invoices@infosys.com', avg_invoice_amount: 180000, invoice_count: 8, created_at: '2024-02-01' },
  { id: 'v3', name: 'Reliance Industries', address: 'Maker Chambers IV, Nariman Point, Mumbai 400021', gstin: '27AABCR5678G1Z3', email: 'accounts@ril.com', avg_invoice_amount: 520000, invoice_count: 5, created_at: '2024-01-20' },
  { id: 'v4', name: 'Wipro Technologies', address: 'Sarjapur Road, Bangalore 560035', gstin: '29AABCW1234H1ZK', email: 'finance@wipro.com', avg_invoice_amount: 156000, invoice_count: 15, created_at: '2024-03-01' },
  { id: 'v5', name: 'HCL Technologies', address: 'Sector 126, Noida 201303', gstin: '09AABCH5678L1Z2', email: 'billing@hcl.com', avg_invoice_amount: 198000, invoice_count: 10, created_at: '2024-02-15' },
  { id: 'v6', name: 'Mahindra & Mahindra', address: 'Gateway Building, Mumbai 400001', gstin: '27AABCM9012K1Z7', email: 'accounts@mahindra.com', avg_invoice_amount: 340000, invoice_count: 6, created_at: '2024-01-10' },
  { id: 'v7', name: 'Larsen & Toubro', address: 'L&T House, Ballard Estate, Mumbai 400001', gstin: '27AABCL3456M1Z1', email: 'invoices@lnt.com', avg_invoice_amount: 890000, invoice_count: 3, created_at: '2024-04-01' },
  { id: 'v8', name: 'Bajaj Auto Ltd', address: 'Akurdi, Pune 411035', gstin: '27AABCB7890N1Z5', email: 'finance@bajaj.com', avg_invoice_amount: 275000, invoice_count: 7, created_at: '2024-03-15' },
];

export const demoInvoices: Invoice[] = [
  { id: 'inv1', vendor_id: 'v1', vendor_name: 'Tata Consultancy Services', invoice_number: 'INV-2024-001', invoice_date: '2024-10-01', due_date: '2024-10-31', line_items: [{ description: 'Cloud Infrastructure Services', quantity: 1, rate: 200000, amount: 200000 }, { description: 'Support & Maintenance', quantity: 1, rate: 45000, amount: 45000 }], subtotal: 245000, cgst: 22050, sgst: 22050, igst: 0, total_amount: 289100, currency: 'INR', status: 'paid', fraud_score: 5, created_at: '2024-10-01' },
  { id: 'inv2', vendor_id: 'v2', vendor_name: 'Infosys Limited', invoice_number: 'INV-2024-002', invoice_date: '2024-10-05', due_date: '2024-11-04', line_items: [{ description: 'Software Development Q3', quantity: 1, rate: 180000, amount: 180000 }], subtotal: 180000, cgst: 0, sgst: 0, igst: 32400, total_amount: 212400, currency: 'INR', status: 'paid', fraud_score: 2, created_at: '2024-10-05' },
  { id: 'inv3', vendor_id: 'v3', vendor_name: 'Reliance Industries', invoice_number: 'INV-2024-003', invoice_date: '2024-10-08', due_date: '2024-11-07', line_items: [{ description: 'Raw Material - Polymer Grade A', quantity: 500, rate: 1040, amount: 520000 }], subtotal: 520000, cgst: 46800, sgst: 46800, igst: 0, total_amount: 613600, currency: 'INR', status: 'pending', fraud_score: 8, created_at: '2024-10-08' },
  { id: 'inv4', vendor_id: 'v4', vendor_name: 'Wipro Technologies', invoice_number: 'INV-2024-004', invoice_date: '2024-09-15', due_date: '2024-10-15', line_items: [{ description: 'IT Consulting', quantity: 40, rate: 3900, amount: 156000 }], subtotal: 156000, cgst: 0, sgst: 0, igst: 28080, total_amount: 184080, currency: 'INR', status: 'overdue', fraud_score: 12, created_at: '2024-09-15' },
  { id: 'inv5', vendor_id: 'v5', vendor_name: 'HCL Technologies', invoice_number: 'INV-2024-005', invoice_date: '2024-10-12', due_date: '2024-11-11', line_items: [{ description: 'Managed IT Services', quantity: 1, rate: 150000, amount: 150000 }, { description: 'Security Audit', quantity: 1, rate: 48000, amount: 48000 }], subtotal: 198000, cgst: 0, sgst: 0, igst: 35640, total_amount: 233640, currency: 'INR', status: 'paid', fraud_score: 3, created_at: '2024-10-12' },
  { id: 'inv6', vendor_id: 'v6', vendor_name: 'Mahindra & Mahindra', invoice_number: 'INV-2024-006', invoice_date: '2024-10-18', due_date: '2024-11-17', line_items: [{ description: 'Vehicle Fleet Lease Q4', quantity: 10, rate: 34000, amount: 340000 }], subtotal: 340000, cgst: 30600, sgst: 30600, igst: 0, total_amount: 401200, currency: 'INR', status: 'pending', fraud_score: 5, created_at: '2024-10-18' },
  { id: 'inv7', vendor_id: 'v7', vendor_name: 'Larsen & Toubro', invoice_number: 'INV-2024-007', invoice_date: '2024-08-20', due_date: '2024-09-19', line_items: [{ description: 'Construction Project Phase 2', quantity: 1, rate: 890000, amount: 890000 }], subtotal: 890000, cgst: 80100, sgst: 80100, igst: 0, total_amount: 1050200, currency: 'INR', status: 'overdue', fraud_score: 15, created_at: '2024-08-20' },
  { id: 'inv8', vendor_id: 'v8', vendor_name: 'Bajaj Auto Ltd', invoice_number: 'INV-2024-008', invoice_date: '2024-10-22', due_date: '2024-11-21', line_items: [{ description: 'Spare Parts Bulk Order', quantity: 200, rate: 1375, amount: 275000 }], subtotal: 275000, cgst: 24750, sgst: 24750, igst: 0, total_amount: 324500, currency: 'INR', status: 'paid', fraud_score: 4, created_at: '2024-10-22' },
  { id: 'inv9', vendor_id: 'v1', vendor_name: 'Tata Consultancy Services', invoice_number: 'INV-2024-009', invoice_date: '2024-10-25', due_date: '2024-11-24', line_items: [{ description: 'Data Analytics Platform License', quantity: 1, rate: 310000, amount: 310000 }], subtotal: 310000, cgst: 27900, sgst: 27900, igst: 0, total_amount: 365800, currency: 'INR', status: 'pending', fraud_score: 6, created_at: '2024-10-25' },
  { id: 'inv10', vendor_id: 'v2', vendor_name: 'Infosys Limited', invoice_number: 'INV-2024-010', invoice_date: '2024-07-10', due_date: '2024-08-09', line_items: [{ description: 'Legacy Migration Services', quantity: 1, rate: 425000, amount: 425000 }], subtotal: 425000, cgst: 0, sgst: 0, igst: 76500, total_amount: 501500, currency: 'INR', status: 'overdue', fraud_score: 22, created_at: '2024-07-10' },
  { id: 'inv11', vendor_id: 'v3', vendor_name: 'Reliance Industries', invoice_number: 'INV-2024-011', invoice_date: '2024-10-28', due_date: '2024-11-27', line_items: [{ description: 'Chemical Solvents - Industrial Grade', quantity: 100, rate: 2100, amount: 210000 }], subtotal: 210000, cgst: 18900, sgst: 18900, igst: 0, total_amount: 247800, currency: 'INR', status: 'paid', fraud_score: 3, created_at: '2024-10-28' },
  { id: 'inv12', vendor_id: 'v5', vendor_name: 'HCL Technologies', invoice_number: 'INV-2024-012', invoice_date: '2024-10-30', due_date: '2024-11-29', line_items: [{ description: 'Cybersecurity Assessment', quantity: 1, rate: 95000, amount: 95000 }], subtotal: 95000, cgst: 0, sgst: 0, igst: 17100, total_amount: 112100, currency: 'INR', status: 'pending', fraud_score: 7, created_at: '2024-10-30' },
  { id: 'inv13', vendor_id: 'v4', vendor_name: 'Wipro Technologies', invoice_number: 'INV-2024-013', invoice_date: '2024-10-02', due_date: '2024-10-09', line_items: [{ description: 'Emergency Server Maintenance', quantity: 1, rate: 85000, amount: 85000 }], subtotal: 85000, cgst: 0, sgst: 0, igst: 15300, total_amount: 100300, currency: 'INR', status: 'flagged', fraud_score: 45, created_at: '2024-10-02' },
  { id: 'inv14', vendor_id: 'v6', vendor_name: 'Mahindra & Mahindra', invoice_number: 'INV-2024-014', invoice_date: '2024-11-01', due_date: '2024-12-01', line_items: [{ description: 'Vehicle Insurance Premium', quantity: 10, rate: 12000, amount: 120000 }], subtotal: 120000, cgst: 10800, sgst: 10800, igst: 0, total_amount: 141600, currency: 'INR', status: 'pending', fraud_score: 2, created_at: '2024-11-01' },
  { id: 'inv15', vendor_id: 'v8', vendor_name: 'Bajaj Auto Ltd', invoice_number: 'INV-2024-015', invoice_date: '2024-11-02', due_date: '2024-12-02', line_items: [{ description: 'Electric Scooter Fleet', quantity: 5, rate: 145000, amount: 725000 }], subtotal: 725000, cgst: 65250, sgst: 65250, igst: 0, total_amount: 855500, currency: 'INR', status: 'pending', fraud_score: 18, created_at: '2024-11-02' },
];

export const demoLedger: LedgerEntry[] = [
  { id: 'l1', invoice_id: 'inv1', category: 'Software', description: 'Cloud Infrastructure Services - TCS', debit: 0, credit: 289100, balance: 289100, transaction_date: '2024-10-01', created_at: '2024-10-01', vendor_name: 'Tata Consultancy Services', reference_id: 'INV-2024-001', status: 'Settled' },
  { id: 'l2', invoice_id: 'inv2', category: 'Software', description: 'Software Development Q3 - Infosys', debit: 212400, credit: 0, balance: 76700, transaction_date: '2024-10-05', created_at: '2024-10-05', vendor_name: 'Infosys Limited', reference_id: 'INV-2024-002', status: 'Settled' },
  { id: 'l3', invoice_id: 'inv3', category: 'Raw Materials', description: 'Polymer Grade A - Reliance', debit: 613600, credit: 0, balance: -536900, transaction_date: '2024-10-08', created_at: '2024-10-08', vendor_name: 'Reliance Industries', reference_id: 'INV-2024-003', status: 'Pending' },
  { id: 'l4', invoice_id: 'inv4', category: 'Professional Services', description: 'IT Consulting - Wipro', debit: 184080, credit: 0, balance: -720980, transaction_date: '2024-09-15', created_at: '2024-09-15', vendor_name: 'Wipro Technologies', reference_id: 'INV-2024-004', status: 'Overdue' },
  { id: 'l5', invoice_id: 'inv5', category: 'Software', description: 'Managed IT + Security Audit - HCL', debit: 0, credit: 233640, balance: -487340, transaction_date: '2024-10-12', created_at: '2024-10-12', vendor_name: 'HCL Technologies', reference_id: 'INV-2024-005', status: 'Settled' },
  { id: 'l6', invoice_id: 'inv6', category: 'Utilities', description: 'Vehicle Fleet Lease Q4 - Mahindra', debit: 401200, credit: 0, balance: -888540, transaction_date: '2024-10-18', created_at: '2024-10-18', vendor_name: 'Mahindra & Mahindra', reference_id: 'INV-2024-006', status: 'Pending' },
  { id: 'l7', invoice_id: 'inv7', category: 'Professional Services', description: 'Construction Phase 2 - L&T', debit: 1050200, credit: 0, balance: -1938740, transaction_date: '2024-08-20', created_at: '2024-08-20', vendor_name: 'Larsen & Toubro', reference_id: 'INV-2024-007', status: 'Overdue' },
  { id: 'l8', invoice_id: 'inv8', category: 'Raw Materials', description: 'Spare Parts Bulk - Bajaj', debit: 0, credit: 324500, balance: -1614240, transaction_date: '2024-10-22', created_at: '2024-10-22', vendor_name: 'Bajaj Auto Ltd', reference_id: 'INV-2024-008', status: 'Settled' },
];

export const demoFraudAlerts: FraudAlert[] = [
  { id: 'fa1', invoice_id: 'inv13', alert_type: 'Unusual Payment Terms', severity: 'high', details: 'Invoice #INV-2024-013 from Wipro Technologies has only 7 days payment window. This deviates from the standard 30-day NET terms. Potential rush-through attempt or vendor spoofing.', is_resolved: false, created_at: '2024-10-02', invoice_number: 'INV-2024-013', vendor_name: 'Wipro Technologies' },
  { id: 'fa2', invoice_id: 'inv10', alert_type: 'Price Spike Detected', severity: 'medium', details: 'Invoice #INV-2024-010 from Infosys shows ₹4,25,000 which is 136% higher than their average invoice amount of ₹1,80,000. Review pricing before approval.', is_resolved: false, created_at: '2024-07-10', invoice_number: 'INV-2024-010', vendor_name: 'Infosys Limited' },
  { id: 'fa3', invoice_id: 'inv15', alert_type: 'New Vendor High Value', severity: 'low', details: 'First high-value invoice (₹8,55,500) from Bajaj Auto Ltd fleet order. Vendor verification recommended per compliance policy for orders exceeding ₹5,00,000.', is_resolved: false, created_at: '2024-11-02', invoice_number: 'INV-2024-015', vendor_name: 'Bajaj Auto Ltd' },
];

export const demoSubscriptions: Subscription[] = [
  { id: 's1', name: 'Amazon Web Services', amount: 45000, currency: 'INR', billing_cycle: 'monthly', next_due_date: '2024-12-01', category: 'Infrastructure', is_active: true, created_at: '2024-01-01', logo: 'cloud' },
  { id: 's2', name: 'Figma Enterprise', amount: 3800, currency: 'INR', billing_cycle: 'monthly', next_due_date: '2024-12-05', category: 'Design', is_active: true, created_at: '2024-02-15', logo: 'palette' },
  { id: 's3', name: 'Notion Team Plan', amount: 2400, currency: 'INR', billing_cycle: 'monthly', next_due_date: '2024-12-10', category: 'Productivity', is_active: true, created_at: '2024-03-01', logo: 'edit_note' },
  { id: 's4', name: 'Slack Business+', amount: 5200, currency: 'INR', billing_cycle: 'monthly', next_due_date: '2024-12-15', category: 'Communication', is_active: true, created_at: '2024-01-15', logo: 'chat' },
  { id: 's5', name: 'Zoom Enterprise', amount: 18000, currency: 'INR', billing_cycle: 'quarterly', next_due_date: '2025-01-01', category: 'Communication', is_active: true, created_at: '2024-04-01', logo: 'videocam' },
];

export const demoReconciliation: Reconciliation = {
  id: 'rec1',
  po_data: { reference_number: 'PO-2024-0891', vendor_name: 'Reliance Industries', items: [{ description: 'Polymer Grade A', quantity: 500, rate: 1040 }], total_amount: 520000, date: '2024-09-28' },
  grn_data: { reference_number: 'GRN-2024-1204', vendor_name: 'Reliance Industries', items: [{ description: 'Polymer Grade A', quantity: 485, rate: 1040 }], total_amount: 504400, date: '2024-10-05' },
  invoice_id: 'inv3',
  match_status: 'Partial Match',
  mismatches: [
    { field: 'Quantity', po_value: 500, grn_value: 485, invoice_value: 500, severity: 'high' },
    { field: 'Total Amount', po_value: 520000, grn_value: 504400, invoice_value: 520000, severity: 'medium' },
  ],
  created_at: '2024-10-08',
};

export const demoAgingBuckets: AgingBucket[] = [
  { label: 'Current', count: 6, amount: 1925200, range: 'Not Yet Due' },
  { label: '1-30 Days', count: 3, amount: 684580, range: '1-30 Overdue' },
  { label: '31-60 Days', count: 2, amount: 1234280, range: '31-60 Overdue' },
  { label: '61-90 Days', count: 1, amount: 501500, range: '61-90 Overdue' },
  { label: '90+ Days', count: 0, amount: 0, range: '90+ Overdue' },
];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
