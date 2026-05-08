import { NextResponse } from 'next/server';
import { demoInvoices } from '@/lib/demo-data';
import { generateGSTR1Report, calculateComplianceScore } from '@/lib/gst';

export async function GET() {
  const report = generateGSTR1Report(demoInvoices);
  const complianceScore = calculateComplianceScore(demoInvoices);

  return NextResponse.json({
    ...report,
    compliance_score: complianceScore,
  });
}
