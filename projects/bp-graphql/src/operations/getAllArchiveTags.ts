import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getAllArchiveTags($sortBy: [String] = ["createdAt:asc"]) {
      archiveTags(sort: $sortBy) {
        data {
          id
          attributes {
            name
            shortDescription
            showcasePicture {
              data {
                id
                attributes {
                  media {
                    data {
                      attributes {
                        url
                        updatedAt
                        provider
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
