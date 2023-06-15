import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getArchiveNames(
      $filters: ArchiveTagFiltersInput = {}
      $sortBy: [String] = ["createdAt:asc"]
    ) {
      archiveTags(filters: $filters, sort: $sortBy) {
        data {
          id
          attributes {
            name
          }
        }
      }
    }
  `,
} satisfies Operation;
