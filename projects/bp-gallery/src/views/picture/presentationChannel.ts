import { useCallback, useEffect, useMemo } from 'react';

const usePresentationChannel = (id: string, onNavigate: (pictureId: string) => void) => {
  const producer = useMemo(() => new BroadcastChannel(`presentation-${id}`), [id]);
  const consumer = useMemo(() => new BroadcastChannel(`presentation-${id}`), [id]);

  useEffect(() => {
    consumer.onmessage = (event: MessageEvent<{ pictureId: string }>) => {
      onNavigate(event.data.pictureId);
    };

    return () => {
      consumer.close();
    };
  }, [consumer, onNavigate]);

  return useCallback(
    (targetId: string) => {
      producer.postMessage({
        pictureId: targetId,
      });
    },
    [producer]
  );
};

export default usePresentationChannel;
