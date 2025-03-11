import { User } from '../models';
import axios from 'axios';

// Base API URL - will point to your Kotlin backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create an axios instance with default config
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth API service
export const authApi = {
  // Register a new user
  async register(email: string, password: string): Promise<User> {
    try {
      const response = await authClient.post('/auth/register', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login a user
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await authClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout a user
  async logout(): Promise<void> {
    try {
      await authClient.post('/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await authClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await authClient.post('/auth/reset-password', { email });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await authClient.put(`/auth/profile/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export default authClient;
