
import React, { useState, useEffect } from 'react';
import { getStudentBenefits, getScholarships, getInternships } from '../services/mockDataService';
import { benefitsService } from '../services/benefitsService';
import { StudentBenefit, Scholarship, Internship } from '../types';
import { 
  TicketIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  MagnifyingGlassIcon, 
  ChevronRightIcon, 
  StarIcon,
  ClockIcon,
  MapPinIcon,
  BanknotesIcon,
  CheckCircleIcon,
  HeartIcon as HeartIconOutline
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const BenefitsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discounts' | 'scholarships' | 'internships'>('discounts');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [savedOfferIds, setSavedOfferIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setAppliedIds(benefitsService.getAppliedIds());
    setSavedOfferIds(benefitsService.getSavedOfferIds());
  }, []);

  const handleApply = async (id: string) => {
    const updated = await benefitsService.applyToBenefit(id);
    setAppliedIds([...updated]);
  };

  const handleToggleSave = async (id: string) => {
    const updated = await benefitsService.toggleSaveOffer(id);
    setSavedOfferIds([...updated]);
  };

  const filteredDiscounts = getStudentBenefits().filter(b => 
    b.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.offer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScholarships = getScholarships().filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInternships = getInternships().filter(i => 
    i.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDiscounts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {filteredDiscounts.map((benefit) => {
        const isSaved = savedOfferIds.includes(benefit.id);
        return (
          <div key={benefit.id} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-premium border border-slate-50 dark:border-slate-800 group hover:border-brand transition-all flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                {benefit.logo}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{benefit.brand}</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{benefit.offer}</h4>
                <span className="text-[9px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md mt-2 inline-block uppercase tracking-widest">{benefit.category}</span>
              </div>
            </div>
            <button 
              onClick={() => handleToggleSave(benefit.id)}
              className={`p-3 rounded-2xl transition-all ${isSaved ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-rose-400'}`}
            >
              {isSaved ? <HeartIconSolid className="w-6 h-6" /> : <HeartIconOutline className="w-6 h-6" />}
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderScholarships = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {filteredScholarships.map((sch) => {
        const isApplied = appliedIds.includes(sch.id);
        return (
          <div key={sch.id} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-premium border border-slate-50 dark:border-slate-800 group hover:border-indigo-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-500 font-black">
                  {sch.provider[0]}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">{sch.name}</h4>
                  <p className="text-xs font-bold text-slate-400">{sch.provider}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {sch.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-500 rounded-lg">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className="text-right flex-1 md:flex-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                <p className="text-xl font-black text-indigo-500">{sch.amount}</p>
                <p className="text-[9px] font-bold text-rose-400 flex items-center justify-end gap-1 mt-1">
                  <ClockIcon className="w-3 h-3" /> Due {sch.deadline}
                </p>
              </div>
              <button 
                onClick={() => handleApply(sch.id)}
                disabled={isApplied}
                className={`py-4 px-8 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-lg transition-all ${isApplied ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'}`}
              >
                {isApplied ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderInternships = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {filteredInternships.map((intern) => {
        const isApplied = appliedIds.includes(intern.id);
        return (
          <div key={intern.id} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[48px] p-10 shadow-2xl group transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <BriefcaseIcon className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-white/10 dark:bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest">{intern.company}</span>
                <span className="text-[9px] font-black text-brand flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3 text-brand" /> Verified Hire
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tighter mb-1">{intern.role}</h4>
                <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {intern.location}</span>
                  <span className="flex items-center gap-1"><StarIconSolid className="w-3 h-3 text-amber-400" /> {intern.type}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-white/10 dark:border-slate-100">
                <div>
                  <p className="text-[9px] opacity-60 font-black uppercase tracking-widest">Stipend</p>
                  <p className="text-lg font-black">{intern.stipend}</p>
                </div>
                <button 
                  onClick={() => handleApply(intern.id)}
                  disabled={isApplied}
                  className={`py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isApplied ? 'bg-white/10 dark:bg-slate-100 text-slate-400' : 'bg-brand text-white shadow-xl shadow-brand/20 active:scale-95'}`}
                >
                  {isApplied ? 'Application Sent' : 'Fast Apply'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-10 pb-20 flex flex-col items-center w-full animate-in fade-in duration-700">
      <div className="max-w-6xl w-full space-y-10 px-4">
        {/* Hub Header */}
        <div className="bg-white dark:bg-slate-900 rounded-[56px] p-12 shadow-premium border border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                <StarIconSolid className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Elite Student Hub</p>
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Your Campus <br/> Edge. 🚀</h2>
            <p className="text-slate-500 font-medium mt-4 max-w-sm">Unlock premium benefits, high-value scholarships, and the best student opportunities in India.</p>
          </div>
          <div className="w-full md:w-80 space-y-4 relative z-10">
            <div className="relative group">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search hub..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand/20 p-5 pl-14 rounded-3xl font-bold text-sm outline-none shadow-inner transition-all"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Applied</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{appliedIds.length}</p>
              </div>
              <div className="flex-1 p-4 bg-brand/10 rounded-2xl text-center border border-brand/20">
                <p className="text-[9px] font-black text-brand uppercase mb-1">Saved</p>
                <p className="text-lg font-black text-brand">{savedOfferIds.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-[32px] shadow-premium flex gap-2 border border-slate-50 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('discounts')}
              className={`flex items-center gap-2 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'discounts' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <TicketIcon className="w-4 h-4" /> Discounts
            </button>
            <button 
              onClick={() => setActiveTab('scholarships')}
              className={`flex items-center gap-2 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'scholarships' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <AcademicCapIcon className="w-4 h-4" /> Scholarships
            </button>
            <button 
              onClick={() => setActiveTab('internships')}
              className={`flex items-center gap-2 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'internships' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <BriefcaseIcon className="w-4 h-4" /> Internships
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'discounts' && renderDiscounts()}
          {activeTab === 'scholarships' && renderScholarships()}
          {activeTab === 'internships' && renderInternships()}
        </div>
      </div>
    </div>
  );
};

export default BenefitsHub;
