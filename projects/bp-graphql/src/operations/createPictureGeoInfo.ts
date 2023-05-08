import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'geo',
  isAllowed: always, // geo picks pictures across all archives
  document: graphql`
    mutation createPictureGeoInfo($data: PictureGeoInfoInput!) {
      createPictureGeoInfo(data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
