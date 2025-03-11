import React, { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useSubscription, useDeleteSubscription } from '../hooks/useSubscriptions';
import { useAuthState } from '../services/authService';
import '../styles/SubscriptionScreen.css';

const SubscriptionScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthState();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Query for fetching subscription details
  const { 
    data: subscription, 
    isLoading, 
    error: queryError 
  } = useSubscription(id);
  
  // Mutation for deleting subscription
  const { 
    mutate: deleteSubscriptionMutation, 
    isPending: isDeleting 
  } = useDeleteSubscription();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <div className="subscription-detail-container"><div className="loading">Loading subscription details...</div></div>;
  }

  if (queryError) {
    return (
      <div className="subscription-detail-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{queryError.message || 'Failed to load subscription details'}</p>
          <button onClick={() => navigate('/')} className="back-button">Back to Home</button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="subscription-detail-container">
        <div className="not-found">
          <h2>Subscription Not Found</h2>
          <p>The subscription you're looking for doesn't exist or has been deleted.</p>
          <button onClick={() => navigate('/')} className="back-button">Back to Home</button>
        </div>
      </div>
    );
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!id) return;
    
    deleteSubscriptionMutation(id, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error) => {
        console.error('Failed to delete subscription:', error);
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="subscription-detail-container">
      <header className="subscription-header">
        <button onClick={() => navigate('/')} className="back-button">Back</button>
        <h1>{subscription.name}</h1>
        <div className="header-actions">
          <a href={`/edit/${id}`} className="edit-button">Edit</a>
        </div>
      </header>

      <div className="subscription-detail-card">
        <div className="subscription-logo-large">
          {subscription.logo ? (
            <img src={subscription.logo} alt={`${subscription.name} logo`} />
          ) : (
            <div className="logo-placeholder-large">
              {subscription.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="subscription-info">
          <div className="info-item">
            <span className="label">Monthly Price</span>
            <span className="value">{formatCurrency(subscription.price, subscription.currency)}</span>
          </div>
          <div className="info-item">
            <span className="label">Renewal Date</span>
            <span className="value">{formatDate(subscription.date)}</span>
          </div>
          <div className="info-item">
            <span className="label">Annual Cost</span>
            <span className="value">{formatCurrency(subscription.price * 12, subscription.currency)}</span>
          </div>
        </div>

        {subscription.transactionHistory && subscription.transactionHistory.length > 0 && (
          <div className="transaction-history">
            <h3>Transaction History</h3>
            <div className="transaction-list">
              {subscription.transactionHistory.map((transaction, index) => (
                <div key={index} className="transaction-item">
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                  <span className="transaction-amount">{formatCurrency(transaction.amount, subscription.currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="danger-zone">
          <button 
            onClick={handleDeleteClick} 
            className="delete-button"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Subscription'}
          </button>

          {showDeleteConfirm && (
            <div className="delete-confirm">
              <p>Are you sure you want to delete this subscription? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button 
                  onClick={handleConfirmDelete} 
                  className="confirm-delete"
                  disabled={isDeleting}
                >
                  Yes, Delete
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  className="cancel-delete"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;
