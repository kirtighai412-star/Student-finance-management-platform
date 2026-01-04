
import React from 'react';
import { 
  HomeIcon, 
  WalletIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  BriefcaseIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { AppTab } from './types';

export const NAVIGATION_ITEMS = [
  { id: AppTab.DASHBOARD, label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
  { id: AppTab.MARKETS, label: 'Stocks', icon: <ChartBarIcon className="w-6 h-6" /> },
  { id: AppTab.PORTFOLIO, label: 'Portfolio', icon: <BriefcaseIcon className="w-6 h-6" /> },
  { id: AppTab.WALLET, label: 'Pay', icon: <WalletIcon className="w-6 h-6" /> },
  { id: AppTab.REWARDS, label: 'Rewards', icon: <TrophyIcon className="w-6 h-6" /> },
  { id: AppTab.ASSISTANT, label: 'AI Guru', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" /> },
  { id: AppTab.SETTINGS, label: 'Settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
];

export const MOCK_CATEGORIES = ['Food', 'Travel', 'Utilities', 'Shopping', 'Investments', 'Others'];
