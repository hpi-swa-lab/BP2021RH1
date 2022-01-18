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
  const communityDate = '2021-11-24T10:50:45.978Z';

  const result = useGetLatestPicturesCategoryInfoQuery({
    variables: { date: new Date(communityDate) },
  });

  const tags = result.data?.pictures?.map(picture => {
    return picture?.category_tags;
  });
  // const categoryTags = [...new Map(tags?.map(item => [item.name, item])).values()];

  const categoryTags = Array.from(
    new Set(tags?.reduce((previous, next) => previous?.concat(next), []))
  );

  const unique_tags = Array.from(new Set(categoryTags.map(a => a?.name))).map(name => {
    return categoryTags.find(a => a?.name === name);
  });
  return (
    <CategoryPictureDisplay
      result={result}
      categoryTags={unique_tags}
      path={path}
      scrollPos={scrollPos}
      scrollHeight={scrollHeight}
      communityView={true}
    />
  );
};

export default CommunityView;
