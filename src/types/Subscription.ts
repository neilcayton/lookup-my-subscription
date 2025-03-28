export interface Transaction {
    id: string,
    amount: number,
    date: string
}

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
}