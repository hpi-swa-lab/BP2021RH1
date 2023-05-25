import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibitionSection($exhibitionId: ID!, $publishedAt: DateTime!) {
      createExhibitionSection(data: { exhibition: $exhibitionId, publishedAt: $publishedAt }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
