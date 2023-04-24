import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    query getArchive($archiveId: ID!) {
      archiveTag(id: $archiveId) {
        data {
          id
          attributes {
            name
            shortDescription
            longDescription
            logo {
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
            showcasePicture {
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
                        url
                        updatedAt
                      }
                    }
                  }
                }
              }
            }
            links {
              data {
                id
                attributes {
                  title
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
