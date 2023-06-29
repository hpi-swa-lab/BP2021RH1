import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getDecadePreviewThumbnails(
      $filter40s: PictureFiltersInput!
      $filter50s: PictureFiltersInput!
      $filter60s: PictureFiltersInput!
      $filter70s: PictureFiltersInput!
      $filter80s: PictureFiltersInput!
      $filter90s: PictureFiltersInput!
    ) {
      decade40s: pictures(
        filters: {
          and: [$filter40s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
        }
        pagination: { limit: 1 }
      ) {
        data {
          attributes {
            media {
              data {
                attributes {
                  formats
                  provider
                  ext
                }
              }
            }
          }
        }
      }
      decade50s: pictures(
        filters: {
          and: [$filter50s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
        }
        pagination: { limit: 1 }
      ) {
        data {
          attributes {
            media {
              data {
                attributes {
                  formats
                  provider
                  ext
                }
              }
            }
          }
        }
      }
      decade60s: pictures(
        filters: {
          and: [$filter60s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
        }
        pagination: { limit: 1 }
      ) {
        data {
          attributes {
            media {
              data {
                attributes {
                  formats
                  provider
                  ext
                }
              }
            }
          }
        }
      }
      decade70s: pictures(
        filters: {
          and: [$filter70s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
        }
        pagination: { limit: 1 }
      ) {
        data {
          attributes {
            media {
              data {
                attributes {
                  formats
                  provider
                  ext
                }
              }
            }
          }
        }
      }
      decade80s: pictures(
        filters: {
          and: [$filter80s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
        }
        pagination: { limit: 1 }
      ) {
        data {
          attributes {
            media {
              data {
                attributes {
                  formats
                  provider
                  ext
                }
              }
            }
          }
        }
      }
      decade90s: pictures(
        filters: {
          and: [$filter90s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
        }
        pagination: { limit: 1 }
      ) {
        data {
          attributes {
            media {
              data {
                attributes {
                  formats
                  provider
                  ext
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
