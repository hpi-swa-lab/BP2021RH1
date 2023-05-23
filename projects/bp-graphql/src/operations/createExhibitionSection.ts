import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibitionSection($exhibitionId: ID!) {
      createExhibitionSection(data: { exhibition: $exhibitionId }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
