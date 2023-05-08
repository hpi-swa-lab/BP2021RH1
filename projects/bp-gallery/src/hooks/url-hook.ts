import { useEffect, useMemo } from 'react';

export const useObjectURL = (blob: Blob | undefined) => {
  const objectURL = useMemo(() => (blob ? URL.createObjectURL(blob) : ''), [blob]);
  useEffect(() => {
    return () => URL.revokeObjectURL(objectURL);
  }, [objectURL]);
  return objectURL;
};
