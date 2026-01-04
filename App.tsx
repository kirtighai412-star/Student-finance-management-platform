
import React, { useState, useEffect } from 'react';
import { AppTab, Transaction, Wallet, Budget, UserProfile, StockPrice, Holding, UserSettings, Notification, SharedVault, BillReminder, GoldSIP, FraudAlert, StudentFee } from './types';
import { 
  getInitialProfile, 
  getInitialWallet, 
  getInitialBudgets, 
  generateMockTransactions, 
  generateStockData,
  getMockNotifications,
  getSharedVaults,
  getBillReminders,
  getGoldSIPs
} from './services/mockDataService';
import { authService } from './services/authService';
import { feeService } from './services/feeService';
import { transactionAnalysisService } from './services/transactionAnalysisService';
import { 
  HomeIcon, 
  ChartBarIcon, 
  ChatBubbleOvalLeftEllipsisIcon,
  BriefcaseIcon,
  BellIcon,
  QrCodeIcon,
  UserGroupIcon,
  PresentationChartBarIcon,
  AcademicCapIcon,
  StarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  ChartBarIcon as ChartBarIconSolid, 
  ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid, 
  BriefcaseIcon as BriefcaseIconSolid,
  PresentationChartBarIcon as PresentationChartBarIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  StarIcon as StarIconSolid,
  BanknotesIcon as BanknotesIconSolid
} from '@heroicons/react/24/solid';
import Dashboard from './components/Dashboard';
import WalletView from './components/WalletView';
import MarketView from './components/MarketView';
import AIAssistant from './components/AIAssistant';
import SettingsView from './components/SettingsView';
import Login from './components/Login';
import QRScanner from './components/QRScanner';
import PortfolioView from './components/PortfolioView';
import SecurityCenter from './components/SecurityCenter';
import NotificationDrawer from './components/NotificationDrawer';
import BillManager from './components/BillManager';
import FinanceView from './components/FinanceView';
import CampusView from './components/CampusView';
import BenefitsHub from './components/BenefitsHub';
import FeeManager from './components/FeeManager';

