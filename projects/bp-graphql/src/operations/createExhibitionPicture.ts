import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('exhibitionIdealotId'),
  document: graphql`
    mutation createExhibitionPicture($exhibitionIdealotId: ID!, $pictureId: ID!) {
      createExhibitionPicture(
        data: { exhibition_idealot: $exhibitionIdealotId, picture: $pictureId }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
