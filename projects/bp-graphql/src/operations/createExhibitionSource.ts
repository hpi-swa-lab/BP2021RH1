import { Operation, graphql } from '../Operation.js';

export default {
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
