'use client';

import { useState } from 'react';
import { demoReconciliation, formatINR } from '@/lib/demo-data';

export default function ReconcilePage() {
  const [showResult, setShowResult] = useState(true);
  const rec = demoReconciliation;

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tighter text-white">3-Way Reconciliation</h1>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-zinc-500 text-[12px] font-bold">PO ↔ GRN ↔ Invoice</span>
        </div>
      </header>

      {/* Upload Zones */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {['Purchase Order', 'Goods Receipt Note', 'Invoice'].map((label, i) => (
          <div key={label} className="bg-[#121212] border border-[#262626] rounded-xl p-6 hover:border-zinc-600 transition-colors">
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-white transition-colors">
              <span className="material-symbols-outlined text-2xl text-zinc-500 mb-3">{['description', 'inventory_2', 'receipt'][i]}</span>
              <p className="text-white text-sm font-medium mb-1">{label}</p>
              <p className="text-zinc-500 text-[11px]">Upload document</p>
              {showResult && <span className="mt-3 text-[10px] font-bold text-white bg-zinc-800 px-2 py-1 rounded">✓ Loaded</span>}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowResult(true)} className="w-full bg-white text-black py-3 rounded-lg font-bold text-sm mb-8 hover:bg-zinc-200 transition-colors active:scale-[0.99]">
        Run 3-Way Reconciliation
      </button>

      {showResult && (
        <>
          {/* Match Status */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rec.match_status === 'Full Match' ? 'bg-white' : 'bg-zinc-800 border border-zinc-600'}`}>
                <span className={`material-symbols-outlined ${rec.match_status === 'Full Match' ? 'text-black' : 'text-white'}`}>
                  {rec.match_status === 'Full Match' ? 'check' : 'warning'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{rec.match_status}</h3>
                <p className="text-zinc-500 text-sm">{rec.mismatches.length} discrepancies found</p>
              </div>
            </div>
          </div>

          {/* Side-by-Side */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-white font-bold">Field Comparison</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  {['Field', 'Purchase Order', 'Goods Receipt', 'Invoice', 'Status'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr className="hover:bg-[#1E1E1E]">
                  <td className="px-6 py-4 text-sm text-white">Reference No.</td>
                  <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{rec.po_data.reference_number}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{rec.grn_data.reference_number}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400 font-mono">INV-2024-003</td>
                  <td className="px-6 py-4"><span className="text-[10px] font-bold bg-white text-black px-2 py-1 rounded">Match</span></td>
                </tr>
                <tr className="hover:bg-[#1E1E1E]">
                  <td className="px-6 py-4 text-sm text-white">Vendor</td>
                  <td className="px-6 py-4 text-sm text-white">{rec.po_data.vendor_name}</td>
                  <td className="px-6 py-4 text-sm text-white">{rec.grn_data.vendor_name}</td>
                  <td className="px-6 py-4 text-sm text-white">Reliance Industries</td>
                  <td className="px-6 py-4"><span className="text-[10px] font-bold bg-white text-black px-2 py-1 rounded">Match</span></td>
                </tr>
                {rec.mismatches.map((m, i) => (
                  <tr key={i} className="hover:bg-[#1E1E1E]">
                    <td className="px-6 py-4 text-sm text-white font-medium">{m.field}</td>
                    <td className="px-6 py-4 text-sm text-white font-mono">{typeof m.po_value === 'number' ? formatINR(m.po_value) : m.po_value}</td>
                    <td className="px-6 py-4 text-sm font-mono text-white border-l-2 border-zinc-500">{typeof m.grn_value === 'number' ? formatINR(m.grn_value) : m.grn_value}</td>
                    <td className="px-6 py-4 text-sm text-white font-mono">{typeof m.invoice_value === 'number' ? formatINR(m.invoice_value) : m.invoice_value}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${m.severity === 'high' ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-400'}`}>
                        Mismatch
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
