import { PictureFiltersInput } from '../../../../graphql/APIConnector';
import { buildDecadeFilter } from '../../search/helpers/search-filters';

const categoryQueryParams = (
  categoryType: string,
  categoryId: string | undefined,
  archiveId: string
) => {
  let queryFilter;
  switch (categoryType) {
    case 'date': {
      queryFilter = categoryId ? buildDecadeFilter(categoryId) ?? {} : {};
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

export const getPictureQueryParams = (
  categoryType: string,
  categoryId: string | undefined,
  archiveId: string,
  collectionsInfo:
    | {
        [key: string]: any;
      }
    | undefined
) => {
  if (categoryType === 'pictures') {
    if (categoryId && collectionsInfo && collectionsInfo.collections.length > 0) {
      return archiveId === '0'
        ? { collections: { name: { eq: categoryId } } }
        : {
            archive_tag: { id: { eq: archiveId } },
            collections: { name: { eq: categoryId } },
          };
    } else {
      return archiveId === '0'
        ? { id: { not: { eq: '-1' } } } // make sure all images get fetched
        : { archive_tag: { id: { eq: archiveId } } };
    }
  } else if (categoryId) {
    return categoryQueryParams(categoryType, categoryId, archiveId);
  } else {
    return archiveId === '0'
      ? { id: { not: { eq: '-1' } } } // make sure all images get fetched
      : { archive_tag: { id: { eq: archiveId } } };
  }
};

export const getCategoryQueryParams = (archiveId: string) => {
  return archiveId === '0'
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
      };
};
