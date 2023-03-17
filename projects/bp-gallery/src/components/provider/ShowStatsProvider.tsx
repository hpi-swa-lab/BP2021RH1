import { createContext, PropsWithChildren } from 'react';

export const ShowStatsContext = createContext(false);

export const ShowStatsProvider = ShowStatsContext.Provider;

export const ShowStats = ({ children }: PropsWithChildren<{}>) => (
  <ShowStatsContext.Provider value={true}>{children}</ShowStatsContext.Provider>
);
