import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'collection',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation mergeCollections($targetId: ID!, $sourceId: ID!) {
      mergeCollections(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
