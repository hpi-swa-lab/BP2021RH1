import { PropsWithChildren, createContext, useEffect, useState } from 'react';

export const MobileProvider = ({ children }: PropsWithChildren<{}>) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width <= 750;

  return <MobileContext.Provider value={{ isMobile }}>{children}</MobileContext.Provider>;
};

export const MobileContext = createContext<{ isMobile: boolean }>({ isMobile: false });
