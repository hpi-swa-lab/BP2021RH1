import React from 'react';
import { useTranslation } from 'react-i18next';
import './CollectionPictureDisplay.scss';
import { FormControlLabel, Switch } from '@mui/material';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import {
  useGetCollectionInfoQuery,
  useGetCollectionWithPicturesPublishedAfterQuery,
} from '../../../graphql/APIConnector';
import { useFlatQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCollection } from '../../../graphql/additionalFlatTypes';
import { decodeBrowsePathComponent, formatBrowsePath } from './helpers/formatBrowsePath';
import CollectionPictureDisplay from './CollectionPictureDisplay';

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
  const { t } = useTranslation();
  const history: History = useHistory();
  const variables = path?.length
    ? { collectionName: decodeBrowsePathComponent(path[path.length - 1]) }
    : { collectionName: 'Das Herbert-Ahrens-Bilderarchiv' }; // TODO

  const { data, loading, error } = useGetCollectionInfoQuery({ variables });
  const collections: FlatCollection[] | undefined = useFlatQueryResponseData(data)?.collections;
  let filteredCollections = collections;

  const picturePublishingDate = '2022-01-03T17:25:00Z'; // highly debatable

  // Query the IDs of all Collections that got new pictures inside them
  const latestCollectionsResult = useGetCollectionWithPicturesPublishedAfterQuery({
    variables: {
      date: picturePublishingDate,
    },
    skip: !communityView,
  });
  const latestCollections: { id: string }[] | undefined = useFlatQueryResponseData(
    latestCollectionsResult.data
  )?.collections;

  if (communityView) {
    const latestCollectionIds = latestCollections?.map(collection => collection.id);
    if (latestCollectionIds && collections) {
      // Filter child_collections to only accept those which got new pictures
      filteredCollections = collections.map(collection => ({
        ...collection,
        child_collections: collection.child_collections?.filter(child =>
          latestCollectionIds.includes(child.id)
        ),
      }));
    }
  }
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={!communityView}
            onChange={() =>
              history.replace(formatBrowsePath(path, !communityView), { showBack: true })
            }
          />
        }
        label={String(communityView ? t('common.community-view') : t('common.browse-view'))}
      />
      <CollectionPictureDisplay
        picturePublishingDate={communityView ? picturePublishingDate : undefined}
        collections={filteredCollections}
        loading={loading || latestCollectionsResult.loading}
        error={error ?? latestCollectionsResult.error}
        path={path}
        scrollPos={scrollPos}
        scrollHeight={scrollHeight}
      />
    </>
  );
};
export default BrowseView;
