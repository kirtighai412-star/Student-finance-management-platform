
import React, { useState, useEffect } from 'react';
import { StudentFee } from '../types';
import { feeService } from '../services/feeService';
import { 
  AcademicCapIcon, 
  HomeIcon, 
  DocumentTextIcon, 
  SparklesIcon, 
  PlusIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ClockIcon,
  ShieldCheckIcon,
  XMarkIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid';

interface FeeManagerProps {
  fees: StudentFee[];
  onUpdateFee: (id: string, update: Partial<StudentFee>) => void;
  onAddTransaction: (amount: number, title: string) => void;
  onFeesRefresh: (newFees: StudentFee[]) => void;
}

const FeeManager: React.FC<FeeManagerProps> = ({ fees, onUpdateFee, onAddTransaction, onFeesRefresh }) => {
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [contribution, setContribution] = useState('');
  const [autoSavePulse, setAutoSavePulse] = useState<number | null>(null);

  useEffect(() => {
    const initAutoSave = async () => {
      const result = await feeService.processAutoSaves();
      if (result.totalDeposited > 0) {
        setAutoSavePulse(result.totalDeposited);
        onFeesRefresh(result.updatedFees);
        setTimeout(() => setAutoSavePulse(null), 5000);
      }
    };
    initAutoSave();
  }, []);

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const handleContribute = async () => {
    if (!selectedFee || !contribution) return;
    const amount = parseFloat(contribution);
    if (isNaN(amount) || amount <= 0) return;

    const updatedFees = await feeService.updateFee(selectedFee.id, { 
      savedAmount: selectedFee.savedAmount + amount 
    });
    onFeesRefresh(updatedFees);
    onAddTransaction(amount, `Fee Fund: ${selectedFee.title}`);
    setIsContributionModalOpen(false);
    setContribution('');
    setSelectedFee(null);
  };

  const handleToggleAutoSave = async (feeId: string, currentState: boolean) => {
    const updatedFees = await feeService.updateFee(feeId, { isAutoSaveActive: !currentState });
    onFeesRefresh(updatedFees);
  };

  const getDaysLeft = (dueDate: number) => {
    const diff = dueDate - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  const totalRequired = fees.reduce((acc, f) => acc + Math.max(0, f.totalAmount - f.savedAmount), 0);
  const totalSaved = fees.reduce((acc, f) => acc + f.savedAmount, 0);
  const totalLimit = fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const overallProgress = totalLimit > 0 ? (totalSaved / totalLimit) * 100 : 0;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {autoSavePulse && (
        <div className="bg-brand text-white px-8 py-4 rounded-[32px] shadow-2xl animate-bounce flex items-center justify-between">
           <div className="flex items-center gap-3">
             <SparklesIcon className="w-6 h-6" />
             <p className="font-black text-sm uppercase tracking-widest">Auto-Save Pulse: {formatINR(autoSavePulse)} deposited while you were away!</p>
           </div>
           <button onClick={() => setAutoSavePulse(null)}><XMarkIcon className="w-5 h-5" /></button>
        </div>
      )}

      {/* Financial Peace Header */}
      <div className="bg-slate-900 text-white rounded-[56px] p-12 shadow-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
         <div className="relative z-10 space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="p-3 bg-brand/20 rounded-2xl text-brand">
                 <ShieldCheckIcon className="w-8 h-8" />
              </span>
              <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Campus Financial Peace</p>
            </div>
            <h2 className="text-5xl font-black tracking-tighter leading-none">Total Fees <br/> Remaining</h2>
            <p className="text-6xl font-black text-white">{formatINR(totalRequired)}</p>
            <div className="flex gap-4 pt-4 justify-center md:justify-start">
               <span className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                 <ClockIcon className="w-4 h-4 text-brand" /> {fees.filter(f => f.savedAmount < f.totalAmount).length} Deadlines Left
               </span>
            </div>
         </div>
         <div className="flex-1 w-full space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] space-y-6">
               <div className="flex justify-between items-center">
                  <p className="text-sm font-black uppercase tracking-widest opacity-60">Overall Readiness</p>
                  <p className="text-lg font-black text-brand">{Math.round(overallProgress)}%</p>
               </div>
               <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
                  <div className="bg-brand h-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
               </div>
               <p className="text-xs font-medium text-slate-400">Your path to being 100% funded is on track for this semester.</p>
            </div>
         </div>
      </div>

      {/* Individual Fees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fees.map(fee => {
          const progress = (fee.savedAmount / fee.totalAmount) * 100;
          const isFull = progress >= 100;
          const daysLeft = getDaysLeft(fee.dueDate);

          return (
            <div key={fee.id} className="bg-white dark:bg-slate-900 rounded-[48px] p-10 shadow-premium border border-slate-50 dark:border-slate-800 hover:border-brand transition-all flex flex-col justify-between group">
               <div>
                 <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-2xl ${
                       fee.category === 'Tuition' ? 'bg-indigo-50 text-indigo-500' :
                       fee.category === 'Hostel' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
                    }`}>
                       {fee.category === 'Tuition' && <AcademicCapIcon className="w-8 h-8" />}
                       {fee.category === 'Hostel' && <HomeIcon className="w-8 h-8" />}
                       {fee.category === 'Exam' && <DocumentTextIcon className="w-8 h-8" />}
                    </div>
                    <div className="text-right">
                       <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${daysLeft < 7 && !isFull ? 'text-rose-500' : 'text-slate-400'}`}>
                          {isFull ? 'Funded' : `${daysLeft} Days Left`}
                       </p>
                       {isFull && <CheckCircleIcon className="w-6 h-6 text-brand ml-auto" />}
                    </div>
                 </div>
                 
                 <h3 className="text-2xl font-black tracking-tight mb-2">{fee.title}</h3>
                 <p className="text-slate-400 text-xs font-medium mb-10">Target: {formatINR(fee.totalAmount)}</p>

                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funded Progress</p>
                       <p className="text-base font-black text-slate-900 dark:text-white">{Math.round(progress)}%</p>
                    </div>
                    <div className="w-full bg-slate-50 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                       <div className="bg-brand h-full transition-all duration-1000" style={{ width: `${Math.min(100, progress)}%` }}></div>
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-[24px]">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${fee.isAutoSaveActive ? 'bg-brand/10 text-brand' : 'bg-slate-200 text-slate-400'}`}>
                           <SparklesIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Daily Auto-Save</span>
                     </div>
                     <button 
                       onClick={() => handleToggleAutoSave(fee.id, fee.isAutoSaveActive)}
                       className={`w-12 h-6 rounded-full relative transition-all ${fee.isAutoSaveActive ? 'bg-brand' : 'bg-slate-300'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fee.isAutoSaveActive ? 'left-7' : 'left-1'}`} />
                     </button>
                  </div>
                  {!isFull && (
                    <button 
                      onClick={() => { setSelectedFee(fee); setIsContributionModalOpen(true); }}
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-black text-[10px] uppercase tracking-widest group-hover:bg-brand group-hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      Add Extra ₹ <ArrowUpIcon className="w-3 h-3" />
                    </button>
                  )}
               </div>
            </div>
          );
        })}
      </div>

      {isContributionModalOpen && selectedFee && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[56px] p-12 space-y-10 shadow-3xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsContributionModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-rose-500 transition-colors">
                <XMarkIcon className="w-10 h-10" />
              </button>
              
              <div className="text-center space-y-3">
                 <div className="w-16 h-16 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mx-auto mb-4">
                    <BanknotesIcon className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter">Micro-Fund</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">{selectedFee.title}</p>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Contribution (₹)</label>
                   <div className="relative">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300">₹</span>
                      <input 
                        type="number" 
                        placeholder="500" 
                        autoFocus
                        value={contribution} 
                        onChange={(e) => setContribution(e.target.value)} 
                        className="w-full bg-slate-50 dark:bg-slate-800 p-10 pl-16 rounded-[40px] text-5xl font-black focus:ring-2 focus:ring-brand/20 outline-none text-slate-900 dark:text-white" 
                      />
                   </div>
                </div>
              </div>

              <button 
                onClick={handleContribute}
                className="w-full py-7 bg-brand text-white rounded-[32px] font-black text-xl shadow-2xl shadow-brand/30 active:scale-95 transition-all hover:scale-[1.02]"
              >
                Fund Now
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default FeeManager;
