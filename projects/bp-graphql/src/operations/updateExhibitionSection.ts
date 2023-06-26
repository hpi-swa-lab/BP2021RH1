import { Operation, graphql } from '../Operation.js';
import { checkExhibitionSection } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibitionSection('id'),
  document: graphql`
    mutation updateExhibitionSection(
      $id: ID!
      $title: String
      $text: String
      $order: Int
      $exhibitionPictureIds: [ID]
    ) {
      updateExhibitionSection(
        id: $id
        data: {
          title: $title
          text: $text
          exhibition_pictures: $exhibitionPictureIds
          order: $order
        }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
