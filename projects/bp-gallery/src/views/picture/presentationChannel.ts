import EventEmitter from 'events';
import { useCallback, useEffect, useMemo } from 'react';

/* ========== FALLBACK FOR SAFARI ========== */
const fallbackLocalSingleton = new EventEmitter();

class FallbackChannel {
  onmessage?: (event: any) => void;
  id: string;
  closed = false;

  constructor(id: string) {
    this.id = id;
    window.addEventListener('storage', event => {
      if (event.key !== `__fallbackChannel_${this.id}` || !this.onmessage || !event.newValue)
        return;
      this.onmessage({
        data: JSON.parse(event.newValue),
      });
    });
    fallbackLocalSingleton.on('post', event => {
      if (this.onmessage) {
        this.onmessage(event);
      }
    });
  }

  postMessage(msg: any) {
    if (!this.closed) {
      localStorage.setItem(`__fallbackChannel_${this.id}`, JSON.stringify(msg));
      fallbackLocalSingleton.emit('post', {
        data: msg,
      });
    }
  }

  close() {
    localStorage.removeItem(`__fallbackChannel_${this.id}`);
    this.closed = true;
  }
}
/* ========== FALLBACK END ========== */

const channelFactory = (id: string) => {
  if (BroadcastChannel as any) {
    return new BroadcastChannel(id);
  } else {
    console.debug(
      'Broadcast Channel not found on this system. Falling back to using local storage.'
    );
    return new FallbackChannel(id);
  }
};

const usePresentationChannel = (id: string, onNavigate: (pictureId: string) => void) => {
  const producer = useMemo(() => channelFactory(id), [id]);
  const consumer = useMemo(() => channelFactory(id), [id]);

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
