import { useCallback, useEffect, useRef } from 'react';
import { FallbackChannel, channelFactory } from '../helpers/channel-helpers';

const usePresentationChannel = (id: string, onNavigate: (pictureId: string) => void) => {
  const producer = useRef<FallbackChannel | BroadcastChannel | null>(null);

  useEffect(() => {
    const consumer = channelFactory(id);
    producer.current = channelFactory(id);
    consumer.onmessage = (event: MessageEvent<{ pictureId: string }>) => {
      onNavigate(event.data.pictureId);
    };

    return () => {
      producer.current?.close();
      producer.current = null;
      consumer.close();
    };
  }, [id, onNavigate]);

  return useCallback(
    (targetId: string) => {
      producer.current?.postMessage({
        pictureId: targetId,
      });
    },
    [producer]
  );
};

export default usePresentationChannel;
