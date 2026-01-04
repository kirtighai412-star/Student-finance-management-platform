
import React, { useState } from 'react';
import { ShieldCheckIcon, LockClosedIcon, FingerPrintIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/solid';

interface SecurityCenterProps {
  onVerify: () => void;
}

const SecurityCenter: React.FC<SecurityCenterProps> = ({ onVerify }) => {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');

  const handleVerify = () => {
    if (step < 3) setStep(step + 1);
    else onVerify();
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in zoom-in duration-500 py-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-[30px] flex items-center justify-center mx-auto text-emerald-500">
           <ShieldCheckIcon className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Security Verification</h2>
        <p className="text-slate-500 text-sm font-medium">Step {step} of 3: Identity Confirmation</p>
      </div>

      <div className="bg-white dark:bg-slate-800 app-card rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-10">
             <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-700">
                <DevicePhoneMobileIcon className="w-10 h-10 text-slate-400" />
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Device Authorized</p>
                   <p className="font-black text-lg">Your Personal Phone</p>
                </div>
             </div>
             <p className="text-slate-500 text-sm leading-relaxed text-center font-medium">We noticed a login from an unfamiliar location. Please confirm this is you to re-enable high-value transactions.</p>
             <button onClick={handleVerify} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-black text-lg transition-all active:scale-95">Verify Device</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-10">
             <div className="flex justify-center gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-12 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-2 ${pin.length >= i ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 dark:border-slate-700'}`}>
                    {pin.length >= i ? '•' : ''}
                  </div>
                ))}
             </div>
             <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Enter Secure Wallet PIN</p>
             <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                  <button key={n} onClick={() => pin.length < 4 && setPin(pin + n)} className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 font-black text-xl transition-all active:scale-90">{n}</button>
                ))}
                <button onClick={() => setPin('')} className="h-16 rounded-2xl bg-rose-50 text-rose-500 font-black text-sm uppercase">Clear</button>
             </div>
             <button disabled={pin.length < 4} onClick={handleVerify} className="w-full py-5 bg-emerald-500 text-white rounded-[20px] font-black text-lg shadow-xl shadow-emerald-500/20 disabled:opacity-50">Confirm PIN</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center animate-in slide-in-from-right-10">
             <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl animate-bounce">
                <FingerPrintIcon className="w-12 h-12" />
             </div>
             <h3 className="text-2xl font-black">Biometric Scan Required</h3>
             <p className="text-slate-500 text-sm font-medium">Confirming biometric signatures on your 2026 hardware-encrypted enclave.</p>
             <button onClick={handleVerify} className="w-full py-5 bg-emerald-500 text-white rounded-[20px] font-black text-lg transition-all active:scale-95">Simulate FaceID</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityCenter;
