import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'geo',
  isAllowed: always,
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
