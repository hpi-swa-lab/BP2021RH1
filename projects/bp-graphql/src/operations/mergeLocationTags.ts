import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'mergeTags',
  isAllowed: always,
  document: graphql`
    mutation mergeLocationTags($targetId: ID!, $sourceId: ID!) {
      mergeLocationTags(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
