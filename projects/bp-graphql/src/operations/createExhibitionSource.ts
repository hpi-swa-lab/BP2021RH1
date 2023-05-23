import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibitionSource($exhibitionId: ID!) {
      createExhibitionSource(data: { exhibition: $exhibitionId }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
