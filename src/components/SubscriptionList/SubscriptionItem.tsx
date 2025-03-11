import React from 'react';
import { Subscription } from '../../types/Subscription';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/SubscriptionItem.css';

interface SubscriptionItemProps {
  subscription: Subscription;
  onClick: () => void;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ subscription, onClick }) => {
  const { name, price, billingCycle, nextBillingDate } = subscription;
  
  // Format the next billing date
  const formattedDate = nextBillingDate 
    ? new Date(nextBillingDate).toLocaleDateString() 
    : 'Not set';

  return (
    <div className="subscription-item" onClick={onClick}>
      <div className="subscription-info">
        <h3 className="subscription-name">{name}</h3>
        <p className="subscription-details">
          {formatCurrency(price)} / {billingCycle}
        </p>
        <p className="subscription-next-billing">
          Next billing: {formattedDate}
        </p>
      </div>
      <div className="subscription-action">
        <span className="view-details">View Details &rarr;</span>
      </div>
    </div>
  );
};

export default SubscriptionItem;