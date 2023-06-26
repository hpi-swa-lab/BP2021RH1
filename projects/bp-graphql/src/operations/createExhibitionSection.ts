import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibitionSection($exhibitionId: ID!, $order: Int, $publishedAt: DateTime!) {
      createExhibitionSection(
        data: { exhibition: $exhibitionId, order: $order, publishedAt: $publishedAt }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
