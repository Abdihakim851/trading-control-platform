'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { supabase, TradingAccount } from '@/lib/supabase';
import { useDashboardStore } from '@/hooks/useStore';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', broker: '', broker_account_id: '', account_type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setAccounts: setStoreAccounts } = useDashboardStore();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAccounts(data || []);
      setStoreAccounts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data, error } = await supabase
        .from('trading_accounts')
        .insert({
          name: formData.name,
          broker: formData.broker,
          broker_account_id: formData.broker_account_id,
          account_type: formData.account_type,
        })
        .select()
        .single();
      if (error) throw error;
      setFormData({ name: '', broker: '', broker_account_id: '', account_type: '' });
      setShowForm(false);
      fetchAccounts();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this account? All trades for this account will also be deleted.')) return;
    try {
      const { error } = await supabase.from('trading_accounts').delete().eq('id', id);
      if (error) throw error;
      fetchAccounts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Accounts - Trading Control</title>
      </Head>
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Trading Accounts</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'Add Account'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <input
                type="text"
                placeholder="Account Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <select
                value={formData.broker}
                onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select Broker</option>
                <option value="FundedNext">FundedNext</option>
                <option value="FTMO">FTMO</option>
                <option value="TradingView">TradingView</option>
                <option value="InteractiveBrokers">Interactive Brokers</option>
              </select>
              <input
                type="text"
                placeholder="Broker Account ID"
                value={formData.broker_account_id}
                onChange={(e) => setFormData({ ...formData, broker_account_id: e.target.value })}
                className="input-field"
                required
              />
              <select
                value={formData.account_type}
                onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Account Type</option>
                <option value="Challenge">Challenge</option>
                <option value="Funded">Funded</option>
                <option value="Live">Live</option>
              </select>
              <button type="submit" className="btn-primary w-full">
                Create Account
              </button>
            </form>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No trading accounts yet.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add Your First Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="card">
                <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                <p className="text-gray-600 text-sm mt-2">Broker: {account.broker}</p>
                <p className="text-gray-600 text-sm">Type: {account.account_type}</p>
                <p className="text-2xl font-bold text-green-600 mt-4">
                  ${account.balance?.toFixed(2) || '0.00'}
                </p>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 btn-secondary text-sm">View</button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
