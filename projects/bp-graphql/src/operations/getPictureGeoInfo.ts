import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'geo',
  isAllowed: always, // geo picks pictures across all archives
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
