
import { Transaction, Wallet, Budget, UserProfile, StockPrice, Category, NewsItem, SavingsGoal, Lesson, StockHistory, UserSettings, Notification, SharedVault, BillReminder, GoldSIP, StudentBenefit, Scholarship, Internship, StudentFee } from '../types';

export const USD_TO_INR = 83.42;

export const getInitialSettings = (): UserSettings => ({
  kycVerified: true,
  biometricActive: true,
  smartNotifications: true,
  nightMode: false,
});

export const getInitialProfile = (): UserProfile => ({
  name: "Arjun Sharma",
  email: "arjun.s@rbupay.com",
  bankName: "HDFC Bank",
  creditScore: 785,
  savingsGoal: 50000,
  savingsCurrent: 12400,
  upiId: "arjun@rbupay",
  isSessionVerified: false,
  settings: getInitialSettings(),
  mood: 'ambitious'
});

export const getInitialWallet = (): Wallet => ({
  balance: 42500,
  currency: 'INR',
  cardName: "ARJUN SHARMA",
  cardNumber: "**** **** **** 5824"
});

export const getStudentFees = (): StudentFee[] => [
  {
    id: 'fee1',
    title: 'Semester 4 Tuition',
    totalAmount: 65000,
    savedAmount: 32000,
    dueDate: Date.now() + (30 * 86400000), // 30 days later
    category: 'Tuition',
    isAutoSaveActive: true,
    dailyContribution: 200
  },
  {
    id: 'fee2',
    title: 'Hostel Rent (Block B)',
    totalAmount: 15000,
    savedAmount: 12000,
    dueDate: Date.now() + (10 * 86400000), // 10 days later
    category: 'Hostel',
    isAutoSaveActive: false,
    dailyContribution: 50
  },
  {
    id: 'fee3',
    title: 'Main Exam Fees',
    totalAmount: 3500,
    savedAmount: 3500,
    dueDate: Date.now() + (5 * 86400000),
    category: 'Exam',
    isAutoSaveActive: false,
    dailyContribution: 0
  }
];

export const getSharedVaults = (): SharedVault[] => [
  {
    id: 'v1',
    title: 'Goa Trip 2026 🌴',
    target: 50000,
    current: 12500,
    members: ['Arjun', 'Rohan', 'Sneha'],
    recentActivity: [
      { user: 'Rohan', amount: 2000, time: Date.now() - 86400000 },
      { user: 'Arjun', amount: 1500, time: Date.now() - 172800000 }
    ]
  },
  {
    id: 'v2',
    title: 'Emergency Fund 🛡️',
    target: 100000,
    current: 45000,
    members: ['Arjun'],
    recentActivity: [
      { user: 'Arjun', amount: 5000, time: Date.now() - 345600000 }
    ]
  }
];

export const getBillReminders = (): BillReminder[] => [
  { id: 'b1', provider: 'BESCOM Electricity', amount: 1240, dueDate: Date.now() + 432000000, category: 'Utilities', isPaid: false },
  { id: 'b2', provider: 'Jio Fiber', amount: 999, dueDate: Date.now() + 86400000, category: 'Utilities', isPaid: false }
];

export const getGoldSIPs = (): GoldSIP[] => [
  { id: 's1', type: 'Gold', amountPerMonth: 2000, nextDate: Date.now() + 1296000000, roundUpActive: true }
];

export const getStudentBenefits = (): StudentBenefit[] => [
  { id: 'sb1', brand: 'Zomato Gold', offer: 'Flat 50% Off on Student Plan', category: 'Food', logo: '🍔' },
  { id: 'sb2', brand: 'Spotify Premium', offer: '₹59/month for Students', category: 'Subscription', logo: '🎵' },
  { id: 'sb3', brand: 'Apple Education', offer: 'Save ₹10,000 on MacBook Air', category: 'Lifestyle', logo: '🍎' },
  { id: 'sb4', brand: 'Campus Canteen', offer: '10% Cashback via RBUPAY', category: 'Campus', logo: '☕' },
  { id: 'sb5', brand: 'GitHub Pack', offer: 'Free Pro Tools for Students', category: 'Subscription', logo: '💻' }
];

export const getScholarships = (): Scholarship[] => [
  { id: 'sch1', name: 'Reliance Foundation Scholarship', provider: 'Reliance Group', amount: '₹2,00,000', deadline: '2026-05-15', tags: ['Merit', 'Undergrad'] },
  { id: 'sch2', name: 'HDFC Badhte Kadam', provider: 'HDFC Bank', amount: '₹75,000', deadline: '2026-06-01', tags: ['Need-based', 'STEM'] },
  { id: 'sch3', name: 'Google Generation Scholarship', provider: 'Google', amount: '$2,500', deadline: '2026-04-20', tags: ['Women in Tech', 'CS'] }
];

