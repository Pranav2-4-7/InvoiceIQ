'use client';

import { demoInvoices, formatINR, formatDate } from '@/lib/demo-data';
import { calculateComplianceScore } from '@/lib/gst';

export default function GSTPage() {
  const score = calculateComplianceScore(demoInvoices);
  const totalCGST = demoInvoices.reduce((s, i) => s + i.cgst, 0);
  const totalSGST = demoInvoices.reduce((s, i) => s + i.sgst, 0);
  const totalIGST = demoInvoices.reduce((s, i) => s + i.igst, 0);
  const b2bTotal = demoInvoices.filter(i => i.cgst > 0 || i.sgst > 0).reduce((s, i) => s + i.subtotal, 0);
  const exportTotal = demoInvoices.filter(i => i.igst > 0).reduce((s, i) => s + i.subtotal, 0);
  const circumference = 2 * Math.PI * 88;
  const offset = circumference - (score / 100) * circumference;

  const complianceChecks = demoInvoices.slice(0, 5).map(inv => ({
    ...inv,
    gst_amount: inv.cgst + inv.sgst + inv.igst,
    compliant: inv.fraud_score < 15,
    gstin: inv.vendor_id === 'v1' ? '27AAACT2727Q1ZV' : inv.vendor_id === 'v2' ? '29AABCI1234F1ZP' : '27AABCR5678G1Z3',
  }));

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tighter text-white">GST Compliance</h1>
          <span className="px-2 py-0.5 rounded border border-zinc-700 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Live</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 border border-[#262626] px-5 py-2.5 rounded-lg hover:border-white transition-all text-sm font-medium text-white">
            <span className="material-symbols-outlined text-[18px]">sync</span>Sync GST Portal
          </button>
          <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">download</span>Download Report
          </button>
        </div>
      </header>

      {/* Period Selector */}
      <div className="flex items-center gap-4 mb-8">
        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Filing Period</label>
        <div className="flex items-center bg-[#121212] border border-[#262626] rounded-lg p-1">
          <button className="px-4 py-1.5 text-[13px] font-medium bg-white text-black rounded-md">Q3 (Oct-Dec)</button>
          <button className="px-4 py-1.5 text-[13px] font-medium text-zinc-500 hover:text-white transition-colors">Q4 (Jan-Mar)</button>
          <div className="w-px h-4 bg-zinc-800 mx-2" />
          <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-white">
            FY 2023-24<span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Compliance Score */}
        <div className="col-span-12 lg:col-span-4 bg-[#121212] border border-[#262626] rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-zinc-700 text-[64px]">verified_user</span>
          </div>
          <h3 className="text-zinc-500 text-[12px] uppercase font-black tracking-widest mb-8">Compliance Health Score</h3>
          <div className="relative flex items-center justify-center mb-6">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="88" fill="transparent" stroke="#1E1E1E" strokeWidth="8" />
              <circle cx="96" cy="96" r="88" fill="transparent" stroke="#FFFFFF" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black tracking-tighter text-white">{score}%</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">{score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Review'}</span>
            </div>
          </div>
          <div className="w-full space-y-3 pt-4 border-t border-zinc-800/50">
            <div className="flex justify-between items-center text-[12px]"><span className="text-zinc-500">Mismatched Invoices</span><span className="text-white font-medium">04</span></div>
            <div className="flex justify-between items-center text-[12px]"><span className="text-zinc-500">Pending Filings</span><span className="text-white font-medium">01</span></div>
          </div>
        </div>

        {/* GSTR-1 Summary */}
        <div className="col-span-12 lg:col-span-8 bg-[#121212] border border-[#262626] rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-bold tracking-tight">GSTR-1 Summary Preview</h3>
              <p className="text-zinc-500 text-[12px]">Aggregate data for October 2023</p>
            </div>
            <button className="text-[12px] font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:underline">
              View All Tables<span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <div className="p-6">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">B2B Invoices (4A)</span>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">{formatINR(b2bTotal)}</span>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>+12% from last quarter
                </span>
              </div>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">IGST Collections</span>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">{formatINR(totalIGST)}</span>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">Interstate transactions</span>
              </div>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">CGST + SGST</span>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">{formatINR(totalCGST + totalSGST)}</span>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">Intrastate transactions</span>
              </div>
            </div>
          </div>
          <div className="flex-grow min-h-[120px] relative bg-gradient-to-t from-[#121212] via-zinc-900/20 to-[#121212]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-end gap-1 h-20">
                {[40, 65, 50, 80, 70, 90, 60, 85, 75, 95, 55, 70].map((h, i) => (
                  <div key={i} className="w-6 bg-zinc-800 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Table */}
        <div className="col-span-12 bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-white text-lg font-bold tracking-tight">Recent Compliance Checks</h3>
            <select className="bg-black border border-zinc-800 text-[12px] text-white rounded-lg px-3 py-1.5 focus:ring-0">
              <option>All Status</option><option>Compliant</option><option>Mismatched</option>
            </select>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#161616]">
                {['Invoice No.', 'Vendor / Client', 'Date', 'Value', 'Tax (GST)', 'Status'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {complianceChecks.map(inv => (
                <tr key={inv.id} className="hover:bg-[#1E1E1E] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{inv.invoice_number}</td>
                  <td className="px-6 py-4">
                    <div><span className="text-sm text-white">{inv.vendor_name}</span><br /><span className="text-[11px] text-zinc-500">GSTIN: {inv.gstin}</span></div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{formatDate(inv.invoice_date)}</td>
                  <td className="px-6 py-4 text-sm text-white font-mono">{formatINR(inv.subtotal)}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{formatINR(inv.gst_amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-tight ${inv.compliant ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-400'}`}>
                      <span className="material-symbols-outlined text-[14px]" style={inv.compliant ? { fontVariationSettings: "'FILL' 1" } : {}}>{inv.compliant ? 'check_circle' : 'error'}</span>
                      {inv.compliant ? 'Compliant' : 'Mismatched'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
