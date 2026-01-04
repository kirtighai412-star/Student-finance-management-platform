
import React, { useState } from 'react';
import { Holding, StockPrice } from '../types';
import { ArrowUpIcon, ArrowDownIcon, CheckCircleIcon, ChartBarIcon, ArrowsRightLeftIcon, BanknotesIcon, XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { 
  ComposedChart, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Area
} from 'recharts';
import { USD_TO_INR } from '../services/mockDataService';

const CandleStick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isUp = close >= open;
  const candleColor = isUp ? '#00d09c' : '#eb5b3c';
  
  const ratio = Math.abs(height) / Math.max(0.1, Math.abs(open - close));
  const topWick = (high - Math.max(open, close)) * ratio;
  const bottomWick = (Math.min(open, close) - low) * ratio;

  return (
    <g>
      <line x1={x + width / 2} y1={y - topWick} x2={x + width / 2} y2={y + height + bottomWick} stroke={candleColor} strokeWidth={1} />
      <rect x={x} y={y} width={width} height={Math.max(2, height)} fill={candleColor} rx={1} />
    </g>
  );
};

interface PortfolioViewProps {
  holdings: Holding[];
  stocks: StockPrice[];
  onSellStock: (symbol: string, quantity: number, price: number) => void;
}

const COLORS = ['#00d09c', '#6366f1', '#a855f7', '#f59e0b', '#ef4444'];

const PortfolioView: React.FC<PortfolioViewProps> = ({ holdings, stocks, onSellStock }) => {
  const [selectedSellHolding, setSelectedSellHolding] = useState<Holding | null>(null);
  const [sellQty, setSellQty] = useState('1');

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const portfolioStats = holdings.reduce((acc, holding) => {
    const currentStock = stocks.find(s => s.symbol === holding.symbol);
    const currentPrice = currentStock ? currentStock.price : holding.avgPrice;
    acc.invested += holding.avgPrice * holding.quantity;
    acc.currentValue += currentPrice * holding.quantity;
    return acc;
  }, { invested: 0, currentValue: 0 });

  const totalPL = portfolioStats.currentValue - portfolioStats.invested;
  const plPercentage = portfolioStats.invested > 0 ? (totalPL / portfolioStats.invested) * 100 : 0;

  const handleSellConfirm = () => {
    if (!selectedSellHolding) return;
    const stock = stocks.find(s => s.symbol === selectedSellHolding.symbol);
    if (!stock) return;
    onSellStock(selectedSellHolding.symbol, parseInt(sellQty), stock.price);
    setSelectedSellHolding(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8">
        {/* Header Stats */}
        <div className="bg-slate-900 text-white p-12 rounded-[56px] shadow-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10 text-center md:text-left">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-4">Master Portfolio</p>
             <h2 className="text-6xl font-black tracking-tighter">{formatINR(portfolioStats.currentValue)}</h2>
             <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${totalPL >= 0 ? 'bg-brand/10 text-brand' : 'bg-rose-500/10 text-rose-500'}`}>
                   {totalPL >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                   <span className="font-black text-sm">{formatINR(Math.abs(totalPL))} ({plPercentage.toFixed(2)}%)</span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Profit</p>
             </div>
          </div>
          <div className="w-40 h-40 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 flex items-center justify-center">
             <ChartBarIcon className="w-20 h-20 text-brand opacity-30" />
          </div>
        </div>

        {/* Holdings List with Candlesticks */}
        <div className="space-y-6">
           <h3 className="text-2xl font-black px-6 tracking-tight">Your Vault Assets</h3>
           <div className="grid grid-cols-1 gap-6">
             {holdings.map(holding => {
               const stock = stocks.find(s => s.symbol === holding.symbol);
               if (!stock) return null;
               const currentVal = stock.price * holding.quantity;
               const pl = currentVal - (holding.avgPrice * holding.quantity);
               
               return (
                 <div key={holding.symbol} className="bg-white dark:bg-slate-900 rounded-[48px] p-10 shadow-premium border border-slate-50 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center hover:border-brand/40 transition-all group">
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-xl">{holding.symbol[0]}</div>
                         <div>
                            <h4 className="text-xl font-black tracking-tight">{stock.name}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{holding.quantity} Units @ {formatINR(holding.avgPrice)}</p>
                         </div>
                       </div>
                       <button onClick={() => setSelectedSellHolding(holding)} className="w-full py-4 bg-rose-50 dark:bg-rose-900/10 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-rose-100 dark:border-rose-900/20 group-hover:bg-rose-500 group-hover:text-white transition-all">Liquidate Position</button>
                    </div>

                    {/* Miniature Candlestick Visualizer */}
                    <div className="h-40 w-full bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-4 relative overflow-hidden">
                       <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={stock.history.slice(-15)}>
                            <XAxis dataKey="time" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Bar dataKey="close" shape={<CandleStick />} />
                            <Area type="monotone" dataKey="close" stroke="#00d09c" fill="#00d09c10" strokeWidth={2} />
                         </ComposedChart>
                       </ResponsiveContainer>
                       <div className="absolute top-4 right-6 text-[8px] font-black uppercase text-slate-400">15D Candle Activity</div>
                    </div>

                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Position Value</p>
                       <p className="text-3xl font-black">{formatINR(currentVal)}</p>
                       <div className={`flex items-center gap-2 justify-end ${pl >= 0 ? 'text-brand' : 'text-rose-500'}`}>
                          <span className="text-xs font-black">{pl >= 0 ? '+' : '-'}{formatINR(Math.abs(pl))}</span>
                          {pl >= 0 ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                       </div>
                    </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      {/* Liquidation Modal */}
      {selectedSellHolding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[56px] p-12 space-y-8 shadow-3xl relative">
              <button onClick={() => setSelectedSellHolding(null)} className="absolute top-10 right-10 text-slate-300"><XMarkIcon className="w-8 h-8" /></button>
              <div className="text-center space-y-2">
                 <h3 className="text-3xl font-black">Sell {selectedSellHolding.symbol}</h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Vault Withdrawal</p>
              </div>
              <div className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 block tracking-widest">Units to Liquidate</label>
                   <input type="number" value={sellQty} onChange={(e) => setSellQty(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-[28px] text-3xl font-black text-center focus:ring-2 focus:ring-brand/20 outline-none" />
                   <p className="text-center text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Max Available: {selectedSellHolding.quantity}</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[32px] text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Estimated Credit</p>
                    <p className="text-3xl font-black text-brand">{formatINR((stocks.find(s => s.symbol === selectedSellHolding.symbol)?.price || 0) * parseInt(sellQty || '0'))}</p>
                 </div>
              </div>
              <button onClick={handleSellConfirm} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[32px] font-black text-xl shadow-2xl">Confirm Liquidation</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioView;
