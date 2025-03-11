/**
 * Represents a user in the system
 */
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    emailVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
    preferences?: UserPreferences;
}

/**
 * User preferences for customizing their experience
 */
export interface UserPreferences {
    currency?: string;
    notificationsEnabled?: boolean;
    reminderDays?: number; // Days before subscription renewal to send reminder
    theme?: 'light' | 'dark' | 'system';
    defaultView?: 'list' | 'calendar' | 'stats';
}
