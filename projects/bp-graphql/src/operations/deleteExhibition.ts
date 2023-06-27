import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('id'),
  document: graphql`
    mutation deleteExhibition($id: ID!) {
      deleteExhibition(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
