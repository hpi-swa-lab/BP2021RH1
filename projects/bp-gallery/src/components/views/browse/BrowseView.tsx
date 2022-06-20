import React from 'react';
import './CollectionPictureDisplay.scss';
import {
  PublicationState,
  useGetCollectionInfoByNameQuery,
  useGetRootCollectionQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import { decodeBrowsePathComponent } from './helpers/format-browse-path';
import CollectionPictureDisplay from './CollectionPictureDisplay';
import ScrollContainer from '../../common/ScrollContainer';
import { AuthRole, useAuth } from '../../provider/AuthProvider';

const BrowseView = ({ path }: { path?: string[] }) => {
  const { role } = useAuth();

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
    publicationState: role >= AuthRole.CURATOR ? PublicationState.Preview : PublicationState.Live,
  };
  const { data, loading, error } = useGetCollectionInfoByNameQuery({
    variables: collectionQueryVariables,
    skip: !!rootCollectionResult.loading,
  });
  const collections: FlatCollection[] | undefined =
    useSimplifiedQueryResponseData(data)?.collections;

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <CollectionPictureDisplay
          collections={collections}
          loading={loading || rootCollectionResult.loading}
          error={error ?? rootCollectionResult.error}
          path={path}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
        />
      )}
    </ScrollContainer>
  );
};
export default BrowseView;
