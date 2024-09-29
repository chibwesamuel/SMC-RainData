/// <reference types="react-router-dom" />

import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import PredictionPage from './components/PredictionPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<PredictionPage />} />
          </Route>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;