import useStorageState from './storage-state.hook';

type ClipboardData = {
  pictureIds: string[];
};

export const useClipboard = () => {
  return useStorageState<ClipboardData>({ pictureIds: [] }, 'clipboard', sessionStorage);
};
