import { Operation, graphql } from '../Operation.js';

export default {
  section: 'picture',
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
