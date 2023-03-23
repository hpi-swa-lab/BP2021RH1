import { useRef } from 'react';

export const useObjectIds = <T extends object>() => {
  const objectIds = useRef(new WeakMap<T, string>());
  const currId = useRef(1);

  const getObjectId = (object: T) => {
    if (objectIds.current.has(object)) {
      return objectIds.current.get(object) as string;
    } else {
      const id = String(currId.current++);
      objectIds.current.set(object, id);
      return id;
    }
  };

  return { getObjectId };
};
