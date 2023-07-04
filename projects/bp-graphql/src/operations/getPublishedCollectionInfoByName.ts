import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPublishedCollectionInfoByName($collectionName: String) {
      collections(filters: { name: { eq: $collectionName } }) {
        data {
          id
          attributes {
            name
            description
            child_collections(sort: "name:asc") {
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
