import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Subscription } from '../../types/Subscription';
import SubscriptionItem from './SubscriptionItem';
import '../../styles/SubscriptionList.css';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: Error | null;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ 
  subscriptions, 
  isLoading, 
  error 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="loading-container">Loading subscriptions...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error.message}</div>;
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="empty-list-container">
        <p>No subscriptions found.</p>
        <button 
          className="add-subscription-button"
          onClick={() => navigate('/add')}
        >
          Add Your First Subscription
        </button>
      </div>
    );
  }

  return (
    <div className="subscription-list">
      {subscriptions.map((subscription) => (
        <SubscriptionItem 
          key={subscription.id} 
          subscription={subscription}
          onClick={() => navigate(`/subscription/${subscription.id}`)}
        />
      ))}
    </div>
  );
};

export default SubscriptionList;