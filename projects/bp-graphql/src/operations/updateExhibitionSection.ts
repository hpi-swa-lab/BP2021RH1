import { Operation, graphql } from '../Operation.js';

export default {
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
