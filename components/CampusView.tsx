
import React, { useState, useEffect } from 'react';
import { CampusGig } from '../types';
import { campusService } from '../services/campusService';
import { SparklesIcon, MapPinIcon, BanknotesIcon, UserCircleIcon, PlusIcon, XMarkIcon, MegaphoneIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';

const CampusView: React.FC = () => {
  const [gigs, setGigs] = useState<CampusGig[]>([]);
  const [headerText, setHeaderText] = useState('Campus Connect 🎓');
  const [subHeaderText, setSubHeaderText] = useState('Customized Social Commerce');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newReward, setNewReward] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<'Gig' | 'Marketplace'>('Gig');

  useEffect(() => {
    const loadGigs = async () => {
      const data = await campusService.getGigs();
      setGigs(data);
    };
    loadGigs();
  }, []);

  const handleCreate = async () => {
    if (!newTitle || !newReward) return;
    const gig: CampusGig = {
      id: `gig-${Date.now()}`,
      title: newTitle,
      reward: parseFloat(newReward),
      postedBy: 'Me',
      location: newLocation || 'Campus',
      type: newType
    };
    const updated = await campusService.addGig(gig);
    setGigs(updated);
    setIsModalOpen(false);
    setNewTitle('');
    setNewReward('');
    setNewLocation('');
  };

  const deleteGig = async (id: string) => {
    const updated = await campusService.deleteGig(id);
    setGigs(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500 pb-20">
      <div className="flex justify-between items-end px-4">
        <div className="group relative">
          {isEditingHeader ? (
            <div className="space-y-2 animate-in slide-in-from-top-1">
              <input 
                value={headerText} 
                onChange={(e) => setHeaderText(e.target.value)}
                onBlur={() => setIsEditingHeader(false)}
                className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter bg-transparent border-b-2 border-brand outline-none w-full"
                autoFocus
              />
              <input 
                value={subHeaderText} 
                onChange={(e) => setSubHeaderText(e.target.value)}
                onBlur={() => setIsEditingHeader(false)}
                className="text-[10px] text-brand font-black uppercase tracking-[0.4em] bg-transparent border-b border-brand/20 outline-none w-full"
              />
            </div>
          ) : (
            <div onClick={() => setIsEditingHeader(true)} className="cursor-pointer group">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-2">
                {headerText} 
                <PencilIcon className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-opacity" />
              </h2>
              <p className="text-[10px] text-brand font-black uppercase tracking-[0.4em] mt-2">{subHeaderText}</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 bg-brand text-white rounded-3xl flex items-center justify-center shadow-xl shadow-brand/20 active:scale-90 transition-all hover:rotate-6"
        >
          <PlusIcon className="w-10 h-10" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map(gig => (
          <div key={gig.id} className="bg-white dark:bg-slate-900 p-8 rounded-[48px] shadow-premium border border-slate-50 dark:border-slate-800 group hover:border-brand/40 transition-all cursor-pointer flex flex-col justify-between relative">
            <button 
              onClick={(e) => { e.stopPropagation(); deleteGig(gig.id); }}
              className="absolute top-6 right-6 p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg ${gig.type === 'Gig' ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-50 text-amber-500'}`}>
                  {gig.type}
                </span>
                <p className="text-2xl font-black text-brand tracking-tighter">₹{gig.reward}</p>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-brand transition-colors">{gig.title}</h3>
            </div>
            
            <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                <MapPinIcon className="w-4 h-4 text-slate-300" /> {gig.location}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                <UserCircleIcon className="w-4 h-4 text-slate-300" /> {gig.postedBy}
              </div>
              <button className="w-full mt-6 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-[20px] font-black text-[10px] uppercase tracking-widest group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                Claim Offer
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[56px] p-12 space-y-10 shadow-3xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-rose-500 transition-colors">
                <XMarkIcon className="w-10 h-10" />
              </button>
              
              <div className="text-center space-y-3">
                 <div className="w-16 h-16 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mx-auto mb-4">
                    <MegaphoneIcon className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter">Post to Campus</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Help your squad, earn reward</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                   <button 
                    onClick={() => setNewType('Gig')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newType === 'Gig' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-500' : 'text-slate-400'}`}
                   >Task / Gig</button>
                   <button 
                    onClick={() => setNewType('Marketplace')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newType === 'Marketplace' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-500' : 'text-slate-400'}`}
                   >Selling Item</button>
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Listing Title</label>
                   <input 
                    type="text" 
                    placeholder="e.g. Note-taking for Calc II" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand/20 transition-all" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Reward (₹)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={newReward} 
                      onChange={(e) => setNewReward(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl font-bold text-slate-900 dark:text-white outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block tracking-widest">Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Hostel 1" 
                      value={newLocation} 
                      onChange={(e) => setNewLocation(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl font-bold text-slate-900 dark:text-white outline-none" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCreate}
                className="w-full py-7 bg-brand text-white rounded-[32px] font-black text-xl shadow-2xl shadow-brand/30 active:scale-95 transition-all hover:scale-[1.02]"
              >
                Broadcast to Squad
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CampusView;
