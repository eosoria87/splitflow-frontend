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
};

export default groupService;
