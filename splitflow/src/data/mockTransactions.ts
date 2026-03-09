import type { TransactionGroup } from "../types/Transaction";

export const mockTransactionGroups: TransactionGroup[] = [
  {
    dateLabel: "TODAY, JUNE 24",
    dailyTotal: 195.00,
    transactions: [
      {
        id: "tx-101",
        title: "Dinner at Mario's",
        category: "food",
        paidBy: "You",
        totalAmount: 120.00,
        splitDetails: "Split equally",
        userNetChange: 80.00, // 120 / 3 = 40 each. You paid 120, so you are owed 80.
        userStatus: "you lent",
      },
      {
        id: "tx-102",
        title: "Train to Rome",
        category: "transport",
        paidBy: "Sarah",
        totalAmount: 45.00,
        splitDetails: "Split exactly",
        userNetChange: -15.00, // You owe 15
        userStatus: "you owe",
      },
      {
        id: "tx-103",
        title: "Morning Coffee & Pastries",
        category: "food",
        paidBy: "Mike",
        totalAmount: 30.00,
        splitDetails: "Split equally",
        userNetChange: 0,
        userStatus: "not involved", // You slept in and didn't get coffee!
      },
    ],
  },
  {
    dateLabel: "YESTERDAY, JUNE 23",
    dailyTotal: 460.00,
    transactions: [
      {
        id: "tx-104",
        title: "Airbnb - 3 Nights",
        category: "accommodation",
        paidBy: "You",
        totalAmount: 400.00,
        splitDetails: "Split equally",
        userNetChange: 300.00,
        userStatus: "you lent",
      },
      {
        id: "tx-105",
        title: "Supermarket Run",
        category: "shopping",
        paidBy: "Tom",
        totalAmount: 60.00,
        splitDetails: "Split by percentages",
        userNetChange: -20.00,
        userStatus: "you owe",
      },
    ],
  },
];
