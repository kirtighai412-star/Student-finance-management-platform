
import React, { useState } from 'react';
import { UserProfile, Budget, Transaction, SharedVault, AuditRecord } from '../types';
import { 
  ShieldCheckIcon,
  SparklesIcon,
  PlusIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  PencilSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { auditService } from '../services/auditService';
import FamilyVaults from './FamilyVaults';

interface FinanceViewProps {
  profile: UserProfile;
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
  vaults: SharedVault[];
  setVaults: React.Dispatch<React.SetStateAction<SharedVault[]>>;
}

const COLORS = ['#00d09c', '#6366f1', '#a855f7', '#f59e0b', '#ef4444', '#94a3b8'];

const FinanceView: React.FC<FinanceViewProps> = ({ profile, budgets, setBudgets, transactions, vaults, setVaults }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAudit, setLastAudit] = useState<AuditRecord | null>(null);
  const [saveChange, setSaveChange] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBudgets, setEditingBudgets] = useState<Budget[]>([...budgets]);

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const healthScore = Math.min(100, Math.max(0, 100 - (totalSpent / totalLimit * 50) + (profile.creditScore / 850 * 50)));

  const handleAudit = async () => {
    setIsAuditing(true);
    const result = await auditService.runAudit(totalSpent);
    setTimeout(() => {
      setLastAudit(result);
      setIsAuditing(false);
    }, 2000);
  };

  const handleSaveBudgets = () => {
    setBudgets(editingBudgets);
    setIsEditModalOpen(false);
  };

  const updateBudgetLimit = (category: string, limit: string) => {
    const val = parseFloat(limit) || 0;
    setEditingBudgets(prev => prev.map(b => b.category === category ? { ...b, limit: val } : b));
  };

  const spendingData = budgets.map(b => ({ 
    name: b.category, 
    spent: b.spent, 
    limit: b.limit,
    remaining: Math.max(0, b.limit - b.spent)
  }));

  const pieData = budgets.map(b => ({ name: b.category, value: b.spent }));

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Financial DNA Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[56px] p-12 shadow-premium border border-slate-50 dark:border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
         <div className="absolute top-0 left-0 w-full h-1 brand-gradient"></div>
         <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie data={[{v: healthScore}, {v: 100-healthScore}]} innerRadius={60} outerRadius={80} dataKey="v" startAngle={90} endAngle={450}>
                     <Cell fill="url(#healthGradient)" />
                     <Cell fill="#f1f5f9" className="dark:fill-slate-800" />
                  </Pie>
                  <defs>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00d09c" /><stop offset="100%" stopColor="#6366f1" /></linearGradient>
                  </defs>
               </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-4xl font-black text-slate-900 dark:text-white">{Math.round(healthScore)}</span>
               <span className="text-[10px] font-black text-slate-400 uppercase">Health Score</span>
            </div>
         </div>
         <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Your Financial DNA</h2>
              <button 
                onClick={() => { setEditingBudgets([...budgets]); setIsEditModalOpen(true); }}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-brand/10 hover:text-brand transition-all shadow-sm"
              >
                <PencilSquareIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-500 font-medium max-w-sm">Calculated from budget adherence, saving velocity, and CIBIL behavior.</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
               <span className="px-4 py-2 bg-brand/10 text-brand text-[10px] font-black uppercase rounded-xl">CIBIL {profile.creditScore}</span>
               <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase rounded-xl">Target: Savings 20%</span>
            </div>
         </div>
      </div>

      {/* Charts Section: Pie & Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Distribution Pie */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-premium border border-slate-50 dark:border-slate-800">
           <div className="flex items-center gap-3 mb-8">
              <ChartPieIcon className="w-6 h-6 text-brand" />
              <h3 className="text-2xl font-black tracking-tight">Spending Breakdown</h3>
           </div>
           <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      formatter={(val: number) => formatINR(val)}
                    />
                    <Legend />
                 </PieChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Budget vs Spent Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-premium border border-slate-50 dark:border-slate-800">
           <div className="flex items-center gap-3 mb-8">
              <PresentationChartBarIcon className="w-6 h-6 text-indigo-500" />
              <h3 className="text-2xl font-black tracking-tight">Budget Utilization</h3>
           </div>
           <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="spent" fill="#6366f1" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="limit" fill="#00d09c" opacity={0.3} radius={[10, 10, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Save the Change & Audit Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
             <SparklesIcon className="w-40 h-40" />
           </div>
           <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black">Save the Change 🪙</h3>
              <p className="text-sm opacity-80 max-w-xs leading-relaxed">Micro-investing for campus life. We round up every spend to the nearest ₹10 and invest the difference.</p>
              <div className="pt-4 flex items-center gap-4">
                 <button onClick={() => setSaveChange(!saveChange)} className={`w-14 h-8 rounded-full relative transition-all ${saveChange ? 'bg-brand shadow-lg' : 'bg-white/20'}`}>
                   <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${saveChange ? 'left-7' : 'left-1'}`} />
                 </button>
                 <span className="text-[10px] font-black uppercase tracking-widest">{saveChange ? 'Active' : 'Paused'}</span>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px] -mb-32 -mr-32"></div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-brand border border-white/10">
                    <SparklesIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand">Neuro Audit</p>
                    <h4 className="text-xl font-black">AI Leak Detection</h4>
                 </div>
              </div>
              
              {lastAudit ? (
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 animate-in slide-in-from-top-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Found Optimizations</p>
                    <p className="text-lg font-black text-white">Save <span className="text-brand">{formatINR(lastAudit.potentialSavings)}</span> this month</p>
                 </div>
              ) : (
                 <p className="text-slate-400 text-xs leading-relaxed font-medium">Scan your recurring subscriptions and food spends for invisible leaks.</p>
              )}
              
              <button 
                 onClick={handleAudit} 
                 disabled={isAuditing}
                 className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
              >
                 {isAuditing ? 'Analyzing Node...' : 'Analyze Now'}
              </button>
           </div>
        </div>
      </div>

      <FamilyVaults vaults={vaults} setVaults={setVaults} />

      {/* Edit Budgets Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[56px] p-12 space-y-10 shadow-3xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-10 right-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"><XMarkIcon className="w-8 h-8" /></button>
              
              <div className="text-center space-y-3">
                 <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mx-auto mb-4">
                    <PencilSquareIcon className="w-8 h-8" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Manage Budgets</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Adjust your monthly limits</p>
              </div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {editingBudgets.map((b, idx) => (
                  <div key={b.category} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">{b.category} Limit (₹)</label>
                    <input 
                      type="number" 
                      value={b.limit}
                      onChange={(e) => updateBudgetLimit(b.category, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand/20 p-5 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSaveBudgets}
                className="w-full py-6 bg-brand text-white rounded-[28px] font-black text-lg shadow-xl shadow-brand/20 active:scale-95 transition-all"
              >
                Save Limits
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
