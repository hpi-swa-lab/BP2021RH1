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
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';

const CommunityView = ({
  path,
  scrollPos,
  scrollHeight,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const history: History = useHistory();
  const communityDate = '2021-11-24T10:50:45.978Z';
  const variables_related = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };
  const related_tags_result = useGetCategoryInfoQuery({ variables: variables_related });
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
    const related_tags = related_tags_result.data?.categoryTags?.map(tag => {
      return tag?.related_tags;
    })[0];
    const tags = result.data?.pictures?.map(picture => {
      return picture?.category_tags;
    });
    const categoryTags = Array.from(
      new Set(tags?.reduce((previous, next) => previous?.concat(next), []))
    );
    const unique_tags = Array.from(new Set(categoryTags.map(a => a?.name))).map(name => {
      return categoryTags.find(a => a?.name === name);
    });

    let filtered_tags;
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
      <>
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              onChange={() => {
                history.push('/browse');
              }}
            />
          }
          label='Community View'
        />
        <CategoryPictureDisplay
          result={result}
          categoryTags={filtered_tags}
          multi_picture_mode={multi_picture_mode}
          path={path}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
          communityView={true}
        />
      </>
    );
  }
};

export default CommunityView;
