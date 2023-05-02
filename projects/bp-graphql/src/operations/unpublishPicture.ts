import { Operation, graphql } from '../Operation.js';

export default {
  section: 'picture',
  document: graphql`
    mutation unpublishPicture($id: ID!) {
      updatePicture(id: $id, data: { publishedAt: null }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
