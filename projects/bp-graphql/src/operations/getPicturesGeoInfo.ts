import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getPicturesGeoInfo($pictureIds: [ID]!) {
      pictureGeoInfos(filters: { picture: { id: { in: $pictureIds } } }) {
        data {
          id
          attributes {
            latitude
            longitude
          }
        }
      }
    }
  `,
} satisfies Operation;
