import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'locations',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation updateLocationCoordinates(
      $tagId: ID!
      $coordinate: ComponentLocationCoordinatesInput
    ) {
      updateLocationTag(id: $tagId, data: { coordinates: $coordinate }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
