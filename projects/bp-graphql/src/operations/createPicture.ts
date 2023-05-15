import { Operation, graphql } from '../Operation.js';
import { checkArchive, isIDLike, isObject, validate } from '../isAllowedHelpers.js';

export default {
  section: 'picture',
  needsParameters: ['archive_tag'],
  isAllowed: checkArchive(variables =>
    validate(validate(variables.data, isObject, 'data').archive_tag, isIDLike, 'data.archive_tag')
  ),
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
