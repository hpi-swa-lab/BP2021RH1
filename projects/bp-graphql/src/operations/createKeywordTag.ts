import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createKeywordTag($name: String!) {
      createKeywordTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
