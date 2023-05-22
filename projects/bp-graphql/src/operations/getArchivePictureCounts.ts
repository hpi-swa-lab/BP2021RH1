import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getArchivePictureCounts {
      getArchivePictureCounts {
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
