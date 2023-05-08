import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'picture',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getAllPicturesByArchive {
      archiveTags {
        data {
          id
          attributes {
            pictures {
              data {
                id
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
