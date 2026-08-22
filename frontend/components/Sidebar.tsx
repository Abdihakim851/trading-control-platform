'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiBarChart2, FiDollarSign, FiShield, FiBook, FiGrid } from 'react-icons/fi';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FiBarChart2, label: 'Trades', href: '/trades' },
    { icon: FiDollarSign, label: 'Accounts', href: '/accounts' },
    { icon: FiShield, label: 'Risk Management', href: '/risk' },
    { icon: FiGrid, label: 'Integrations', href: '/integrations' },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 hidden lg:block">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
