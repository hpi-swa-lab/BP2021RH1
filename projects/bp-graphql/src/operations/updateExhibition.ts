import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('id'),
  document: graphql`
    mutation updateExhibition($id: ID!, $data: ExhibitionInput!) {
      updateExhibition(id: $id, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
