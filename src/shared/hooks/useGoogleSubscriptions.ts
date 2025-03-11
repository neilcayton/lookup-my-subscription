import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscriptionApi';
import { Subscription } from '../models/Subscription';

// Query keys
const GOOGLE_SUBSCRIPTION_KEYS = {
  all: ['googleSubscriptions'] as const,
  gmail: (userId: string) => [...GOOGLE_SUBSCRIPTION_KEYS.all, 'gmail', userId] as const,
  googlePlay: (userId: string) => [...GOOGLE_SUBSCRIPTION_KEYS.all, 'googlePlay', userId] as const,
};

/**
 * Hook to fetch subscriptions from Gmail
 * @param userId - The ID of the user
 * @returns Query result with Gmail subscriptions data
 */
export const useGmailSubscriptions = (userId: string | undefined) => {
  return useQuery({
    queryKey: GOOGLE_SUBSCRIPTION_KEYS.gmail(userId || 'anonymous'),
    queryFn: async () => {
      if (!userId) {
        console.log('No user ID provided, returning empty array');
        return [];
      }
      
      try {
        console.log('Fetching Gmail subscriptions for user:', userId);
        const subscriptions = await subscriptionApi.fetchGmailSubscriptions(userId);
        console.log('Fetched Gmail subscriptions:', subscriptions);
        return subscriptions;
      } catch (error) {
        console.error('Error in useGmailSubscriptions:', error);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch subscriptions from Google Play
 * @param userId - The ID of the user
 * @returns Query result with Google Play subscriptions data
 */
export const useGooglePlaySubscriptions = (userId: string | undefined) => {
  return useQuery({
    queryKey: GOOGLE_SUBSCRIPTION_KEYS.googlePlay(userId || 'anonymous'),
    queryFn: async () => {
      if (!userId) {
        console.log('No user ID provided, returning empty array');
        return [];
      }
      
      try {
        console.log('Fetching Google Play subscriptions for user:', userId);
        const subscriptions = await subscriptionApi.fetchGooglePlaySubscriptions(userId);
        console.log('Fetched Google Play subscriptions:', subscriptions);
        return subscriptions;
      } catch (error) {
        console.error('Error in useGooglePlaySubscriptions:', error);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to sync all Google-sourced subscriptions with Firestore
 * @returns Mutation function and status
 */
export const useSyncSubscriptions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        console.log('Syncing subscriptions for user:', userId);
        await subscriptionApi.syncSubscriptions(userId);
        console.log('Subscriptions synced successfully');
      } catch (error) {
        console.error('Error in useSyncSubscriptions:', error);
        throw error;
      }
    },
    onSuccess: (_, userId) => {
      // Invalidate and refetch all subscription queries
      queryClient.invalidateQueries({ queryKey: GOOGLE_SUBSCRIPTION_KEYS.gmail(userId) });
      queryClient.invalidateQueries({ queryKey: GOOGLE_SUBSCRIPTION_KEYS.googlePlay(userId) });
      // Also invalidate regular subscription queries
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'list', userId] });
    },
    onError: (error) => {
      console.error('Mutation error in useSyncSubscriptions:', error);
    }
  });
};

/**
 * Hook to manually trigger a scan for new subscriptions
 * @returns Mutation function and status
 */
export const useScanForNewSubscriptions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        console.log('Scanning for new subscriptions for user:', userId);
        const newSubscriptions = await subscriptionApi.scanForNewSubscriptions(userId);
        console.log('Found new subscriptions:', newSubscriptions);
        return newSubscriptions;
      } catch (error) {
        console.error('Error in useScanForNewSubscriptions:', error);
        throw error;
      }
    },
    onSuccess: (_, userId) => {
      // Invalidate and refetch all subscription queries
      queryClient.invalidateQueries({ queryKey: GOOGLE_SUBSCRIPTION_KEYS.gmail(userId) });
      queryClient.invalidateQueries({ queryKey: GOOGLE_SUBSCRIPTION_KEYS.googlePlay(userId) });
      // Also invalidate regular subscription queries
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'list', userId] });
    },
    onError: (error) => {
      console.error('Mutation error in useScanForNewSubscriptions:', error);
    }
  });
};
