import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../common/Loading';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import SubCollections from './SubCollections';
import './BrowseView.scss';
import {
  PictureFiltersInput,
  PublicationState,
  useCreateSubCollectionMutation,
  useGetCollectionInfoByNameQuery,
  useGetRootCollectionQuery,
} from '../../../graphql/APIConnector';
import CollectionDescription from './CollectionDescription';
import { FlatCollection, FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { PictureUploadAreaProps } from '../../common/picture-gallery/PictureUploadArea';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { DialogContext, DialogPreset } from '../../provider/DialogProvider';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { decodeBrowsePathComponent } from './helpers/format-browse-path';
import ScrollContainer from '../../common/ScrollContainer';

const getPictureFilters = (collectionId: string) => {
  const filters: PictureFiltersInput = { and: [] };

  filters.and?.push({
    collections: {
      id: {
        eq: collectionId,
      },
    },
  });

  return filters;
};

const BrowseView = ({ path, startpage }: { path?: string[]; startpage?: boolean }) => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const dialog = useContext(DialogContext);
  const [addSubCollection] = useCreateSubCollectionMutation();

  // Query collection info
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

  //Curator functionality
  const { linkToCollection, moveToCollection, removeFromCollection, bulkEdit } = useBulkOperations(
    collections?.[0]
  );

  const addCollection = useCallback(async () => {
    const collectionName = await dialog({
      preset: DialogPreset.INPUT_FIELD,
      title: t('curator.nameOfNewCollection'),
    });
    if (collectionName?.length && collections) {
      addSubCollection({
        variables: {
          name: collectionName,
          parentId: collections[0].id,
          publishedAt: new Date().toISOString(),
        },
        refetchQueries: ['getCollectionInfoByName'],
      });
    }
  }, [collections, addSubCollection, dialog, t]);

  const uploadAreaProps = useCallback(
    (collection: FlatCollection): Partial<PictureUploadAreaProps> | undefined => {
      return role >= AuthRole.CURATOR
        ? {
            preprocessPictures: (pictures: FlatPicture[]) => {
              return pictures.map(picture => ({
                ...picture,
                collections: [collection.id as any],
              }));
            },
            folderName: collection.name,
          }
        : undefined;
    },
    [role]
  );

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (collections?.length && collections[0]) {
    const collection = collections[0];
    const childCount = collection.child_collections?.length ?? 0;
    return (
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='collection-picture-display'>
            {!startpage && (
              <CollectionDescription
                id={collection.id}
                description={collection.description ?? ''}
                name={collection.name}
              />
            )}
            {childCount > 0 && (
              <SubCollections childCollections={collection.child_collections ?? []} path={path} />
            )}
            {role >= AuthRole.CURATOR && (
              <Button startIcon={<Add />} onClick={addCollection}>
                {t('curator.createCollection')}
              </Button>
            )}
            <PictureScrollGrid
              queryParams={getPictureFilters(collection.id)}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={collection.name}
              uploadAreaProps={uploadAreaProps(collection)}
              bulkOperations={[removeFromCollection, linkToCollection, moveToCollection, bulkEdit]}
            />
          </div>
        )}
      </ScrollContainer>
    );
  } else {
    return <div>{t('common.no-collection')}</div>;
  }
};

export default BrowseView;
