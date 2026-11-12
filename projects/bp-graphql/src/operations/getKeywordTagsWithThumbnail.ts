import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getKeywordTagsWithThumbnail(
      $filters: KeywordTagFiltersInput = {}
      $thumbnailFilters: PictureFiltersInput = {}
      $pagination: PaginationArg!
      $sortBy: [String]
    ) {
      keywordTags: keywordTags_connection(
        filters: $filters
        pagination: $pagination
        sort: $sortBy
      ) {
        data {
          id
          attributes {
            name
            thumbnail: pictures_connection(filters: $thumbnailFilters, pagination: { limit: 1 }) {
              data {
                attributes {
                  media {
                    data {
                      attributes {
                        formats
                        provider
                      }
                    }
                  }
                }
              }
            }
            verified_thumbnail: verified_pictures_connection(
              filters: $thumbnailFilters
              pagination: { limit: 1 }
            ) {
              data {
                attributes {
                  media {
                    data {
                      attributes {
                        formats
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
  `,
} satisfies Operation;
