import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'createTag',
  isAllowed: always,
  document: graphql`
    mutation createKeywordTag($name: String!) {
      createKeywordTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
