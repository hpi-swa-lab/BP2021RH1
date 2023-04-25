import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getCollectionInfoByName(
      $collectionName: String
      $publicationState: PublicationState = LIVE
    ) {
      collections(filters: { name: { eq: $collectionName } }, publicationState: $publicationState) {
        data {
          id
          attributes {
            name
            description
            child_collections(sort: "name:asc", publicationState: $publicationState) {
              data {
                id
                attributes {
                  name
                  thumbnail
                  publishedAt
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
