import { Operation, graphql } from '../Operation.js';

export default {
  section: 'collection',
  document: graphql`
    mutation mergeCollections($targetId: ID!, $sourceId: ID!) {
      mergeCollections(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
