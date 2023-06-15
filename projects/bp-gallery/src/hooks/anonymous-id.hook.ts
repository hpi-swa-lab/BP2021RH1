import { nanoid } from 'nanoid';
import useStorageState from './storage-state.hook';

export const useAnonymousId = () => {
  const [anonymousId] = useStorageState<string>(() => nanoid(), 'anonymous_id', sessionStorage);
  return anonymousId;
};
