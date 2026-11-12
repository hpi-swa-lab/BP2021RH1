import { Operation, graphql } from '../Operation.js';
import { checkMultiplePictures } from '../isAllowedHelpers.js';

export default {
  group: 'editPicture',
  isAllowed: checkMultiplePictures('pictureIds'),
  document: graphql`
    query getMultiplePictureInfo($pictureIds: [ID!]) {
      pictures: pictures_connection(filters: { id: { in: $pictureIds } }) {
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
            media {
              data {
                id
                attributes {
                  url
                  updatedAt
                  provider
                }
              }
            }
            comments: comments_connection(sort: "date:asc") {
              data {
                id
                attributes {
                  text
                  author
                  date
                  accepted
                  pinned
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
