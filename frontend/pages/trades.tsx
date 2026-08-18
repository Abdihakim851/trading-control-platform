'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { tradesAPI } from '@/lib/api';
import { useDashboardStore } from '@/hooks/useStore';

export default function TradesPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { selectedAccount, accounts } = useDashboardStore();
  const [accountId, setAccountId] = useState(selectedAccount || '');

  useEffect(() => {
    if (accountId) {
      fetchTrades();
    }
  }, [accountId]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const tradesRes = await tradesAPI.getTrades(accountId);
      setTrades(tradesRes.data);

      const analyticsRes = await tradesAPI.getAnalytics(accountId);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
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
        <title>Trades - Trading Control</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Trading Journal</h1>

        {accounts.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="input-field"
            >
              <option value="">Select an account</option>
              {accounts.map((acc: any) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {analytics && (
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
                ${analytics.total_pnl?.toFixed(2) || '0'}
              </p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium">Avg P&L</h3>
              <p className={`text-3xl font-bold ${analytics.avg_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${analytics.avg_pnl?.toFixed(2) || '0'}
              </p>
            </div>
          </div>
        )}

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
                  <td className="px-6 py-3">{trade.symbol}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      trade.direction === 'BUY' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.direction}
                    </span>
                  </td>
                  <td className="px-6 py-3">${trade.entry_price?.toFixed(4)}</td>
                  <td className="px-6 py-3">${trade.exit_price?.toFixed(4) || '-'}</td>
                  <td className="px-6 py-3">{trade.quantity}</td>
                  <td className="px-6 py-3">
                    <span className={trade.pnl >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      ${trade.pnl?.toFixed(2) || '-'}
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
      </div>
    </>
  );
}
