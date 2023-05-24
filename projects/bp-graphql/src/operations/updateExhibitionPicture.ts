import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateExhibitionPicture($id: ID!, $data: ExhibitionPictureInput!) {
      updateExhibitionPicture(id: $id, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
