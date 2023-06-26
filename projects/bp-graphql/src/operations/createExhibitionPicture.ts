import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibitionPicture(
      $exhibitionIdealotId: ID!
      $pictureId: ID!
      $publishedAt: DateTime!
    ) {
      createExhibitionPicture(
        data: {
          exhibition_idealot: $exhibitionIdealotId
          picture: $pictureId
          publishedAt: $publishedAt
        }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
