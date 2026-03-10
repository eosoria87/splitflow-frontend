import type { AuditLogEntry } from "../types/AuditLog";

export const mockAuditLogs: AuditLogEntry[] = [
    {
        id: "al-1", date: "Oct 24, 2023", time: "14:30", description: "Team Lunch at Mario's", 
        group: "Marketing Team", category: "food", payerName: "Sarah J.", payerAvatar: "https://i.pravatar.cc/150?img=5", amount: 145.00, status: "Settled"
    },
    {
        id: "al-2", date: "Oct 23, 2023", time: "09:15", description: "Q4 Strategy Retreat Booking", 
        group: "Executive Board", category: "transport", payerName: "David K.", payerAvatar: "https://i.pravatar.cc/150?img=11", amount: 1250.00, status: "Pending"
    },
    {
        id: "al-3", date: "Oct 22, 2023", time: "18:45", description: "Uber to Airport", 
        group: "Sales Team", category: "transport", payerName: "Mike R.", payerAvatar: "https://i.pravatar.cc/150?img=12", amount: 45.50, status: "Disputed"
    },
    {
        id: "al-4", date: "Oct 21, 2023", time: "11:00", description: "Monthly AWS Bill", 
        group: "Dev Ops", category: "shopping", payerName: "System", payerAvatar: "", amount: 320.00, status: "Settled"
    }
];
