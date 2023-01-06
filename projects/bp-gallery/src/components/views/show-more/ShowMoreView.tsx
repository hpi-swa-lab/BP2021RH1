import React from 'react';
import { useGetCollectionInfoByIdQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType, Thumbnail } from '../../../types/additionalFlatTypes';
import CategoryCarousel from '../../common/CategoryCarousel';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../common/ScrollContainer';
import { useAuth } from '../../provider/AuthProvider';
import CollectionDescription from '../browse/CollectionDescription';
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
      filters: {
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
  if (flattenedTags) {
    console.log(flattenedTags[0].name);
  }

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
                queryParams={{
                  archive_tag: { id: { eq: archiveId } },
                  collections: { id: { eq: categoryId } },
                }}
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
                queryParams={{
                  archive_tag: { id: { eq: archiveId } },
                }}
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
            {flattenedTags && <h2>{flattenedTags[0].name}</h2>}
            <PictureScrollGrid
              queryParams={{
                archive_tag: { id: { eq: archiveId } },
                verified_location_tags: { id: { eq: categoryId } },
              }}
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
              queryParams={{
                or: [
                  { verified_pictures: { archive_tag: { id: { eq: archiveId } } } },
                  { pictures: { archive_tag: { id: { eq: archiveId } } } },
                ],
              }}
              archiveId={archiveId}
            />
            <PictureScrollGrid
              queryParams={{ archive_tag: { id: { eq: archiveId } } }}
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
