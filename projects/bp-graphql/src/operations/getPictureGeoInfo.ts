import { Operation, graphql } from '../Operation.js';

export default {
  group: 'geo',
  document: graphql`
    query getPictureGeoInfo($pictureId: ID!) {
      pictureGeoInfos(filters: { picture: { id: { eq: $pictureId } } }) {
        data {
          id
          attributes {
            latitude
            longitude
            radius
          }
        }
      }
    }
  `,
} satisfies Operation;
