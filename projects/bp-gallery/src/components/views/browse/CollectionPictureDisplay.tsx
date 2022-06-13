import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../common/Loading';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import SubCollections from './SubCollections';
import { PictureFiltersInput, useCreateSubCollectionMutation } from '../../../graphql/APIConnector';
import CollectionDescription from './CollectionDescription';
import { FlatCollection, FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { PictureUploadAreaProps } from '../../common/picture-gallery/PictureUploadArea';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { DialogContext, DialogPreset } from '../../provider/DialogProvider';

const getPictureFilters = (collectionId: string, picturePublishingDate?: string) => {
  const filters: PictureFiltersInput = { and: [] };

  filters.and?.push({
    collections: {
      id: {
        eq: collectionId,
      },
    },
  });

  if (picturePublishingDate) {
    filters.and?.push({
      publishedAt: {
        gt: picturePublishingDate,
      },
    });
  }

  return filters;
};

const CollectionPictureDisplay = ({
  error,
  loading = false,
  collections,
  path,
  scrollPos,
  scrollHeight,
  picturePublishingDate,
}: {
  error?: any;
  loading?: boolean;
  collections?: FlatCollection[];
  path: string[] | undefined;
  scrollPos: number;
  scrollHeight: number;
  picturePublishingDate?: string;
}) => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const dialog = useContext(DialogContext);

  const [addSubCollection] = useCreateSubCollectionMutation();

  const { linkToCollection, moveToCollection, removeFromCollection } = useBulkOperations(
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
      <div className='collection-picture-display'>
        <CollectionDescription
          id={collection.id}
          description={collection.description ?? ''}
          name={collection.name}
        />
        {childCount > 0 && (
          <SubCollections
            childCollections={collection.child_collections ?? []}
            path={path}
            onlyLatest={!!picturePublishingDate}
          />
        )}
        {role >= AuthRole.CURATOR && (
          <Button startIcon={<Add />} onClick={addCollection}>
            {t('curator.createCollection')}
          </Button>
        )}
        <PictureScrollGrid
          queryParams={getPictureFilters(collection.id, picturePublishingDate)}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
          hashbase={collection.name}
          uploadAreaProps={uploadAreaProps(collection)}
          bulkOperations={[removeFromCollection, linkToCollection, moveToCollection]}
        />
      </div>
    );
  } else {
    return <div>{t('common.no-collection')}</div>;
  }
};

export default CollectionPictureDisplay;
