import { Operation, graphql } from '../Operation.js';
import { checkArchive } from '../isAllowedHelpers.js';

export default {
  section: 'archive',
  needsParameters: ['archive_tag'],
  isAllowed: checkArchive('id'),
  document: graphql`
    mutation removeArchiveTag($id: ID!) {
      removeArchiveTag(id: $id)
    }
  `,
} satisfies Operation;
