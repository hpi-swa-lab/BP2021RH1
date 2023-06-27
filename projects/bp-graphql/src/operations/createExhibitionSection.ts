import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('exhibitionId'),
  document: graphql`
    mutation createExhibitionSection($exhibitionId: ID!, $order: Int, $publishedAt: DateTime!) {
      createExhibitionSection(
        data: { exhibition: $exhibitionId, order: $order, publishedAt: $publishedAt }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
