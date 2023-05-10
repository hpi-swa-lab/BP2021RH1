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
//   ideaLots {
//     data {
//       id
//       attributes {
//         exhibition_pictures {
//           data {
//             id
//             attributes {
//               picture {
//                 data {
//                   id
//                   attributes {
//                     media {
//                       data {
//                         id
//                         attributes {
//                           width
//                           height
//                           formats
//                           url
//                           updatedAt
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//               subtitle
//             }
//           }
//         }
//         exhibition {
//           data {
//             id
//           }
//         }
//       }
//     }
//   }
// }
