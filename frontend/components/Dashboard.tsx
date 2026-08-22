'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trade, TradingAccount } from '@/lib/supabase';
import { useDashboardStore } from '@/hooks/useStore';

interface DashboardProps {
  trades: Trade[];
  accounts: TradingAccount[];
}

export default function Dashboard({ trades, accounts }: DashboardProps) {
  const { selectedAccount, setSelectedAccount } = useDashboardStore();

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winRate = trades.length > 0
    ? ((trades.filter(t => (t.pnl || 0) > 0).length / trades.length) * 100).toFixed(2)
    : '0.00';

  const chartData = trades.slice(0, 30).reverse().map(trade => ({
    date: new Date(trade.entry_time).toLocaleDateString(),
    pnl: trade.pnl || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Account selector */}
      {accounts.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
          <select
            value={selectedAccount || accounts[0].id}
            onChange={(e) => setSelectedAccount(e.target.value)}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Accounts</h3>
          <p className="text-3xl font-bold text-blue-600">{accounts.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Trades</h3>
          <p className="text-3xl font-bold text-green-600">{trades.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total P&L</h3>
          <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalPnL.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Win Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{winRate}%</p>
        </div>
      </div>

      {/* Charts */}
      {trades.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">P&L Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pnl" stroke="#3b82f6" name="P&L ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Win/Loss Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{
                name: 'Trades',
                wins: trades.filter(t => (t.pnl || 0) > 0).length,
                losses: trades.filter(t => (t.pnl || 0) <= 0).length,
              }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" fill="#10b981" name="Wins" />
                <Bar dataKey="losses" fill="#ef4444" name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No trades yet for this account. Go to the Trades page to add your first trade.</p>
        </div>
      )}
    </div>
  );
}