export const getInternships = (): Internship[] => [
  { id: 'int1', role: 'Frontend Engineering Intern', company: 'Zomato', stipend: '₹40,000/mo', location: 'Gurugram', type: 'On-site' },
  { id: 'int2', role: 'Product Design Intern', company: 'Paytm', stipend: '₹25,000/mo', location: 'Noida', type: 'Hybrid' },
  { id: 'int3', role: 'Quant Research Intern', company: 'HDFC Bank', stipend: '₹50,000/mo', location: 'Mumbai', type: 'Remote' }
];

export const getMockNotifications = (): Notification[] => [
  {
    id: 'n1',
    title: 'Nifty 50 Alert 🚀',
    message: 'Zomato crossed ₹450! Your investment is up by 12% this morning.',
    timestamp: Date.now() - 1000 * 60 * 15,
    read: false,
    type: 'success'
  },
  {
    id: 'n2',
    title: 'RBUPAY Security Check 🔐',
    message: 'Login session verified successfully. Your assets are protected.',
    timestamp: Date.now() - 1000 * 60 * 120,
    read: false,
    type: 'security'
  },
  {
    id: 'n3',
    title: 'Budget Nudge 🍛',
    message: 'You\'ve spent 85% of your "Food" budget for March. Time to slow down?',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    type: 'alert'
  }
];

const companyMetadata: Record<string, { name: string, desc: string, cap: string, pe: string, div: string, currency: 'INR' | 'USD' }> = {
  'RELIANCE': { name: 'Reliance Industries', desc: 'India\'s largest conglomerate with interests in energy, retail, and telecommunications.', cap: '₹19.5T', pe: '28.4', div: '0.45%', currency: 'INR' },
  'TCS': { name: 'Tata Consultancy Services', desc: 'Global leader in IT services, consulting, and business solutions.', cap: '₹14.2T', pe: '31.2', div: '1.25%', currency: 'INR' },
  'HDFCBANK': { name: 'HDFC Bank Ltd', desc: 'India\'s largest private sector bank by assets and market capitalization.', cap: '₹12.8T', pe: '18.5', div: '0.90%', currency: 'INR' },
  'INFY': { name: 'Infosys Ltd', desc: 'Digital services and consulting MNC focusing on AI and cloud transformation.', cap: '₹6.5T', pe: '24.1', div: '1.80%', currency: 'INR' },
  'WIPRO': { name: 'Wipro Limited', desc: 'Major Indian multinational corporation that provides IT, consulting and business process services.', cap: '₹2.8T', pe: '21.4', div: '0.15%', currency: 'INR' },
  'BHARTIARTL': { name: 'Bharti Airtel Ltd', desc: 'Leading global telecommunications company with operations in 18 countries across Asia and Africa.', cap: '₹7.2T', pe: '54.2', div: '0.35%', currency: 'INR' },
  'ADANIENT': { name: 'Adani Enterprises Ltd', desc: 'Flagship company of the Adani Group, focusing on energy, logistics, and data centers.', cap: '₹3.5T', pe: '88.4', div: '0.10%', currency: 'INR' },
  'ZOMATO': { name: 'Zomato Ltd', desc: 'Online food delivery and restaurant discovery platform dominating Indian foodtech.', cap: '₹1.8T', pe: '142.5', div: '0.00%', currency: 'INR' },
  'PAYTM': { name: 'One97 Communications (Paytm)', desc: 'Leading Indian digital payments and financial services company.', cap: '₹0.4T', pe: 'N/A', div: '0.00%', currency: 'INR' },
  'NYKAA': { name: 'FSN E-Commerce (Nykaa)', desc: 'Indian e-commerce company focused on beauty, wellness, and fashion.', cap: '₹0.5T', pe: '124.2', div: '0.00%', currency: 'INR' },
  'APPLE': { name: 'Apple Inc.', desc: 'Global technology leader in premium electronics, software, and services.', cap: '$3.2T', pe: '32.1', div: '0.50%', currency: 'USD' },
  'GOOGLE': { name: 'Alphabet Inc.', desc: 'The world leader in search, AI, cloud, and digital advertising.', cap: '$2.1T', pe: '27.4', div: '0.40%', currency: 'USD' },
  'NVDA': { name: 'NVIDIA Corp', desc: 'Leading the AI revolution with specialized GPU and networking hardware.', cap: '$2.8T', pe: '75.2', div: '0.02%', currency: 'USD' },
  'GOLD': { name: 'Physical Gold', desc: 'Traditional safe-haven asset, 24K pure gold tracking global MCX rates.', cap: 'N/A', pe: 'N/A', div: '0.00%', currency: 'INR' },
  'SILVER': { name: 'Physical Silver', desc: 'Industrial and investment precious metal tracking global bullion markets.', cap: 'N/A', pe: 'N/A', div: '0.00%', currency: 'INR' },
};

