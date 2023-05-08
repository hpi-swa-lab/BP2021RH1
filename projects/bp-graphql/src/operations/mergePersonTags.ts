import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'mergeTags',
  isAllowed: always,
  document: graphql`
    mutation mergePersonTags($targetId: ID!, $sourceId: ID!) {
      mergePersonTags(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
