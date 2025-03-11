import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getSubscriptionByUserId, 
  getSubscriptionById, 
  createSubscription, 
  updateSubsription, 
  deleteSubscription 
} from '../services/subscriptionService';
import { Subscription } from '../types/Subscription';

// Query keys
const SUBSCRIPTION_KEYS = {
  all: ['subscriptions'] as const,
  lists: () => [...SUBSCRIPTION_KEYS.all, 'list'] as const,
  list: (userId: string) => [...SUBSCRIPTION_KEYS.lists(), userId] as const,
  details: () => [...SUBSCRIPTION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUBSCRIPTION_KEYS.details(), id] as const,
};

// Get all subscriptions for a user
export const useUserSubscriptions = (userId: string | undefined) => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.list(userId || 'anonymous'),
    queryFn: async () => {
      if (!userId) {
        console.log('No user ID provided, returning empty array');
        return [];
      }
      
      try {
        console.log('Fetching subscriptions for user:', userId);
        const subscriptions = await getSubscriptionByUserId(userId);
        console.log('Fetched subscriptions:', subscriptions);
        return subscriptions;
      } catch (error) {
        console.error('Error in useUserSubscriptions:', error);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a specific subscription by ID
export const useSubscription = (id: string | undefined) => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.detail(id || ''),
    queryFn: async () => {
      if (!id) {
        console.log('No subscription ID provided, returning null');
        return null;
      }
      
      try {
        console.log('Fetching subscription with ID:', id);
        const subscription = await getSubscriptionById(id);
        console.log('Fetched subscription:', subscription);
        return subscription;
      } catch (error) {
        console.error('Error in useSubscription:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
  });
};

// Create a new subscription
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newSubscription: Omit<Subscription, 'id'>) => {
      try {
        console.log('Creating new subscription:', newSubscription);
        const id = await createSubscription(newSubscription);
        console.log('Created subscription with ID:', id);
        return id;
      } catch (error) {
        console.error('Error in useCreateSubscription:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the user's subscription list
      if (variables.userId) {
        console.log('Invalidating queries for user:', variables.userId);
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(variables.userId) });
      }
    },
    onError: (error) => {
      console.error('Mutation error in useCreateSubscription:', error);
    }
  });
};

// Update an existing subscription
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedSubscription: Subscription) => {
      try {
        console.log('Updating subscription:', updatedSubscription);
        await updateSubsription(updatedSubscription);
        console.log('Updated subscription with ID:', updatedSubscription.id);
        return updatedSubscription.id;
      } catch (error) {
        console.error('Error in useUpdateSubscription:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch both the list and the specific subscription
      if (variables.userId) {
        console.log('Invalidating queries for user:', variables.userId);
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(variables.userId) });
      }
      console.log('Invalidating query for subscription:', variables.id);
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.detail(variables.id) });
    },
    onError: (error) => {
      console.error('Mutation error in useUpdateSubscription:', error);
    }
  });
};

// Delete a subscription
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log('Deleting subscription with ID:', id);
        await deleteSubscription(id);
        console.log('Deleted subscription with ID:', id);
        return id;
      } catch (error) {
        console.error('Error in useDeleteSubscription:', error);
        throw error;
      }
    },
    onSuccess: (id) => {
      // Get the deleted subscription from the cache to access its userId
      const deletedSubscription = queryClient.getQueryData<Subscription>(SUBSCRIPTION_KEYS.detail(id));
      
      // Invalidate and refetch the user's subscription list if we have the userId
      if (deletedSubscription?.userId) {
        console.log('Invalidating queries for user:', deletedSubscription.userId);
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(deletedSubscription.userId) });
      }
      
      // Remove the specific subscription from the cache
      console.log('Removing query for subscription:', id);
      queryClient.removeQueries({ queryKey: SUBSCRIPTION_KEYS.detail(id) });
    },
    onError: (error) => {
      console.error('Mutation error in useDeleteSubscription:', error);
    }
  });
};
