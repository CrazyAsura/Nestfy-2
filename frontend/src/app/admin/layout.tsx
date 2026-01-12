'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/libs/stores';
import { CircularProgress, Box } from '@mui/material';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Se não estiver logado ou não for admin, redireciona para login
    if (!accessToken || !user || user.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [user, accessToken, router]);

  // Enquanto verifica ou se não for admin, mostra loading ou nada
  if (!accessToken || !user || user.role !== 'ADMIN') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
