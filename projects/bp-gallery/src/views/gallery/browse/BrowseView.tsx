import React from 'react';
import './CategoryPictureDisplay.scss';
import CategoryPictureDisplay from './CategoryPictureDisplay';
import { FormControlLabel, Switch } from '@mui/material';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import {
  useGetCategoryInfoQuery,
  useGetCategoryTagsPublishedAfterDateQuery,
} from '../../../graphql/APIConnector';
import { useFlatQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCategoryTag } from '../../../graphql/additionalFlatTypes';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/formatBrowsePath';

const BrowseView = ({
  path,
  scrollPos,
  scrollHeight,
  communityView = false,
}: {
  path?: string[];
  scrollPos: number;
  scrollHeight: number;
  communityView: boolean;
}) => {
  const history: History = useHistory();
  const variables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };

  const { data, loading, error } = useGetCategoryInfoQuery({ variables });
  const categoryTags: FlatCategoryTag[] | undefined = useFlatQueryResponseData(data)?.categoryTags;

  let toCommunityView = true;
  let filteredCategoryTags = categoryTags;

  const picturePublishingDate = '2022-01-03T17:25:00Z'; // highly debatable

  // Query the IDs of all CategoryTags that got new pictures inside them
  const latestCategoryTagsResult = useGetCategoryTagsPublishedAfterDateQuery({
    variables: {
      date: picturePublishingDate,
    },
  });
  const latestCategoryTags: { id: string }[] | undefined = useFlatQueryResponseData(
    latestCategoryTagsResult.data
  )?.categoryTags;
  if (communityView) {
    const latestCategoryTagIds = latestCategoryTags?.map(tag => tag.id);

    if (latestCategoryTagIds && categoryTags) {
      toCommunityView = false;
      // Filter related tags to only accept those which got new pictures
      filteredCategoryTags = categoryTags.map(tag => ({
        ...tag,
        related_tags: tag.related_tags?.filter(relatedTag =>
          latestCategoryTagIds.includes(relatedTag.id)
        ),
      }));
    }
  }
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            onChange={() =>
              history.push(formatBrowsePath(path, toCommunityView), { showBack: true })
            }
          />
        }
        label='Browse View'
      />
      <CategoryPictureDisplay
        categoryTags={filteredCategoryTags}
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
