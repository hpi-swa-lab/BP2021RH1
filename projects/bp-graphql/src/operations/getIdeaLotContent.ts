import { Operation, graphql } from '../Operation.js';
import { checkExhibition } from '../isAllowedHelpers.js';

export default {
  group: 'exhibition',
  isAllowed: checkExhibition('exhibitionId'),
  document: graphql`
    query getIdeaLotContent($exhibitionId: ID!) {
      exhibition(documentId: $exhibitionId) {
        data {
          id
          attributes {
            idealot_pictures: idealot_pictures_connection {
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
        }
      }
    }
  `,
} satisfies Operation;
