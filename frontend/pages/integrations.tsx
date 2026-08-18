'use client';

import Head from 'next/head';
import { useState } from 'react';
import { fundednextAPI, ftmoAPI } from '@/lib/api';

export default function IntegrationsPage() {
  const [fundednextCode, setFundednextCode] = useState('');
  const [ftmoData, setFtmoData] = useState({ accountId: '', server: '', platform: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFundednextConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await fundednextAPI.connect(fundednextCode, 'FundedNext Account');
      setMessage('✓ FundedNext account connected successfully!');
      setFundednextCode('');
    } catch (error: any) {
      setMessage(`✗ Error: ${error.response?.data?.error || 'Connection failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFtmoConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await ftmoAPI.connect(ftmoData.accountId, ftmoData.server, ftmoData.platform, '');
      setMessage('✓ FTMO account connected successfully!');
      setFtmoData({ accountId: '', server: '', platform: '' });
    } catch (error: any) {
      setMessage(`✗ Error: ${error.response?.data?.error || 'Connection failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Integrations - Trading Control</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Broker Integrations</h1>

        {message && (
          <div className={`mb-6 p-4 rounded ${message.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FundedNext Integration */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">FundedNext Integration</h2>
            <p className="text-gray-600 text-sm mb-4">
              Connect your FundedNext account to sync trades and performance data automatically.
            </p>
            <form onSubmit={handleFundednextConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Authorization Code</label>
                <input
                  type="text"
                  value={fundednextCode}
                  onChange={(e) => setFundednextCode(e.target.value)}
                  placeholder="Paste your FundedNext auth code"
                  className="input-field mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect FundedNext'}
              </button>
            </form>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>How to get your auth code:</strong>
                <ol className="list-decimal ml-5 mt-2">
                  <li>Log in to your FundedNext account</li>
                  <li>Go to Settings → API/Integrations</li>
                  <li>Generate an authorization code</li>
                  <li>Paste it above</li>
                </ol>
              </p>
            </div>
          </div>

          {/* FTMO Integration */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">FTMO Integration</h2>
            <p className="text-gray-600 text-sm mb-4">
              Connect your FTMO account via your trading platform (MT4/MT5).
            </p>
            <form onSubmit={handleFtmoConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account ID</label>
                <input
                  type="text"
                  value={ftmoData.accountId}
                  onChange={(e) => setFtmoData({ ...ftmoData, accountId: e.target.value })}
                  placeholder="Your FTMO account ID"
                  className="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Server</label>
                <input
                  type="text"
                  value={ftmoData.server}
                  onChange={(e) => setFtmoData({ ...ftmoData, server: e.target.value })}
                  placeholder="e.g., FTMO-Demo"
                  className="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Platform</label>
                <select
                  value={ftmoData.platform}
                  onChange={(e) => setFtmoData({ ...ftmoData, platform: e.target.value })}
                  className="input-field mt-1"
                  required
                >
                  <option value="">Select platform</option>
                  <option value="MT4">MetaTrader 4</option>
                  <option value="MT5">MetaTrader 5</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect FTMO'}
              </button>
            </form>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> FTMO doesn't provide a public API. You'll need to export your trading data from your FTMO dashboard manually or use your MT4/MT5 platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
