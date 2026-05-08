import { NextRequest, NextResponse } from 'next/server';
import { parseWithGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const poFile = formData.get('po') as File | null;
    const grnFile = formData.get('grn') as File | null;
    const invoiceFile = formData.get('invoice') as File | null;

    const parseDoc = async (file: File | null, label: string) => {
      if (!file) return null;
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const prompt = `Extract from this ${label}: reference_number, vendor_name, items (array of {description, quantity, rate}), total_amount, date. Return ONLY JSON.`;
      const result = await parseWithGemini(prompt, file.type.startsWith('image/') ? base64 : undefined);
      try { return JSON.parse(result); } catch { return null; }
    };

    const [poData, grnData, invoiceData] = await Promise.all([
      parseDoc(poFile, 'Purchase Order'),
      parseDoc(grnFile, 'Goods Receipt Note'),
      parseDoc(invoiceFile, 'Invoice'),
    ]);

    const mismatches = [];
    if (poData && grnData && invoiceData) {
      if (Math.abs((poData.total_amount || 0) - (grnData.total_amount || 0)) / (poData.total_amount || 1) > 0.01) {
        mismatches.push({ field: 'Total Amount', po_value: poData.total_amount, grn_value: grnData.total_amount, invoice_value: invoiceData.total_amount, severity: 'high' });
      }
    }

    return NextResponse.json({
      po_data: poData, grn_data: grnData, invoice_data: invoiceData,
      match_status: mismatches.length === 0 ? 'Full Match' : 'Partial Match',
      mismatches,
    });
  } catch (error) {
    console.error('Reconciliation error:', error);
    return NextResponse.json({ error: 'Reconciliation failed' }, { status: 500 });
  }
}
