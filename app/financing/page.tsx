'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '@/lib/demo-data';

export default function FinancingPage() {
  const [invoiceAmount, setInvoiceAmount] = useState(500000);
  const [daysToPayment, setDaysToPayment] = useState(30);
  const [urgency, setUrgency] = useState<'immediate' | '2weeks' | '1month'>('2weeks');

  const advanceRate = 0.80;
  const feeRates = { immediate: 0.03, '2weeks': 0.02, '1month': 0.015 };
  const feeRate = feeRates[urgency];
  const advance = invoiceAmount * advanceRate;
  const fee = advance * feeRate;
  const totalRepayable = advance + fee;
  const netBenefit = invoiceAmount - totalRepayable;

  const lenders = [
    { name: 'QuickFin Capital', rate: 2.8, processing: '24 hours', advance: invoiceAmount * 0.85 },
    { name: 'IndiCredit Pro', rate: 2.0, processing: '3-5 days', advance: invoiceAmount * 0.80 },
    { name: 'SwiftPay Finance', rate: 1.5, processing: '7-10 days', advance: invoiceAmount * 0.75 },
  ];

  const breakEvenData = Array.from({ length: 6 }, (_, i) => {
    const month = i + 1;
    return {
      month: `M${month}`,
      revenue: invoiceAmount * month * 0.1,
      cost: fee * month,
      benefit: (invoiceAmount * month * 0.1) - (fee * month),
    };
  });

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-xl font-bold tracking-tighter text-white">Invoice Financing</h1>
        <p className="text-zinc-500 text-sm mt-1">Calculate advance amounts and compare lender offers</p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Calculator */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 space-y-6">
            <h3 className="text-white font-bold text-lg">Financing Calculator</h3>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Invoice Amount (₹)</label>
              <input type="number" value={invoiceAmount} onChange={e => setInvoiceAmount(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white text-lg font-bold focus:border-white focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Days to Payment</label>
              <input type="number" value={daysToPayment} onChange={e => setDaysToPayment(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Urgency</label>
              <div className="flex gap-2">
                {([['immediate', 'Immediate'], ['2weeks', '2 Weeks'], ['1month', '1 Month']] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setUrgency(val)} className={`flex-1 py-2 rounded-lg text-[12px] font-bold transition-all ${urgency === val ? 'bg-white text-black' : 'border border-zinc-800 text-zinc-400 hover:border-white hover:text-white'}`}>{label}</button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-lg space-y-3">
              <div className="flex justify-between"><span className="text-zinc-400 text-sm">Available Advance (80%)</span><span className="text-white font-bold">{formatINR(advance)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400 text-sm">Fee ({(feeRate * 100).toFixed(1)}%/month)</span><span className="text-zinc-400">{formatINR(fee)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400 text-sm">Total Repayable</span><span className="text-white font-bold">{formatINR(totalRepayable)}</span></div>
              <div className="pt-3 border-t border-zinc-800 flex justify-between">
                <span className="text-white font-bold">Net Benefit</span>
                <span className="text-white font-bold text-xl">{formatINR(netBenefit)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Lenders */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">Illustrative Lender Estimates</h3>
            <p className="text-zinc-500 text-[11px] mb-6">These are representative offers for comparison purposes only.</p>
            <div className="space-y-4">
              {lenders.map((l, i) => (
                <div key={l.name} className="flex items-center justify-between p-4 border border-[#262626] rounded-lg hover:border-zinc-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${i === 0 ? 'bg-white' : 'bg-zinc-800'}`}>
                      <span className={`material-symbols-outlined ${i === 0 ? 'text-black' : 'text-white'}`}>account_balance</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{l.name}</p>
                      <p className="text-zinc-500 text-[11px]">Processing: {l.processing}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatINR(l.advance)}</p>
                    <p className="text-zinc-500 text-[11px]">{l.rate}% per month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Break Even Chart */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-6">Break-Even Analysis</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={breakEvenData}>
                <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#1e1e1e', border: '1px solid #262626', borderRadius: 8 }} />
                <Line type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#fff', r: 3 }} name="Revenue" />
                <Line type="monotone" dataKey="cost" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Cost" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
