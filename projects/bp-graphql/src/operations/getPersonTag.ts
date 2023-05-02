import { Operation, graphql } from '../Operation.js';

export default {
  group: 'editFaceTags',
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
