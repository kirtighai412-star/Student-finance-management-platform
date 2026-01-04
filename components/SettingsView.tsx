
import React, { useState } from 'react';
import { UserProfile, UserSettings } from '../types';
import { 
  BellIcon, 
  ShieldCheckIcon, 
  BanknotesIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
  IdentificationIcon,
  BuildingLibraryIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface SettingsViewProps {
  profile: UserProfile;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onLogout: () => void;
}

const BANKS_OPTIONS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'SBI Global', 'Union Bank'
];

const SettingsView: React.FC<SettingsViewProps> = ({ profile, isDarkMode, onToggleTheme, onUpdateSettings, onLogout }) => {
  const [banks, setBanks] = useState([
    { name: 'HDFC Bank', acc: '**** 5824', status: 'Primary', balance: '₹12,450', connected: true },
    { name: 'ICICI Bank', acc: '**** 9012', status: 'Savings', balance: '₹30,050', connected: true },
  ]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  
  // Bank Form State
  const [newBankName, setNewBankName] = useState(BANKS_OPTIONS[0]);
  const [newAccNumber, setNewAccNumber] = useState('');
  const [newIFSC, setNewIFSC] = useState('');

  const handleLinkBank = () => {
    if (!newAccNumber || !newIFSC) return;
    setIsLinking(true);
    // Simulate mock API call to bank gateway
    setTimeout(() => {
      const newBank = {
        name: newBankName,
        acc: `**** ${newAccNumber.slice(-4)}`,
        status: 'Savings',
        balance: `₹${(Math.random() * 10000 + 1000).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        connected: true
      };
      setBanks(prev => [...prev, newBank]);
      setIsLinking(false);
      setIsLinkingModalOpen(false);
      setNewAccNumber('');
      setNewIFSC('');
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-28 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="bg-white dark:bg-slate-800 app-card rounded-[40px] p-10 flex items-center gap-8 shadow-sm border border-slate-50 dark:border-slate-700/50">
          <div className="relative">
             <img src={`https://picsum.photos/seed/${profile.name}/200/200`} alt="Profile" className="w-24 h-24 rounded-[32px] object-cover border-4 border-brand p-1 shadow-lg" />
             <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
                <CheckBadgeIcon className="w-8 h-8 text-brand" />
             </div>
          </div>
          <div>
             <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profile.name}</h2>
             <p className="text-sm text-slate-500 font-bold tracking-tight">{profile.email}</p>
             <div className="mt-3 flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-brand/10 text-brand rounded-full">Elite Wealth ID 💎</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-full">Tier 1 KYC</span>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Connected Assets</h3>
             <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded-md">Live Sync</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {banks.map((bank, idx) => (
               <div key={idx} className="bg-white dark:bg-slate-800 app-card rounded-[32px] p-8 hover:border-brand/40 transition-all border-2 border-transparent shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-[22px] flex items-center justify-center shadow-inner">
                        <BuildingLibraryIcon className="w-7 h-7 text-slate-400" />
                     </div>
                     <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2.5 py-1 bg-brand/10 text-brand text-[9px] font-black rounded-lg uppercase tracking-widest">Active</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">{bank.status}</span>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">{bank.name}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{bank.acc}</p>
                  </div>
                  <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-50 dark:border-slate-700">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Available</p>
                     <p className="font-black text-lg text-slate-900 dark:text-white">{bank.balance}</p>
                  </div>
               </div>
             ))}
             
             <button 
               onClick={() => setIsLinkingModalOpen(true)}
               className={`bg-dashed border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 hover:border-brand hover:bg-brand/5 group transition-all min-h-[220px]`}
             >
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                   <PlusIcon className="w-7 h-7 text-slate-400 group-hover:text-white" />
                </div>
                <div className="text-center space-y-1">
                   <p className="text-sm font-black text-slate-500 group-hover:text-brand transition-colors">Link New Bank</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-60">UPI 2.0 Auto-Discovery</p>
                </div>
             </button>
          </div>

          <h3 className="px-4 text-xs font-black text-slate-400 uppercase tracking-[0.3em] pt-8">Security & Interface</h3>
          <div className="bg-white dark:bg-slate-800 app-card rounded-[40px] overflow-hidden divide-y divide-slate-50 dark:divide-slate-700 shadow-sm border border-slate-50 dark:border-slate-700/50">
             <div className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-5">
                   <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl text-slate-500 shadow-sm">
                      {isDarkMode ? <SunIcon className="w-6 h-6 text-amber-400" /> : <MoonIcon className="w-6 h-6 text-indigo-500" />}
                   </div>
                   <div>
                      <p className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Appearance Mode</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isDarkMode ? 'Lunar Interface' : 'Solar Interface'}</p>
                   </div>
                </div>
                <button onClick={onToggleTheme} className={`w-14 h-7 rounded-full relative transition-all p-1 shadow-inner ${isDarkMode ? 'bg-brand' : 'bg-slate-200'}`}>
                   <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${isDarkMode ? 'left-8' : 'left-1'}`}></div>
                </button>
             </div>
             <div className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-5">
                   <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl text-slate-500 shadow-sm">
                      <BellIcon className="w-6 h-6 text-brand" />
                   </div>
                   <div>
                      <p className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">AI Pulse Alerts</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Real-time budget nudges</p>
                   </div>
                </div>
                <button 
                  onClick={() => onUpdateSettings({ smartNotifications: !profile.settings.smartNotifications })} 
                  className={`w-14 h-7 rounded-full relative transition-all p-1 shadow-inner ${profile.settings.smartNotifications ? 'bg-brand' : 'bg-slate-200'}`}>
                   <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${profile.settings.smartNotifications ? 'left-8' : 'left-1'}`}></div>
                </button>
             </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-6 bg-rose-50 dark:bg-rose-900/10 text-rose-500 font-black rounded-[32px] border border-rose-100 dark:border-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-sm"
          >
             <ArrowRightOnRectangleIcon className="w-6 h-6" /> 
             <span className="uppercase tracking-[0.2em] text-xs">Terminate Wealth Session</span>
          </button>
        </div>
      </div>

      {/* Link New Bank Modal */}
      {isLinkingModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[56px] p-12 space-y-10 shadow-3xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsLinkingModalOpen(false)} className="absolute top-10 right-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"><XMarkIcon className="w-8 h-8" /></button>
              
              <div className="text-center space-y-3">
                 <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mx-auto mb-4">
                    <BuildingLibraryIcon className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add New Bank</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secure Bank Authorization</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-1 block tracking-widest">Select Bank</label>
                  <select 
                    value={newBankName} 
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand/20 p-5 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all"
                  >
                    {BANKS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-1 block tracking-widest">Account Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter full account number" 
                    value={newAccNumber}
                    onChange={(e) => setNewAccNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand/20 p-5 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-1 block tracking-widest">IFSC Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HDFC0001234" 
                    value={newIFSC}
                    onChange={(e) => setNewIFSC(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand/20 p-5 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleLinkBank} 
                disabled={isLinking || !newAccNumber || !newIFSC}
                className="w-full py-6 bg-brand text-white rounded-[28px] font-black text-lg shadow-xl shadow-brand/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isLinking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-6 h-6" /> Confirm Link
                  </>
                )}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
