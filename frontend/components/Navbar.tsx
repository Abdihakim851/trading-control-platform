'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/hooks/useStore';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Trading Control
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-gray-600">{user?.email}</span>
          <Link href="/settings" className="hover:text-blue-600">
            <FiSettings size={20} />
          </Link>
          <button onClick={handleLogout} className="hover:text-red-600 flex items-center gap-2">
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
