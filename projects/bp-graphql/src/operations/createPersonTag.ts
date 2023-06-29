import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'createTag',
  isAllowed: always,
  document: graphql`
    mutation createPersonTag($name: String!) {
      createPersonTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
