'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatINR } from '@/lib/demo-data';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ParsedData {
  vendor_name: string;
  vendor_address: string;
  vendor_gstin: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  line_items: { description: string; quantity: number; rate: number; amount: number }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
  currency: string;
}

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/parse-invoice', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse invoice');
      }
      
      setParsedData(data.parsed || data);
      toast.success('Invoice parsed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Parse failed');
      setParsedData(null);
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSave = async () => {
    if (!parsedData || !db) return;
    
    try {
      await addDoc(collection(db, 'ledger_entries'), {
        vendor_name: parsedData.vendor_name,
        reference_id: parsedData.invoice_number,
        transaction_date: parsedData.invoice_date,
        description: `Invoice from ${parsedData.vendor_name}`,
        category: 'Purchase',
        status: 'Pending',
        debit: parsedData.total_amount,
        credit: 0,
        balance: 0, // This would normally be calculated
        created_at: new Date().toISOString()
      });
      
      toast.success('Invoice confirmed & saved to ledger');
      setParsedData(null);
      setFileName('');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('Failed to save to ledger');
    }
  };

  const recentUploads = [
    { name: 'INV-2023-089.pdf', status: 'Processed', amount: '₹4,500.00', time: '2 mins ago' },
    { name: 'Q3_Maintenance.jpg', status: 'Parsing', amount: '--', time: '12 mins ago' },
    { name: 'STK_Software_Sub.pdf', status: 'Processed', amount: '₹12,900.50', time: '1 hour ago' },
  ];

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="text-xl font-bold tracking-tighter text-white">Invoice Upload</div>
        <div className="flex items-center gap-6">
          <div className="relative flex items-center bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-1.5 w-64">
            <span className="material-symbols-outlined text-zinc-500 text-sm">search</span>
            <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-white placeholder-zinc-500 w-full ml-2" placeholder="Search transactions..." />
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">notifications</span>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">AK</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero */}
        <div className="relative h-[200px] rounded-xl overflow-hidden border border-[#262626] bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h1 className="text-[32px] font-semibold tracking-tight text-white mb-2">Automated Invoice Processing</h1>
            <p className="text-zinc-400 max-w-xl">Upload your documents for AI-driven data extraction and ledger synchronization.</p>
          </div>
          <div className="absolute top-6 right-8 opacity-[0.04]">
            <span className="material-symbols-outlined text-[160px]">cloud_upload</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Upload Zone */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-8 transition-all hover:border-zinc-600 group">
              <div
                className={`border-2 border-dashed rounded-lg p-16 flex flex-col items-center justify-center space-y-4 cursor-pointer transition-colors ${
                  dragActive ? 'border-white bg-zinc-900/50' : 'border-zinc-700 group-hover:border-white'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-3xl text-white">cloud_upload</span>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-medium text-white mb-1">Drag & drop files here</p>
                  <p className="text-sm text-zinc-500">PDF, JPG, PNG up to 25MB</p>
                </div>
                <button className="mt-4 bg-white text-black px-6 py-2 rounded-lg text-[12px] font-bold hover:opacity-90 transition-opacity">Select Files</button>
                <input id="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            </div>

            {/* AI Status */}
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[20px] font-medium text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  AI Parsing Status
                </h3>
                <span className="text-zinc-500 text-[11px] uppercase tracking-widest">{parsing ? 'Processing...' : 'Active'}</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">OCR Engine Stability</span>
                  <span className="text-[12px] font-bold text-white">Optimal</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-white h-full transition-all duration-1000 ${parsing ? 'w-[60%] animate-pulse' : 'w-[92%]'}`} />
                </div>
                <p className="text-[11px] text-zinc-500">
                  {fileName ? `Processing: ${fileName}` : 'Neural network ready. All compliance filters engaged.'}
                </p>
              </div>
            </div>
          </div>

          {/* Parsed Data Preview */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-[#121212] border border-[#262626] rounded-xl flex flex-col h-full">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-[20px] font-medium text-white">Extracted Data</h3>
                <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[11px] font-bold">LIVE PREVIEW</span>
              </div>
              {parsedData ? (
                <>
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px]">
                    <div className="space-y-4">
                      <Field label="VENDOR NAME" value={parsedData.vendor_name} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="INVOICE DATE" value={parsedData.invoice_date} />
                        <Field label="DUE DATE" value={parsedData.due_date} />
                      </div>
                      <Field label="TAX IDENTIFIER (GST)" value={parsedData.vendor_gstin} />
                    </div>
                    <div className="pt-4 border-t border-zinc-800">
                      <label className="text-[11px] text-zinc-500 block mb-3">LINE ITEMS</label>
                      {parsedData.line_items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-900">
                          <div>
                            <span className="text-white text-sm">{item.description}</span>
                            <span className="text-zinc-500 text-xs block">Qty: {item.quantity} × ₹{item.rate}</span>
                          </div>
                          <span className="text-white text-sm">{formatINR(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-zinc-900/30 p-4 rounded-lg">
                      <div className="flex justify-between mb-2"><span className="text-sm text-zinc-400">Subtotal</span><span className="text-sm text-white">{formatINR(parsedData.subtotal)}</span></div>
                      {parsedData.cgst > 0 && <div className="flex justify-between mb-2"><span className="text-sm text-zinc-400">CGST (9%)</span><span className="text-sm text-white">{formatINR(parsedData.cgst)}</span></div>}
                      {parsedData.sgst > 0 && <div className="flex justify-between mb-2"><span className="text-sm text-zinc-400">SGST (9%)</span><span className="text-sm text-white">{formatINR(parsedData.sgst)}</span></div>}
                      {parsedData.igst > 0 && <div className="flex justify-between mb-2"><span className="text-sm text-zinc-400">IGST (18%)</span><span className="text-sm text-white">{formatINR(parsedData.igst)}</span></div>}
                      <div className="flex justify-between pt-2 border-t border-zinc-700">
                        <span className="text-[20px] font-medium text-white">Total</span>
                        <span className="text-[20px] font-medium text-white">{formatINR(parsedData.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-zinc-800">
                    <button onClick={handleSave} className="w-full bg-white text-black py-4 rounded-lg text-[20px] font-medium hover:bg-zinc-200 transition-colors active:scale-[0.99]">
                      Confirm & Save to Ledger
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-12 text-center">
                  <div>
                    <span className="material-symbols-outlined text-zinc-700 text-[64px] mb-4 block">description</span>
                    <p className="text-zinc-500 text-sm">Upload an invoice to see extracted data here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[30px] font-semibold tracking-tight text-white">Recent Uploads</h2>
            <button className="text-zinc-400 text-[12px] font-bold hover:text-white transition-colors">View All History</button>
          </div>
          <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/20">
                  {['Filename', 'Status', 'Amount', 'Date', ''].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {recentUploads.map((u, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-white text-sm">{u.name}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm">
                        {u.status === 'Processed' ? (
                          <><span className="w-1.5 h-1.5 rounded-full bg-white" /> {u.status}</>
                        ) : (
                          <><span className="material-symbols-outlined text-[14px] text-zinc-500 animate-spin">refresh</span> <span className="text-zinc-500">{u.status}</span></>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">{u.amount}</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">{u.time}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="material-symbols-outlined text-zinc-500 cursor-pointer hover:text-white">more_horiz</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-[11px] text-zinc-500">{label}</label>
      <div className="bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm">{value}</div>
    </div>
  );
}
