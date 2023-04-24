import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation createSubCollection($name: String!, $parentId: ID!, $publishedAt: DateTime!) {
      createCollection(
        data: { name: $name, parent_collections: [$parentId], publishedAt: $publishedAt }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
