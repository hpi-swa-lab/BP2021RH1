import React from 'react';
import './BrowseView.scss';
import { useGetCategoryInfoQuery } from '../../../graphql/APIConnector';
import CategoryPictureDisplay from './CategoryPictureDisplay';

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
  const variables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };

  const result = useGetCategoryInfoQuery({
    variables: variables,
  });
  const categoryTags = result.data?.categoryTags;

  return (
    <CategoryPictureDisplay
      result={result}
      categoryTags={categoryTags}
      path={path}
      scrollPos={scrollPos}
      scrollHeight={scrollHeight}
      communityView={false}
      multi_picture_mode={true}
    />
  );
};
export default BrowseView;
