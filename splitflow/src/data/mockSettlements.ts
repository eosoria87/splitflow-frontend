import type { DebtSettlement } from "../types/Debt";

export const mockSettlements: DebtSettlement[] = [
    {
        id: "opt-1",
        debtorName: "You",
        creditorName: "Sarah M.",
        amount: 45.50,
        targetAvatar: "https://i.pravatar.cc/150?img=5", // Sarah's avatar
        type: 'you-owe'
    },
    {
        id: "opt-2",
        debtorName: "Mike R.",
        creditorName: "You",
        amount: 120.00,
        targetAvatar: "https://i.pravatar.cc/150?img=11", // Mike's avatar
        type: 'owes-you'
    },
    {
        id: "opt-3",
        debtorName: "Tom K.",
        creditorName: "You",
        amount: 15.75,
        targetAvatar: "", // Empty to test your fallback initials! (will show "TO")
        type: 'owes-you'
    }
];
