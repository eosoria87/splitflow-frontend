
export interface DebtSettlement {
    id: string;
    debtorName: string;   // Person who owes money
    creditorName: string; // Person who is owed money
    amount: number;
    targetAvatar?: string; // Avatar of the person the user is interacting with
    type: 'you-owe' | 'owes-you'; 
}
