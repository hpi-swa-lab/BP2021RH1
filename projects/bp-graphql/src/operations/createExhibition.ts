import { Operation, graphql } from '../Operation.js';

export default {
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
