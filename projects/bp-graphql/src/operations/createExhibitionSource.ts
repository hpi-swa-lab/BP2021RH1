import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('exhibitionId'),
  document: graphql`
    mutation createExhibitionSource($exhibitionId: ID!, $publishedAt: DateTime!) {
      createExhibitionSource(data: { exhibition: $exhibitionId, publishedAt: $publishedAt }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
