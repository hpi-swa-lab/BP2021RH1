import { Operation, graphql } from '../Operation.js';
import { checkArchive } from '../isAllowedHelpers.js';

export default {
  section: 'picture',
  needsParameters: ['archive_tag'],
  isAllowed: checkArchive(variables => variables.data.archive_tag),
  document: graphql`
    mutation createPicture($data: PictureInput!) {
      createPicture(data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
