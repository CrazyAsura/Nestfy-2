'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrate } from './slices/auth.slice';

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userJson = localStorage.getItem('user');

    if (accessToken && userJson) {
      try {
        const user = JSON.parse(userJson);
        dispatch(hydrate({ accessToken, user }));
      } catch (error) {
        console.error('Erro ao hidratar autenticação:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}
