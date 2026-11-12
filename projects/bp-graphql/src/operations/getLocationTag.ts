import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getLocationTag($id: ID!) {
      locationTag(documentId: $id) {
        data {
          attributes {
            name
          }
        }
      }
    }
  `,
} satisfies Operation;
