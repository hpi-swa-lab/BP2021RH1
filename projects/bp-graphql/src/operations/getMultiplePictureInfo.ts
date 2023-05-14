import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getMultiplePictureInfo($pictureIds: [ID!]) {
      pictures(filters: { id: { in: $pictureIds } }) {
        data {
          id
          attributes {
            descriptions(sort: "createdAt:asc") {
              data {
                id
                attributes {
                  text
                }
              }
            }
            time_range_tag {
              data {
                id
                attributes {
                  start
                  end
                  isEstimate
                }
              }
            }
            verified_time_range_tag {
              data {
                id
                attributes {
                  start
                  end
                  isEstimate
                }
              }
            }
            keyword_tags(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            verified_keyword_tags(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            location_tags(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            verified_location_tags(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            person_tags(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            verified_person_tags(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            collections(publicationState: PREVIEW) {
              data {
                id
                attributes {
                  name
                }
              }
            }
            media {
              data {
                id
                attributes {
                  url
                  updatedAt
                }
              }
            }
            comments(publicationState: PREVIEW, sort: "date:asc") {
              data {
                id
                attributes {
                  text
                  author
                  date
                  publishedAt
                  pinned
                }
              }
            }
            is_text
            linked_pictures {
              data {
                id
              }
            }
            linked_texts {
              data {
                id
              }
            }
            archive_tag {
              data {
                id
                attributes {
                  name
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
