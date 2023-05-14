import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getKeywordTagsWithThumbnail(
      $filters: KeywordTagFiltersInput = {}
      $thumbnailFilters: PictureFiltersInput = {}
      $start: Int
      $limit: Int
      $sortBy: [String]
    ) {
      keywordTags(filters: $filters, pagination: { start: $start, limit: $limit }, sort: $sortBy) {
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
