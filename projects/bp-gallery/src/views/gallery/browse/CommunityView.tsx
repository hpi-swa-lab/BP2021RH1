import React from 'react';
import './BrowseView.scss';
import {
  useGetCategoryInfoQuery,
  useGetLatestPicturesCategoryInfoQuery,
} from '../../../graphql/APIConnector';
import CategoryPictureDisplay from './CategoryPictureDisplay';
import { decodeBrowsePathComponent } from './BrowseView';

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

  // for testing
  const test = path?.length ? decodeBrowsePathComponent(path[path.length - 1]) : 'nope';

  const variables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };
  const related_tags_result = useGetCategoryInfoQuery({ variables: variables });
  const related_tags = related_tags_result.data?.categoryTags?.map(tag => {
    return tag?.related_tags;
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

  //filter from unique_tags only current related_tags
  const filtered_tags = unique_tags.filter((c_tag: any) =>
    related_tags?.map((r_tag: any) => r_tag.id).includes(c_tag.id)
  );
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
