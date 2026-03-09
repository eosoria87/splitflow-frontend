export interface BalanceItem {
    id: string;
    name: string;
    description: string;
    amount: number;
    type: 'owed-to-me' | 'i-owe';
    status?: string;
    image?: string;
    icon?: React.ReactNode;
}
