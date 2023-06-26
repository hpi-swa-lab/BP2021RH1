import { PropsWithChildren, useEffect, useState, createContext } from 'react';

export const ExhibitionIdContext = createContext<string | undefined>(undefined);

const ExhibitionProvider = ({ children }: PropsWithChildren) => {
  const [exhibitionId, setExhibitionId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const exhibitionId = params.get('exhibitionId');
    exhibitionId && setExhibitionId(exhibitionId);
  }, [setExhibitionId]);

  return (
    <ExhibitionIdContext.Provider value={exhibitionId}>{children}</ExhibitionIdContext.Provider>
  );
};

export default ExhibitionProvider;
