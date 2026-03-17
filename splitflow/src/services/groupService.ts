import { apiClient } from '../helper/apiClient';

const API_URL = import.meta.env.VITE_API_URL;

export interface Group {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  created_by: string;
  created_at: string;
  role: string;
}

export interface GroupMember {
  user_id: string;
  role: string;
  joined_at: string;
  name: string;
  email: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  userRole: string;
  members: GroupMember[];
}

export interface RawExpense {
  id: string;
  description: string;
  amount: number;
  paid_by: string;
  payer_name: string;
  category: string | null;
  date: string;
  created_at: string;
  participants: { user_id: string; share: number }[];
  participants_count: number;
}

export interface BalanceEntry {
  userId: string;
  name: string;
  email: string;
  paid: number;
  owes: number;
  netBalance: number;
}

export interface SettlementSuggestion {
  from: string;
  from_name: string;
  to: string;
  to_name: string;
  amount: number;
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
  category?: string;
}

const groupService = {
  async getGroups(token: string): Promise<Group[]> {
    const res = await fetch(`${API_URL}/api/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Failed to fetch groups');
    return data.groups;
  },

  async createGroup(payload: CreateGroupPayload, token: string): Promise<Group> {
    const res = await fetch(`${API_URL}/api/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Failed to create group');
    return data.group;
  },

  async getGroupById(groupId: string): Promise<GroupDetail> {
    const res = await apiClient.get(`/groups/${groupId}`);
    return res.data.group;
  },

  async getGroupExpenses(groupId: string): Promise<RawExpense[]> {
    const res = await apiClient.get(`/groups/${groupId}/expenses`);
    return res.data.expenses;
  },

  async getGroupBalances(groupId: string): Promise<BalanceEntry[]> {
    const res = await apiClient.get(`/groups/${groupId}/balances`);
    return res.data.balances;
  },

  async getSettlementSuggestions(groupId: string): Promise<SettlementSuggestion[]> {
    const res = await apiClient.get(`/groups/${groupId}/settlements/suggestions`);
    return res.data.settlements;
  },
};

export default groupService;
