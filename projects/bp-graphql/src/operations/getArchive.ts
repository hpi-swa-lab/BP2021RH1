import { Operation, graphql } from '../Operation.js';
import { checkArchive } from '../isAllowedHelpers.js';

export default {
  section: 'archive',
  needsParameters: ['archive_tag'],
  isAllowed: checkArchive('archiveId'),
  document: graphql`
    query getArchive($archiveId: ID!) {
      archiveTag(id: $archiveId) {
        data {
          id
          attributes {
            name
            shortDescription
            longDescription
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
