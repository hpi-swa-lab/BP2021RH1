import { useCallback, useEffect, useState } from 'react';

// changing `key` or `storage` is not supported
const useStorageState = <T extends object | string | number>(
  initialValue: T | (() => T),
  key: string,
  storage: Storage
) => {
  const [value, rawSetValue] = useState<T>(() => {
    const valueInStorage = storage.getItem(key);
    return valueInStorage
      ? (JSON.parse(valueInStorage) as T)
      : typeof initialValue === 'function'
      ? initialValue()
      : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((currentValue: T) => T)) => {
      rawSetValue(oldValue => {
        const newValue = typeof value === 'function' ? value(oldValue) : value;

        const oldStringifiedValue = storage.getItem(key);
        const newStringifiedValue = JSON.stringify(newValue);
        storage.setItem(key, newStringifiedValue);

        // notify other instances of the same hook
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            oldValue: oldStringifiedValue,
            newValue: newStringifiedValue,
            storageArea: storage,
          })
        );

        return newValue;
      });
    },
    [storage, key]
  );

  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.storageArea !== storage || event.key !== key) {
        return;
      }
      const stringifiedValue = JSON.stringify(value);
      if (event.newValue === null) {
        // prevent deltion of the item
        storage.setItem(key, stringifiedValue);
      } else {
        if (event.newValue === stringifiedValue) {
          return;
        }
        // use rawSetValue instead of setValue because we don't want
        // to notify others again - they receive the current event, too
        rawSetValue(JSON.parse(event.newValue) as T);
      }
    };
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [storage, key, value]);

  return [value, setValue] as const;
};

export default useStorageState;
