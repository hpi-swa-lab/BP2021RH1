import React from 'react';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import useBulkOperations from '../../../hooks/bulk-operations.hook';

const LatestPicturesView = () => {
  const { moveToCollection } = useBulkOperations();

  return (
    <ScrollContainer>
      {(scrollPos: number, scrollHeight: number) => (
        <div>
          <h2>Neuste Bilder</h2>
          Hier sind die Bilder die zuletzt gescannt und hochgeladen wurden
          <PictureScrollGrid
            queryParams={{}}
            scrollPos={scrollPos}
            scrollHeight={scrollHeight}
            hashbase={'uploads'}
            bulkOperations={[moveToCollection]}
            sortBy={['publishedAt:desc']}
          />
        </div>
      )}
    </ScrollContainer>
  );
};

export default LatestPicturesView;
