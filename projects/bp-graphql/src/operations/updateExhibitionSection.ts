import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateExhibitionSection(
      $id: ID!
      $title: String!
      $text: String!
      $exhibitionPictureIds: [ID!]
    ) {
      updateExhibitionSection(
        id: $id
        data: { title: $title, text: $text, exhibition_pictures: $exhibitionPictureIds }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
