import { StrapiExtended } from '../../../types';
import { deepStringifyIds } from '../../helper';

export const getAllLocationTags = async (strapi: StrapiExtended) =>
  deepStringifyIds(
    await strapi.documents('api::location-tag.location-tag').findMany({
      fields: ['name', 'visible', 'root', 'accepted'],
      populate: ['coordinates', 'synonyms', 'parent_tags'],
    })
  );

export const getLocationTagsWithThumbnail = async (
  strapi: StrapiExtended,
  filters: any = {},
  thumbnailFilters: any = {},
  pagination: any,
  sortBy: string[]
) => {
  const { transformArgs } = strapi.plugin('graphql').service('builders').utils;

  const locationArgs = transformArgs(
    {
      filters,
      pagination,
      sort: sortBy,
    },
    {
      contentType: strapi.contentTypes['api::location-tag.location-tag'],
      usePagination: true,
    }
  );

  type WithPictures = { pictures?: { id: number }[]; verified_pictures?: { id: number }[] };
  const locationTags = (await strapi.documents('api::location-tag.location-tag').findMany({
    ...locationArgs,
    fields: ['name'],
    populate: {
      coordinates: true,
      child_tags: true,
      parent_tags: true,
      pictures: { filters: { deleted: false } },
      verified_pictures: { filters: { deleted: false } },
    },
  })) as WithPictures[];

  const { filters: transformedThumbnailFilters } = transformArgs(
    {
      filters: thumbnailFilters,
    },
    {
      contentType: strapi.contentTypes['api::picture.picture'],
    }
  );

  const thumbnails = await strapi.documents('api::picture.picture').findMany({
    filters: {
      $and: [
        {
          id: {
            $in: locationTags
              .flatMap(tag => [tag?.pictures?.[0], tag?.verified_pictures?.[0]])
              .map(picture => picture?.id)
              .filter(id => id),
          },
        },
        transformedThumbnailFilters,
      ],
    },
    populate: ['media' as 'createdBy'],
  });

  const thumbnailsById = Object.fromEntries(
    thumbnails.map(thumbnail => [thumbnail?.id, thumbnail])
  );

  const lookupThumbnail = (pictures?: unknown[]) => {
    const id = (pictures?.[0] as { id: number } | undefined)?.id;
    if (!id) {
      return [];
    }
    const thumbnail = thumbnailsById[id];
    if (!thumbnail) {
      return [];
    }
    return [thumbnail];
  };

  return locationTags.map(tag => ({
    ...tag,
    thumbnail: lookupThumbnail(tag?.pictures),
    verified_thumbnail: lookupThumbnail(tag?.verified_pictures),
  }));
};
