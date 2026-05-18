'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getProfile } from '@/lib/auth';
import { useUserStore } from '@/store/useUser.store';
import Loading from '@/component/loading.component';
import { ReactNode } from 'react';

const MIN_LOADING_MS = 200;
 
export default function ProfileProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const setProfile = useUserStore((state) => state.setProfile);
  const [isLoading, setIsLoading] = useState(true);
 
useEffect(() => {
  const handleGetProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        toast.error('Bạn cần đăng nhập để truy cập trang này');
        return; 
      }

      const [res] = await Promise.all([
        getProfile(),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
      ]);
      setProfile(res);
      setIsLoading(false);
    } catch (err: any) {
      router.push('/login');
    }
  };
  handleGetProfile();
}, []);
 
  if (isLoading) return <Loading />;
 
  return <>{children}</>;
}