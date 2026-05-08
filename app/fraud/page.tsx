'use client';

import { demoFraudAlerts } from '@/lib/demo-data';

const stats = [
  { label: 'Risk Score', value: '12.4', icon: 'monitoring', sub: '↓ 2.1% from last month' },
  { label: 'Active Alerts', value: '42', icon: 'warning', sub: '5 new today' },
  { label: 'Blocked Txns', value: '128', icon: 'block', sub: 'Last 24 hours' },
  { label: 'Savings Impact', value: '₹12L', icon: 'account_balance_wallet', sub: 'Annual loss prevented' },
];

const timeline = [
  { time: '10:42 AM', title: 'Engine Lockdown Triggered', desc: 'Automatic suspension of ACH transfers due to high-risk volume peak.', active: true },
  { time: '09:15 AM', title: 'New Vendor Verified', desc: 'Acme Global (Entity ID: 88291) passed Level 3 compliance check.', active: false },
  { time: 'Yesterday, 04:30 PM', title: 'Bulk Upload Scrubbed', desc: '480 invoices scanned. 12 flagged for manual review, 0 hard failures.', active: false },
  { time: 'Yesterday, 11:20 AM', title: 'AI Model Retrained', desc: 'Updated fraud patterns database with latest Q3 compliance regulations.', active: false },
];

export default function FraudPage() {
  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-[20px] font-medium text-white font-bold tracking-tight">Fraud Detection</h1>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-zinc-500 text-[12px] font-bold">Security Overview</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg w-64">
            <span className="material-symbols-outlined text-zinc-500 mr-2 text-[20px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-white w-full placeholder-zinc-600" placeholder="Search alerts..." />
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">AK</div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[#121212] border border-[#262626] p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <span className="text-zinc-500 text-[12px] font-bold uppercase tracking-wider">{s.label}</span>
              <span className="material-symbols-outlined text-white">{s.icon}</span>
            </div>
            <div className="text-3xl font-semibold text-white">{s.value}</div>
            <div className="flex items-center mt-2 text-zinc-500 text-[11px]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-[#262626] mb-8 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.02),transparent_60%)]" />
        <div className="absolute inset-0 p-12 flex flex-col justify-center">
          <h2 className="text-white text-[30px] font-semibold tracking-tight mb-2">Real-time Anomaly Detection</h2>
          <p className="text-zinc-400 max-w-lg">Monitoring transactions across 148 nodes. System status: Optimal.</p>
          <div className="mt-6">
            <button className="bg-white text-black px-6 py-2 rounded font-bold text-[12px] hover:bg-zinc-200 transition-colors">Run Diagnostics</button>
          </div>
        </div>
      </div>

      {/* Alert Feed + Timeline */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-[20px] font-medium">High-Priority Alerts</h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 border border-[#262626] rounded text-[11px] text-zinc-400 hover:text-white transition-colors">Filter</button>
              <button className="px-4 py-1.5 border border-[#262626] rounded text-[11px] text-zinc-400 hover:text-white transition-colors">Export</button>
            </div>
          </div>

          <div className="space-y-4">
            {demoFraudAlerts.map(alert => (
              <div key={alert.id} className="bg-[#121212] border border-[#262626] p-6 rounded-lg flex items-start justify-between hover:border-white/20 transition-all cursor-pointer">
                <div className="flex gap-6">
                  <div className={`h-12 w-12 rounded flex items-center justify-center ${alert.severity === 'high' ? 'bg-white' : 'border border-[#262626]'}`}>
                    <span className={`material-symbols-outlined ${alert.severity === 'high' ? 'text-black' : 'text-zinc-400'}`}>
                      {alert.severity === 'high' ? 'priority_high' : alert.severity === 'medium' ? 'error_outline' : 'info'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-bold text-sm">{alert.invoice_number || alert.alert_type}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded ${
                        alert.severity === 'high' ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-500'
                      }`}>{alert.severity === 'high' ? 'High Risk' : alert.severity === 'medium' ? 'Warning' : 'Info'}</span>
                    </div>
                    <p className="text-zinc-500 text-sm mb-2">{alert.details}</p>
                    <div className="flex items-center gap-4 text-[11px] text-zinc-600">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span>{alert.created_at}</span>
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-zinc-700">more_vert</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-[#121212] border border-[#262626] rounded-lg p-6 sticky top-24">
            <h3 className="text-white text-[20px] font-medium mb-8">Security Event Log</h3>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />
              <div className="space-y-10 relative">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className={`h-4 w-4 rounded-full ring-4 ring-black z-10 ${t.active ? 'bg-white' : 'bg-zinc-700'}`} />
                    <div className="flex-grow">
                      <span className="text-zinc-600 text-[11px] block mb-1">{t.time}</span>
                      <h4 className="text-white font-bold text-[12px]">{t.title}</h4>
                      <p className="text-zinc-500 text-sm mt-1">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full mt-12 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all rounded font-bold text-[12px]">View Full History</button>
          </div>
        </div>
      </div>
    </div>
  );
}