const RBUPAY_LOGO = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <rect width="40" height="40" rx="12" fill="url(#paint0_linear_logo)"/>
    <path d="M12 12C12 10.8954 12.8954 10 14 10H22C25.3137 10 28 12.6863 28 16C28 19.3137 25.3137 22 22 22H18L26 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" fill="white" fillOpacity="0.5"/>
    <defs>
      <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D09C"/>
        <stop offset="1" stopColor="#6366F1"/>
      </linearGradient>
    </defs>
  </svg>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [profile, setProfile] = useState<UserProfile>(getInitialProfile());
  const [wallet, setWallet] = useState<Wallet>(getInitialWallet());
  const [budgets, setBudgets] = useState<Budget[]>(getInitialBudgets());
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions());
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]); 
  const [notifications, setNotifications] = useState<Notification[]>(getMockNotifications());
  const [vaults, setVaults] = useState<SharedVault[]>(getSharedVaults());
  const [bills, setBills] = useState<BillReminder[]>(getBillReminders());
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(transactionAnalysisService.getAlerts());
  const [saveTheChangeActive, setSaveTheChangeActive] = useState(true);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const user = await authService.checkSession();
      if (user) {
        setProfile(user);
        setIsLoggedIn(true);
      }
      setAppReady(true);
    };
    initAuth();
  }, []);

  useEffect(() => {
    const loadFees = async () => {
      const data = await feeService.getAllFees();
      setFees(data);
    };
    if (isLoggedIn) loadFees();
  }, [isLoggedIn]);

  useEffect(() => {
    const initialStocks = [
      generateStockData('RELIANCE'), generateStockData('TCS'), generateStockData('HDFCBANK'),
      generateStockData('INFY'), generateStockData('WIPRO'), generateStockData('BHARTIARTL'),
      generateStockData('ADANIENT'), generateStockData('ZOMATO'), generateStockData('PAYTM'),
      generateStockData('NYKAA'), generateStockData('APPLE'), generateStockData('GOOGLE'),
      generateStockData('NVDA'), generateStockData('GOLD'), generateStockData('SILVER'),
    ];
    setStocks(initialStocks);

    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const lastPrice = s.price;
        const newPrice = s.price + (Math.random() * 2 - 1);
        return {
          ...s, lastPrice, price: newPrice,
          change: s.change + (Math.random() * 0.05 - 0.025),
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogin = (userProfile: UserProfile) => {
    setProfile(userProfile);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setActiveTab(AppTab.DASHBOARD);
  };

  const handleUpdateFee = async (id: string, update: Partial<StudentFee>) => {
    const updated = await feeService.updateFee(id, update);
    setFees(updated);
  };

  const handleAddTransaction = async (tx: Transaction) => {
    let finalTx = { ...tx };
    
    // Save the Change Round-up Logic
    if (saveTheChangeActive && tx.status === 'completed' && tx.amount % 10 !== 0) {
      const roundUp = Math.ceil(tx.amount / 10) * 10 - tx.amount;
      if (roundUp > 0) {
        finalTx.roundUpAmount = roundUp;
        setWallet(prev => ({ ...prev, balance: prev.balance - roundUp }));
      }
    }

    const alert = await transactionAnalysisService.analyzeTransaction(finalTx, transactions);
    if (alert) {
      setFraudAlerts(prev => [alert, ...prev]);
    }

    setTransactions(prev => [finalTx, ...prev]);
    if (finalTx.status === 'completed') {
      if (finalTx.recipient.toLowerCase().includes('sell order')) {
        setWallet(prev => ({ ...prev, balance: prev.balance + finalTx.amount }));
      } else {
        setWallet(prev => ({ ...prev, balance: prev.balance - finalTx.amount }));
        if (finalTx.category !== 'Others' && finalTx.category !== 'Fees') {
          setBudgets(prev => prev.map(b => 
            b.category === finalTx.category ? { ...b, spent: b.spent + finalTx.amount } : b
          ));
        }
      }
    }
  };

  const handleFeeContribution = (amount: number, title: string) => {
    handleAddTransaction({
      id: `fee-fund-${Date.now()}`,
      amount,
      recipient: title,
      sender: profile.name,
      category: 'Fees',
      timestamp: Date.now(),
      status: 'completed',
      riskScore: 'low'
    });
  };

  const handleBuyStock = (symbol: string, quantity: number, price: number) => {
    setHoldings(prev => {
      const existing = prev.find(h => h.symbol === symbol);
      if (existing) {
        return prev.map(h => h.symbol === symbol ? { 
          ...h, 
          avgPrice: (h.avgPrice * h.quantity + price * quantity) / (h.quantity + quantity),
          quantity: h.quantity + quantity 
        } : h);
      }
      return [...prev, { symbol, quantity, avgPrice: price }];
    });
    handleAddTransaction({
      id: `buy-${Date.now()}`,
      amount: quantity * price,
      recipient: `Buy Order: ${symbol}`,
      sender: profile.name,
      category: 'Investments',
      timestamp: Date.now(),
      status: 'completed',
      riskScore: 'low'
    });
  };

  const handleSellStock = (symbol: string, quantity: number, price: number) => {
    setHoldings(prev => {
      const existing = prev.find(h => h.symbol === symbol);
      if (!existing) return prev;
      if (existing.quantity <= quantity) return prev.filter(h => h.symbol !== symbol);
      return prev.map(h => h.symbol === symbol ? { ...h, quantity: h.quantity - quantity } : h);
    });
    handleAddTransaction({
      id: `sell-${Date.now()}`,
      amount: quantity * price,
      recipient: `Sell Order: ${symbol}`,
      sender: profile.name,
      category: 'Investments',
      timestamp: Date.now(),
      status: 'completed',
      riskScore: 'low'
    });
  };

  const navItems = [
    { id: AppTab.DASHBOARD, label: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid },
    { id: AppTab.FEES, label: 'Fees', icon: BanknotesIcon, activeIcon: BanknotesIconSolid },
    { id: AppTab.BENEFITS, label: 'Benefits', icon: StarIcon, activeIcon: StarIconSolid },
    { id: AppTab.CAMPUS, label: 'Campus', icon: AcademicCapIcon, activeIcon: AcademicCapIconSolid },
    { id: AppTab.MARKETS, label: 'Markets', icon: ChartBarIcon, activeIcon: ChartBarIconSolid },
    { id: AppTab.ASSISTANT, label: 'Guru', icon: ChatBubbleOvalLeftEllipsisIcon, activeIcon: ChatBubbleOvalLeftEllipsisIconSolid },
  ];

  if (!appReady) return null;
  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fcfdfe] dark:bg-[#020617] selection:bg-brand/30">
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 glass-panel sticky top-0 z-50 shadow-sm transition-all">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab(AppTab.DASHBOARD)}>
           <div className="hover:scale-110 transition-transform duration-500">
             {RBUPAY_LOGO}
           </div>
           <div className="flex flex-col">
              <span className="font-extrabold text-xl leading-none tracking-tight text-slate-900 dark:text-white uppercase">RBUPAY</span>
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em] leading-loose">Secure Asset Gateway</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsScanning(true)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><QrCodeIcon className="w-6 h-6" /></button>
          <button onClick={() => setIsNotificationsOpen(true)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all relative">
            <BellIcon className="w-6 h-6 text-slate-500" />
            {(notifications.filter(n => !n.read).length > 0) && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>}
          </button>
          <div onClick={() => setActiveTab(AppTab.SETTINGS)} className="ml-2 w-11 h-11 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-premium cursor-pointer hover:scale-110 transition-all">
            <img src={`https://picsum.photos/seed/${profile.name}/100/100`} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-40 no-scrollbar relative">
        <div className="max-w-6xl mx-auto px-6 py-10 transition-all">
          {activeTab === AppTab.DASHBOARD && <Dashboard profile={profile} wallet={wallet} budgets={budgets} setBudgets={setBudgets} transactions={transactions} stocks={stocks} holdings={holdings} onNavigate={setActiveTab} onAddTransaction={handleAddTransaction} fraudAlerts={fraudAlerts} />}
          {activeTab === AppTab.WALLET && <WalletView wallet={wallet} transactions={transactions} onSendMoney={handleAddTransaction} profile={profile} />}
          {activeTab === AppTab.MARKETS && <MarketView stocks={stocks} onBuyStock={handleBuyStock} />}
          {activeTab === AppTab.CAMPUS && <CampusView />}
          {activeTab === AppTab.BENEFITS && <BenefitsHub />}
          {activeTab === AppTab.FEES && <FeeManager fees={fees} onUpdateFee={handleUpdateFee} onAddTransaction={handleFeeContribution} onFeesRefresh={setFees} />}
          {activeTab === AppTab.FINANCE && <FinanceView profile={profile} budgets={budgets} setBudgets={setBudgets} transactions={transactions} vaults={vaults} setVaults={setVaults} />}
          {activeTab === AppTab.PORTFOLIO && <PortfolioView holdings={holdings} stocks={stocks} onSellStock={handleSellStock} />}
          {activeTab === AppTab.ASSISTANT && <AIAssistant context={{ profile, wallet, budgets, transactions, stocks, holdings }} />}
          {activeTab === AppTab.SETTINGS && <SettingsView profile={profile} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} onUpdateSettings={() => {}} onLogout={handleLogout} />}
          {activeTab === AppTab.SECURITY && <SecurityCenter onVerify={() => setActiveTab(AppTab.DASHBOARD)} />}
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl px-8 py-5 flex justify-between items-center rounded-full shadow-3xl border border-white/20 dark:border-slate-800/40">
          {navItems.map((item) => {
            const IsActive = activeTab === item.id;
            const Icon = IsActive ? item.activeIcon : item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1.5 transition-all ${IsActive ? 'text-brand scale-110' : 'text-slate-400'}`}>
                <div className={`p-2 rounded-xl ${IsActive ? 'bg-brand/10' : ''}`}><Icon className="w-6 h-6" /></div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all ${IsActive ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <NotificationDrawer notifications={notifications} isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onMarkRead={() => {}} onNavigate={setActiveTab} />
      {isScanning && <QRScanner onClose={() => setIsScanning(false)} onScan={() => { setIsScanning(false); setActiveTab(AppTab.WALLET); }} />}
    </div>
  );
};

export default App;
