
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type RiskScore = 'low' | 'medium' | 'high';
export type Category = 'Food' | 'Travel' | 'Utilities' | 'Shopping' | 'Investments' | 'Salary' | 'Rent' | 'Others' | 'Fees';

export interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  sender: string;
  category: Category;
  timestamp: number;
  status: TransactionStatus;
  riskScore: RiskScore;
  flaggedReason?: string;
  isSplit?: boolean;
  splitWith?: string[];
  roundUpAmount?: number;
}

export interface StudentFee {
  id: string;
  title: string; // e.g., "Semester 4 Tuition"
  totalAmount: number;
  savedAmount: number;
  dueDate: number;
  category: 'Tuition' | 'Hostel' | 'Exam' | 'Other';
  isAutoSaveActive: boolean;
  dailyContribution: number;
}

export interface FraudAlert {
  id: string;
  timestamp: number;
  type: 'velocity' | 'amount' | 'pattern';
  severity: RiskScore;
  description: string;
  txId: string;
}

export interface Wallet {
  balance: number;
  currency: 'INR';
  cardName: string;
  cardNumber: string;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface SharedVault {
  id: string;
  title: string;
  target: number;
  current: number;
  members: string[];
  recentActivity: { user: string; amount: number; time: number }[];
}

export interface BillReminder {
  id: string;
  provider: string;
  amount: number;
  dueDate: number;
  category: string;
  isPaid: boolean;
}

export interface GoldSIP {
  id: string;
  type: 'Gold' | 'Silver';
  amountPerMonth: number;
  nextDate: number;
  roundUpActive: boolean;
}

export interface CampusGig {
  id: string;
  title: string;
  reward: number;
  postedBy: string;
  location: string;
  type: 'Gig' | 'Marketplace';
}

export interface StudentBenefit {
  id: string;
  brand: string;
  offer: string;
  category: 'Subscription' | 'Food' | 'Lifestyle' | 'Campus';
  logo: string;
  expiry?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  tags: string[];
}

export interface Internship {
  id: string;
  role: string;
  company: string;
  stipend: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
}

export interface AuditRecord {
  id: string;
  timestamp: number;
  potentialSavings: number;
  category: string;
  status: 'pending' | 'optimized';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'info' | 'alert' | 'success' | 'security';
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface StockHistory {
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface StockPrice {
  symbol: string;
  name: string;
  price: number; 
  priceUSD?: number; 
  currency: 'INR' | 'USD';
  change: number;
  lastPrice: number;
  history: StockHistory[];
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  description: string;
}

export interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number; 
}

export interface UserSettings {
  kycVerified: boolean;
  biometricActive: boolean;
  smartNotifications: boolean;
  nightMode: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  current: number;
}

export interface UserProfile {
  name: string;
  email: string;
  bankName?: string;
  creditScore: number;
  upiId: string;
  isSessionVerified: boolean;
  settings: UserSettings;
  savingsGoal: number;
  savingsCurrent: number;
  mood: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  WALLET = 'wallet',
  MARKETS = 'markets',
  PORTFOLIO = 'portfolio',
  VAULTS = 'vaults',
  FINANCE = 'finance',
  BILLS = 'bills',
  ASSISTANT = 'assistant',
  SETTINGS = 'settings',
  SECURITY = 'security',
  REWARDS = 'rewards',
  CAMPUS = 'campus',
  BENEFITS = 'benefits',
  FEES = 'fees'
}
