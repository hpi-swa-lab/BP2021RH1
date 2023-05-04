import { Operation, graphql } from '../Operation.js';

export default {
  group: 'viewPicture',
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
