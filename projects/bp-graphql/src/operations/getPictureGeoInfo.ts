import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
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
