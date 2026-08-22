import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  initialized: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setInitialized: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  initialized: false,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setInitialized: (v) => set({ initialized: v }),
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
