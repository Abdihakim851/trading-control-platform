'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/hooks/useStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token && router.pathname !== '/login' && router.pathname !== '/register' && router.pathname !== '/') {
      router.push('/login');
    }
  }, [token, router]);

  const isAuthPage = router.pathname === '/login' || router.pathname === '/register' || router.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}
      <div className="flex">
        {!isAuthPage && <Sidebar />}
        <main className={!isAuthPage ? 'flex-1 ml-64' : 'w-full'}>
          {children}
        </main>
      </div>
    </div>
  );
}
