import { StrapiExtended } from '../../../types';
import { deepStringifyIds } from '../../helper';

export const getAllPersonTags = async (strapi: StrapiExtended) =>
  deepStringifyIds(
    await strapi.documents('api::person-tag.person-tag').findMany({
      fields: ['name'],
      populate: ['synonyms'],
    })
  );
