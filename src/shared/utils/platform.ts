/**
 * Utility functions for web platform
 */

/**
 * Storage adapter for web platform
 */
export const storage = {
  /**
   * Get an item from storage
   * @param key - The key to get
   * @returns The value or null if not found
   */
  getItem: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },
  
  /**
   * Set an item in storage
   * @param key - The key to set
   * @param value - The value to store
   */
  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return;
  },
  
  /**
   * Remove an item from storage
   * @param key - The key to remove
   */
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return;
  }
};
