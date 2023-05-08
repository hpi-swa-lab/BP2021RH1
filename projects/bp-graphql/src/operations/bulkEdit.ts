import { Operation, graphql } from '../Operation.js';
import { checkMultiplePictures } from '../isAllowedHelpers.js';

export default {
  group: 'editPicture',
  isAllowed: checkMultiplePictures('pictureIds'),
  document: graphql`
    mutation bulkEdit($pictureIds: [ID!]!, $data: JSON!) {
      doBulkEdit(ids: $pictureIds, data: $data)
    }
  `,
} satisfies Operation;
