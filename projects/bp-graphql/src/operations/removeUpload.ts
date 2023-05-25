import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'createPicture',
  isAllowed: always,
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
