import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateArchive($archiveId: ID!, $data: ArchiveTagInput!) {
      updateArchiveTag(id: $archiveId, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
