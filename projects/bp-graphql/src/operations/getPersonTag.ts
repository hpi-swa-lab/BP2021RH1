import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    query getPersonTag($id: ID!) {
      personTag(id: $id) {
        data {
          attributes {
            name
          }
        }
      }
    }
  `,
} satisfies Operation;
