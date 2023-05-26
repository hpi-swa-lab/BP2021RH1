import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getTagThumbnails',
  isAllowed: always,
  document: graphql`
    query getLocationTagsWithThumbnail(
      $filters: LocationTagFiltersInput = {}
      $thumbnailFilters: PictureFiltersInput = {}
      $pagination: PaginationArg!
      $sortBy: [String]
    ) {
      locationTags(filters: $filters, pagination: $pagination, sort: $sortBy) {
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
                        provider
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
