'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  trades: any[];
  accounts: any[];
}

export default function Dashboard({ trades, accounts }: DashboardProps) {
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winRate = trades.length > 0 ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(2) : 0;

  const chartData = trades.slice(-30).map(trade => ({
    date: new Date(trade.entry_time).toLocaleDateString(),
    pnl: trade.pnl,
  }));

  return (
    <div className="p-6 space-y-6">
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
          <p className="text-3xl font-bold text-purple-600">{winRate}%</p>
        </div>
      </div>

      {/* Charts */}
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
              <Line type="monotone" dataKey="pnl" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Win/Loss Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{
              name: 'Trades',
              wins: trades.filter(t => t.pnl > 0).length,
              losses: trades.filter(t => t.pnl <= 0).length,
            }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#10b981" />
              <Bar dataKey="losses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
