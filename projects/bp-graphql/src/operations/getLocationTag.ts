import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getLocationTag($id: ID!) {
      locationTag(id: $id) {
        data {
          attributes {
            name
          }
        }
      }
    }
  `,
} satisfies Operation;
