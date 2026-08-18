'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiBarChart2, FiDollarSign, FiShield, FiBook } from 'react-icons/fi';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FiBarChart2, label: 'Trades', href: '/trades' },
    { icon: FiDollarSign, label: 'Accounts', href: '/accounts' },
    { icon: FiShield, label: 'Risk Management', href: '/risk' },
    { icon: FiBook, label: 'Journal', href: '/journal' },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-screen bg-white shadow-lg">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
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
