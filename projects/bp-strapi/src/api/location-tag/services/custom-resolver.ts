import { StrapiExtended } from '../../../types';
import { deepStringifyIds } from '../../helper';

export const getAllLocationTags = async (strapi: StrapiExtended) =>
  deepStringifyIds(
    await strapi.entityService.findMany('api::location-tag.location-tag', {
      fields: ['name', 'visible', 'root', 'accepted'],
      populate: ['coordinates', 'synonyms', 'parent_tags'],
    })
  );
