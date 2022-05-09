import { useCallback, useEffect, useMemo, useState } from 'react';

const SCANNER_PORT = 8000;

const COMMANDS = {
  SELECT_SCANNER: 'set_scanner',
  LIST_SCANNERS: 'list',
  SCAN: 'scan',
  SET_CROPPING: 'set_crop',
};

const useScanner = () => {
  const socket = useMemo(() => new WebSocket(`ws://localhost:${SCANNER_PORT}`), []);

  const [scanners, setScanners] = useState<string[]>();
  const [selectedScannerId, setSelectedScannerId] = useState<number>(0);

  const [shouldCrop, setShouldCrop] = useState<boolean>(true);

  const [scannedDocument, setScannedDocument] = useState<Blob | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const selectScanner = useCallback(
    (id: number) => {
      socket.send(`${COMMANDS.SELECT_SCANNER} ${id}`);
      setSelectedScannerId(id);
      socket.send(COMMANDS.LIST_SCANNERS);
    },
    [socket]
  );

  const toggleAutoCrop = useCallback(() => {
    setShouldCrop(shouldCrop => {
      socket.send(`${COMMANDS.SET_CROPPING} ${shouldCrop ? '0' : '1'}`);
      return !shouldCrop;
    });
  }, [socket]);

  useEffect(() => {
    socket.addEventListener('open', () => {
      setLoading(true);
      socket.send(COMMANDS.LIST_SCANNERS);
    });

    socket.addEventListener('message', event => {
      if (event.data instanceof Blob) {
        setScannedDocument(event.data);
        setLoading(false);
      } else {
        const data = JSON.parse(event.data as string);
        if (data.list) {
          setScanners(data.list as string[]);
          setLoading(false);
        }
        if (data.selected_scanner) {
          setSelectedScannerId(Number(data.selected_scanner ?? 0) || 0);
        }
        if (data.noop) {
          setLoading(false);
        }
      }
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  const scan = useCallback(() => {
    setLoading(true);
    socket.send(COMMANDS.SCAN);
  }, [socket]);

  return {
    scanners,
    scannedDocument,
    loading,
    scan,
    selectedScannerId,
    selectScanner,
    autoCrop: shouldCrop,
    toggleAutoCrop,
  };
};

export default useScanner;
