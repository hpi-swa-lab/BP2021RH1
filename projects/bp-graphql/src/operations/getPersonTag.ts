import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'viewPicture',
  isAllowed: always,
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
