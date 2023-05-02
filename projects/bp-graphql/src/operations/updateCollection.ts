import { Operation, graphql } from '../Operation.js';

export default {
  section: 'collection',
  document: graphql`
    mutation updateCollection($collectionId: ID!, $data: CollectionInput!) {
      updateCollection(id: $collectionId, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
