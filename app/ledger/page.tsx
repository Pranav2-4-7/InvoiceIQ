'use client';

import { useState, useEffect } from 'react';
import { demoLedger, formatINR, formatDate } from '@/lib/demo-data';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const filterOptions = ['All Time', 'Last 30 Days', 'Fiscal Year'];

export default function LedgerPage() {
  const [activeFilter, setActiveFilter] = useState('Last 30 Days');
  const [searchTerm, setSearchTerm] = useState('');
  const [liveEntries, setLiveEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!db) return;
      try {
        const q = query(collection(db, 'ledger_entries'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLiveEntries(entries);
      } catch (error) {
        console.error("Error fetching ledger entries:", error);
      }
    };
    fetchEntries();
  }, []);

  const combinedLedger = [...liveEntries, ...demoLedger];

  const filtered = combinedLedger.filter(e =>
    !searchTerm || e.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) || e.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDebit = combinedLedger.reduce((s, e) => s + (Number(e.debit) || 0), 0);
  const totalCredit = combinedLedger.reduce((s, e) => s + (Number(e.credit) || 0), 0);

  const exportCSV = () => {
    const headers = ['Date', 'Reference', 'Vendor', 'Category', 'Debit', 'Credit', 'Balance'];
    const rows = filtered.map(e => [e.transaction_date, e.reference_id, e.vendor_name, e.category, e.debit, e.credit, e.balance]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ledger_export.csv'; a.click();
    toast.success('CSV exported successfully');
  };

  const stats = [
    { label: 'DEBIT VOLUMES', value: formatINR(totalDebit), change: '↑ 12%' },
    { label: 'CREDIT VOLUMES', value: formatINR(totalCredit), change: '↑ 08%' },
    { label: 'PENDING APPROVALS', value: '14', icon: 'pending_actions' },
    { label: 'FRAUD SCORE', value: '0.02%', icon: 'verified_user' },
  ];

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-[20px] font-medium text-white">General Ledger</h2>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-zinc-500 text-[12px] font-bold">Q3 FISCAL 2024</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">search</span>
            <input className="bg-zinc-900 border-none text-[13px] pl-10 pr-4 py-2 rounded-full w-64 focus:ring-1 focus:ring-white focus:outline-none text-white transition-all" placeholder="Search entries..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">AK</div>
        </div>
      </header>

      {/* Hero */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-8 flex flex-col justify-end">
          <h1 className="text-[40px] font-semibold tracking-tight text-white mb-2">Transactional Ledger</h1>
          <p className="text-zinc-400 max-w-2xl">Monitor real-time ledger flows, tax liabilities, and reconciliation states.</p>
        </div>
        <div className="col-span-4">
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[12px] font-bold text-zinc-500">GST LIABILITY SUMMARY</span>
                <span className="material-symbols-outlined text-white">account_balance_wallet</span>
              </div>
              <p className="text-[32px] font-bold text-white tracking-tighter">₹1,42,890</p>
              <p className="text-zinc-500 text-[12px] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+4.2% from last month
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800 mt-4">
                <div><p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Input Credit</p><p className="text-white font-medium">₹42,100</p></div>
                <div><p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Output Tax</p><p className="text-white font-medium">₹1,84,990</p></div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-10">
              <span className="material-symbols-outlined text-[160px]">receipt_long</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6 bg-[#121212] border border-[#262626] p-3 rounded-lg">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md text-[12px] font-bold">
            <span className="material-symbols-outlined text-sm">filter_list</span>FILTERS
          </button>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex gap-2">
            {filterOptions.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 border rounded-md text-[12px] font-medium transition-all ${activeFilter === f ? 'border-white text-white' : 'border-zinc-800 text-zinc-400 hover:border-white hover:text-white'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="p-2 text-zinc-500 hover:text-white transition-colors"><span className="material-symbols-outlined">file_download</span></button>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors"><span className="material-symbols-outlined">print</span></button>
          <button className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold tracking-tighter text-sm rounded transition-transform active:scale-[0.98]">NEW TRANSACTION</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {stats.map(s => (
          <div key={s.label} className="bg-[#121212] border border-[#262626] p-6 rounded-xl flex flex-col justify-between h-32">
            <span className="text-[12px] font-bold text-zinc-500">{s.label}</span>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-bold">{s.value}</p>
              {s.change ? <span className="text-[12px] text-zinc-400">{s.change}</span> : <span className="material-symbols-outlined text-white">{s.icon}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
          <h3 className="text-[20px] font-medium text-white">Recent Transactions</h3>
          <div className="flex gap-4">
            <span className="text-[12px] text-zinc-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white" /> Credit</span>
            <span className="text-[12px] text-zinc-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-700" /> Debit</span>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#262626]">
              {['Date', 'Reference ID', 'Entity / Vendor', 'Category', 'Status', 'Amount'].map(h => (
                <th key={h} className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 ${h === 'Amount' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-zinc-900/50 transition-colors cursor-pointer">
                <td className="px-8 py-6 font-medium text-white">{formatDate(entry.transaction_date)}</td>
                <td className="px-8 py-6 text-zinc-400 font-mono text-[12px]">{entry.reference_id}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${entry.credit > 0 ? 'bg-white text-black' : 'bg-zinc-800 border border-zinc-700 text-white'}`}>
                      {entry.vendor_name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-white font-medium">{entry.vendor_name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded">{entry.category?.toUpperCase()}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="flex items-center gap-2 text-[12px]">
                    <span className={`w-1.5 h-1.5 rounded-full ${entry.status === 'Settled' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : entry.status === 'Overdue' ? 'bg-zinc-400' : 'bg-zinc-700'}`} />
                    <span className={entry.status === 'Settled' ? 'text-white' : 'text-zinc-500'}>{entry.status}</span>
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className={`flex items-center justify-end gap-2 font-medium ${entry.credit > 0 ? 'text-white font-bold' : 'text-zinc-400'}`}>
                    {entry.debit > 0 ? `- ${formatINR(entry.debit)}` : formatINR(entry.credit)}
                    <span className="material-symbols-outlined text-[18px]">{entry.credit > 0 ? 'north_east' : 'south_west'}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-8 py-4 border-t border-zinc-800 flex justify-between items-center">
          <span className="text-[12px] text-zinc-500">Showing 1-{filtered.length} of {combinedLedger.length} entries</span>
          <div className="flex gap-2">
            <button className="p-2 border border-zinc-800 rounded text-zinc-500 hover:text-white transition-all"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="p-2 border border-white rounded text-white bg-zinc-900 text-sm px-4">1</button>
            <button className="p-2 border border-zinc-800 rounded text-zinc-500 text-sm px-4">2</button>
            <button className="p-2 border border-zinc-800 rounded text-zinc-500 hover:text-white transition-all"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
