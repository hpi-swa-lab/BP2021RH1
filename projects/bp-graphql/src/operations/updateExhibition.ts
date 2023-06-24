import { Operation, graphql } from '../Operation.js';
//$title: String!, $text: String!, $titlePicture: ID!, $exhibition_sections: [ID!], $epilog: String!, $exhibition
//{ title: $title, text: $text, title_picture: $titlePicture, exhbition_sections: $exhibition_sections, epilog: $epilog }
export default {
  document: graphql`
    mutation updateExhibition($id: ID!, $data: ExhibitionInput!) {
      updateExhibition(id: $id, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
