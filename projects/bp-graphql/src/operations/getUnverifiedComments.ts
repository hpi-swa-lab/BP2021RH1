import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'comment',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getUnverifiedComments {
      comments(filters: { publishedAt: { null: true } }, publicationState: PREVIEW) {
        data {
          id
          attributes {
            picture {
              data {
                id
                attributes {
                  media {
                    data {
                      id
                      attributes {
                        width
                        height
                        formats
                        updatedAt
                      }
                    }
                  }
                }
              }
            }
            text
            author
          }
        }
      }
    }
  `,
} satisfies Operation;
