import React from 'react';
import { useGetCollectionInfoByNameQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollContainer from '../../common/ScrollContainer';
import { getPictureQueryParams } from './helpers/queryParams-helpers';
import { useGetShowcaseAdornments } from './helpers/showcaseAdornment-helpers';
import './ShowMoreView.scss';
import ShowMoreViewHeader from './ShowMoreViewHeader';

const ShowMoreView = ({
  archiveId,
  categoryType,
  categoryId,
}: {
  archiveId?: string;
  categoryType: string;
  categoryId?: string;
}) => {
  const { linkToCollection, moveToCollection, removeFromCollection, bulkEdit } =
    useBulkOperations();

  const showcaseAdornment = useGetShowcaseAdornments(archiveId);

  const { data, error } = useGetCollectionInfoByNameQuery({
    variables: {
      collectionName: categoryId ? categoryId : '',
    },
  });

  const collectionsInfo = useSimplifiedQueryResponseData(data);

  const { tagsWithThumbnailQuery } = useGenericTagEndpoints(categoryType as TagType);

  const tagInfo = tagsWithThumbnailQuery({
    variables: {
      filters:
        categoryType !== 'pictures'
          ? !archiveId
            ? { id: { eq: categoryId } }
            : {
                verified_pictures: { archive_tag: { id: { eq: archiveId } } },
                id: { eq: categoryId },
              }
          : { id: { eq: '-1' } },
      limit: 1,
    },
  });

  const flattened = useSimplifiedQueryResponseData(tagInfo.data);

  const flattenedTags: (FlatTag & { thumbnail: Thumbnail[] })[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

  if (error || tagInfo.error) {
    return <QueryErrorDisplay error={error ? error : tagInfo.error!} />;
  } else {
    return (
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='show-more-container'>
            <ShowMoreViewHeader
              archiveId={archiveId}
              categoryType={categoryType}
              categoryId={categoryId}
              collectionsInfo={collectionsInfo}
              flattenedTags={flattenedTags}
            />
            <PictureScrollGrid
              queryParams={getPictureQueryParams(
                categoryType,
                categoryId,
                archiveId,
                collectionsInfo
              )}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              sortBy={
                categoryType !== 'pictures' && categoryId
                  ? ['time_range_tag.start:asc']
                  : ['createdAt:desc']
              }
              hashbase={'show-more'}
              extraAdornments={showcaseAdornment ? [showcaseAdornment] : []}
              bulkOperations={[removeFromCollection, linkToCollection, moveToCollection, bulkEdit]}
            />
          </div>
        )}
      </ScrollContainer>
    );
  }
};

export default ShowMoreView;
