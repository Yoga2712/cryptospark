import React from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-full max-w-lg mx-auto mb-12 group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <input
            type="text"
            className="block w-full pl-12 pr-6 py-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-white/30 transition-all duration-300"
            placeholder="Search for a token..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </motion.div>
  );
};

export default SearchBar;