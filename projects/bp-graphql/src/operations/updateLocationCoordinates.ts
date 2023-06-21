import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateLocationCoordinates($tagId: ID!, $lat: Float!, $lng: Float!) {
      updateLocationTag(id: $tagId, data: { coordinates: { latitude: $lat, longitude: $lng } }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
