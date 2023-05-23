import { PictureFiltersInput } from '../../../../graphql/APIConnector';
import { TagType } from '../../../../types/additionalFlatTypes';
import { buildDecadeFilter } from '../../search/helpers/search-filters';

const categoryQueryParams = (
  categoryType: string,
  categoryId: string | undefined,
  archiveId: string | undefined
) => {
  let queryFilter;
  switch (categoryType) {
    case TagType.TIME_RANGE: {
      queryFilter = categoryId ? buildDecadeFilter(categoryId) ?? {} : {};
      break;
    }
    case TagType.KEYWORD: {
      queryFilter = {
        or: [
          { verified_keyword_tags: { id: { eq: categoryId } } },
          { keyword_tags: { id: { eq: categoryId } } },
        ],
      };
      break;
    }
    case TagType.PERSON: {
      queryFilter = {
        or: [
          { verified_person_tags: { id: { eq: categoryId } } },
          { person_tags: { id: { eq: categoryId } } },
        ],
      };
      break;
    }
    case TagType.LOCATION:
    default:
      queryFilter = {
        or: [
          { verified_location_tags: { id: { eq: categoryId } } },
          { location_tags: { id: { eq: categoryId } } },
        ],
      };
      break;
  }

  return !archiveId
    ? queryFilter
    : ({
        archive_tag: { id: { eq: archiveId } },
        and: queryFilter,
      } as PictureFiltersInput);
};

export const getPictureQueryParams = (
  categoryType: string,
  categoryId: string | undefined,
  archiveId: string | undefined,
  collectionsInfo:
    | {
        [key: string]: any;
      }
    | undefined
) => {
  if (categoryType === 'pictures') {
    if (categoryId && collectionsInfo && collectionsInfo.collections.length > 0) {
      return !archiveId
        ? { collections: { name: { eq: categoryId } }, id: { not: { eq: '-1' } } }
        : {
            archive_tag: { id: { eq: archiveId } },
            collections: { name: { eq: categoryId } },
            id: { not: { eq: '-1' } },
          };
    } else {
      return !archiveId
        ? { id: { not: { eq: '-1' } } } // make sure all images get fetched
        : { archive_tag: { id: { eq: archiveId } }, id: { not: { eq: '-1' } } };
    }
  } else if (categoryId) {
    return categoryQueryParams(categoryType, categoryId, archiveId);
  } else {
    return !archiveId
      ? { id: { not: { eq: '-1' } } } // make sure all images get fetched
      : { archive_tag: { id: { eq: archiveId } }, id: { not: { eq: '-1' } } };
  }
};

export const getCategoryQueryParams = (archiveId: string | undefined) => {
  return !archiveId
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

export const getChildLocationsQueryParams = (
  archiveId: string | undefined,
  categoryId: string,
  categoryType: string
) => {
  return !archiveId
    ? {
        and: [
          { verified_pictures: { id: { not: { eq: '-1' } } } },
          { parent_tags: { id: { eq: categoryId } } },
          { id: { not: { eq: '-1' } } },
        ],
      }
    : {
        and: [
          { parent_tags: { id: { eq: categoryId } } },
          {
            or: [
              { verified_pictures: { archive_tag: { id: { eq: archiveId } } } },
              { pictures: { archive_tag: { id: { eq: archiveId } } } },
            ],
          },
        ],
      };
};
