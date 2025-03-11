import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Common/Header';
import '../styles/SettingsScreen.css';

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currency, setCurrency] = useState('USD');

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // In a real app, you would save this to user preferences
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // In a real app, you would save this to user preferences
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
    // In a real app, you would save this to user preferences
  };

  return (
    <div className="settings-container">
      <Header />
      <div className="settings-content">
        <h2>Settings</h2>
        
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label htmlFor="darkMode">Dark Mode</label>
            <input
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={handleDarkModeToggle}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-item">
            <label htmlFor="notifications">Enable Notifications</label>
            <input
              type="checkbox"
              id="notifications"
              checked={notificationsEnabled}
              onChange={handleNotificationsToggle}
            />
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Currency</h3>
          <div className="setting-item">
            <label htmlFor="currency">Display Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
        
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;