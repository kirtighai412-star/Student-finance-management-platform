
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
}

const BANKS = [
  { id: 'sbi', name: 'State Bank of India (SBI)', icon: '🏦' },
  { id: 'hdfc', name: 'HDFC Bank', icon: '🏦' },
  { id: 'icici', name: 'ICICI Bank', icon: '🏦' },
  { id: 'axis', name: 'Axis Bank', icon: '🏦' },
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bankName, setBankName] = useState(BANKS[1].name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a strictly valid email address (e.g., user@domain.com)");
      return;
    }
    if (password.length < 4) {
      setError("Passcode must be at least 4 digits for security.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let profile: UserProfile;
      if (mode === 'login') {
        profile = await authService.login(email, password);
      } else {
        if (!name) throw new Error("Please enter your full name for KYC.");
        profile = await authService.signup(name, email, password, bankName);
      }
      onLogin(profile);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Simulate real-world Google OAuth 2.0 flow
    setTimeout(async () => {
      try {
        const profile = await authService.signup("Arjun Google", "arjun.sharma@gmail.com", "1234", "HDFC Bank");
        onLogin(profile);
      } catch (e) {
        // If already exists, just login
        const profile = await authService.login("arjun.sharma@gmail.com", "1234");
        onLogin(profile);
      } finally {
        setLoading(false);
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-6 font-sans relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-premiumIndigo/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-12 rounded-[56px] shadow-3xl border border-slate-100 dark:border-slate-800 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 brand-gradient rounded-[32px] flex items-center justify-center shadow-3xl mb-10 transform -rotate-6">
            <span className="text-white font-black italic text-4xl">R</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
            {mode === 'login' ? 'Secure Login' : 'Open Vault'}
          </h2>
          <p className="mt-3 text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">RBUPAY Asset Gateway</p>
        </div>
        
        <div className="mt-10 space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-5 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-3xl font-black text-slate-700 dark:text-slate-200 hover:border-brand/30 transition-all active:scale-95 shadow-premium group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
            Continue with Google
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100 dark:border-slate-800"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-slate-900 px-6 text-slate-400 font-black tracking-[0.4em]">Node Protocol</span></div>
          </div>
        </div>

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-3xl text-rose-500 text-xs font-black text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {mode === 'signup' && (
              <div className="group">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-2 block tracking-widest">Full Name (KYC)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-brand/20 rounded-[24px] py-5 px-8 text-slate-900 dark:text-white outline-none transition-all font-bold placeholder:text-slate-300"
                  placeholder="Arjun Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-2 block tracking-widest">Email Node</label>
              <input
                type="email"
                required
                className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-brand/20 rounded-[24px] py-5 px-8 text-slate-900 dark:text-white outline-none transition-all font-bold placeholder:text-slate-300"
                placeholder="node@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 mb-2 block tracking-widest">Security Pin</label>
              <input
                type="password"
                required
                className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-brand/20 rounded-[24px] py-5 px-8 text-slate-900 dark:text-white outline-none transition-all font-black placeholder:text-slate-300 tracking-[0.8em]"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-6 brand-gradient text-white rounded-[28px] font-black text-xl shadow-3xl shadow-brand/20 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95"
          >
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Sync Profile' : 'Generate ID')}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 font-bold mt-8 uppercase tracking-widest">
          {mode === 'login' ? "New to the network?" : "Node already active?"} 
          <button 
            type="button" 
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
            className="ml-2 font-black text-brand hover:underline"
          >
            {mode === 'login' ? 'Initialize' : 'Authorize'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
