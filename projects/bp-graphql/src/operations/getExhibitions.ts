import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getExhibitions($archiveId: ID, $sortBy: [String] = ["createdAt:desc"]) {
      exhibitions(filters: { archive_tag: { id: { eq: $archiveId } } }, sort: $sortBy) {
        data {
          id
          attributes {
            title
            is_published
            archive_tag {
              data {
                id
              }
            }
            title_picture {
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
                              url
                              updatedAt
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
        }
      }
    }
  `,
} satisfies Operation;
