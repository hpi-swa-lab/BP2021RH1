import { Operation, graphql } from '../Operation.js';

export default {
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
