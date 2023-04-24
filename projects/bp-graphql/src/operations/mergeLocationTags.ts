import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation mergeLocationTags($targetId: ID!, $sourceId: ID!) {
      mergeLocationTags(targetId: $targetId, sourceId: $sourceId)
    }
  `,
} satisfies Operation;
