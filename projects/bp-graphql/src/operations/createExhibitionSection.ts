import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('exhibitionId'),
  document: graphql`
    mutation createExhibitionSection($exhibitionId: ID!, $order: Int) {
      createExhibitionSection(data: { exhibition: $exhibitionId, order: $order }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
