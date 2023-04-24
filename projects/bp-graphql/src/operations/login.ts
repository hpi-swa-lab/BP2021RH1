import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation login($username: String!, $password: String!) {
      login(input: { identifier: $username, password: $password }) {
        jwt
      }
    }
  `,
} satisfies Operation;
