export function calculateGST(amount: number, vendorState: string, myState: string, slabRate: number = 18) {
  const isInterstate = vendorState.toLowerCase() !== myState.toLowerCase();
  const taxAmount = (amount * slabRate) / 100;
  
  if (isInterstate) {
    return { cgst: 0, sgst: 0, igst: taxAmount, total: amount + taxAmount, slabRate };
  }
  return { cgst: taxAmount / 2, sgst: taxAmount / 2, igst: 0, total: amount + taxAmount, slabRate };
}

export function detectGSTSlab(description: string): number {
  const desc = description.toLowerCase();
  const slab5 = ['food', 'agriculture', 'fertilizer', 'seed', 'organic'];
  const slab12 = ['processed food', 'medicine', 'pharmaceutical', 'umbrella', 'sewing'];
  const slab28 = ['luxury', 'automobile', 'car', 'tobacco', 'aerated', 'cement'];
  
  if (slab5.some(k => desc.includes(k))) return 5;
  if (slab12.some(k => desc.includes(k))) return 12;
  if (slab28.some(k => desc.includes(k))) return 28;
  return 18;
}

export function generateGSTR1Report(invoices: { subtotal: number; cgst: number; sgst: number; igst: number; vendor_name: string; invoice_number: string; invoice_date: string }[]) {
  const b2b = invoices.filter(i => i.igst > 0 || (i.cgst > 0 && i.sgst > 0));
  const totalTax = invoices.reduce((s, i) => s + i.cgst + i.sgst + i.igst, 0);
  
  return {
    period: 'Q3 FY 2024-25',
    b2b_total: b2b.reduce((s, i) => s + i.subtotal, 0),
    total_cgst: invoices.reduce((s, i) => s + i.cgst, 0),
    total_sgst: invoices.reduce((s, i) => s + i.sgst, 0),
    total_igst: invoices.reduce((s, i) => s + i.igst, 0),
    total_tax: totalTax,
    invoice_count: invoices.length,
    invoices: invoices.map(i => ({
      invoice_number: i.invoice_number,
      date: i.invoice_date,
      taxable_value: i.subtotal,
      cgst: i.cgst, sgst: i.sgst, igst: i.igst,
    })),
  };
}

export function calculateComplianceScore(invoices: { vendor_name: string; cgst: number; sgst: number; igst: number; status: string }[]): number {
  if (invoices.length === 0) return 100;
  const withGST = invoices.filter(i => i.cgst > 0 || i.sgst > 0 || i.igst > 0).length;
  const timely = invoices.filter(i => i.status !== 'overdue').length;
  const gstRatio = withGST / invoices.length;
  const timelyRatio = timely / invoices.length;
  return Math.round((gstRatio * 50 + timelyRatio * 50));
}
