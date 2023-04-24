import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation createArchiveTag($name: String!) {
      createArchiveTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
