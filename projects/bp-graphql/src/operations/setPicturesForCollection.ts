import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'collection',
  needsParameters: [],
  isAllowed: always,
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
