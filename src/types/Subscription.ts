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
    transactionHistory?: Transaction[];
    userId?: string;
}