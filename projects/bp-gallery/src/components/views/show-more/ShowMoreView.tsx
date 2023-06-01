import { useContext } from 'react';
import { useGetCollectionInfoByNameQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import { ShowStats } from '../../provider/ShowStatsProvider';
import { getPictureQueryParams } from './helpers/queryParams-helpers';
import { useGetShowcaseAdornments } from './helpers/showcaseAdornment-helpers';
import './ShowMoreView.scss';
import ShowMoreViewHeader from './ShowMoreViewHeader';
import { ExhibitionIdContext } from '../../provider/ExhibitionProvider';

const ShowMoreView = ({
  archiveId,
  categoryType,
  categoryId,
}: {
  archiveId?: string;
  categoryType: string;
  categoryId?: string;
}) => {
  const { linkToCollection, moveToCollection, removeFromCollection, bulkEdit, addToExhibition } =
    useBulkOperations();

  const exhibitionId = useContext(ExhibitionIdContext);

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
        categoryType !== 'pictures' && categoryType !== 'latest'
          ? !archiveId
            ? { id: { eq: categoryId } }
            : {
                verified_pictures: { archive_tag: { id: { eq: archiveId } } },
                id: { eq: categoryId },
              }
          : { id: { eq: '-1' } },
      pagination: {
        start: 0,
        limit: 1,
      },
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
      <div className='show-more-container'>
        <ShowMoreViewHeader
          archiveId={archiveId}
          categoryType={categoryType}
          categoryId={categoryId}
          collectionsInfo={collectionsInfo}
          flattenedTags={flattenedTags}
        />
        <ShowStats>
          <PictureScrollGrid
            queryParams={getPictureQueryParams(
              categoryType,
              categoryId,
              archiveId,
              collectionsInfo
            )}
            sortBy={
              categoryType !== 'pictures' && categoryId
                ? ['time_range_tag.start:asc']
                : categoryType === 'most-liked'
                ? ['likes:desc']
                : ['createdAt:desc']
            }
            hashbase={'show-more'}
            extraAdornments={showcaseAdornment ? [showcaseAdornment] : []}
            bulkOperations={[removeFromCollection, linkToCollection, moveToCollection, bulkEdit]}
            maxNumPictures={
              categoryType === 'latest' || categoryType === 'most-liked' ? 500 : undefined
            }
            fetchPolicy='cache-and-network'
          />
        </ShowStats>
      </div>
    );
  }
};

export default ShowMoreView;
