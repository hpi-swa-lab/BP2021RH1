import React from 'react';
import { PictureFiltersInput, useGetCollectionInfoByIdQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import CategoryCarousel from '../../common/CategoryCarousel';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import { useAuth } from '../../provider/AuthProvider';
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
  const { role } = useAuth();

  let categoryType2 = TagType.LOCATION;
  let headerName = '';
  let description = '';

  const { data, loading, error, fetchMore } = useGetCollectionInfoByIdQuery({
    variables: {
      collectionId: categoryId ? categoryId : '1',
    },
  });

  const collectionInfo = useSimplifiedQueryResponseData(data);

  switch (categoryType) {
    case 'date': {
      categoryType2 = TagType.TIME_RANGE;
      headerName = 'Jahrzehnte';
      description = 'Hier finden sie alle Bilder unseres Archivs aus bestimmten Jahrzehnten.';
      break;
    }
    case 'keyword': {
      categoryType2 = TagType.KEYWORD;
      headerName = 'Unsere Kategorien';
      description = 'Hier finden sie alle thematischen Kategorien unseres Archivs.';
      break;
    }
    case 'person': {
      categoryType2 = TagType.PERSON;
      headerName = 'Personen';
      description = 'Hier finden sie alle Personen in unserem Archiv.';
      break;
    }
    case 'location':
    default: {
      categoryType2 = TagType.LOCATION;
      headerName = 'Orte';
      description = 'Hier finden sie alle Orte in unserem Archiv.';
    }
  }

  const { tagsWithThumbnailQuery } = useGenericTagEndpoints(categoryType2);

  const tagInfo = tagsWithThumbnailQuery({
    variables: {
      filters:
        archiveId === '0'
          ? { id: { eq: categoryId } }
          : {
              verified_pictures: { archive_tag: { id: { eq: archiveId } } },
              id: { eq: categoryId },
            },
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
    switch (categoryType) {
      case 'date': {
        return archiveId === '0'
          ? decadeFilter
          : ({
              archive_tag: { id: { eq: archiveId } },
              and: decadeFilter,
            } as PictureFiltersInput);
      }
      case 'keyword': {
        return archiveId === '0'
          ? { verified_keyword_tags: { id: { eq: categoryId } } }
          : {
              archive_tag: { id: { eq: archiveId } },
              verified_keyword_tags: { id: { eq: categoryId } },
            };
      }
      case 'person': {
        return archiveId === '0'
          ? { verified_person_tags: { id: { eq: categoryId } } }
          : {
              archive_tag: { id: { eq: archiveId } },
              verified_person_tags: { id: { eq: categoryId } },
            };
      }
      case 'location':
      default: {
        return archiveId === '0'
          ? { verified_location_tags: { id: { eq: categoryId } } }
          : {
              archive_tag: { id: { eq: archiveId } },
              verified_location_tags: { id: { eq: categoryId } },
            };
      }
    }
  };

  if (categoryType === 'pictures') {
    if (categoryId) {
      return (
        <ScrollContainer>
          {(scrollPos: number, scrollHeight: number) => (
            <div className='show-more-container'>
              {collectionInfo && (
                <CollectionDescription
                  id={collectionInfo.collection.id}
                  description={collectionInfo.collection.description ?? ''}
                  name={collectionInfo.collection.name}
                />
              )}
              <PictureScrollGrid
                queryParams={
                  archiveId === '0'
                    ? { collections: { id: { eq: categoryId } } }
                    : {
                        archive_tag: { id: { eq: archiveId } },
                        collections: { id: { eq: categoryId } },
                      }
                }
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'show-more'}
                //uploadAreaProps={uploadAreaProps(collection)}
                /*bulkOperations={[
                    removeFromCollection,
                    linkToCollection,
                    moveToCollection,
                    bulkEdit,
                  ]}*/
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
              <h2>Unsere Bilder</h2>
              <div className='show-more-description'>
                Hier finden sie alle Bilder unseres Archivs.
              </div>
              <PictureScrollGrid
                queryParams={
                  archiveId === '0'
                    ? { id: { not: { eq: '-1' } } }
                    : { archive_tag: { id: { eq: archiveId } } }
                }
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'show-more'}
                //uploadAreaProps={uploadAreaProps(collection)}
                /*bulkOperations={[
                    removeFromCollection,
                    linkToCollection,
                    moveToCollection,
                    bulkEdit,
                  ]}*/
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
            {flattenedTags && (
              <h2>
                {categoryType === 'date'
                  ? categoryId === '4'
                    ? 'Früher'
                    : `19${categoryId}0er`
                  : flattenedTags[0].name}
              </h2>
            )}
            <PictureScrollGrid
              queryParams={categoryQueryParams()}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={'show-more'}
              //uploadAreaProps={uploadAreaProps(collection)}
              /*bulkOperations={[
                  removeFromCollection,
                  linkToCollection,
                  moveToCollection,
                  bulkEdit,
                ]}*/
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
            <h2>{headerName}</h2>
            <div className='show-more-description'>{description}</div>
            <CategoryCarousel
              type={categoryType2}
              queryParams={
                archiveId === '0'
                  ? { id: { not: { eq: '-1' } } }
                  : {
                      or: [
                        { verified_pictures: { archive_tag: { id: { eq: archiveId } } } },
                        { pictures: { archive_tag: { id: { eq: archiveId } } } },
                      ],
                    }
              }
              archiveId={archiveId}
            />
            <PictureScrollGrid
              queryParams={
                archiveId === '0'
                  ? { id: { not: { eq: '-1' } } }
                  : { archive_tag: { id: { eq: archiveId } } }
              }
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={'show-more'}
              //uploadAreaProps={uploadAreaProps(collection)}
              /*bulkOperations={[
                  removeFromCollection,
                  linkToCollection,
                  moveToCollection,
                  bulkEdit,
                ]}*/
            />
          </div>
        )}
      </ScrollContainer>
    );
  }
};

export default ShowMoreView;
