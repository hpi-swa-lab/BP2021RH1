import { Operation, graphql } from '../Operation.js';
import { checkExhibitionSource } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibitionSource('id'),
  document: graphql`
    mutation updateExhibitionSource($id: ID!, $source: String!) {
      updateExhibitionSource(id: $id, data: { source: $source }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
