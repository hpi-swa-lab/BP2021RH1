import React from 'react';
import { PictureFiltersInput, useGetArchiveQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
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
  // const { role } = useAuth();
  console.log(data);
  console.log(archive);

  // const { linkToCollection, moveToCollection, removeFromCollection, bulkEdit } = useBulkOperations(
  //   collections?.[0]
  // );

  return (
    <div className='archive-container'>
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='collection-picture-display'>
            {archive && <ArchiveInfo archive={archive} />}
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
