'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      if (!auth.isAuthenticated) {
        router.push('/');
      }
    }, [auth.isAuthenticated, router]);

    // Durante a renderização do servidor ou antes do useEffect, renderize um placeholder
    if (!isClient) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // No cliente, se não estiver autenticado, não renderize nada
    if (!auth.isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
} 