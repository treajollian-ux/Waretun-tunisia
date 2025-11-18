import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ServerList from './components/ServerList';
import ConnectionStatus from './components/ConnectionStatus';
import { VPNProvider } from './hooks/useVPN';
import './styles/App.css';

function App() {
  return (
    <VPNProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>📍 Waretun Tunisia</h1>
            <p>VPN مجاني وآمن لتونس</p>
          </header>
          
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/servers" element={<ServerList />} />
            </Routes>
          </main>
          
          <ConnectionStatus />
        </div>
      </Router>
    </VPNProvider>
  );
}

export default App;
