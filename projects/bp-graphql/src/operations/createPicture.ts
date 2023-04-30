import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createPicture($data: PictureInput!) {
      createPicture(data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
