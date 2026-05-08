import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { invoice_amount, due_date, urgency } = await request.json();
    const amount = Number(invoice_amount) || 0;
    const advanceRate = 0.80;
    const feeRates: Record<string, number> = { immediate: 0.03, '2weeks': 0.02, '1month': 0.015 };
    const feeRate = feeRates[urgency] || 0.02;
    const advance = amount * advanceRate;
    const fee = advance * feeRate;

    const offers = [
      { lender: 'QuickFin Capital', advance_amount: amount * 0.85, fee_percentage: 2.8, fee_amount: amount * 0.85 * 0.028, total_repayable: amount * 0.85 * 1.028, net_benefit: amount - amount * 0.85 * 1.028, processing_time: '24 hours' },
      { lender: 'IndiCredit Pro', advance_amount: amount * 0.80, fee_percentage: 2.0, fee_amount: amount * 0.80 * 0.02, total_repayable: amount * 0.80 * 1.02, net_benefit: amount - amount * 0.80 * 1.02, processing_time: '3-5 days' },
      { lender: 'SwiftPay Finance', advance_amount: amount * 0.75, fee_percentage: 1.5, fee_amount: amount * 0.75 * 0.015, total_repayable: amount * 0.75 * 1.015, net_benefit: amount - amount * 0.75 * 1.015, processing_time: '7-10 days' },
    ];

    return NextResponse.json({
      advance, fee, total_repayable: advance + fee, net_benefit: amount - (advance + fee),
      fee_rate: feeRate, offers,
    });
  } catch (error) {
    console.error('Financing error:', error);
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}
