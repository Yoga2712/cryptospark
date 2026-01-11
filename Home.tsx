import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCoinsMarkets } from '../services/api';
import { CoinMarket } from '../types';
import CoinCard from '../components/CoinCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const Home: React.FC = () => {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoinsMarkets();
        setCoins(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cryptocurrency data.');
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div className="min-h-screen text-slate-100 px-4 py-8 md:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-16 mt-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-2 font-display">
              CRYPTO<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">SPARK</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
          >
            Explore the future of finance with real-time analytics.
          </motion.p>
          
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </header>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="glass text-center text-red-400 p-8 rounded-2xl border border-red-500/20 max-w-2xl mx-auto flex flex-col gap-4">
            <span className="text-lg font-bold">Unable to load data</span>
            <span>{error}</span>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg transition-colors mx-auto"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {filteredCoins.length === 0 ? (
              <div className="text-center text-slate-500 py-12 font-mono bg-white/5 rounded-xl border border-white/5">
                NO DATA FOUND FOR "{searchTerm.toUpperCase()}"
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredCoins.map((coin, index) => (
                  <CoinCard key={coin.id} coin={coin} index={index} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
