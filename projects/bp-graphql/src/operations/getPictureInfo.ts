import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPictureInfo($pictureId: ID!) {
      picture(id: $pictureId) {
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
            comments(
              publicationState: PREVIEW
              sort: "date:desc"
              filters: { picture: { id: { eq: $pictureId } } }
            ) {
              data {
                id
                attributes {
                  text
                  author
                  picture {
                    data {
                      id
                    }
                  }
                  date
                  parentComment {
                    data {
                      id
                    }
                  }
                  childComments(publicationState: PREVIEW, sort: "date:asc") {
                    data {
                      id
                    }
                  }
                  publishedAt
                  pinned
                }
              }
            }
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
            picture_sequence {
              data {
                id
                attributes {
                  pictures(sort: "picture_sequence_order:asc") {
                    data {
                      id
                    }
                  }
                }
              }
            }
            archive_tag {
              data {
                id
                attributes {
                  name
                  restrictImageDownloading
                }
              }
            }
            likes
          }
        }
      }
    }
  `,
} satisfies Operation;
