import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('exhibitionIdealotId'),
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
