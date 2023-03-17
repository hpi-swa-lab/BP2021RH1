import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useStorageState = <T>(
  initialValue: T,
  key: string,
  storage: Storage
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    const valueInStorage = storage.getItem(key);
    return valueInStorage ? (JSON.parse(valueInStorage) as T) : initialValue;
  });

  useEffect(() => storage.setItem(key, JSON.stringify(value)), [storage, key, value]);

  useEffect(() => {
    window.addEventListener('storage', event => {
      if (event.storageArea !== storage || event.key !== key) {
        return;
      }
      const stringifiedValue = JSON.stringify(value);
      if (event.newValue === null) {
        storage.setItem(key, stringifiedValue);
      } else {
        if (event.newValue === stringifiedValue) {
          return;
        }
        setValue(JSON.parse(event.newValue) as T);
      }
    });
  }, [storage, key, value]);

  return [value, setValue];
};

export default useStorageState;
