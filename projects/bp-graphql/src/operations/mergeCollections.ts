import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation mergeCollections($targetId: ID!, $sourceId: ID!) {
      mergeCollections(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
