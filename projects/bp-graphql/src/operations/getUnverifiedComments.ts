import { Operation, graphql } from "../Operation.js";

export default {
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
