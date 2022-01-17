import React from 'react';
import './BrowseView.scss';
import { useGetLatestPicturesCategoryInfoQuery } from '../../../graphql/APIConnector';
import CategoryPictureDisplay from './CategoryPictureDisplay';

const CommunityView = ({
  path,
  scrollPos,
  scrollHeight,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const communityDate = '2021-11-28';

  const result = useGetLatestPicturesCategoryInfoQuery({
    variables: { date: new Date(communityDate) },
  });
  const categoryTags = Array.from(new Set(result.data?.categoryTags));
  return (
    <CategoryPictureDisplay
      result={result}
      categoryTags={categoryTags}
      path={path}
      scrollPos={scrollPos}
      scrollHeight={scrollHeight}
      communityView={true}
    />
  );
};

export default CommunityView;
