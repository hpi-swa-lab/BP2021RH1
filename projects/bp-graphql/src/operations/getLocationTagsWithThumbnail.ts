import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getLocationTagsWithThumbnail(
      $filters: LocationTagFiltersInput = {}
      $thumbnailFilters: PictureFiltersInput = {}
      $pagination: PaginationArg!
      $sortBy: [String]
    ) {
      getLocationTagsWithThumbnail(
        filters: $filters
        thumbnailFilters: $thumbnailFilters
        pagination: $pagination
        sortBy: $sortBy
      )
    }
  `,
} satisfies Operation;
