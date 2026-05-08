'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/upload', label: 'Invoice Upload', icon: 'upload_file' },
  { href: '/ledger', label: 'Ledger', icon: 'menu_book' },
  { href: '/gst', label: 'GST Compliance', icon: 'gavel' },
  { href: '/fraud', label: 'Fraud Alerts', icon: 'security' },
  { href: '/reconcile', label: 'Reconciliation', icon: 'compare_arrows' },
  { href: '/multi-currency', label: 'Currency Converter', icon: 'currency_exchange' },
  { href: '/financing', label: 'Marketplace', icon: 'account_balance' },
  { href: '/split', label: 'Expense Splitting', icon: 'group' },
  { href: '/subscriptions', label: 'Subscriptions', icon: 'event_repeat' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-zinc-800 bg-black flex flex-col p-4 space-y-1 z-50">
      <div className="px-2 mb-8">
        <h1 className="text-lg font-black tracking-tighter text-white">InvoiceIQ</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Enterprise Suite</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-zinc-800 space-y-1">
        <button className="w-full bg-white text-black py-2.5 rounded-lg text-[13px] font-bold mb-4 active:opacity-90 hover:bg-zinc-200 transition-colors">
          New Transaction
        </button>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-900/50 hover:text-white transition-all duration-150 text-[13px] font-medium"
        >
          <span className="material-symbols-outlined text-lg">support_agent</span>
          Support
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-900/50 hover:text-white transition-all duration-150 text-[13px] font-medium"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          Settings
        </Link>
      </div>
    </aside>
  );
}
