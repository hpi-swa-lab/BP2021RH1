import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPublishedCollectionInfoByName($collectionName: String) {
      collections: collections_connection(
        filters: { name: { eq: $collectionName }, visible: { eq: true } }
      ) {
        data {
          id
          attributes {
            name
            description
            child_collections: child_collections_connection(
              sort: "name:asc"
              filters: { visible: { eq: true } }
            ) {
              data {
                id
                attributes {
                  name
                  thumbnail
                  visible
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
