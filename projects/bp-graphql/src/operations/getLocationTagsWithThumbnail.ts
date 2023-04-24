import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    query getLocationTagsWithThumbnail(
      $filters: LocationTagFiltersInput = {}
      $thumbnailFilters: PictureFiltersInput = {}
      $start: Int
      $limit: Int
      $sortBy: [String]
    ) {
      locationTags(filters: $filters, pagination: { start: $start, limit: $limit }, sort: $sortBy) {
        data {
          id
          attributes {
            name
            thumbnail: pictures(filters: $thumbnailFilters, pagination: { limit: 1 }) {
              data {
                attributes {
                  media {
                    data {
                      attributes {
                        formats
                      }
                    }
                  }
                }
              }
            }
            verified_thumbnail: verified_pictures(
              filters: $thumbnailFilters
              pagination: { limit: 1 }
            ) {
              data {
                attributes {
                  media {
                    data {
                      attributes {
                        formats
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
