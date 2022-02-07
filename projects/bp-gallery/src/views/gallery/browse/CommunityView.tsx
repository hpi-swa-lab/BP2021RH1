import React from 'react';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import './CategoryPictureDisplay.scss';
import CategoryPictureDisplay from './CategoryPictureDisplay';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/formatBrowsePath';
import {
  useGetCategoryInfoQuery,
  useGetCategoryTagsPublishedAfterDateQuery,
} from '../../../graphql/APIConnector';
import { useFlatQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCategoryTag } from '../../../graphql/additionalFlatTypes';

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
  const latestCategoryTagIds = latestCategoryTags?.map(tag => tag.id);

  const categoryInfoVariables = path?.length
    ? { categoryName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { categoryPriority: 1 };

  // Query the information to the CategoryTag whose pictures get displayed
  const categoryInfoResult = useGetCategoryInfoQuery({ variables: categoryInfoVariables });
  const categoryTags: FlatCategoryTag[] | undefined = useFlatQueryResponseData(
    categoryInfoResult.data
  )?.categoryTags;

  let filteredCategoryTags = categoryTags;
  if (latestCategoryTagIds && categoryTags) {
    // Filter related tags to only accept those which got new pictures
    filteredCategoryTags = categoryTags.map(tag => ({
      ...tag,
      related_tags: tag.related_tags?.filter(relatedTag =>
        latestCategoryTagIds.includes(relatedTag.id)
      ),
    }));
  }

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            onChange={() => history.push(formatBrowsePath(path), { showBack: true })}
          />
        }
        label='Community View'
      />
      <CategoryPictureDisplay
        picturePublishingDate={picturePublishingDate}
        categoryTags={filteredCategoryTags}
        loading={categoryInfoResult.loading || latestCategoryTagsResult.loading}
        error={latestCategoryTagsResult.error ?? categoryInfoResult.error}
        path={path}
        scrollPos={scrollPos}
        scrollHeight={scrollHeight}
      />
    </>
  );
};

export default CommunityView;
