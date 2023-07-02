import { useEffect, useState } from 'react';

export const useCachedOnRefetch = <T>(data: T, enable = true) => {
  const [cachedData, setCachedData] = useState(data);
  useEffect(() => {
    if (data) {
      setCachedData(data);
    }
  }, [data]);
  return enable ? cachedData : data;
};
