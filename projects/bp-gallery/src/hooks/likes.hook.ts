import useStorageState from './storage-state.hook';

const useLikes = () => {
  return useStorageState<string[]>([], 'likes', localStorage);
};

export default useLikes;
