import { Operation, graphql } from '../Operation.js';

export default {
  group: 'createTag',
  document: graphql`
    mutation createLocationTag($name: String!) {
      createLocationTag(data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
