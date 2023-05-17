import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibitionSource($source: String!) {
      createExhibitionSource(data: { source: $source }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
