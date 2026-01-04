
import React, { useState, useMemo } from 'react';
import { StockPrice, StockHistory } from '../types';
import { 
  ComposedChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  Area
} from 'recharts';
import { ChevronLeftIcon, GlobeAltIcon, ShieldCheckIcon, ArrowsRightLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { USD_TO_INR } from '../services/mockDataService';

const CandleStick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isUp = close > open;
  const candleColor = isUp ? '#00d09c' : '#eb5b3c';
  const ratio = Math.abs(height) / Math.max(0.1, Math.abs(open - close));
  
  return (
    <g>
      <line x1={x + width / 2} y1={y - (high - Math.max(open, close)) * ratio} x2={x + width / 2} y2={y + height + (Math.min(open, close) - low) * ratio} stroke={candleColor} strokeWidth={1} />
      <rect x={x} y={y} width={width} height={height} fill={candleColor} />
    </g>
  );
};

interface MarketViewProps {
  stocks: StockPrice[];
  onBuyStock: (symbol: string, quantity: number, price: number) => void;
}

const MarketView: React.FC<MarketViewProps> = ({ stocks, onBuyStock }) => {
  const [selectedStock, setSelectedStock] = useState<StockPrice | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [buyQty, setBuyQty] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  
  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const formatUSD = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => 
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stocks, searchQuery]);

  const handleBuyConfirm = () => {
    if (!selectedStock) return;
    const qty = parseInt(buyQty);
    if (isNaN(qty) || qty <= 0) return;
    onBuyStock(selectedStock.symbol, qty, selectedStock.price);
    setIsBuyModalOpen(false);
  };

  if (selectedStock) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-10 duration-500 pb-20 flex flex-col items-center w-full">
        <div className="max-w-4xl w-full space-y-8 px-4">
          <button onClick={() => setSelectedStock(null)} className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-emerald-500 transition-colors">
             <ChevronLeftIcon className="w-4 h-4" /> Back to Markets
          </button>

          <div className="bg-white dark:bg-slate-800 app-card rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden border-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-slate-900 text-white rounded-[24px] flex items-center justify-center font-black text-3xl shadow-xl">
                   {selectedStock.symbol[0]}
                 </div>
                 <div>
                   <h3 className="text-3xl font-black">{selectedStock.name}</h3>
                   <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-2 py-0.5 border rounded-lg dark:border-slate-700">{selectedStock.symbol}</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-black uppercase">
                         <ShieldCheckIcon className="w-3 h-3" /> {selectedStock.currency === 'USD' ? 'NYSE' : 'NSE'} Verified
                      </span>
                   </div>
                 </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">{formatINR(selectedStock.price)}</p>
                  {selectedStock.currency === 'USD' && (
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-xl mt-2">
                       <span className="text-xs font-black text-indigo-500">$ {selectedStock.priceUSD?.toLocaleString()}</span>
                       <span className="text-[10px] font-bold text-slate-400">@ ₹{USD_TO_INR}</span>
                    </div>
                  )}
                </div>
                <p className={`text-sm font-black flex items-center justify-end gap-1 mt-1 ${selectedStock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}% (30D)
                </p>
              </div>
            </div>

            <div className="h-80 md:h-[450px] w-full mb-12">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={selectedStock.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d09c" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#00d09c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => selectedStock.currency === 'USD' ? `$${(v/USD_TO_INR).toFixed(0)}` : `₹${v}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                      formatter={(value: number) => [
                        selectedStock.currency === 'USD' ? `${formatUSD(value/USD_TO_INR)} (${formatINR(value)})` : formatINR(value),
                        'Price'
                      ]}
                    />
                    <Area type="monotone" dataKey="close" stroke="#00d09c" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                    <Bar dataKey="close" shape={<CandleStick />} barSize={10} />
                 </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-slate-50 dark:border-slate-700">
               <div><p className="text-[10px] text-slate-400 font-black uppercase mb-1.5">Market Cap</p><p className="font-black text-lg">{selectedStock.marketCap}</p></div>
               <div><p className="text-[10px] text-slate-400 font-black uppercase mb-1.5">P/E Ratio</p><p className="font-black text-lg">{selectedStock.peRatio}</p></div>
               <div><p className="text-[10px] text-slate-400 font-black uppercase mb-1.5">Div. Yield</p><p className="font-black text-lg">{selectedStock.dividendYield}</p></div>
               <div><p className="text-[10px] text-slate-400 font-black uppercase mb-1.5">Base Currency</p><p className="font-black text-lg flex items-center gap-2">{selectedStock.currency} <ArrowsRightLeftIcon className="w-4 h-4 text-emerald-500" /></p></div>
            </div>

            <div className="pt-10 border-t border-slate-50 dark:border-slate-700 space-y-4">
               <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <GlobeAltIcon className="w-5 h-5 text-slate-400" /> About Company
               </h4>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-3xl font-medium">{selectedStock.description}</p>
            </div>

            <div className="mt-12 flex gap-4">
               <button onClick={() => setIsBuyModalOpen(true)} className="flex-1 py-5 bg-emerald-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Buy Shares</button>
               <button className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-[24px] font-black text-lg active:scale-95 transition-all">Add to Watchlist</button>
            </div>
          </div>
        </div>

        {isBuyModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-slate-800 w-full max-sm rounded-[40px] p-10 space-y-8 shadow-2xl relative">
                <h3 className="text-2xl font-black">Trade {selectedStock.symbol}</h3>
                <div className="space-y-6">
                   <div>
                     <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Shares Quantity</label>
                     <input type="number" value={buyQty} onChange={(e) => setBuyQty(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[20px] p-5 text-2xl font-black focus:outline-none" />
                   </div>
                   <div className="flex flex-col gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-[20px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-emerald-600">Total (INR Base)</span>
                        <span className="text-lg font-black text-emerald-600">{formatINR(selectedStock.price * parseInt(buyQty || '1'))}</span>
                      </div>
                      {selectedStock.currency === 'USD' && (
                        <div className="flex justify-between items-center border-t border-emerald-500/10 pt-2">
                          <span className="text-[9px] font-bold text-emerald-600/60">Estimated {selectedStock.currency} Cost</span>
                          <span className="text-xs font-black text-emerald-600/60">{formatUSD(selectedStock.priceUSD! * parseInt(buyQty || '1'))}</span>
                        </div>
                      )}
                   </div>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setIsBuyModalOpen(false)} className="flex-1 py-4 text-sm font-black text-slate-400">Cancel</button>
                   <button onClick={handleBuyConfirm} className="flex-[2] py-4 bg-emerald-500 text-white rounded-[20px] font-black shadow-lg">Confirm Order</button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12 flex flex-col items-center w-full">
      <div className="max-w-6xl w-full px-4 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Global Markets 🌏</h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5">Dual-Currency Real-time Tickers</p>
          </div>
          
          <div className="w-full md:w-96 relative group">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" />
            <input 
              type="text" 
              placeholder="Search companies, symbols..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[28px] py-4 pl-14 pr-6 font-bold outline-none focus:border-brand/20 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredStocks.map(s => (
            <button key={s.symbol} onClick={() => setSelectedStock(s)} className="p-6 bg-white dark:bg-slate-800 app-card rounded-[32px] text-left transition-all hover:scale-[1.05] group border-none">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-black text-slate-400 group-hover:text-emerald-500 transition-colors uppercase">{s.symbol}</p>
                 {s.currency === 'USD' && <span className="text-[8px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 px-2 py-0.5 rounded-lg font-black">USD</span>}
               </div>
               <h4 className="font-black text-base truncate mb-1">{s.name}</h4>
               <p className="text-xl font-black text-slate-900 dark:text-white">{formatINR(s.price)}</p>
               {s.currency === 'USD' && (
                 <p className="text-[10px] font-bold text-slate-400 opacity-70">{formatUSD(s.priceUSD!)}</p>
               )}
               <div className="flex items-center gap-1.5 mt-3">
                 <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${s.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                   {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
                 </span>
               </div>
            </button>
          ))}
          {filteredStocks.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-300 border-2 border-dashed">
                <MagnifyingGlassIcon className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketView;
