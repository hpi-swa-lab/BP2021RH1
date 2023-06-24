import { Operation, graphql } from '../Operation.js';

export default {
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
