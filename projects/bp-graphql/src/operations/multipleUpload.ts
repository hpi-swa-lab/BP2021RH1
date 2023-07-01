import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'createPicture',
  isAllowed: always,
  document: graphql`
    mutation multipleUpload($files: [Upload!]!) {
      multipleUpload(files: $files) {
        data {
          id
          attributes {
            ext
          }
        }
      }
    }
  `,
} satisfies Operation;
