import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'archive',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation createArchiveTag($name: String!) {
      createArchiveTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
