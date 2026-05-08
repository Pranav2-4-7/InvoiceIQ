'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { demoSubscriptions, formatINR } from '@/lib/demo-data';
import type { Subscription } from '@/types';
import toast from 'react-hot-toast';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(demoSubscriptions);
  const [sortBy, setSortBy] = useState<'amount' | 'next_due_date' | 'category'>('amount');
  const [showAdd, setShowAdd] = useState(false);
  const [newSub, setNewSub] = useState<{ name: string; amount: string; category: string; billing_cycle: 'monthly' | 'quarterly' | 'yearly' }>({ name: '', amount: '', category: 'Software', billing_cycle: 'monthly' });

  const monthlyEquiv = (s: Subscription) => {
    if (s.billing_cycle === 'monthly') return s.amount;
    if (s.billing_cycle === 'quarterly') return s.amount / 3;
    return s.amount / 12;
  };

  const totalMonthly = subs.filter(s => s.is_active).reduce((sum, s) => sum + monthlyEquiv(s), 0);

  const categoryData = Object.entries(
    subs.reduce((acc, s) => {
      if (!s.is_active) return acc;
      acc[s.category] = (acc[s.category] || 0) + monthlyEquiv(s);
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const colors = ['#ffffff', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'];

  const sorted = [...subs].sort((a, b) => {
    if (sortBy === 'amount') return monthlyEquiv(b) - monthlyEquiv(a);
    if (sortBy === 'next_due_date') return new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime();
    return a.category.localeCompare(b.category);
  });

  const handleAdd = () => {
    if (!newSub.name || !newSub.amount) return toast.error('Fill all fields');
    setSubs([...subs, {
      id: `s${Date.now()}`, name: newSub.name, amount: Number(newSub.amount), currency: 'INR',
      billing_cycle: newSub.billing_cycle, next_due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      category: newSub.category, is_active: true, created_at: new Date().toISOString(),
    }]);
    setShowAdd(false);
    setNewSub({ name: '', amount: '', category: 'Software', billing_cycle: 'monthly' });
    toast.success('Subscription added');
  };

  const toggleActive = (id: string) => {
    setSubs(subs.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
  };

  const deleteSub = (id: string) => {
    setSubs(subs.filter(s => s.id !== id));
    toast.success('Subscription removed');
  };

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-white">Subscription Tracker</h1>
          <p className="text-zinc-500 text-sm mt-1">Monitor recurring expenses</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-white text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors">
          <span className="material-symbols-outlined text-[18px] align-middle mr-1">add</span>Add Subscription
        </button>
      </header>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <input value={newSub.name} onChange={e => setNewSub({ ...newSub, name: e.target.value })} placeholder="Service Name" className="bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-white focus:outline-none" />
            <input type="number" value={newSub.amount} onChange={e => setNewSub({ ...newSub, amount: e.target.value })} placeholder="Amount (₹)" className="bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm focus:border-white focus:outline-none" />
            <select value={newSub.billing_cycle} onChange={e => setNewSub({ ...newSub, billing_cycle: e.target.value as 'monthly' | 'quarterly' | 'yearly' })} className="bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none">
              <option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option>
            </select>
            <button onClick={handleAdd} className="bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Total + Chart */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Total Monthly Burn Rate</p>
            <p className="text-[48px] font-black tracking-tighter text-white">{formatINR(totalMonthly)}</p>
            <p className="text-zinc-500 text-sm mt-2">{subs.filter(s => s.is_active).length} active subscriptions</p>
          </div>

          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="#000" strokeWidth={2}>
                  {categoryData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e1e1e', border: '1px solid #262626', borderRadius: 8 }} formatter={(v) => formatINR(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: colors[i % colors.length] }} />
                    <span className="text-zinc-400">{d.name}</span>
                  </div>
                  <span className="text-white font-medium">{formatINR(d.value)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription List */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-white font-bold">All Subscriptions</h3>
              <div className="flex gap-2">
                {(['amount', 'next_due_date', 'category'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all ${sortBy === s ? 'bg-white text-black' : 'border border-zinc-800 text-zinc-400 hover:text-white'}`}>
                    {s === 'next_due_date' ? 'Due Date' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-zinc-800">
              {sorted.map(sub => (
                <div key={sub.id} className={`p-6 flex items-center justify-between hover:bg-zinc-900/50 transition-colors ${!sub.is_active ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">{sub.logo || 'subscriptions'}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{sub.name}</p>
                      <p className="text-zinc-500 text-[11px]">{sub.category} · {sub.billing_cycle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white font-bold">{formatINR(sub.amount)}<span className="text-zinc-500 font-normal text-[11px]">/{sub.billing_cycle === 'monthly' ? 'mo' : sub.billing_cycle === 'quarterly' ? 'qtr' : 'yr'}</span></p>
                      <p className="text-zinc-500 text-[11px]">Due: {sub.next_due_date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleActive(sub.id)} className={`w-8 h-8 rounded flex items-center justify-center border transition-colors ${sub.is_active ? 'border-white text-white' : 'border-zinc-800 text-zinc-600'}`}>
                        <span className="material-symbols-outlined text-[16px]">{sub.is_active ? 'pause' : 'play_arrow'}</span>
                      </button>
                      <button onClick={() => deleteSub(sub.id)} className="w-8 h-8 rounded flex items-center justify-center border border-zinc-800 text-zinc-600 hover:text-white hover:border-white transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
