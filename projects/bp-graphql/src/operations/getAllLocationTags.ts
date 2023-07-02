import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getAllTags',
  isAllowed: always,
  document: graphql`
    query getAllLocationTags {
      getAllLocationTags
    }
  `,
} satisfies Operation;
