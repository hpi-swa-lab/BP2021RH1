import { PropsWithChildren, useState } from 'react';
import { AdvancedSearchContext } from './AdvancedSearchContext';

export const AdvancedSearchProvider = ({ children }: PropsWithChildren<{}>) => {
  const [keywordFilter, SetKeywordFilter] = useState('');
  const [descriptionFilter, SetDescriptionFilter] = useState('');
  const [commentFilter, SetCommentFilter] = useState('');
  const [personFilter, SetPersonFilter] = useState('');
  const [faceTagFilter, SetFaceTagFilter] = useState('');
  const [locationFilter, SetLocationFilter] = useState('');
  const [collectionFilter, SetCollectionFilter] = useState('');
  const [archiveFilter, SetArchiveFilter] = useState('');
  const [timeRangeFilter, SetTimeRangeFilter] = useState('');

  const value = {
    keywordFilter,
    SetKeywordFilter,
    descriptionFilter,
    SetDescriptionFilter,
    commentFilter,
    SetCommentFilter,
    personFilter,
    SetPersonFilter,
    faceTagFilter,
    SetFaceTagFilter,
    locationFilter,
    SetLocationFilter,
    collectionFilter,
    SetCollectionFilter,
    archiveFilter,
    SetArchiveFilter,
    timeRangeFilter,
    SetTimeRangeFilter,
  };

  return <AdvancedSearchContext.Provider value={value}>{children}</AdvancedSearchContext.Provider>;
};
