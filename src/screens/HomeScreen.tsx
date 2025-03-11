import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Subscription } from '../types/Subscription';
import { logout, useAuthState } from '../services/authService';
import '../styles/HomeScreen.css';
import { useUserSubscriptions } from '../hooks/useSubscriptions';

const HomeScreen: React.FC = () => {
  const currentUser = useAuthState();
  const navigate = useNavigate();
  
  const { 
    data: subscriptions = [], 
    isLoading, 
    error: queryError 
  } = useUserSubscriptions(currentUser?.uid);
  
  const error = queryError ? 'Failed to load subscriptions' : '';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const calculateTotalMonthly = () => {
    return subscriptions.reduce((total, sub) => total + sub.price, 0).toFixed(2);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>My Subscriptions</h1>
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="subscription-summary">
        <div className="summary-card">
          <h2>Monthly Total</h2>
          <p className="total-amount">${calculateTotalMonthly()}</p>
          <p className="subscription-count">{subscriptions.length} active subscriptions</p>
        </div>
      </div>

      <div className="subscription-actions">
        <Link to="/add" className="add-button">+ Add Subscription</Link>
      </div>

      {isLoading ? (
        <div className="loading">Loading subscriptions...</div>
      ) : subscriptions.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any subscriptions yet.</p>
          <p>Add your first subscription to start tracking!</p>
        </div>
      ) : (
        <div className="subscription-list">
          {subscriptions.map((sub) => (
            <Link to={`/subscription/${sub.id}`} key={sub.id} className="subscription-card">
              <div className="subscription-logo">
                {sub.logo ? (
                  <img src={sub.logo} alt={sub.name} />
                ) : (
                  <div className="logo-placeholder">{sub.name.charAt(0)}</div>
                )}
              </div>
              <div className="subscription-details">
                <h3>{sub.name}</h3>
                <p className="subscription-price">${sub.price} / month</p>
                <p className="subscription-date">Renewed on: {new Date(sub.date).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;