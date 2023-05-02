import { Operation, graphql } from '../Operation.js';

export default {
  group: 'mergeTags',
  document: graphql`
    mutation mergePersonTags($targetId: ID!, $sourceId: ID!) {
      mergePersonTags(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
