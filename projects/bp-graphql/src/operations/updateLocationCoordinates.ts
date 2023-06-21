import { Operation, graphql } from '../Operation.js';

export default {
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
