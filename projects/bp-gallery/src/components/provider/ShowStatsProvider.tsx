import { createContext, PropsWithChildren } from 'react';

export const ShowStatsContext = createContext(false);

export const ShowStats = ({ children }: PropsWithChildren<{}>) => (
  <ShowStatsContext.Provider value={true}>{children}</ShowStatsContext.Provider>
);

export const HideStats = ({ children }: PropsWithChildren<{}>) => (
  <ShowStatsContext.Provider value={false}>{children}</ShowStatsContext.Provider>
);
