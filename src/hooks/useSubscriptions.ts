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
    queryFn: () => userId ? getSubscriptionByUserId(userId) : Promise.resolve([]),
    enabled: !!userId,
  });
};

// Get a specific subscription by ID
export const useSubscription = (id: string | undefined) => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.detail(id || ''),
    queryFn: () => id ? getSubscriptionById(id) : Promise.resolve(null),
    enabled: !!id,
  });
};

// Create a new subscription
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newSubscription: Omit<Subscription, 'id'>) => 
      createSubscription(newSubscription),
    onSuccess: (_, variables) => {
      // Invalidate and refetch the user's subscription list
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(variables.userId) });
      }
    },
  });
};

// Update an existing subscription
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updatedSubscription: Subscription) => 
      updateSubsription(updatedSubscription),
    onSuccess: (_, variables) => {
      // Invalidate and refetch both the list and the specific subscription
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(variables.userId) });
      }
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.detail(variables.id) });
    },
  });
};

// Delete a subscription
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      deleteSubscription(id),
    onSuccess: (_, id) => {
      // Get the deleted subscription from the cache to access its userId
      const deletedSubscription = queryClient.getQueryData<Subscription>(SUBSCRIPTION_KEYS.detail(id));
      
      // Invalidate and refetch the user's subscription list if we have the userId
      if (deletedSubscription?.userId) {
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.list(deletedSubscription.userId) });
      }
      
      // Remove the specific subscription from the cache
      queryClient.removeQueries({ queryKey: SUBSCRIPTION_KEYS.detail(id) });
    },
  });
};
