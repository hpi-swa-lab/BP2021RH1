import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useAdvancedSearch } from '../../../hooks/context-hooks';
import { SearchFilterInputItem } from './SearchFilterInputItem';

export const SearchFilterInput = ({ key, attribute }: { key: string; attribute: string }) => {
  const [rowIds, SetRowIds] = useState([0]);
  const [filters, SetFilters] = useState(['']);

  const setFilter = (id: string, filter: string) => {
    SetFilters(current => current.splice(parseInt(id), 0, filter));
  };

  const deleteRow = useCallback(
    (id: string) => {
      if (rowIds.length > 1) {
        SetRowIds(current => current.splice(parseInt(id), 1));
        SetFilters(current => current.splice(parseInt(id), 1));
      }
    },
    [rowIds]
  );

  const incrementRows = useCallback(() => {
    SetRowIds(current => current.splice(rowIds.length, 0, rowIds[rowIds.length - 1] + 1));
  }, [rowIds]);

  const filter = filters.join(' ');

  const context = useAdvancedSearch();

  const updateFilter = useCallback(() => {
    switch (attribute) {
      case 'keyword':
        return context?.SetKeywordFilter;
      case 'description':
        return context?.SetDescriptionFilter;
      case 'comment':
        return context?.SetCommentFilter;
      case 'person':
        return context?.SetPersonFilter;
      case 'face-tag':
        return context?.SetFaceTagFilter;
      case 'location':
        return context?.SetLocationFilter;
      case 'collection':
        return context?.SetCollectionFilter;
      case 'archive':
        return context?.SetArchiveFilter;
      case 'timeRange':
        return context?.SetTimeRangeFilter;
      default:
        return () => {
          console.log("attribute doens't exist", attribute);
        };
    }
  }, [
    attribute,
    context?.SetArchiveFilter,
    context?.SetCollectionFilter,
    context?.SetCommentFilter,
    context?.SetDescriptionFilter,
    context?.SetFaceTagFilter,
    context?.SetKeywordFilter,
    context?.SetLocationFilter,
    context?.SetPersonFilter,
    context?.SetTimeRangeFilter,
  ]);
  useEffect(() => {
    if (updateFilter()) {
      (updateFilter() as Dispatch<SetStateAction<string>>)(filter);
    }
  }, [filter, updateFilter]);

  return (
    <>
      {rowIds.map(id => (
        <SearchFilterInputItem
          key={id.toString()}
          id={id.toString()}
          attribute={attribute}
          deleteRow={deleteRow}
          incrementRows={incrementRows}
          setFilter={setFilter}
        ></SearchFilterInputItem>
      ))}
    </>
  );
};
