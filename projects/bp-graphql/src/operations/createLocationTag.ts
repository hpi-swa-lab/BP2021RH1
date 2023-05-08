import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'createTag',
  isAllowed: always,
  document: graphql`
    mutation createLocationTag($name: String!) {
      createLocationTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
