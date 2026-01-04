
import React, { useState } from 'react';
import { Wallet, Transaction, UserProfile } from '../types';
import { PaperAirplaneIcon, QrCodeIcon, CreditCardIcon, ArrowDownTrayIcon, ChevronRightIcon, DocumentArrowDownIcon, XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface WalletViewProps {
  wallet: Wallet;
  transactions: Transaction[];
  profile: UserProfile;
  onSendMoney: (tx: Transaction) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ wallet, transactions, profile, onSendMoney }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [activeSplitTx, setActiveSplitTx] = useState<Transaction | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const handleSend = () => {
    if (!recipient || !amount) return;
    setLoading(true);
    setTimeout(() => {
      onSendMoney({
        id: `tx-2026-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        amount: parseFloat(amount),
        recipient,
        sender: profile.name,
        category: 'Others',
        timestamp: Date.now(),
        status: 'completed',
        riskScore: 'low'
      });
      setLoading(false);
      setIsModalOpen(false);
      setRecipient('');
      setAmount('');
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-right-10 duration-700">
      
      {/* 3D Virtual Card */}
      <div className="tilt-card relative h-72 w-full premium-gradient rounded-[48px] p-12 text-white shadow-3xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-white/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse-slow"></div>
          <div className="flex justify-between items-start relative z-10">
             <div className="space-y-2">
               <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80">RBUPAY Platinum</p>
               <h2 className="text-6xl font-black tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left">{formatINR(wallet.balance)}</h2>
             </div>
             <div className="w-16 h-12 bg-white/15 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:rotate-6 transition-transform">
                <span className="font-black italic text-2xl tracking-tighter">W</span>
             </div>
          </div>
          <div className="flex justify-between items-end relative z-10">
             <div className="space-y-2">
               <p className="text-[12px] font-bold opacity-70 tracking-[0.2em]">{profile.name.toUpperCase()}</p>
               <p className="font-mono text-base opacity-90 tracking-[0.3em] font-medium">{wallet.cardNumber}</p>
             </div>
             <div className="flex gap-4">
               <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-white text-indigo-600 rounded-3xl font-black text-sm shadow-2xl hover:bg-brand hover:text-white transition-all flex items-center gap-3 active:scale-95">
                  <PaperAirplaneIcon className="w-5 h-5 -rotate-45" /> Send
               </button>
             </div>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[56px] shadow-3xl overflow-hidden border border-slate-50 dark:border-slate-800">
        <div className="p-12 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
           <h3 className="font-black text-3xl tracking-tight text-slate-900 dark:text-white">Campus Ledger</h3>
           <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em]">Real-time Updates</p>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
           {transactions.length === 0 ? (
             <div className="p-20 text-center space-y-6 opacity-30">
                <DocumentArrowDownIcon className="w-16 h-16 mx-auto" />
                <p className="font-bold uppercase tracking-widest text-xs">No records found</p>
             </div>
           ) : (
             transactions.map(tx => (
               <div key={tx.id} className="p-10 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                  <div className="flex items-center gap-8">
                     <div className="w-16 h-16 rounded-[28px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                        {tx.recipient[0]}
                     </div>
                     <div className="space-y-2">
                        <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">{tx.recipient}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-400">{tx.category}</span>
                          {tx.roundUpAmount && (
                            <span className="text-[9px] font-black text-brand bg-brand/10 px-2 rounded-lg">Round-up: ₹{tx.roundUpAmount}</span>
                          )}
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => { setActiveSplitTx(tx); setIsSplitModalOpen(true); }}
                      className="p-3 bg-brand/10 text-brand rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <UserGroupIcon className="w-5 h-5" />
                    </button>
                    <div className="text-right space-y-1">
                       <p className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">-{formatINR(tx.amount)}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.status}</p>
                    </div>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Canteen Splitter Modal */}
      {isSplitModalOpen && activeSplitTx && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[56px] p-12 space-y-8 shadow-3xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsSplitModalOpen(false)} className="absolute top-10 right-10 text-slate-300"><XMarkIcon className="w-8 h-8" /></button>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black tracking-tight">Split the Bill 🍔</h3>
                <p className="text-sm font-bold text-slate-400">Transaction: {activeSplitTx.recipient}</p>
                <p className="text-4xl font-black text-brand pt-4">{formatINR(activeSplitTx.amount)}</p>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">The Squad</p>
                 <div className="flex gap-4">
                   {['Rohan', 'Sneha', 'Arnav', 'Isha'].map(name => (
                     <div key={name} className="flex flex-col items-center gap-2">
                       <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black border-2 border-transparent hover:border-brand cursor-pointer transition-all active:scale-90">{name[0]}</div>
                       <span className="text-[9px] font-black text-slate-500 uppercase">{name}</span>
                     </div>
                   ))}
                 </div>
              </div>
              <button className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[32px] font-black text-xl shadow-xl shadow-slate-900/10">Request Settlement</button>
           </div>
        </div>
      )}

      {/* Send Money Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[64px] p-14 space-y-12 shadow-premium relative animate-in zoom-in duration-500 border border-white/10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 p-2 text-slate-300 hover:text-slate-600 transition-all"><XMarkIcon className="w-10 h-10" /></button>
              <div className="space-y-3 text-center">
                <h3 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Instant Pay 🚀</h3>
                <p className="text-xs text-brand font-black uppercase tracking-[0.4em]">Campus Network Active</p>
              </div>
              <div className="space-y-10">
                 <div className="space-y-4">
                   <label className="text-[12px] font-black uppercase text-slate-400 ml-4 tracking-widest">Recipient</label>
                   <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter UPI ID or Number" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent p-7 rounded-[32px] font-black text-xl focus:border-brand transition-all outline-none shadow-inner" />
                 </div>
                 <div className="space-y-4 text-center">
                   <label className="text-[12px] font-black uppercase text-slate-400 tracking-widest">Amount</label>
                   <div className="relative">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-5xl font-black text-slate-300">₹</span>
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent p-10 pl-20 rounded-[40px] text-6xl font-black focus:border-brand transition-all outline-none shadow-inner text-slate-900 dark:text-white" />
                   </div>
                 </div>
              </div>
              <button onClick={handleSend} disabled={loading || !amount || !recipient} className="w-full py-8 brand-gradient text-white rounded-[40px] font-black text-2xl shadow-3xl shadow-brand/40 active:scale-95 transition-all disabled:opacity-50 hover:scale-[1.02]">
                {loading ? 'Transmitting...' : 'Authorize Send'}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;
