
import React, { useState } from 'react';
import { TrophyIcon, StarIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import { getLessons } from '../services/mockDataService';
import { Lesson } from '../types';

const RewardsView: React.FC = () => {
  const [lessons] = useState<Lesson[]>(getLessons());
  const [activeLesson, setActiveLesson] = useState(0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-amber-500/20">
         <div className="absolute top-0 right-0 p-8 opacity-20">
            <TrophyIcon className="w-32 h-32" />
         </div>
         <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Reward Points</p>
            <h2 className="text-4xl font-black mb-4 flex items-center gap-2">2,450 <StarIcon className="w-8 h-8 text-yellow-300" /></h2>
            <p className="text-sm font-medium max-w-[200px] opacity-90">Keep hitting your budget goals to unlock more cashback!</p>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white dark:bg-slate-800 app-card rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <TrophyIcon className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Claimed</p>
            <p className="font-black text-sm text-emerald-500">₹150 Cashback</p>
         </div>
         <div className="bg-white dark:bg-slate-800 app-card rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform opacity-50 grayscale">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
               <StarIcon className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Locked</p>
            <p className="font-black text-sm">Save 5k more</p>
         </div>
      </div>

      <div className="space-y-4">
         <div className="flex items-center gap-2 px-2">
            <LightBulbIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold">Wealth Academy 🎓</h3>
         </div>
         <div className="relative h-64 bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div key={lessons[activeLesson].id} className="animate-in slide-in-from-right-10 duration-500">
               <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full">{lessons[activeLesson].category}</span>
               <h4 className="text-xl font-black mt-4 mb-2">{lessons[activeLesson].title}</h4>
               <p className="text-sm text-slate-500 leading-relaxed">{lessons[activeLesson].description}</p>
            </div>
            <div className="absolute bottom-8 right-8 flex gap-2">
               <button 
                  onClick={() => setActiveLesson((prev) => (prev > 0 ? prev - 1 : lessons.length - 1))}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
               >
                  ←
               </button>
               <button 
                  onClick={() => setActiveLesson((prev) => (prev < lessons.length - 1 ? prev + 1 : 0))}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
               >
                  →
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RewardsView;
