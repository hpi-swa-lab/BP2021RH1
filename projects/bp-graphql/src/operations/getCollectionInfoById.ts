import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    query getCollectionInfoById($collectionId: ID!) {
      collection(id: $collectionId) {
        data {
          id
          attributes {
            name
            description
            child_collections(sort: "name:asc", publicationState: PREVIEW) {
              data {
                id
                attributes {
                  name
                  publishedAt
                  pictures(pagination: { limit: 1 }) {
                    data {
                      id
                    }
                  }
                  child_collections(pagination: { limit: 1 }, publicationState: PREVIEW) {
                    data {
                      id
                    }
                  }
                  parent_collections(publicationState: PREVIEW) {
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
        }
      }
    }
  `,
} satisfies Operation;
