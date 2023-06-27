import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'mergeTags',
  isAllowed: always,
  document: graphql`
    mutation mergeKeywordTags($targetId: ID!, $sourceId: ID!) {
      mergeKeywordTags(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
