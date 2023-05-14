import { Operation, graphql } from '../Operation.js';

export default {
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
