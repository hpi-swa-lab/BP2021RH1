import { Operation, graphql } from '../Operation.js';
import { checkExhibitionPicture } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibitionPicture('id'),
  document: graphql`
    mutation updateExhibitionPicture($id: ID!, $data: ExhibitionPictureInput!) {
      updateExhibitionPicture(id: $id, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
