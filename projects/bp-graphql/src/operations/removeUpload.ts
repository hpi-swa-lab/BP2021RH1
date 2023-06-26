import { Operation, graphql } from '../Operation.js';
import { checkUpload } from '../isAllowedHelpers.js';

export default {
  group: 'createPicture',
  isAllowed: checkUpload('id'),
  document: graphql`
    mutation removeUpload($id: ID!) {
      removeFile(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
