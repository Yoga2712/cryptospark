import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CoinDetails from './pages/CoinDetails';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen text-white font-sans selection:bg-primary selection:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;