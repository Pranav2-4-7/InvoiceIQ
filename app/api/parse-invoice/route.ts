import { NextRequest, NextResponse } from 'next/server';
import { parseWithGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    const prompt = `Extract all data from this invoice and return ONLY a JSON object with these fields:
vendor_name, vendor_address, vendor_gstin, invoice_number, invoice_date (YYYY-MM-DD),
due_date (YYYY-MM-DD), line_items (array of {description, quantity, rate, amount}),
subtotal, cgst, sgst, igst, total_amount, currency.
Return ONLY the JSON, no explanation.`;

    const isImage = file.type.startsWith('image/');
    const result = await parseWithGemini(prompt, isImage ? base64 : undefined);

    let parsed;
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(result);
    } catch {
      parsed = JSON.parse(result);
    }

    return NextResponse.json({ parsed, raw: result });
  } catch (error: any) {
    console.error('Parse invoice error:', error);
    const errorMessage = error?.message || 'Unknown API Error';
    return NextResponse.json({ 
      error: `Gemini API Error: ${errorMessage}` 
    }, { status: 500 });
  }
}
