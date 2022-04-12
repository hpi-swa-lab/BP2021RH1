import React from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../shared/Loading';
import QueryErrorDisplay from '../../shared/QueryErrorDisplay';
import PictureScrollGrid from '../shared/PictureScrollGrid';
import SubCollections from './SubCollections';
import { PictureFiltersInput } from '../../../graphql/APIConnector';
import CollectionDescription from './CollectionDescription';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';

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
  collections?: any;
  path: string[] | undefined;
  scrollPos: number;
  scrollHeight: number;
  picturePublishingDate?: string;
}) => {
  const { t } = useTranslation();
  const { role } = useAuth();

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (collections?.length && collections[0]) {
    const collection = collections[0];
    const childCount = collection.child_collections?.length ?? 0;

    return (
      <div className='collection-picture-display'>
        <CollectionDescription description={collection.description ?? ''} name={collection.name} />
        {childCount > 0 && (
          <SubCollections
            childCollections={collection.child_collections as { thumbnail: string; name: string }[]}
            path={path}
            communityView={!!picturePublishingDate}
          />
        )}
        <PictureScrollGrid
          filters={getPictureFilters(collection.id as string, picturePublishingDate)}
          scrollPos={scrollPos}
          scrollHeight={scrollHeight}
          hashbase={collection.name}
          gridProps={
            role >= AuthRole.CURATOR
              ? {
                  beforeAddPictures: (pictures: FlatPicture[]) => {
                    return pictures.map(picture => ({
                      ...picture,
                      publishedAt: new Date().toISOString(),
                      collections: [collection.id],
                    }));
                  },
                  folderName: collection.name,
                }
              : undefined
          }
        />
      </div>
    );
  } else {
    return <div>{t('common.no-collection')}</div>;
  }
};

export default CollectionPictureDisplay;
