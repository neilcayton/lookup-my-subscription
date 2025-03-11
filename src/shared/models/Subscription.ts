/**
 * Represents a transaction related to a subscription
 */
export interface Transaction {
    id: string;
    amount: number;
    date: string;
}

/**
 * Represents a subscription with all its details
 */
export interface Subscription {
    id: string;
    name: string;
    logo: string;
    price: number;
    currency: string;
    date: string;
    billingCycle: string; // e.g., 'monthly', 'yearly', etc.
    nextBillingDate?: string; // Optional next billing date
    transactionHistory?: Transaction[];
    userId?: string;
    source?: string; // e.g., 'manual', 'gmail', 'google_play'
}
