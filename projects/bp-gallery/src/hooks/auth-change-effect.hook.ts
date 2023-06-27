import { useEffect } from 'react';
import { useAuth } from './context-hooks';

export const useAuthChangeEffect = (callback: () => void) => {
  const { userId } = useAuth();
  useEffect(() => {
    callback();
  }, [userId, callback]);
};
