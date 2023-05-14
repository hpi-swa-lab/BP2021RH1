import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation mergeKeywordTags($targetId: ID!, $sourceId: ID!) {
      mergeKeywordTags(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
