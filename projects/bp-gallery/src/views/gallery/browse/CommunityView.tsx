import React from 'react';
import './BrowseView.scss';
import {
  useGetCategoryInfoQuery,
  useGetLatestPicturesCategoryInfoQuery,
} from '../../../graphql/APIConnector';
import CategoryPictureDisplay from './CategoryPictureDisplay';
import { decodeBrowsePathComponent } from './BrowseView';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import Loading from '../../../components/Loading';

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
  const variables_related = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };
  const first_level = !path?.length;
  const related_tags_result = useGetCategoryInfoQuery({ variables: variables_related });
  // data, loading, error
  const result = useGetLatestPicturesCategoryInfoQuery({
    variables: { date: new Date(communityDate) },
  });

  if (result.error) {
    return <QueryErrorDisplay error={result.error} />;
  } else if (related_tags_result.error) {
    return <QueryErrorDisplay error={related_tags_result.error} />;
  } else if (result.loading) {
    return <Loading />;
  } else if (related_tags_result.loading) {
    return <Loading />;
  } else {
    const test = path?.length ? decodeBrowsePathComponent(path[path.length - 1]) : 'nope';

    const related_tags = related_tags_result.data?.categoryTags?.map(tag => {
      return tag?.related_tags;
    })[0];

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
    let filtered_tags;
    //filter from unique_tags only current related_tags
    //hier noch aktuellen Tag hinzufügen an 0te Stelle
    filtered_tags = unique_tags.filter((c_tag: any) =>
      related_tags?.map((r_tag: any) => r_tag.id).includes(c_tag.id)
    );
    let multi_picture_mode = true;
    const first_tag = related_tags_result.data?.categoryTags?.map(tag => tag);
    if (!filtered_tags.length) {
      filtered_tags = first_tag;
      multi_picture_mode = false;
    }

    return (
      <CategoryPictureDisplay
        result={result}
        categoryTags={filtered_tags}
        multi_picture_mode={multi_picture_mode}
        path={path}
        scrollPos={scrollPos}
        scrollHeight={scrollHeight}
        communityView={true}
      />
    );
  }
  // for testing
};

export default CommunityView;
