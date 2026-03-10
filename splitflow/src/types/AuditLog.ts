import type { TransactionCategory } from "./Transaction";

export type AuditStatus = 'Settled' | 'Pending' | 'Disputed';

export interface AuditLogEntry {
    id: string;
    date: string;       // e.g., "Oct 24, 2023"
    time: string;       // e.g., "14:30"
    description: string;
    group: string;
    category: TransactionCategory;
    payerName: string;
    payerAvatar?: string;
    amount: number;
    status: AuditStatus;
}
