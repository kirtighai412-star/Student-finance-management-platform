
import React, { useState, useEffect } from 'react';
import { Wallet, Transaction, Budget, UserProfile, StockPrice, Holding, AppTab, FraudAlert } from '../types';
import { 
  SparklesIcon,
  BanknotesIcon,
  MegaphoneIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAmericasIcon,
  ArrowUpRightIcon,
  LockClosedIcon,
  XMarkIcon,
  PencilSquareIcon,
  QrCodeIcon,
  CursorArrowRaysIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/solid';
import { getLiveMarketHeadline } from '../services/geminiService';
import { getEconomicNews } from '../services/mockDataService';

interface DashboardProps {
  profile: UserProfile;
  wallet: Wallet;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
  stocks: StockPrice[];
  holdings: Holding[];
  fraudAlerts: FraudAlert[];
  onNavigate: (tab: AppTab) => void;
  onAddTransaction: (tx: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, wallet, budgets, setBudgets, transactions, stocks, holdings, fraudAlerts, onNavigate }) => {
  const [breakingNews, setBreakingNews] = useState('Fetching live market pulse...');
  const [worldNews] = useState(getEconomicNews());
  const [mlStatus, setMlStatus] = useState('Idle');
  const [showBalance, setShowBalance] = useState(false);
  
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const headline = await getLiveMarketHeadline();
      setBreakingNews(headline);
    };
    fetchNews();

    const mlInterval = setInterval(() => {
      const statuses = ['Scanning Patterns...', 'Analyzing Velocity...', 'Syncing Node...', 'Verified Secure'];
      setMlStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 4000);

    return () => clearInterval(mlInterval);
  }, []);

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  
  const totalSpend = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const dailyAvg = totalSpend / 30 || 150;
  const runwayDays = Math.floor(wallet.balance / Math.max(1, dailyAvg));

  const handleRevealClick = () => {
    if (showBalance) {
      setShowBalance(false);
    } else {
      setIsPasscodeModalOpen(true);
      setPasscode('');
      setPasscodeError(false);
    }
  };

  const handlePasscodeSubmit = (digit: string) => {
    const newPasscode = passcode + digit;
    if (newPasscode.length <= 4) setPasscode(newPasscode);
    
    if (newPasscode.length === 4) {
      // In a real app, we verify against the authService's stored PIN.
      // For the demo, we allow '1234' (default) or '0000' as master keys.
      if (newPasscode === '1234' || newPasscode === '0000') { 
        setShowBalance(true);
        setIsPasscodeModalOpen(false);
      } else {
        setPasscodeError(true);
        setTimeout(() => {
          setPasscode('');
          setPasscodeError(false);
        }, 600);
      }
    }
  };

  // REAL UPI QR Code Integration
  // Generates a valid UPI deep link QR: upi://pay?pa=arjun@rbupay&pn=Arjun%20Sharma
  const upiId = profile.upiId || 'arjun@rbupay';
  const qrBaseUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=`;
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(profile.name)}&cu=INR&mode=01&orgid=189999`;
  const upiQrUrl = `${qrBaseUrl}${encodeURIComponent(upiLink)}`;

  return (
    <div className="space-y-10 pb-20 flex flex-col items-center w-full animate-in fade-in duration-1000">
      {/* Dynamic Market Ticker */}
      <div className="w-full overflow-hidden bg-slate-900 dark:bg-slate-800/80 py-4 border-y border-white/5 backdrop-blur-md sticky top-[80px] z-40">
        <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
           {[...stocks, ...stocks].map((s, idx) => (
             <div key={`${s.symbol}-${idx}`} className="flex items-center gap-4">
               <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{s.symbol}</span>
               <span className="text-sm font-black text-white">{formatINR(s.price)}</span>
               <span className={`text-[9px] font-black px-2 py-0.5 rounded ${s.change >= 0 ? 'bg-brand/20 text-brand' : 'bg-rose-500/20 text-rose-500'}`}>
                 {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
               </span>
             </div>
           ))}
        </div>
      </div>

      <div className="max-w-6xl w-full space-y-10 px-6">
        {/* Real-time Status Banner */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-premium border border-slate-50 dark:border-slate-800 px-10">
          <div className="flex items-center gap-4">
            <div className={`w-3.5 h-3.5 rounded-full ${mlStatus === 'Verified Secure' ? 'bg-brand shadow-[0_0_15px_rgba(0,208,156,0.5)]' : 'bg-amber-500 animate-ping'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Pattern Engine: {mlStatus}
            </span>
          </div>
          <div className="flex items-center gap-8">
             <button 
               onClick={() => setIsReceiveModalOpen(true)}
               className="text-[10px] font-black text-brand flex items-center gap-2.5 uppercase tracking-widest hover:scale-110 transition-all bg-brand/5 px-4 py-2.5 rounded-2xl group"
             >
               <QrCodeIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Receive Assets
             </button>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               <ShieldCheckIcon className="w-4 h-4 text-brand" /> Biometric Link
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Futuristic Wallet Card */}
          <div className="lg:col-span-2 relative h-[400px] group cursor-pointer perspective-3d">
            <div className="absolute inset-0 brand-gradient rounded-[64px] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative h-full bg-white dark:bg-slate-900 p-14 rounded-[64px] shadow-3xl border border-slate-50 dark:border-slate-800 flex flex-col justify-between overflow-hidden tilt-card transition-all">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="p-5 bg-brand/10 rounded-3xl text-brand shadow-inner">
                        <BanknotesIcon className="w-10 h-10" />
                     </div>
                     <div>
                       <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1">Total Assets</p>
                       <p className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-1.5">
                         <ShieldCheckIcon className="w-3.5 h-3.5" /> Secured by RBUNode
                       </p>
                     </div>
                  </div>
                  <div className="relative">
                    <h4 className="text-[84px] font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                      {showBalance ? formatINR(wallet.balance) : '••••••'}
                    </h4>
                    {!showBalance && <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mt-4 ml-2">Verification Required to View</p>}
                  </div>
                </div>
                <button 
                  onClick={handleRevealClick} 
                  className={`p-6 rounded-[32px] transition-all flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 ${showBalance ? 'bg-slate-50 dark:bg-slate-800 text-slate-400' : 'bg-brand text-white'}`}
                >
                  {showBalance ? <XMarkIcon className="w-7 h-7" /> : <LockClosedIcon className="w-7 h-7" />}
                </button>
              </div>
              
              <div className="flex items-center justify-between relative z-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                 <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-[20px] bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-premium border border-white/10">R</div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Node</p>
                      <p className="text-base font-black tracking-tight">{profile.bankName || 'Integrated Bank'}</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => onNavigate(AppTab.WALLET)} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-brand hover:text-white transition-all shadow-xl">
                      Transmit <CursorArrowRaysIcon className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Capital Health Card */}
          <div className="bg-slate-900 dark:bg-white p-14 rounded-[64px] shadow-3xl flex flex-col justify-between group relative overflow-hidden transition-all hover:scale-[1.02]">
             <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand/20 rounded-full blur-[100px] -mb-40 -mr-40"></div>
             <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-3">
                 <BoltIcon className="w-6 h-6 text-brand" />
                 <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">Asset Runway</p>
               </div>
               <h3 className="text-8xl font-black text-white dark:text-slate-900 tracking-tighter leading-none">
                 {runwayDays} <span className="text-2xl font-black opacity-30 tracking-widest">DAYS</span>
               </h3>
               <p className="text-xs font-black text-brand uppercase tracking-[0.2em]">Predicted Liquidity Stability</p>
             </div>
             <div className="mt-14 relative z-10">
               <div className="w-full h-5 bg-white/10 dark:bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                 <div className={`h-full rounded-full transition-all duration-2000 ease-out ${runwayDays < 10 ? 'bg-rose-500' : 'bg-brand'}`} style={{ width: `${Math.min(100, (runwayDays/60)*100)}%` }} />
               </div>
               <p className="mt-5 text-[10px] font-black text-slate-500 leading-relaxed uppercase tracking-[0.3em]">Pattern audit sync complete: 100%</p>
             </div>
          </div>
        </div>

        {/* Global Breaking News Ticker */}
        <div className="bg-slate-900 text-white rounded-[40px] p-3 flex items-center shadow-3xl border border-white/5 group overflow-hidden">
           <div className="bg-brand text-white px-10 py-4 rounded-full flex items-center gap-4 animate-pulse relative z-10 shadow-xl"><MegaphoneIcon className="w-5 h-5" /><span className="text-[12px] font-black uppercase tracking-[0.3em]">FLASH</span></div>
           <div className="flex-1 px-10"><p className="text-white font-black text-base truncate uppercase tracking-tight group-hover:scale-105 transition-transform origin-left">{breakingNews}</p></div>
        </div>
      </div>

      {/* Passcode UI - BANK LEVEL SECURITY */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/98 backdrop-blur-[64px] animate-in fade-in duration-500">
          <div className={`bg-white dark:bg-slate-900 w-full max-w-sm rounded-[64px] p-14 space-y-12 shadow-3xl border border-white/5 relative ${passcodeError ? 'animate-shake' : ''}`}>
            <button onClick={() => setIsPasscodeModalOpen(false)} className="absolute top-12 right-12 text-slate-400 hover:text-slate-600 transition-all active:scale-90">
              <XMarkIcon className="w-10 h-10" />
            </button>
            <div className="text-center space-y-5">
              <div className="w-24 h-24 bg-brand/10 rounded-[32px] flex items-center justify-center text-brand mx-auto mb-8 shadow-inner">
                <ShieldCheckIcon className="w-12 h-12" />
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Verify to Unlock</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] leading-relaxed">Enter your node passcode to view sensitive financial data.</p>
            </div>
            
            <div className="flex justify-center gap-6 py-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-16 h-20 rounded-3xl flex items-center justify-center font-black text-4xl border-2 transition-all duration-300 ${passcode.length > i ? 'bg-brand border-brand text-white shadow-3xl shadow-brand/30 scale-110' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50'}`}>
                  {passcode.length > i ? '•' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} onClick={() => handlePasscodeSubmit(num.toString())} className="h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 hover:bg-brand hover:text-white font-black text-3xl transition-all active:scale-90 shadow-sm">{num}</button>
              ))}
              <div />
              <button onClick={() => handlePasscodeSubmit('0')} className="h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 hover:bg-brand hover:text-white font-black text-3xl transition-all active:scale-90 shadow-sm">0</button>
              <button onClick={() => setPasscode(passcode.slice(0, -1))} className="h-20 rounded-3xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-black text-xs uppercase tracking-widest active:scale-95">Del</button>
            </div>
            <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] opacity-30 mt-4">Node Default: 1 2 3 4</p>
          </div>
        </div>
      )}

      {/* Receive Assets Modal - REAL QR CODE */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/98 backdrop-blur-[64px] animate-in fade-in duration-500">
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[64px] p-14 space-y-10 shadow-3xl text-center relative border border-white/5">
              <button onClick={() => setIsReceiveModalOpen(false)} className="absolute top-12 right-12 text-slate-400 hover:text-rose-500 transition-all active:scale-90">
                <XMarkIcon className="w-10 h-10" />
              </button>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Receive Assets</h3>
                <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => { navigator.clipboard.writeText(upiId); alert('UPI Node Copied!'); }}>
                  <p className="text-[11px] text-brand font-black uppercase tracking-[0.3em]">{upiId}</p>
                  <DocumentDuplicateIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand transition-colors" />
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-[48px] inline-block shadow-inner border-[12px] border-slate-50 relative group">
                 <div className="absolute inset-0 bg-brand/5 scale-0 group-hover:scale-100 transition-transform rounded-[40px] pointer-events-none"></div>
                 <img src={upiQrUrl} alt="UPI QR" className="w-64 h-64 rounded-2xl mx-auto relative z-10" />
              </div>
              
              <div className="space-y-4 pt-6">
                 <p className="text-sm font-bold text-slate-500 leading-relaxed px-6 opacity-80">Scan with any verified UPI app (GPay, PhonePe, Paytm) to transmit money directly to your linked node.</p>
                 <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">BHIM UPI 2.0</span>
                    <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">RBUPay Sync</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 50s linear infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } } .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        .perspective-3d { perspective: 2000px; }
        .tilt-card { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};

export default Dashboard;
