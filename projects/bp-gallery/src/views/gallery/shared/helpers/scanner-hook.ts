import { useCallback, useEffect, useMemo, useState } from 'react';

const SCANNER_PORT = 8000;
const ALIVE_CHECK_INTERVAL = 5000;

const useScanner = () => {
  const socket = useMemo(() => new WebSocket(`ws://localhost:${SCANNER_PORT}`), []);

  const [scanners, setScanners] = useState<string[]>();
  const [selectedScannerId, setSelectedScannerId] = useState<number>(0);

  const [scannedDocument, setScannedDocument] = useState<Blob | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const selectScanner = useCallback(
    (id: number) => {
      socket.send(`set_scanner ${id}`);
      setSelectedScannerId(id);
      socket.send('list');
    },
    [socket]
  );

  useEffect(() => {
    socket.addEventListener('open', () => {
      setLoading(true);
      socket.send('list');
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
    socket.send('scan');
  }, [socket]);

  return { scanners, scannedDocument, loading, scan, selectedScannerId, selectScanner };
};

export default useScanner;
