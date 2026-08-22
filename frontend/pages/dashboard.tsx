'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { supabase, Trade, TradingAccount } from '@/lib/supabase';
import { useDashboardStore } from '@/hooks/useStore';
import Link from 'next/link';

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedAccount, setSelectedAccount, setAccounts: setStoreAccounts } = useDashboardStore();

  useEffect(() => {
    fetchData();
  }, [selectedAccount]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: accData, error: accError } = await supabase
        .from('trading_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (accError) throw accError;
      setAccounts(accData || []);
      setStoreAccounts(accData || []);

      if (accData && accData.length > 0) {
        const selectedId = selectedAccount || accData[0].id;
        if (!selectedAccount) setSelectedAccount(selectedId);
        const { data: tradeData, error: tradeError } = await supabase
          .from('trades')
          .select('*')
          .eq('account_id', selectedId)
          .order('entry_time', { ascending: false });
        if (tradeError) throw tradeError;
        setTrades(tradeData || []);
      } else {
        setTrades([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Trading Control</title>
      </Head>
      {accounts.length === 0 ? (
        <div className="p-6">
          <div className="card text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Welcome to Trading Control</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by creating your first trading account. Then you can log trades, track performance, and manage risk.
            </p>
            <Link href="/accounts" className="btn-primary inline-block">
              Create Your First Account
            </Link>
          </div>
        </div>
      ) : (
        <Dashboard trades={trades} accounts={accounts} />
      )}
    </>
  );
}
