import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getIdeaLotContent($exhibitionId: ID!) {
      exhibition(id: $exhibitionId) {
        data {
          id
          attributes {
            idealot_pictures {
              data {
                id
                attributes {
                  subtitle
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
