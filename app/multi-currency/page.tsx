'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AED', 'SGD', 'AUD', 'CAD'];
const rateData = [
  { day: 'Mon', rate: 83.12 }, { day: 'Tue', rate: 83.45 }, { day: 'Wed', rate: 83.28 },
  { day: 'Thu', rate: 83.67 }, { day: 'Fri', rate: 83.54 }, { day: 'Sat', rate: 83.89 }, { day: 'Sun', rate: 83.72 },
];

const rates: Record<string, number> = {
  USD: 83.72, EUR: 91.45, GBP: 106.23, JPY: 0.56, AED: 22.79, SGD: 62.34, AUD: 54.67, CAD: 61.23,
};

export default function MultiCurrencyPage() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState(10000);
  const rate = rates[from] || 1;
  const converted = amount * rate;
  const fee = converted * 0.015;

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tighter text-white">Multi-Currency</h1>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-zinc-500 text-[12px] font-bold">FX Converter</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Converter */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 space-y-6">
            <h3 className="text-white font-bold text-lg">Currency Converter</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Amount</label>
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white text-lg font-bold focus:border-white focus:outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">From</label>
                  <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none">
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">To</label>
                  <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-white focus:outline-none">
                    <option value="INR">INR</option>
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between"><span className="text-zinc-400 text-sm">Exchange Rate</span><span className="text-white font-bold">1 {from} = ₹{rate.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400 text-sm">Converted Amount</span><span className="text-white font-bold text-xl">₹{converted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400 text-sm">Conversion Fee (1.5%)</span><span className="text-zinc-400">₹{fee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
              <div className="pt-4 border-t border-zinc-800 flex justify-between">
                <span className="text-white font-bold">Total Cost</span>
                <span className="text-white font-bold text-xl">₹{(converted + fee).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Trend */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-6">7-Day Rate Trend ({from}/INR)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={rateData}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e1e1e', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="rate" stroke="#ffffff" strokeWidth={2} fill="url(#rateGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Currency Cards */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(rates).slice(0, 4).map(([cur, r]) => (
              <div key={cur} className="bg-[#121212] border border-[#262626] rounded-xl p-4 flex justify-between items-center hover:border-zinc-600 transition-colors">
                <div>
                  <p className="text-white font-bold">{cur}/INR</p>
                  <p className="text-zinc-500 text-[11px]">Live rate</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">₹{r.toFixed(2)}</p>
                  <p className="text-zinc-500 text-[11px]">
                    {r > 80 ? '↑ 0.3%' : '↓ 0.1%'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
