import { StrapiExtended } from '../../../types';
import { deepStringifyIds } from '../../helper';

export const getAllPersonTags = async (strapi: StrapiExtended) =>
  deepStringifyIds(
    await strapi.entityService.findMany('api::person-tag.person-tag', {
      fields: ['name'],
      populate: ['synonyms'],
    })
  );
