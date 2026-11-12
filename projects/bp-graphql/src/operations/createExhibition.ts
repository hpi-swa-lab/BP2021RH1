import { Operation, graphql } from '../Operation.js';
import { checkArchive } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkArchive('archiveId'),
  document: graphql`
    mutation createExhibition($archiveId: ID!) {
      createExhibition(data: { archive_tag: $archiveId }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
