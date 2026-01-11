import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CoinMarket } from '../types';

interface CoinCardProps {
  coin: CoinMarket;
  index: number;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, index }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass glass-card rounded-2xl p-6 cursor-pointer relative overflow-hidden group transition-all duration-300"
      onClick={handleCardClick}
    >
      {/* Abstract Background Decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">{coin.symbol.toUpperCase()}</h3>
              <span className="text-sm text-slate-400 font-medium">{coin.name}</span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-black/30 px-2 py-1 rounded border border-white/5">
            #{coin.market_cap_rank}
          </span>
        </div>
        
        <div className="mt-6">
          <span className="text-slate-400 text-sm uppercase tracking-wider font-medium">Price</span>
          <div className="text-3xl font-display font-bold text-white mt-2">
            ${coin.current_price.toLocaleString()}
          </div>
        </div>

        <div className="mt-5 flex justify-between items-end border-t border-white/5 pt-5">
          <div className="flex flex-col">
             <span className="text-xs text-slate-500 uppercase font-semibold">24h Change</span>
             <span className={`text-base font-bold flex items-center mt-1 ${isPositive ? 'text-primary' : 'text-secondary'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
             </span>
          </div>
          
          <div className="text-right">
             <span className="text-xs text-slate-500 uppercase font-semibold">Vol</span>
             <div className="text-sm text-slate-300 mt-1 font-mono font-medium">
               ${(coin.total_volume / 1_000_000).toFixed(0)}M
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CoinCard;