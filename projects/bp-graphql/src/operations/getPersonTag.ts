import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPersonTag($id: ID!) {
      personTag(id: $id) {
        data {
          attributes {
            name
          }
        }
      }
    }
  `,
} satisfies Operation;
