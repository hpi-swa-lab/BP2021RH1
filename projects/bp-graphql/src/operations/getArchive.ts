import { Operation, graphql } from '../Operation.js';

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
            email
            paypalClient
            paypalDonationText
            paypalPurpose
            logo {
              data {
                id
                attributes {
                  width
                  height
                  formats
                  updatedAt
                  provider
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
                        provider
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
