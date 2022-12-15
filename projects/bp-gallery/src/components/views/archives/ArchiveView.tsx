import React from 'react';
import { PictureFiltersInput, useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGetPictures from '../../../hooks/get-pictures.hook';
import { FlatArchiveTag, FlatPicture } from '../../../types/additionalFlatTypes';
import { asApiPath } from '../../App';
import PicturePreview from '../../common/picture-gallery/PicturePreview';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import ArchiveInfo from './ArchiveInfo';

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
  const { data, loading, error } = useGetArchiveQuery({ variables: { archiveId } });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;
  const { data: picData } = useGetPictures(
    getPictureFilters([archive?.showcasePicture?.id ?? '-1']),
    false
  );
  console.log(picData);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const showcasePicture: FlatPicture | undefined =
    useSimplifiedQueryResponseData(picData)?.pictures[0];
  const src = archive?.logo?.formats?.thumbnail.url ?? '';
  // const { role } = useAuth();
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
            <div className='archive-info'>
              {archive && <ArchiveInfo archive={archive} />}
              {showcasePicture && (
                <div className='archive-showcase'>
                  <PicturePreview
                    picture={showcasePicture}
                    onClick={() => {
                      // navigateToPicture(picture.id);
                    }}
                    // adornments={pictureAdornments}
                    // viewOnly={viewOnly}
                  />
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
