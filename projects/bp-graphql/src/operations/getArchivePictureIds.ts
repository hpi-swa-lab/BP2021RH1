import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getArchivePictureIds($archiveId: ID!) {
      archiveTag(id: $archiveId) {
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
