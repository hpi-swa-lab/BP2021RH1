import { Operation, graphql } from '../Operation.js';
import { checkArchive } from '../isAllowedHelpers.js';

export default {
  group: 'editArchive',
  isAllowed: checkArchive('archive_tag'),
  document: graphql`
    mutation createLink($title: String!, $url: String!, $archive_tag: ID!) {
      createLink(data: { title: $title, url: $url, archive_tag: $archive_tag }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
