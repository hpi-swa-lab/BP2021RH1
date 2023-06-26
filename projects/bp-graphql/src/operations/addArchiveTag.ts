import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'archive',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation addArchiveTag($name: String!) {
      addArchiveTag(name: $name)
    }
  `,
} satisfies Operation;
