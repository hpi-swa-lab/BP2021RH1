import { Operation, graphql } from '../Operation.js';

export default {
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