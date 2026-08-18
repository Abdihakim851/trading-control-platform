import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  user: any;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null }),
}));

interface DashboardStore {
  accounts: any[];
  selectedAccount: string | null;
  setAccounts: (accounts: any[]) => void;
  setSelectedAccount: (accountId: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  accounts: [],
  selectedAccount: null,
  setAccounts: (accounts) => set({ accounts }),
  setSelectedAccount: (accountId) => set({ selectedAccount: accountId }),
}));
