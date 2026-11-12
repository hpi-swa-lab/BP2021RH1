import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getAllPictureIds {
      pictures: pictures_connection {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
