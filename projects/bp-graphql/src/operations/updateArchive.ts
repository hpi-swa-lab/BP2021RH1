import { Operation, graphql } from '../Operation.js';

export default {
  group: 'editArchive',
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
