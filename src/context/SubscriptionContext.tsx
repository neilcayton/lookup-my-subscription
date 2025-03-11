import React, { createContext, useContext, ReactNode } from 'react';
import { Subscription } from '../types/Subscription';
import { useUserSubscriptions } from '../hooks/useSubscriptions';
import { useAuthState } from '../services/authService';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: Error | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const currentUser = useAuthState();
  const { data: subscriptions, isLoading, error } = useUserSubscriptions(currentUser?.uid);
  
  const value = {
    subscriptions: subscriptions || [],
    isLoading,
    error,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;