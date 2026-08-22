'use client';

import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/hooks/useStore';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

const PUBLIC_PATHS = ['/', '/login', '/register'];

export default function Layout({ children }: LayoutProps) {
  const { token } = useAuthStore();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(router.pathname);

  useEffect(() => {
    if (!token && !isPublic) {
      router.push('/login');
    }
  }, [token, isPublic, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isPublic && <Navbar />}
      <div className="flex">
        {!isPublic && <Sidebar />}
        <main className={!isPublic ? 'flex-1 lg:ml-64 min-h-screen' : 'w-full'}>
          {children}
        </main>
      </div>
    </div>
  );
}
