
import React from 'react';
import { BillReminder } from '../types';
import { ReceiptPercentIcon, BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface BillManagerProps {
  bills: BillReminder[];
}

const BillManager: React.FC<BillManagerProps> = ({ bills }) => {
  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="px-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Bill Pulse 📑</h2>
        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Smart Reminders & Tracking</p>
      </div>

      <div className="bg-indigo-600 rounded-[40px] p-10 text-white flex items-center justify-between shadow-xl shadow-indigo-500/20">
         <div className="space-y-2">
            <h3 className="text-2xl font-black">Next Bill Due</h3>
            <p className="text-sm opacity-80">Jio Fiber • Tomorrow</p>
            <p className="text-4xl font-black mt-4">₹999.00</p>
         </div>
         <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-xl"><BellAlertIcon className="w-10 h-10" /></div>
      </div>

      <div className="space-y-4">
        {bills.map(bill => (
          <div key={bill.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-premium border border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400"><ReceiptPercentIcon className="w-6 h-6" /></div>
               <div>
                  <h4 className="font-black text-lg">{bill.provider}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
               </div>
            </div>
            <div className="text-right flex items-center gap-6">
               <p className="font-black text-xl">{formatINR(bill.amount)}</p>
               <button className="px-6 py-3 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand/10">Pay</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillManager;
