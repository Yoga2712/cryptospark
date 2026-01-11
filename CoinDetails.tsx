import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCoinDetails, getCoinMarketChart } from '../services/api';
import { CoinDetail, ChartDataPoint } from '../types';
import PriceChart from '../components/PriceChart';
import Loader from '../components/Loader';

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const coinData = await getCoinDetails(id);
        setCoin(coinData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load coin details.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchChart = async () => {
      if (!id) return;

      try {
        setChartLoading(true);
        setChartError(null);
        const marketChart = await getCoinMarketChart(id, days);
        
        const formattedData: ChartDataPoint[] = marketChart.prices.map(([timestamp, price]) => {
          const date = new Date(timestamp);
          return {
            date: days === 1 ? date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
            price,
          };
        });
        
        setChartData(formattedData);
        setChartLoading(false);
      } catch (err: any) {
        console.error("Failed to load chart data", err);
        setChartError(err.message || 'Chart data unavailable');
        setChartLoading(false);
      }
    };

    fetchChart();
  }, [id, days]);

  const goBack = () => navigate('/');

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (error || !coin) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-400 gap-4">
        <h2 className="text-2xl font-display font-bold">Error Loading Coin</h2>
        <p>{error || 'Coin not found'}</p>
        <button onClick={goBack} className="bg-white/10 px-6 py-2 rounded-full hover:bg-white/20 transition-colors text-white">
            Back to Home
        </button>
    </div>
  );

  const isPositive = coin.market_data.price_change_percentage_24h >= 0;
  const chartColor = isPositive ? '#06b6d4' : '#d946ef'; // Cyan or Fuchsia

  return (
    <div className="min-h-screen text-slate-100 p-4 pb-12 relative">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary z-50" />
      
      <div className="max-w-7xl mx-auto pt-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-10">
            <button 
              onClick={goBack}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
            >
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-lg">Back to Markets</span>
            </button>
        </div>

        {/* Main Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    <img src={coin.image.large} alt={coin.name} className="w-24 h-24 rounded-full relative z-10" />
                </div>
                <div>
                    <h1 className="text-6xl font-display font-bold text-white mb-2">{coin.name}</h1>
                    <div className="flex items-center gap-3">
                        <span className="bg-white/10 px-4 py-1.5 rounded text-base font-bold tracking-wider">{coin.symbol.toUpperCase()}</span>
                        <span className="bg-primary/20 text-primary px-4 py-1.5 rounded text-base font-bold">Rank #{coin.market_cap_rank}</span>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-right"
            >
                <div className="text-base text-slate-400 mb-1 font-mono uppercase tracking-wide">Current Price</div>
                <div className="text-6xl font-bold font-display text-white">
                    ${coin.market_data.current_price.usd.toLocaleString()}
                </div>
                <div className={`text-xl font-medium mt-2 flex items-center justify-end ${isPositive ? 'text-primary' : 'text-secondary'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}% (24h)
                </div>
            </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
        >
             <p className="inline-block text-sm text-secondary/80 bg-secondary/10 px-6 py-2 rounded-full border border-secondary/20 font-medium">
               ⚠️ This page is created only for study and educational purposes.
            </p>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Stats Column - Left */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-4"
          >
             <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Market Stats</h3>
                <div className="space-y-6">
                    <StatItem label="Market Cap" value={`$${coin.market_data.market_cap.usd.toLocaleString()}`} />
                    <StatItem label="Volume (24h)" value={`$${coin.market_data.total_volume.usd.toLocaleString()}`} />
                    <StatItem label="Circulating Supply" value={`${coin.market_data.circulating_supply.toLocaleString()}`} />
                    <StatItem label="Total Supply" value={coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : '∞'} />
                </div>
             </div>

             <div className="glass p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Price Ranges</h3>
                <div className="space-y-6">
                    <StatItem label="24h High" value={`$${coin.market_data.high_24h.usd.toLocaleString()}`} color="text-primary" />
                    <StatItem label="24h Low" value={`$${coin.market_data.low_24h.usd.toLocaleString()}`} color="text-secondary" />
                </div>
             </div>
          </motion.div>

          {/* Chart Column - Right */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
             <div className="glass rounded-2xl p-6 h-full min-h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-display font-bold">Price Performance</h2>
                    <div className="bg-black/30 p-1 rounded-lg flex space-x-1">
                        {[7, 30].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    days === d 
                                    ? 'bg-white/10 text-white shadow-lg' 
                                    : 'text-slate-500 hover:text-white'
                                }`}
                            >
                                {d === 7 ? '7 Days' : '30 Days'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full relative">
                    {chartLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : chartError ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                             <p>{chartError}</p>
                             <button onClick={() => setDays(days === 7 ? 30 : 7)} className="text-xs text-primary hover:underline">Try changing range</button>
                        </div>
                    ) : (
                        <PriceChart data={chartData} color={chartColor} />
                    )}
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
    <div>
        <div className="text-sm text-slate-400 mb-1 font-medium">{label}</div>
        <div className={`font-mono font-semibold text-xl ${color || 'text-slate-100'}`}>{value}</div>
    </div>
);

export default CoinDetails;
