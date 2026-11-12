import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPictureInfo($pictureId: ID!) {
      picture(documentId: $pictureId) {
        data {
          id
          attributes {
            descriptions: descriptions_connection(sort: "createdAt:asc") {
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
            keyword_tags: keyword_tags_connection(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            verified_keyword_tags: verified_keyword_tags_connection(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            location_tags: location_tags_connection(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            verified_location_tags: verified_location_tags_connection(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            person_tags: person_tags_connection(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            verified_person_tags: verified_person_tags_connection(sort: "updatedAt:asc") {
              data {
                id
                attributes {
                  name
                  updatedAt
                }
              }
            }
            collections: collections_connection {
              data {
                id
                attributes {
                  name
                }
              }
            }
            comments: comments_connection(
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
                  childComments: childComments_connection(sort: "date:asc") {
                    data {
                      id
                    }
                  }
                  accepted
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
            linked_pictures: linked_pictures_connection {
              data {
                id
              }
            }
            linked_texts: linked_texts_connection {
              data {
                id
              }
            }
            picture_sequence {
              data {
                id
                attributes {
                  pictures: pictures_connection(sort: "picture_sequence_order:asc") {
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
