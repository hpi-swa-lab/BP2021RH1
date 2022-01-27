import React from 'react';
import './BrowseView.scss';
import CategoryPictureDisplay from './CategoryPictureDisplay';
import { FormControlLabel, Switch } from '@mui/material';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useGetCategoryInfoQuery } from '../../../graphql/APIConnector';
import { useFlatQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCategoryTag } from '../../../graphql/additionalFlatTypes';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/formatBrowsePath';

const BrowseView = ({
  path,
  scrollPos,
  scrollHeight,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const history: History = useHistory();
  const variables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };

  const { data, loading, error } = useGetCategoryInfoQuery({ variables });
  const categoryTags: FlatCategoryTag[] | undefined = useFlatQueryResponseData(data)?.categoryTags;

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            onChange={() => history.push(formatBrowsePath(path, true), { showBack: true })}
          />
        }
        label='Browse View'
      />
      <CategoryPictureDisplay
        categoryTags={categoryTags}
        loading={loading}
        error={error}
        path={path}
        scrollPos={scrollPos}
        scrollHeight={scrollHeight}
      />
    </>
  );
};
export default BrowseView;
