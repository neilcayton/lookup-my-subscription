import axios from 'axios';
import { Subscription } from '../models';

// Base API URL - will point to your Kotlin backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Subscription API service
export const subscriptionApi = {
  // Fetch user's subscriptions
  async fetchUserSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(`/subscriptions/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  // Create a new subscription
  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    try {
      const response = await apiClient.post('/subscriptions', subscription);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Update an existing subscription
  async updateSubscription(subscription: Subscription): Promise<Subscription> {
    try {
      const response = await apiClient.put(`/subscriptions/${subscription.id}`, subscription);
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  // Delete a subscription
  async deleteSubscription(id: string): Promise<void> {
    try {
      await apiClient.delete(`/subscriptions/${id}`);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  },

  // Fetch subscriptions from Gmail
  async fetchGmailSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(`/subscriptions/gmail/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Gmail subscriptions:', error);
      throw error;
    }
  },

  // Fetch subscriptions from Google Play
  async fetchGooglePlaySubscriptions(userId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(`/subscriptions/google-play/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Google Play subscriptions:', error);
      throw error;
    }
  },

  // Sync all Google-sourced subscriptions with Firestore
  async syncSubscriptions(userId: string): Promise<void> {
    try {
      await apiClient.post(`/subscriptions/sync/${userId}`);
    } catch (error) {
      console.error('Error syncing subscriptions:', error);
      throw error;
    }
  },

  // Manually trigger a scan for new subscriptions
  async scanForNewSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.post(`/subscriptions/scan/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error scanning for subscriptions:', error);
      throw error;
    }
  }
};

export default apiClient;
