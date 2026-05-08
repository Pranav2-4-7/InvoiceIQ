'use client';

import { demoInvoices, demoFraudAlerts, demoAgingBuckets, formatINR, formatDate } from '@/lib/demo-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const stats = [
  { label: 'Total Invoices', value: '1,284', change: '↑ 12%', icon: 'receipt_long', positive: true, progress: 75 },
  { label: 'Receivable', value: '₹42.8L', change: '↓ 2.1%', icon: 'payments', positive: false, progress: 50 },
  { label: 'Overdue', value: '₹1.42L', change: '↑ 4%', icon: 'warning', positive: false, progress: 25 },
  { label: 'GST Liability', value: '₹89.1K', change: '↑ 0.5%', icon: 'account_balance_wallet', positive: true, progress: 60 },
];

const agingData = demoAgingBuckets.map((b, i) => ({
  ...b,
  fill: ['#ffffff', '#a1a1aa', '#71717a', '#52525b', '#3f3f46'][i],
}));

export default function DashboardPage() {
  const recentInvoices = demoInvoices.slice(0, 5);
  const alerts = demoFraudAlerts;

  return (
    <div className="p-8">
      {/* Top Bar */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-lg">Dashboard</span>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-zinc-500 text-sm">Enterprise Suite</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              className="bg-[#1c1b1b] border border-zinc-800 text-white text-sm rounded-full px-4 py-1.5 w-64 focus:outline-none focus:border-white transition-colors placeholder-zinc-500"
              placeholder="Search invoices..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-zinc-500 cursor-pointer hover:text-white transition-colors">notifications</span>
            <span className="material-symbols-outlined text-zinc-500 cursor-pointer hover:text-white transition-colors">settings</span>
            <span className="material-symbols-outlined text-zinc-500 cursor-pointer hover:text-white transition-colors">help_outline</span>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold">AK</div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative w-full h-[260px] rounded-xl overflow-hidden border border-[#262626] bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Quarterly Outlook</p>
            <h2 className="text-[30px] font-semibold tracking-tight text-white leading-tight">Financial Integrity Score: 98.4%</h2>
            <p className="text-zinc-500 text-sm mt-2">All systems operational · Last sync 24s ago</p>
          </div>
          <div className="absolute top-8 right-8 opacity-[0.04]">
            <span className="material-symbols-outlined text-[200px]">verified_user</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#121212] border border-[#262626] p-6 rounded-xl hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                <span className="material-symbols-outlined text-white text-sm">{stat.icon}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-semibold tracking-tight text-white">{stat.value}</span>
                <span className={`text-sm flex items-center ${stat.positive ? 'text-white' : 'text-zinc-500'}`}>{stat.change}</span>
              </div>
              <div className="mt-4 w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full transition-all duration-700" style={{ width: `${stat.progress}%`, opacity: stat.positive ? 1 : 0.4 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Chart + Table */}
          <div className="lg:col-span-8 space-y-6">
            {/* Aging Chart */}
            <div className="bg-[#121212] border border-[#262626] p-8 rounded-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[20px] font-medium tracking-tight text-white">Invoice Aging Analysis</h3>
                  <p className="text-zinc-500 text-sm">Current outstanding distribution by duration</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-white" />
                  <span className="text-xs text-zinc-400">Aging Invoices</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={agingData} barSize={60}>
                  <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip
                    contentStyle={{ background: '#1e1e1e', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [formatINR(Number(value)), 'Amount']}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {agingData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Invoices */}
            <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-[20px] font-medium tracking-tight text-white">Recent Invoices</h3>
                <button className="text-white text-xs border border-zinc-800 px-4 py-2 hover:bg-zinc-900 transition-colors rounded">View All</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {['ID', 'Client', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-zinc-900/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-mono text-xs text-white">#{inv.invoice_number}</td>
                      <td className="px-6 py-4 text-sm text-white">{inv.vendor_name}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{formatINR(inv.total_amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                          inv.status === 'paid' ? 'bg-white text-black' :
                          inv.status === 'overdue' ? 'border-2 border-white text-white' :
                          inv.status === 'flagged' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'border border-zinc-700 text-zinc-400'
                        }`}>{inv.status}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{formatDate(inv.invoice_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Fraud Alerts */}
          <div className="lg:col-span-4">
            <div className="bg-[#121212] border border-[#262626] rounded-xl h-full flex flex-col">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white">security</span>
                  <h3 className="text-[20px] font-medium tracking-tight text-white">Fraud Alerts</h3>
                </div>
                <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded">{alerts.length} NEW</span>
              </div>
              <div className="p-6 space-y-6 flex-1">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`flex gap-4 p-4 rounded-lg ${
                    alert.severity === 'high' ? 'bg-zinc-900/50 border-l-4 border-white' :
                    alert.severity === 'medium' ? 'border-l-4 border-zinc-500' :
                    'border-l-4 border-zinc-800'
                  }`}>
                    <div className="pt-1">
                      <span className={`material-symbols-outlined ${
                        alert.severity === 'high' ? 'text-white' :
                        alert.severity === 'medium' ? 'text-zinc-500' : 'text-zinc-700'
                      }`} style={alert.severity === 'high' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'info' : 'visibility'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm font-bold uppercase tracking-tight ${alert.severity === 'low' ? 'text-zinc-400' : 'text-white'}`}>
                        {alert.alert_type}
                      </p>
                      <p className={`text-xs ${alert.severity === 'low' ? 'text-zinc-600' : 'text-zinc-400'}`}>{alert.details}</p>
                      {alert.severity !== 'low' && (
                        <div className="pt-2 flex gap-3">
                          <button className={`text-[10px] font-bold px-3 py-1 rounded ${
                            alert.severity === 'high' ? 'text-black bg-white' : 'text-white border border-zinc-800 hover:bg-zinc-900'
                          }`}>{alert.severity === 'high' ? 'Review' : 'Check History'}</button>
                          {alert.severity === 'high' && (
                            <button className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">Dismiss</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-zinc-800 mt-auto">
                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                  <p className="text-[10px] text-zinc-500 uppercase mb-2">Overall Risk Exposure</p>
                  <div className="text-2xl font-black text-white">LOW</div>
                  <div className="mt-2 w-full bg-black h-1 rounded-full">
                    <div className="bg-zinc-600 h-full w-[15%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Compliance */}
        <div className="bg-[#121212] border border-[#262626] p-8 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded">
              <span className="material-symbols-outlined text-black text-3xl">verified_user</span>
            </div>
            <div>
              <h4 className="text-white font-bold">GST Compliance Status: Fully Reconciled</h4>
              <p className="text-zinc-500 text-sm">All tax filings are up to date for Q3 FY24.</p>
            </div>
          </div>
          <button className="bg-transparent border border-zinc-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-zinc-900 transition-all active:scale-95">
            Download Tax Audit
          </button>
        </div>
      </div>
    </div>
  );
}
