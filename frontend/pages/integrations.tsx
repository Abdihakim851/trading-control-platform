'use client';

import Head from 'next/head';
import { FiInfo } from 'react-icons/fi';

export default function IntegrationsPage() {
  return (
    <>
      <Head>
        <title>Integrations - Trading Control</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Broker Integrations</h1>

        <div className="card mb-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <FiInfo className="text-blue-600 mt-1 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-800">
              Broker API integrations are coming soon. For now, you can manually add your trading accounts
              and log trades through the platform. This page will support automatic trade syncing from
              FundedNext and FTMO in a future update.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FundedNext Integration */}
          <div className="card opacity-75">
            <h2 className="text-xl font-semibold mb-4">FundedNext Integration</h2>
            <p className="text-gray-600 text-sm mb-4">
              Connect your FundedNext account to sync trades and performance data automatically.
            </p>
            <div className="p-3 bg-gray-100 rounded text-center">
              <span className="text-gray-500 text-sm">Coming Soon</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>How it will work:</strong>
                <ol className="list-decimal ml-5 mt-2">
                  <li>Log in to your FundedNext account</li>
                  <li>Go to Settings and generate an authorization code</li>
                  <li>Paste it here to connect</li>
                </ol>
              </p>
            </div>
          </div>

          {/* FTMO Integration */}
          <div className="card opacity-75">
            <h2 className="text-xl font-semibold mb-4">FTMO Integration</h2>
            <p className="text-gray-600 text-sm mb-4">
              Connect your FTMO account via your trading platform (MT4/MT5).
            </p>
            <div className="p-3 bg-gray-100 rounded text-center">
              <span className="text-gray-500 text-sm">Coming Soon</span>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> FTMO doesn't provide a public API. You'll need to export your trading data
                from your FTMO dashboard manually or use your MT4/MT5 platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
