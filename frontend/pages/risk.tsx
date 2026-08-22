'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { supabase, RiskSettings, TradingAccount } from '@/lib/supabase';
import { useDashboardStore } from '@/hooks/useStore';

export default function RiskPage() {
  const [riskSettings, setRiskSettings] = useState<RiskSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { selectedAccount, accounts, setAccounts: setStoreAccounts } = useDashboardStore();
  const [accountId, setAccountId] = useState(selectedAccount || '');
  const [formData, setFormData] = useState({
    max_daily_loss: 0,
    max_weekly_loss: 0,
    max_open_positions: 5,
    risk_per_trade: 2,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchRiskSettings(accountId);
    }
  }, [accountId]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setStoreAccounts(data || []);
      if (!accountId && data && data.length > 0) {
        setAccountId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load accounts');
      setLoading(false);
    }
  };

  const fetchRiskSettings = async (accId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('risk_settings')
        .select('*')
        .eq('account_id', accId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setRiskSettings(data);
        setFormData({
          max_daily_loss: data.max_daily_loss || 0,
          max_weekly_loss: data.max_weekly_loss || 0,
          max_open_positions: data.max_open_positions || 5,
          risk_per_trade: data.risk_per_trade || 2,
        });
      } else {
        setRiskSettings(null);
        setFormData({ max_daily_loss: 0, max_weekly_loss: 0, max_open_positions: 5, risk_per_trade: 2 });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load risk settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSaved(false);
    try {
      if (riskSettings) {
        const { error } = await supabase
          .from('risk_settings')
          .update({
            max_daily_loss: formData.max_daily_loss,
            max_weekly_loss: formData.max_weekly_loss,
            max_open_positions: formData.max_open_positions,
            risk_per_trade: formData.risk_per_trade,
            updated_at: new Date().toISOString(),
          })
          .eq('id', riskSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('risk_settings')
          .insert({
            account_id: accountId,
            max_daily_loss: formData.max_daily_loss,
            max_weekly_loss: formData.max_weekly_loss,
            max_open_positions: formData.max_open_positions,
            risk_per_trade: formData.risk_per_trade,
          });
        if (error) throw error;
      }
      setSaved(true);
      fetchRiskSettings(accountId);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading && accounts.length === 0) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Risk Management - Trading Control</title>
      </Head>
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        <h1 className="text-3xl font-bold mb-6">Risk Management</h1>

        {accounts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">You need to create a trading account first.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="input-field max-w-xs"
              >
                {accounts.map((acc: TradingAccount) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Risk Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Daily Loss ($)</label>
                    <input
                      type="number"
                      value={formData.max_daily_loss}
                      onChange={(e) => setFormData({ ...formData, max_daily_loss: parseFloat(e.target.value) })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Weekly Loss ($)</label>
                    <input
                      type="number"
                      value={formData.max_weekly_loss}
                      onChange={(e) => setFormData({ ...formData, max_weekly_loss: parseFloat(e.target.value) })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Open Positions</label>
                    <input
                      type="number"
                      value={formData.max_open_positions}
                      onChange={(e) => setFormData({ ...formData, max_open_positions: parseInt(e.target.value) })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Risk Per Trade (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.risk_per_trade}
                      onChange={(e) => setFormData({ ...formData, risk_per_trade: parseFloat(e.target.value) })}
                      className="input-field mt-1"
                    />
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary w-full mt-6 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                  {saved && (
                    <p className="text-green-600 text-sm text-center">Settings saved successfully!</p>
                  )}
                </form>
              </div>

              <div className="space-y-4">
                <div className="card bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Position Sizing</h3>
                  <p className="text-sm text-blue-800">
                    Risk per trade helps determine the correct position size. Based on your risk per trade setting of {formData.risk_per_trade}%, the system will automatically calculate position sizes to maintain this risk level.
                  </p>
                </div>
                <div className="card bg-yellow-50 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-2">Daily Loss Limit</h3>
                  <p className="text-sm text-yellow-800">
                    Once you reach your maximum daily loss of ${formData.max_daily_loss}, trading will be automatically paused for the rest of the day to prevent revenge trading.
                  </p>
                </div>
                <div className="card bg-green-50 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Maximum Positions</h3>
                  <p className="text-sm text-green-800">
                    You can have a maximum of {formData.max_open_positions} open positions at any time. This helps manage correlation risk and portfolio heat.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
