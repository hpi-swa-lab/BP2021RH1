import { Operation, graphql } from '../Operation.js';
import { checkArchive } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkArchive('archiveId'),
  document: graphql`
    mutation createExhibition($archiveId: ID!, $publishedAt: DateTime!) {
      createExhibition(data: { archive_tag: $archiveId, publishedAt: $publishedAt }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
