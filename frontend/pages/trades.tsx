'use client';

import Head from 'next/head';
import { useEffect, useState, useMemo } from 'react';
import { supabase, Trade, TradingAccount, TradeAnalytics } from '@/lib/supabase';
import { useDashboardStore } from '@/hooks/useStore';

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { selectedAccount, setSelectedAccount, setAccounts: setStoreAccounts } = useDashboardStore();
  const [accountId, setAccountId] = useState(selectedAccount || '');

  const [formData, setFormData] = useState({
    symbol: '',
    direction: 'BUY' as 'BUY' | 'SELL',
    entry_price: '',
    exit_price: '',
    quantity: '',
    pnl: '',
    notes: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accountId) {
      setSelectedAccount(accountId);
      fetchTrades(accountId);
    }
  }, [accountId]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAccounts(data || []);
      setStoreAccounts(data || []);
      if (!accountId && data && data.length > 0) {
        setAccountId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load accounts');
      setLoading(false);
    }
  };

  const fetchTrades = async (accId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('account_id', accId)
        .order('entry_time', { ascending: false });
      if (error) throw error;
      setTrades(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const pnl = formData.pnl ? parseFloat(formData.pnl) : null;
      const tradeData: any = {
        account_id: accountId,
        symbol: formData.symbol.toUpperCase(),
        direction: formData.direction,
        entry_price: parseFloat(formData.entry_price),
        exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
        quantity: parseFloat(formData.quantity),
        pnl: pnl,
        pnl_percent: pnl && parseFloat(formData.entry_price) ? (pnl / (parseFloat(formData.entry_price) * parseFloat(formData.quantity))) * 100 : null,
        notes: formData.notes || null,
        exit_time: formData.exit_price ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from('trades').insert(tradeData);
      if (error) throw error;
      setFormData({ symbol: '', direction: 'BUY', entry_price: '', exit_price: '', quantity: '', pnl: '', notes: '' });
      setShowForm(false);
      fetchTrades(accountId);
    } catch (err: any) {
      setError(err.message || 'Failed to add trade');
    }
  };

  const analytics: TradeAnalytics = useMemo(() => {
    const total = trades.length;
    const wins = trades.filter(t => (t.pnl || 0) > 0).length;
    const losses = trades.filter(t => (t.pnl || 0) <= 0).length;
    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const pnlValues = trades.map(t => t.pnl || 0);
    const maxWin = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
    const maxLoss = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;
    return {
      total_trades: total,
      wins,
      losses,
      win_rate: total > 0 ? ((wins / total) * 100).toFixed(2) : '0.00',
      total_pnl: totalPnl,
      avg_pnl: total > 0 ? totalPnl / total : 0,
      max_win: maxWin,
      max_loss: maxLoss,
    };
  }, [trades]);

  if (loading && trades.length === 0) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Trades - Trading Control</title>
      </Head>
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Trading Journal</h1>
          {accountId && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancel' : 'Add Trade'}
            </button>
          )}
        </div>

        {accounts.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="input-field max-w-xs"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">You need to create a trading account first.</p>
          </div>
        ) : (
          <>
            {showForm && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Trade</h2>
                <form onSubmit={handleAddTrade} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Symbol</label>
                    <input
                      type="text"
                      placeholder="EURUSD"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Direction</label>
                    <select
                      value={formData.direction}
                      onChange={(e) => setFormData({ ...formData, direction: e.target.value as 'BUY' | 'SELL' })}
                      className="input-field mt-1"
                      required
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entry Price</label>
                    <input
                      type="number"
                      step="0.00001"
                      placeholder="1.0800"
                      value={formData.entry_price}
                      onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Exit Price</label>
                    <input
                      type="number"
                      step="0.00001"
                      placeholder="1.0820"
                      value={formData.exit_price}
                      onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="1.0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">P&L ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="20.00"
                      value={formData.pnl}
                      onChange={(e) => setFormData({ ...formData, pnl: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      placeholder="Trade notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input-field mt-1"
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="btn-primary w-full">Add Trade</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total Trades</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.total_trades}</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Win Rate</h3>
                <p className="text-3xl font-bold text-green-600">{analytics.win_rate}%</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total P&L</h3>
                <p className={`text-3xl font-bold ${analytics.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${analytics.total_pnl.toFixed(2)}
                </p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Avg P&L</h3>
                <p className={`text-3xl font-bold ${analytics.avg_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${analytics.avg_pnl.toFixed(2)}
                </p>
              </div>
            </div>

            {trades.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 mb-4">No trades recorded yet.</p>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Add Your First Trade
                </button>
              </div>
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Symbol</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Direction</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Entry Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Exit Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">P&L</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => (
                      <tr key={trade.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium">{trade.symbol}</td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${
                            trade.direction === 'BUY' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.direction}
                          </span>
                        </td>
                        <td className="px-6 py-3">{trade.entry_price?.toFixed(5)}</td>
                        <td className="px-6 py-3">{trade.exit_price?.toFixed(5) || '-'}</td>
                        <td className="px-6 py-3">{trade.quantity}</td>
                        <td className="px-6 py-3">
                          <span className={trade.pnl != null && trade.pnl >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {trade.pnl != null ? `$${trade.pnl.toFixed(2)}` : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(trade.entry_time).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
