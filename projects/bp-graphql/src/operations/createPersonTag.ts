import { Operation, graphql } from '../Operation.js';

export default {
  group: 'createTag',
  document: graphql`
    mutation createPersonTag($name: String!) {
      createPersonTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
