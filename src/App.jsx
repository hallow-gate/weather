// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherDashboard from './components/WeatherDashboard';
import WaterTracker from './components/WaterTracker';
import './App.css';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              {isInstallable && (
                <button onClick={handleInstall} className="install-button glass-card">
                  Install App
                </button>
              )}
              <WeatherDashboard />
              <WaterTracker />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
