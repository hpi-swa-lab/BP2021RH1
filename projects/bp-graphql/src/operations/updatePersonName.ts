import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagName',
  isAllowed: always,
  document: graphql`
    mutation updatePersonName($tagId: ID!, $name: String!) {
      updatePersonTag(id: $tagId, data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
