import type { GroupCardType } from "../types/Group";

export const mockGroups: GroupCardType[] = [
  {
    key: "1",
    name: "Trip to Cabo",
    updated_at: "2 days ago",
    status: "owed",
    amount: "$120.00",
  },
  {
    key: "2",
    name: "House Rent",
    updated_at: "Yesterday",
    status: "owe",
    amount: "$55.00",
  },
  {
    key: "3",
    name: "Pizza Night",
    updated_at: "5 days ago",
    status: "settled",
    amount: null,
  },
];
