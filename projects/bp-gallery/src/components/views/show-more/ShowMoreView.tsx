import { Star } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  PictureFiltersInput,
  useGetArchiveQuery,
  useGetCollectionInfoByNameQuery,
  useUpdateArchiveMutation,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useBulkOperations from '../../../hooks/bulk-operations.hook';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import {
  FlatArchiveTag,
  FlatPicture,
  FlatTag,
  TagType,
  Thumbnail,
} from '../../../types/additionalFlatTypes';
import CategoryCarousel from '../../common/CategoryCarousel';
import { PicturePreviewAdornment } from '../../common/picture-gallery/PicturePreview';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollContainer from '../../common/ScrollContainer';
import CollectionDescription from '../browse/CollectionDescription';
import { buildDecadeFilter } from '../search/helpers/search-filters';
import './ShowMoreView.scss';

const ShowMoreView = ({
  archiveId,
  categoryType,
  categoryId,
}: {
  archiveId: string;
  categoryType: string;
  categoryId?: string;
}) => {
  const { t } = useTranslation();

  const getShowMoreHeader = () => t('show-more.' + categoryType + '-title');
  const getShowMoreText = () => t('show-more.' + categoryType + '-text');

  const { linkToCollection, moveToCollection, removeFromCollection, bulkEdit } =
    useBulkOperations();

  const archiveQueryResult = useGetArchiveQuery({ variables: { archiveId } });

  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(
    archiveQueryResult.data
  )?.archiveTag;

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });

  const showcaseAdornment: PicturePreviewAdornment = {
    position: 'top-left',
    icon: picture =>
      picture.id === archive?.showcasePicture?.id ? <Star className='star-selected' /> : <Star />,
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

  const { data, loading, error, fetchMore } = useGetCollectionInfoByNameQuery({
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
          ? archiveId === '0'
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

  const decadeFilter: PictureFiltersInput =
    categoryType === 'date' && categoryId ? buildDecadeFilter(categoryId) ?? {} : {};

  const categoryQueryParams = () => {
    let queryFilter;
    switch (categoryType) {
      case 'date': {
        queryFilter = decadeFilter;
        break;
      }
      case 'keyword': {
        queryFilter = {
          or: [
            { verified_keyword_tags: { id: { eq: categoryId } } },
            { keyword_tags: { id: { eq: categoryId } } },
          ],
        };
        break;
      }
      case 'person': {
        queryFilter = {
          or: [
            { verified_person_tags: { id: { eq: categoryId } } },
            { person_tags: { id: { eq: categoryId } } },
          ],
        };
        break;
      }
      case 'location':
      default:
        queryFilter = {
          or: [
            { verified_location_tags: { id: { eq: categoryId } } },
            { location_tags: { id: { eq: categoryId } } },
          ],
        };
        break;
    }

    return archiveId === '0'
      ? queryFilter
      : ({
          archive_tag: { id: { eq: archiveId } },
          and: queryFilter,
        } as PictureFiltersInput);
  };

  if (error || tagInfo.error) {
    return <QueryErrorDisplay error={error ? error : tagInfo.error!} />;
  } else if (categoryType === 'pictures') {
    if (categoryId && collectionsInfo && collectionsInfo.collections.length > 0) {
      return (
        <ScrollContainer>
          {(scrollPos: number, scrollHeight: number) => (
            <div className='show-more-container'>
              <CollectionDescription
                id={collectionsInfo.collections[0].id}
                description={collectionsInfo.collections[0].description ?? ''}
                name={collectionsInfo.collections[0].name}
              />
              <PictureScrollGrid
                queryParams={
                  archiveId === '0'
                    ? { collections: { name: { eq: categoryId } } }
                    : {
                        archive_tag: { id: { eq: archiveId } },
                        collections: { name: { eq: categoryId } },
                      }
                }
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'show-more'}
                extraAdornments={archiveId !== '0' ? [showcaseAdornment] : []}
                bulkOperations={[
                  removeFromCollection,
                  linkToCollection,
                  moveToCollection,
                  bulkEdit,
                ]}
              />
            </div>
          )}
        </ScrollContainer>
      );
    } else {
      return (
        <ScrollContainer>
          {(scrollPos: number, scrollHeight: number) => (
            <div className='show-more-container'>
              <h2>{getShowMoreHeader()}</h2>
              <div className='show-more-description'>{getShowMoreText()}</div>
              <PictureScrollGrid
                queryParams={
                  archiveId === '0'
                    ? { id: { not: { eq: '-1' } } } // make sure all images get fetched
                    : { archive_tag: { id: { eq: archiveId } } }
                }
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'show-more'}
                extraAdornments={archiveId !== '0' ? [showcaseAdornment] : []}
                bulkOperations={[
                  removeFromCollection,
                  linkToCollection,
                  moveToCollection,
                  bulkEdit,
                ]}
              />
            </div>
          )}
        </ScrollContainer>
      );
    }
  } else if (categoryId) {
    return (
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='show-more-container'>
            {flattenedTags && (categoryType === 'date' || flattenedTags.length > 0) && (
              <h2>
                {categoryType === 'date'
                  ? categoryId === '4'
                    ? t('common.past')
                    : t('show-more.x0s', { decade: categoryId })
                  : flattenedTags[0].name}
              </h2>
            )}
            <PictureScrollGrid
              queryParams={categoryQueryParams()}
              sortBy={['time_range_tag.start:asc']}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={'show-more'}
              extraAdornments={archiveId !== '0' ? [showcaseAdornment] : []}
              bulkOperations={[removeFromCollection, linkToCollection, moveToCollection, bulkEdit]}
            />
          </div>
        )}
      </ScrollContainer>
    );
  } else {
    return (
      <ScrollContainer>
        {(scrollPos: number, scrollHeight: number) => (
          <div className='show-more-container'>
            <h2>{getShowMoreHeader()}</h2>
            <div className='show-more-description'>{getShowMoreText()}</div>
            <CategoryCarousel
              type={categoryType as TagType}
              queryParams={
                archiveId === '0'
                  ? {
                      and: [
                        { verified_pictures: { id: { not: { eq: '-1' } } } },
                        { visible: { eq: true } },
                        { id: { not: { eq: '-1' } } },
                      ],
                    }
                  : {
                      and: [
                        { visible: { eq: true } },
                        {
                          or: [
                            { verified_pictures: { archive_tag: { id: { eq: archiveId } } } },
                            { pictures: { archive_tag: { id: { eq: archiveId } } } },
                          ],
                        },
                      ],
                    }
              }
              archiveId={archiveId}
            />
            <PictureScrollGrid
              queryParams={
                archiveId === '0'
                  ? { id: { not: { eq: '-1' } } } // make sure all images get fetched
                  : { archive_tag: { id: { eq: archiveId } } }
              }
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={'show-more'}
              extraAdornments={archiveId !== '0' ? [showcaseAdornment] : []}
              bulkOperations={[removeFromCollection, linkToCollection, moveToCollection, bulkEdit]}
            />
          </div>
        )}
      </ScrollContainer>
    );
  }
};

export default ShowMoreView;
