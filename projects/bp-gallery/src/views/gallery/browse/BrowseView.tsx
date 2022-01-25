import React from 'react';
import './BrowseView.scss';
import { useGetCategoryInfoQuery } from '../../../graphql/APIConnector';
import CategoryPictureDisplay from './CategoryPictureDisplay';
import { FormControlLabel, Switch } from '@mui/material';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useFlatQueryResponseData } from '../../../graphql/queryUtils';

export function encodeBrowsePathComponent(folder: string): string {
  return encodeURIComponent(folder.replace(/ /gm, '_'));
}

export function decodeBrowsePathComponent(folder: string): string {
  return decodeURIComponent(folder).replace(/_/gm, ' ');
}

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

  const result = useGetCategoryInfoQuery({
    variables: variables,
  });
  result.data = useFlatQueryResponseData(result.data);
  const categoryTags = result.data?.categoryTags;

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            onChange={() => {
              history.push('/browse/latest');
            }}
          />
        }
        label='Browse View'
      />
      <CategoryPictureDisplay
        result={result}
        categoryTags={categoryTags}
        path={path}
        scrollPos={scrollPos}
        scrollHeight={scrollHeight}
        communityView={false}
        multi_picture_mode={true}
      />
    </>
  );
};
export default BrowseView;
