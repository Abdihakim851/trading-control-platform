'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { accountsAPI, tradesAPI } from '@/lib/api';
import { useDashboardStore } from '@/hooks/useStore';

export default function DashboardPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedAccount } = useDashboardStore();

  useEffect(() => {
    fetchData();
  }, [selectedAccount]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accountsRes = await accountsAPI.getAccounts();
      setAccounts(accountsRes.data);

      if (accountsRes.data.length > 0) {
        const selectedId = selectedAccount || accountsRes.data[0].id;
        const tradesRes = await tradesAPI.getTrades(selectedId);
        setTrades(tradesRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Trading Control</title>
      </Head>
      <Dashboard trades={trades} accounts={accounts} />
    </>
  );
}
