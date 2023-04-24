import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    query me {
      me {
        role {
          name
        }
        username
        email
      }
    }
  `,
} satisfies Operation;
