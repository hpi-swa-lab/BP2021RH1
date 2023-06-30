import { StrapiExtended } from '../../../types';

export const getAllLocationTags = (strapi: StrapiExtended) =>
  strapi.entityService.findMany('api::location-tag.location-tag', {
    fields: ['name', 'visible', 'root', 'accepted'],
    populate: ['coordinates', 'synonyms', 'parent_tags'],
  });
