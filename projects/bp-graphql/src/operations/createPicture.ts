import { Operation, graphql } from '../Operation.js';

export default {
  section: 'picture',
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
