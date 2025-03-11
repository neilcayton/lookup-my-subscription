import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Subscription } from '../types/Subscription';
import { useAuthState } from '../services/authService';
import '../styles/AddEditScreen.css';
import { useSubscription, useCreateSubscription, useUpdateSubscription } from '../hooks/useSubscriptions';

const AddEditScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const currentUser = useAuthState();
  
  const [formData, setFormData] = useState<Omit<Subscription, 'id'>>({
    name: '',
    logo: '',
    price: 0,
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    billingCycle: 'monthly', // Default billing cycle
    userId: currentUser?.uid || '',
  });
  
  const [error, setError] = useState('');

  // Query for fetching subscription details in edit mode
  const { 
    data: subscriptionData, 
    isLoading: isLoadingSubscription,
    error: subscriptionError
  } = useSubscription(isEditMode ? id : undefined);

  // Mutations for creating and updating subscriptions
  const { mutate: createSubscriptionMutation, isPending: isCreating } = useCreateSubscription();
  const { mutate: updateSubscriptionMutation, isPending: isUpdating } = useUpdateSubscription();

  const isLoading = isLoadingSubscription || isCreating || isUpdating;

  useEffect(() => {
    if (subscriptionError) {
      setError('Failed to load subscription details');
    }
  }, [subscriptionError]);

  useEffect(() => {
    // Populate form with subscription data when in edit mode
    if (isEditMode && subscriptionData) {
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = new Date(subscriptionData.date).toISOString().split('T')[0];
      
      setFormData({
        name: subscriptionData.name,
        logo: subscriptionData.logo,
        price: subscriptionData.price,
        currency: subscriptionData.currency,
        date: formattedDate,
        billingCycle: subscriptionData.billingCycle || 'monthly',
        userId: subscriptionData.userId || currentUser?.uid || '',
        transactionHistory: subscriptionData.transactionHistory,
      });
    }
  }, [subscriptionData, isEditMode, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to perform this action');
      return;
    }
    
    try {
      if (isEditMode && id) {
        updateSubscriptionMutation(
          { id, ...formData },
          {
            onSuccess: () => navigate('/'),
            onError: (err) => setError(err.message || 'Failed to update subscription')
          }
        );
      } else {
        createSubscriptionMutation(
          {
            ...formData,
            userId: currentUser.uid,
          },
          {
            onSuccess: () => navigate('/'),
            onError: (err) => setError(err.message || 'Failed to create subscription')
          }
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save subscription');
    }
  };

  return (
    <div className="add-edit-container">
      <header className="add-edit-header">
        <h1>{isEditMode ? 'Edit Subscription' : 'Add New Subscription'}</h1>
        <button onClick={() => navigate('/')} className="back-button">Back</button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {isLoadingSubscription && isEditMode ? (
        <div className="loading">Loading subscription details...</div>
      ) : (
        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="form-group">
            <label htmlFor="name">Subscription Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Netflix, Spotify, etc."
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="logo">Logo URL (optional)</label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              disabled={isLoading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Monthly Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="billingCycle">Billing Cycle</label>
            <select
              id="billingCycle"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Renewal Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isCreating ? 'Adding...' : isUpdating ? 'Updating...' : isEditMode ? 'Update Subscription' : 'Add Subscription'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddEditScreen;