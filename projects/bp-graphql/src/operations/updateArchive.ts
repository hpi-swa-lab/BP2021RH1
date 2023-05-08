import { Operation, graphql } from '../Operation.js';
import { checkArchive } from '../isAllowedHelpers.js';

export default {
  group: 'editArchive',
  isAllowed: checkArchive('archiveId'),
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
