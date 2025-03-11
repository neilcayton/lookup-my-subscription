import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscriptionApi';
import { Subscription } from '../models/Subscription';

// Query keys
const SUBSCRIPTION_KEYS = {
  all: ['subscriptions'] as const,
  lists: () => [...SUBSCRIPTION_KEYS.all, 'list'] as const,
  list: (userId: string) => [...SUBSCRIPTION_KEYS.lists(), userId] as const,
  details: () => [...SUBSCRIPTION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUBSCRIPTION_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all subscriptions for a user
 * @param userId - The ID of the user
 * @returns Query result with subscriptions data
 */
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
        const subscriptions = await subscriptionApi.fetchUserSubscriptions(userId);
        console.log('Fetched subscriptions:', subscriptions);
        return subscriptions;
      } catch (error) {
        console.error('Error in useUserSubscriptions:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new subscription
 * @returns Mutation function and status
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subscription: Omit<Subscription, 'id'>) => {
      try {
        console.log('Creating subscription:', subscription);
        const newSubscription = await subscriptionApi.createSubscription(subscription);
        console.log('Created subscription:', newSubscription);
        return newSubscription;
      } catch (error) {
        console.error('Error in useCreateSubscription:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch subscriptions list for this user
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(variables.userId) });
      }
    },
    onError: (error) => {
      console.error('Mutation error in useCreateSubscription:', error);
    }
  });
};

/**
 * Hook to update an existing subscription
 * @returns Mutation function and status
 */
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subscription: Subscription) => {
      try {
        console.log('Updating subscription:', subscription);
        const updatedSubscription = await subscriptionApi.updateSubscription(subscription);
        console.log('Updated subscription:', updatedSubscription);
        return updatedSubscription;
      } catch (error) {
        console.error('Error in useUpdateSubscription:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the updated subscription and the list
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.detail(variables.id) });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(variables.userId) });
      }
    },
    onError: (error) => {
      console.error('Mutation error in useUpdateSubscription:', error);
    }
  });
};

/**
 * Hook to delete a subscription
 * @returns Mutation function and status
 */
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log('Deleting subscription:', id);
        await subscriptionApi.deleteSubscription(id);
        console.log('Deleted subscription:', id);
      } catch (error) {
        console.error('Error in useDeleteSubscription:', error);
        throw error;
      }
    },
    onSuccess: (_, id) => {
      // Get all query cache
      const queryCache = queryClient.getQueryCache();
      
      // Find the user ID from any subscription list query
      const subscriptionListQueries = queryCache.findAll({
        queryKey: SUBSCRIPTION_KEYS.lists(),
      });
      
      // Invalidate all subscription list queries
      subscriptionListQueries.forEach(query => {
        queryClient.invalidateQueries({ queryKey: query.queryKey });
      });
      
      // Also invalidate the specific subscription detail
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.detail(id) });
    },
    onError: (error) => {
      console.error('Mutation error in useDeleteSubscription:', error);
    }
  });
};
