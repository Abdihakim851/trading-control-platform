'use client';

import { useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/hooks/useStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setToken, setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setToken(session.access_token);
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      }
      setInitialized(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session) {
          setToken(session.access_token);
          setUser({ id: session.user.id, email: session.user.email ?? '' });
        } else {
          setToken(null);
          setUser(null);
        }
      })();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setToken, setUser, setInitialized]);

  return <>{children}</>;
}


export { AuthProvider }