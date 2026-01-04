import React from 'react';
import { Notification, AppTab } from '../types';
import { XMarkIcon, BellAlertIcon, ShieldCheckIcon, CheckCircleIcon, InformationCircleIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface NotificationDrawerProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onNavigate: (tab: AppTab) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ notifications, isOpen, onClose, onMarkRead, onNavigate }) => {
  if (!isOpen) return null;

  const handleNotificationClick = (n: Notification) => {
    onMarkRead(n.id);
    onClose();
    
    // Intelligent Routing
    if (n.type === 'security') {
      onNavigate(AppTab.SECURITY);
    } else if (n.title.toLowerCase().includes('payment') || n.title.toLowerCase().includes('budget')) {
      onNavigate(AppTab.WALLET);
    } else if (n.title.toLowerCase().includes('zomato') || n.title.toLowerCase().includes('market')) {
      onNavigate(AppTab.MARKETS);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white/95 dark:bg-[#020617]/95 backdrop-blur-3xl h-full shadow-2xl animate-in slide-in-from-right duration-500 ease-out flex flex-col">
        <div className="px-8 py-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
             <div className="p-3 brand-gradient rounded-2xl text-white shadow-inner rotate-3">
               <BellAlertIcon className="w-6 h-6" />
             </div>
             <div className="flex flex-col">
               <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Your Pulse</h3>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1.5">RBUPAY Intelligence</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90">
            <XMarkIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[40px] flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <SparklesIcon className="w-12 h-12 opacity-30" />
               </div>
               <div className="space-y-2">
                 <p className="text-lg font-black tracking-tight">Clear skies today!</p>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">No new alerts. Your wealth is growing quietly with RBUPAY.</p>
               </div>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((n, i) => (
                <div 
                  key={n.id} 
                  onClick={() => handleNotificationClick(n)}
                  className={`mx-4 p-6 rounded-[32px] flex items-start gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all relative group mb-2 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 ${!n.read ? 'bg-brand/5 dark:bg-brand/10' : ''}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`mt-1 p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 shadow-sm ${
                    n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    n.type === 'security' ? 'bg-rose-100 text-rose-600' :
                    n.type === 'alert' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {n.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> :
                     n.type === 'security' ? <ShieldCheckIcon className="w-5 h-5" /> :
                     <InformationCircleIcon className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-brand transition-colors">{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-brand shadow-lg shadow-brand/40 mt-1" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <ArrowRightIcon className="w-3 h-3 text-brand opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 space-y-4">
           <button className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
             Mark all as read
           </button>
           <p className="text-[8px] text-center text-slate-400 font-black uppercase tracking-[0.3em] opacity-60">RBUPAY Core Intelligence v3.1</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;