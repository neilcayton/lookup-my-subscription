import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Subscription } from '../types/Subscription';
import { logout, useAuthState } from '../services/authService';
import '../styles/HomeScreen.css';
import { useUserSubscriptions, useDeleteSubscription } from '../hooks/useSubscriptions';
import Header from '../components/Common/Header';

const HomeScreen: React.FC = () => {
  const { currentUser, loading: authLoading, error: authError } = useAuthState();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Get the user ID safely
  const userId = useMemo(() => currentUser?.uid || undefined, [currentUser]);
  
  const { 
    data: subscriptions = [], 
    isLoading: subscriptionsLoading, 
    error: queryError,
    refetch
  } = useUserSubscriptions(userId);

  const { mutate: deleteSubscription, isPending: isDeleting } = useDeleteSubscription();
  
  const isLoading = authLoading || subscriptionsLoading || isDeleting;
  const error = authError || (queryError ? 'Failed to load subscriptions' : '');

  // Show more detailed error information in development
  useEffect(() => {
    if (queryError) {
      console.error('Subscription query error:', queryError);
      setErrorDetails(queryError instanceof Error ? queryError.message : String(queryError));
    } else {
      setErrorDetails(null);
    }
  }, [queryError]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      deleteSubscription(id);
    }
  };

  const handleRetry = () => {
    refetch();
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

      <div className="subscription-summary">
        <div className="summary-card">
          <h2>Total Monthly</h2>
          <p className="summary-amount">${calculateTotalMonthly()}</p>
        </div>
      </div>

      <div className="subscription-actions">
        <Link to="/add" className="add-button">Add Subscription</Link>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <p>Loading subscriptions...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          {errorDetails && (
            <p className="error-details">{errorDetails}</p>
          )}
          <button onClick={handleRetry} className="retry-button">Retry</button>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any subscriptions yet.</p>
          <p>Click the "Add Subscription" button to get started!</p>
        </div>
      ) : (
        <div className="subscription-list">
          {subscriptions.map(subscription => (
            <div key={subscription.id} className="subscription-card">
              <div className="subscription-logo">
                {subscription.logo ? (
                  <img src={subscription.logo} alt={`${subscription.name} logo`} />
                ) : (
                  <div className="placeholder-logo">{subscription.name.charAt(0)}</div>
                )}
              </div>
              <div className="subscription-details">
                <h3>{subscription.name}</h3>
                <p className="subscription-price">${subscription.price.toFixed(2)}/{subscription.billingCycle || 'monthly'}</p>
                <p className="subscription-date">Next payment: {new Date(subscription.date).toLocaleDateString()}</p>
              </div>
              <div className="subscription-actions">
                <Link to={`/edit/${subscription.id}`} className="edit-button">Edit</Link>
                <button 
                  onClick={() => handleDeleteSubscription(subscription.id)} 
                  className="delete-button"
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;