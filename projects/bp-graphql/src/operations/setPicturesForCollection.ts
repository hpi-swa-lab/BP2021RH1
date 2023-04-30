import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation setPicturesForCollection($pictureIds: [ID]!, $collectionId: ID!) {
      updateCollection(id: $collectionId, data: { pictures: $pictureIds }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
