import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64 w-full gap-4">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full border-t-2 border-primary shadow-[0_0_15px_rgba(6,182,212,0.6)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.div
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-secondary/80 blur-md"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </div>
      <span className="text-primary font-mono text-sm tracking-widest animate-pulse">LOADING</span>
    </div>
  );
};

export default Loader;