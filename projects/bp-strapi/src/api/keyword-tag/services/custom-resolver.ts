import { StrapiExtended } from '../../../types';
import { deepStringifyIds } from '../../helper';

export const getAllKeywordTags = async (strapi: StrapiExtended) =>
  deepStringifyIds(
    await strapi.documents('api::keyword-tag.keyword-tag').findMany({
      fields: ['name', 'visible'],
      populate: ['synonyms'],
    })
  );
