import React from 'react';
import './CollectionPictureDisplay.scss';
import {
  useGetCollectionInfoByNameQuery,
  useGetCollectionWithPicturesPublishedAfterQuery,
  useGetRootCollectionQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import { decodeBrowsePathComponent } from '../../../helpers/formatBrowsePath';
import CollectionPictureDisplay from './CollectionPictureDisplay';
import ScrollContainer from '../../common/ScrollContainer';

const BrowseView = ({
  path,
  communityView = false,
}: {
  path?: string[];
  communityView: boolean;
}) => {
  // Query the name of the root-collection if there is no path
  const rootCollectionResult = useGetRootCollectionQuery({
    skip: path && path.length > 0,
  });
  const rootCollectionName = useSimplifiedQueryResponseData(rootCollectionResult.data)
    ?.browseRootCollection.current.name;

  const collectionQueryVariables = {
    collectionName: path?.length
      ? decodeBrowsePathComponent(path[path.length - 1])
      : rootCollectionName,
  };
  const { data, loading, error } = useGetCollectionInfoByNameQuery({
    variables: collectionQueryVariables,
    skip: !!rootCollectionResult.loading,
  });
  const collections: FlatCollection[] | undefined =
    useSimplifiedQueryResponseData(data)?.collections;
  let filteredCollections = collections;

  const picturePublishingDate = '2022-01-03T17:25:00Z'; // highly debatable

  // Query the IDs of all Collections that got new pictures inside them
  const latestCollectionsResult = useGetCollectionWithPicturesPublishedAfterQuery({
    variables: {
      date: picturePublishingDate,
    },
    skip: !communityView,
  });
  const latestCollections: { id: string }[] | undefined = useSimplifiedQueryResponseData(
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
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <CollectionPictureDisplay
          picturePublishingDate={communityView ? picturePublishingDate : undefined}
          collections={filteredCollections}
          loading={loading || latestCollectionsResult.loading || rootCollectionResult.loading}
          error={error ?? latestCollectionsResult.error ?? rootCollectionResult.error}
          path={path}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
        />
      )}
    </ScrollContainer>
  );
};
export default BrowseView;
