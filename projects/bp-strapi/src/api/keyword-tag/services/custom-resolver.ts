import { StrapiExtended } from '../../../types';
import { deepStringifyIds } from '../../helper';

export const getAllKeywordTags = async (strapi: StrapiExtended) =>
  deepStringifyIds(
    await strapi.entityService.findMany('api::keyword-tag.keyword-tag', {
      fields: ['name', 'visible'],
      populate: ['synonyms'],
    })
  );
