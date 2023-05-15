import { useEffect } from 'react';
import { useAuth } from './context-hooks';

export const useAuthChangeEffect = (callback: () => void) => {
  const auth = useAuth();
  useEffect(() => {
    callback();
  }, [auth.username, callback]);
};
