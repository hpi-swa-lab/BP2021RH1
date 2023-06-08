import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getAllPictureIds {
      pictures {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
