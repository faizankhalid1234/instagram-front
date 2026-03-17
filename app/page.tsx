'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Login from '@/components/auth/Login';

export default function Home() {
  const { user, loadAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  return <Login />;
}
