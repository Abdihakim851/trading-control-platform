import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  refreshToken: (token: string) =>
    api.post('/auth/refresh', { token }),
};

export const accountsAPI = {
  getAccounts: () => api.get('/accounts'),
  createAccount: (data: any) => api.post('/accounts', data),
  getAccount: (id: string) => api.get(`/accounts/${id}`),
  updateAccount: (id: string, data: any) => api.put(`/accounts/${id}`, data),
  deleteAccount: (id: string) => api.delete(`/accounts/${id}`),
};

export const tradesAPI = {
  getTrades: (accountId: string) => api.get(`/trades/account/${accountId}`),
  createTrade: (data: any) => api.post('/trades', data),
  getAnalytics: (accountId: string) => api.get(`/trades/analytics/${accountId}`),
};

export const subscriptionsAPI = {
  getSubscription: () => api.get('/subscriptions'),
  createSubscription: (tier: string, paymentMethodId: string) =>
    api.post('/subscriptions/create', { tier, payment_method_id: paymentMethodId }),
  cancelSubscription: () => api.post('/subscriptions/cancel'),
};

export const fundednextAPI = {
  connect: (authCode: string, accountName: string) =>
    api.post('/integrations/fundednext/connect', { auth_code: authCode, account_name: accountName }),
  getAccounts: (integrationId: string) =>
    api.get(`/integrations/fundednext/accounts/${integrationId}`),
  syncTrades: (integrationId: string) =>
    api.post(`/integrations/fundednext/sync/${integrationId}`),
};

export const ftmoAPI = {
  connect: (accountId: string, server: string, platform: string, credentials: string) =>
    api.post('/integrations/ftmo/connect', { account_id: accountId, server, platform, credentials_encrypted: credentials }),
  getAccounts: (integrationId: string) =>
    api.get(`/integrations/ftmo/accounts/${integrationId}`),
  importCSV: (integrationId: string, tradesData: any[]) =>
    api.post(`/integrations/ftmo/import-csv/${integrationId}`, { trades_data: tradesData }),
};

export default api;
