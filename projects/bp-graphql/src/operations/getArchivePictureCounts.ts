import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'archive',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getArchivePictureCounts {
      archivePictureCounts {
        data {
          id
          attributes {
            count
          }
        }
      }
    }
  `,
} satisfies Operation;
