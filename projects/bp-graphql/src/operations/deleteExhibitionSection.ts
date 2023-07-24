import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('id'),
  document: graphql`
    mutation deleteExhibitionSection($id: ID!) {
      deleteExhibitionSection(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