export const generateStockData = (symbol: string): StockPrice => {
  const meta = companyMetadata[symbol] || { name: symbol, desc: 'Corporate Entity', cap: 'N/A', pe: 'N/A', div: '0%', currency: 'INR' };
  
  const nativePrices: Record<string, number> = {
    'RELIANCE': 4200, 'TCS': 5800, 'HDFCBANK': 2450, 'INFY': 1850, 'ZOMATO': 450, 
    'WIPRO': 540, 'BHARTIARTL': 1200, 'ADANIENT': 2950, 'PAYTM': 650, 'NYKAA': 180,
    'APPLE': 225, 'GOOGLE': 178, 'NVDA': 920, 
    'GOLD': 9500, 'SILVER': 115
  };
  
  const nativePrice = nativePrices[symbol] || 1000;
  
  const history: StockHistory[] = Array.from({ length: 40 }, (_, i) => {
    const change = (Math.random() * 2 - 1) * (nativePrice * 0.05);
    const open = nativePrice + change;
    const close = open + (Math.random() * 2 - 1) * (nativePrice * 0.02);
    return {
      time: `2026-03-${i + 1}`,
      open,
      close,
      high: Math.max(open, close) + Math.random() * 5,
      low: Math.min(open, close) - Math.random() * 5,
      volume: Math.floor(Math.random() * 1000000)
    };
  });

  const currentNativePrice = history[history.length - 1].close;
  const lastNativePrice = history[history.length - 2].close;
  
  const priceINR = meta.currency === 'USD' ? currentNativePrice * USD_TO_INR : currentNativePrice;
  const lastPriceINR = meta.currency === 'USD' ? lastNativePrice * USD_TO_INR : lastNativePrice;

  return {
    symbol,
    name: meta.name,
    currency: meta.currency,
    price: priceINR,
    priceUSD: meta.currency === 'USD' ? currentNativePrice : undefined,
    lastPrice: lastPriceINR,
    change: ((currentNativePrice - history[0].close) / history[0].close) * 100,
    history,
    marketCap: meta.cap,
    peRatio: meta.pe,
    dividendYield: meta.div,
    description: meta.desc
  };
};

export const getEconomicNews = (): NewsItem[] => [
  { id: '1', headline: "Sensex targets 110,000 by year-end 2026 as global investment pours in.", source: "Bloomberg", time: "10m ago", sentiment: 'positive' },
  { id: '2', headline: "RBUPAY integrates Digital Rupee cross-border settlement for retail users.", source: "RBI", time: "1h ago", sentiment: 'positive' },
  { id: '3', headline: "NVDA reports record AI chip demand from Indian data centers and startups.", source: "Reuters", time: "3h ago", sentiment: 'positive' },
  { id: '4', headline: "Indian Tech MNCs report record Q3 earnings driven by global AI contracts.", source: "ET Now", time: "5h ago", sentiment: 'positive' },
  { id: '5', headline: "Crude oil stabilizes as India shifts aggressively towards Green Hydrogen infrastructure.", source: "Mint", time: "2h ago", sentiment: 'neutral' },
  { id: '6', headline: "Zomato expands drone delivery to 50 more cities in India.", source: "TechCrunch", time: "15m ago", sentiment: 'positive' },
];

export const getInitialBudgets = (): Budget[] => [
  { category: 'Food', limit: 8000, spent: 3400 },
  { category: 'Travel', limit: 5000, spent: 1200 },
  { category: 'Investments', limit: 10000, spent: 4000 },
  { category: 'Utilities', limit: 2000, spent: 450 },
  { category: 'Shopping', limit: 6000, spent: 2100 },
];

export const generateMockTransactions = (): Transaction[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `tx-${i}`,
    amount: Math.floor(Math.random() * 2000) + 100,
    recipient: 'Campus Mart',
    sender: "Arjun Sharma",
    category: 'Shopping',
    timestamp: Date.now() - (i * 86400000),
    status: 'completed',
    riskScore: 'low'
  }));
};

export const getLessons = (): Lesson[] => [
  {
    id: '1',
    title: 'The Power of Compounding',
    description: 'Learn how starting small can lead to huge wealth over time with Einstein\'s 8th wonder of the world.',
    category: 'Wealth'
  },
  {
    id: '2',
    title: 'Mastering the 50/30/20 Rule',
    description: 'A simple way to manage your pocket money: 50% Needs, 30% Wants, and 20% Savings.',
    category: 'Budgeting'
  },
  {
    id: '3',
    title: 'Your First SIP',
    description: 'A step-by-step guide on how to start a Systematic Investment Plan with just ₹500.',
    category: 'Investing'
  }
];
