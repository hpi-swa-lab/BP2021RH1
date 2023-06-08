import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query me {
      me {
        id
        username
        email
      }
    }
  `,
} satisfies Operation;
