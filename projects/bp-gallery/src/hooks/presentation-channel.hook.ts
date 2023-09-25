import { useCallback, useEffect, useRef } from 'react';
import { PictureIds } from '../components/views/picture/PictureView';
import { FallbackChannel, channelFactory } from '../helpers/channel-helpers';

const usePresentationChannel = (id: string, onNavigate: (ids: PictureIds) => void) => {
  const producer = useRef<FallbackChannel | BroadcastChannel | null>(null);

  useEffect(() => {
    const consumer = channelFactory(id);
    producer.current = channelFactory(id);
    consumer.onmessage = (
      event: MessageEvent<{ pictureInSiblingsId: string; pictureInSequenceId: string }>
    ) => {
      onNavigate(event.data);
    };

    return () => {
      producer.current?.close();
      producer.current = null;
      consumer.close();
    };
  }, [id, onNavigate]);

  return useCallback(
    (ids: PictureIds) => {
      producer.current?.postMessage(ids);
    },
    [producer]
  );
};

export default usePresentationChannel;
