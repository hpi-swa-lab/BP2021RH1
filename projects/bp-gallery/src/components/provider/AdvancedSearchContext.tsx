import { Dispatch, SetStateAction, createContext } from 'react';

export type AdvancedSearchContext = {
  keywordFilter: string;
  SetKeywordFilter: Dispatch<SetStateAction<string>>;
  descriptionFilter: string;
  SetDescriptionFilter: Dispatch<SetStateAction<string>>;
  commentFilter: string;
  SetCommentFilter: Dispatch<SetStateAction<string>>;
  personFilter: string;
  SetPersonFilter: Dispatch<SetStateAction<string>>;
  faceTagFilter: string;
  SetFaceTagFilter: Dispatch<SetStateAction<string>>;
  locationFilter: string;
  SetLocationFilter: Dispatch<SetStateAction<string>>;
  collectionFilter: string;
  SetCollectionFilter: Dispatch<SetStateAction<string>>;
  archiveFilter: string;
  SetArchiveFilter: Dispatch<SetStateAction<string>>;
  timeRangeFilter: string;
  SetTimeRangeFilter: Dispatch<SetStateAction<string>>;
};

export const AdvancedSearchContext = createContext<AdvancedSearchContext | null>(null);
