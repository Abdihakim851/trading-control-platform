import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Trading Control Platform</title>
        <meta name="description" content="Manage your trading accounts with risk control and analytics" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">Trading Control</div>
            <div className="flex gap-4">
              <Link href="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Trading Account Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Control multiple trading accounts, manage risk, prevent revenge trading, and track your performance with advanced analytics.
          </p>
          <Link href="/register" className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700">
            Get Started Free
          </Link>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Multi-Account Dashboard',
                  description: 'Manage multiple trading accounts from different brokers in one place',
                },
                {
                  title: 'Risk Management',
                  description: 'Automatic position sizing and risk calculations to protect your capital',
                },
                {
                  title: 'Revenge Trading Prevention',
                  description: 'Smart alerts and trading pauses to prevent emotional decisions',
                },
                {
                  title: 'Trading Journal',
                  description: 'Comprehensive trade logging with detailed analytics and insights',
                },
                {
                  title: 'Money Management',
                  description: 'Track profits, losses, and account growth with detailed reports',
                },
                {
                  title: 'Legal Compliance',
                  description: 'Complete audit trails and documentation for regulatory requirements',
                },
              ].map((feature, idx) => (
                <div key={idx} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { name: 'Free', price: '$0', accounts: 1, features: ['1 Account', 'Basic Dashboard'] },
                { name: 'Basic', price: '$29', accounts: 3, features: ['3 Accounts', 'Full Analytics', 'Email Support'] },
                { name: 'Professional', price: '$99', accounts: 'Unlimited', features: ['Unlimited Accounts', 'Advanced Analytics', 'Priority Support', 'API Access'] },
                { name: 'Enterprise', price: '$299', accounts: 'Unlimited', features: ['Unlimited Accounts', 'Custom Features', 'Dedicated Support', 'White Label'] },
              ].map((plan, idx) => (
                <div key={idx} className={`p-6 rounded-lg border-2 transition ${
                  idx === 2 ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white'
                }`}>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">{plan.price}/mo</p>
                  <p className="text-gray-600 mb-4">Accounts: {plan.accounts}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-gray-600">✓ {feature}</li>
                    ))}
                  </ul>
                  <button className={`w-full py-2 rounded transition ${
                    idx === 2 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}>
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
