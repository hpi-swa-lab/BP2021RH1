import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PictureFiltersInput,
  useCanRunCreateSubCollectionMutation,
  useCanRunGetCollectionInfoByNameQuery,
  useCreateSubCollectionMutation,
  useGetCollectionInfoByNameQuery,
  useGetPublishedCollectionInfoByNameQuery,
  useGetRootCollectionQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import { FlatCollection, FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import Footer from '../../common/footer/Footer';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { PictureUploadAreaProps } from '../../common/picture-gallery/PictureUploadArea';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { ExhibitionIdContext } from '../../provider/ExhibitionProvider';
import { ShowStats } from '../../provider/ShowStatsProvider';
import './BrowseView.scss';
import CollectionDescription from './CollectionDescription';
import SubCollections from './SubCollections';
import { decodeBrowsePathComponent } from './helpers/format-browse-path';

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
  const dialog = useDialog();

  const [addSubCollection] = useCreateSubCollectionMutation();
  const { canRun: canAddSubCollection } = useCanRunCreateSubCollectionMutation();

  // Query collection info
  const rootCollectionResult = useGetRootCollectionQuery({
    skip: path && path.length > 0,
  });
  const rootCollectionName = useSimplifiedQueryResponseData(rootCollectionResult.data)
    ?.browseRootCollection.current.name;

  const { canRun: canSeeUnpublishedColletions } = useCanRunGetCollectionInfoByNameQuery();

  const collectionQueryVariables = {
    collectionName: path?.length
      ? decodeBrowsePathComponent(path[path.length - 1])
      : rootCollectionName,
  };
  const {
    data: unpublishedData,
    loading: unpublishedLoading,
    error: unpublishedError,
  } = useGetCollectionInfoByNameQuery({
    variables: collectionQueryVariables,
    skip: !!rootCollectionResult.loading || !canSeeUnpublishedColletions,
  });
  const {
    data: publishedData,
    loading: publishedLoading,
    error: publishedError,
  } = useGetPublishedCollectionInfoByNameQuery({
    variables: collectionQueryVariables,
    skip: !!rootCollectionResult.loading || canSeeUnpublishedColletions,
  });
  const data = unpublishedData ?? publishedData;
  const loading = unpublishedLoading || publishedLoading;
  const error = unpublishedError ?? publishedError;

  const collections: FlatCollection[] | undefined =
    useSimplifiedQueryResponseData(data)?.collections;

  const exhibitionId = useContext(ExhibitionIdContext);
  //Curator functionality
  const { linkToCollection, moveToCollection, removeFromCollection, bulkEdit, addToExhibition } =
    useBulkOperations(collections?.[0]);

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
    (collection: FlatCollection): Partial<PictureUploadAreaProps> | undefined => ({
      // whether the user actually can upload the picture is handled in PictureUploadArea
      preprocessPictures: (pictures: FlatPicture[]) => {
        return pictures.map(picture => ({
          ...picture,
          collections: [collection.id as any],
        }));
      },
      folderName: collection.name,
    }),
    []
  );

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (collections?.length && collections[0]) {
    const collection = collections[0];
    const childCount = collection.child_collections?.length ?? 0;
    return (
      <div className='browse-container'>
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
          {canAddSubCollection && (
            <Button startIcon={<Add />} onClick={addCollection}>
              {t('curator.createCollection')}
            </Button>
          )}
          <ShowStats>
            <PictureScrollGrid
              queryParams={getPictureFilters(collection.id)}
              hashbase={collection.name}
              uploadAreaProps={uploadAreaProps(collection)}
              bulkOperations={[
                removeFromCollection,
                linkToCollection,
                moveToCollection,
                bulkEdit,
                ...(exhibitionId ? [addToExhibition] : []),
              ]}
              textFilter={null}
            />
          </ShowStats>
        </div>
        <Footer />
      </div>
    );
  } else {
    return <div>{t('common.no-collection')}</div>;
  }
};

export default BrowseView;
