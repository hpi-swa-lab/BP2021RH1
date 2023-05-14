import { Operation, graphql } from '../Operation.js';

export default {
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
