import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  PictureFiltersInput,
  useGetArchiveQuery,
  useUpdateArchiveMutation,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag, FlatPicture } from '../../../types/additionalFlatTypes';
import { asApiPath } from '../../App';
import PicturePreview, {
  PicturePreviewAdornment,
} from '../../common/picture-gallery/PicturePreview';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import ArchiveInfo from './ArchiveInfo';
import './ArchiveView.scss';

const getPictureFilters = (pictures: string[]) => {
  const filters: PictureFiltersInput = { and: [] };

  filters.and?.push({
    id: {
      in: pictures,
    },
  });

  return filters;
};

interface ArchiveViewProps {
  archiveId: string;
}

const ArchiveView = ({ archiveId }: ArchiveViewProps) => {
  const { t } = useTranslation();

  const { data, loading, error } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;
  const src = archive?.logo?.formats?.thumbnail.url ?? '';

  const showcaseAdornment: PicturePreviewAdornment = {
    position: 'top-left',
    icon: 'star',
    title: t('pictureAdornments.showcase'),
    onClick: picture => {
      if (showcasePicture?.id === picture.id) return;
      updateArchive({
        variables: {
          archiveId,
          data: {
            showcasePicture: picture.id,
          },
        },
      });
    },
  };

  console.log(archive);
  console.log(showcasePicture);

  // const { linkToCollection, moveToCollection, removeFromCollection, bulkEdit } = useBulkOperations(
  //   collections?.[0]
  // );

  return (
    <div className='archive-container'>
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='collection-picture-display'>
            <h2>{archive?.name}</h2>
            <div className='archive-info'>
              {archive && <ArchiveInfo archive={archive} />}
              {showcasePicture && (
                <div className='archive-showcase'>
                  <PicturePreview picture={showcasePicture} onClick={() => {}} viewOnly={true} />
                </div>
              )}
            </div>
            {archive?.logo && (
              <div className='archive-logo-container'>
                <img
                  className='archive-logo'
                  src={asApiPath(
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    `/${src as string}?updatedAt=${(archive.logo.updatedAt ?? 'unknown') as string}`
                  )}
                />
              </div>
            )}

            {/* {childCount > 0 && (
              <SubCollections childCollections={collection.child_collections ?? []} path={path} />
            )}
            {role >= AuthRole.CURATOR && (
              <Button startIcon={<Add />} onClick={addCollection}>
                {t('curator.createCollection')}
              </Button>
            )} */}
            {archive?.pictures && (
              <PictureScrollGrid
                queryParams={getPictureFilters(archive.pictures.map(picture => picture.id))}
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'archive'}
                extraAdornments={[showcaseAdornment]}
                // uploadAreaProps={uploadAreaProps(collection)}
                // bulkOperations={[
                //   removeFromCollection,
                //   linkToCollection,
                //   moveToCollection,
                //   bulkEdit,
                // ]}
              />
            )}
          </div>
        )}
      </ScrollContainer>
    </div>
  );
};

export default ArchiveView;
