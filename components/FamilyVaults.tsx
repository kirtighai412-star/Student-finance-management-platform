
import React, { useState } from 'react';
import { SharedVault } from '../types';
import { UserGroupIcon, PlusIcon, SparklesIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface FamilyVaultsProps {
  vaults: SharedVault[];
  setVaults?: React.Dispatch<React.SetStateAction<SharedVault[]>>;
}

const FamilyVaults: React.FC<FamilyVaultsProps> = ({ vaults: initialVaults, setVaults: setGlobalVaults }) => {
  // Use internal state for responsiveness but sync with global state if provided
  const [vaults, setLocalVaults] = useState<SharedVault[]>(initialVaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const startEditing = (vault: SharedVault) => {
    setEditingId(vault.id);
    setEditName(vault.title);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    const updatedVaults = vaults.map(v => v.id === editingId ? { ...v, title: editName } : v);
    setLocalVaults(updatedVaults);
    
    // Notify parent of the state change if setVaults was passed
    if (setGlobalVaults) {
      setGlobalVaults(updatedVaults);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center px-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Shared Vaults 👫</h2>
          <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Collaborative Savings Goals</p>
        </div>
        <button className="p-4 bg-brand text-white rounded-[24px] shadow-lg shadow-brand/20 active:scale-95 transition-all"><PlusIcon className="w-6 h-6" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vaults.map(vault => (
          <div key={vault.id} className="bg-white dark:bg-slate-900 p-8 rounded-[48px] shadow-premium border border-slate-50 dark:border-slate-800 hover:border-brand/40 transition-all group relative">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-500"><UserGroupIcon className="w-8 h-8" /></div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Target</p>
                  <p className="text-xl font-black">{formatINR(vault.target)}</p>
               </div>
            </div>
            
            <div className="mb-4">
              {editingId === vault.id ? (
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-brand/20 rounded-xl p-3 text-lg font-black outline-none focus:border-brand"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="p-3 bg-brand text-white rounded-xl"><CheckIcon className="w-5 h-5" /></button>
                  <button onClick={() => setEditingId(null)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400"><XMarkIcon className="w-5 h-5" /></button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">{vault.title}</h3>
                  <button onClick={() => startEditing(vault)} className="p-2 text-slate-300 hover:text-brand transition-colors opacity-0 group-hover:opacity-100"><PencilIcon className="w-4 h-4" /></button>
                </div>
              )}
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
               <div className="bg-brand h-full transition-all duration-1000" style={{ width: `${(vault.current / vault.target) * 100}%` }}></div>
            </div>
            <div className="flex justify-between items-center mb-8">
               <div className="flex -space-x-3">
                  {vault.members.map((m, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-[10px] font-black">{m[0]}</div>
                  ))}
               </div>
               <p className="text-sm font-black text-brand">{formatINR(vault.current)} saved</p>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800">
               <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><SparklesIcon className="w-3 h-3" /> Recent Activity</p>
               {vault.recentActivity.map((act, i) => (
                 <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-bold">{act.user} added</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">+{formatINR(act.amount)}</span>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyVaults;
