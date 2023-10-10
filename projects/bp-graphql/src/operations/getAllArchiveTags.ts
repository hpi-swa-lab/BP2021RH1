import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getAllArchiveTags($sortBy: [String] = ["createdAt:asc"]) {
      archiveTags(sort: $sortBy) {
        data {
          id
          attributes {
            name
            shortDescription
            hidden
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
