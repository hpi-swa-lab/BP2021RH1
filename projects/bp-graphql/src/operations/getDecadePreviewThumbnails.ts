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
      decade40s: pictures_connection(
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
                }
              }
            }
          }
        }
      }
      decade50s: pictures_connection(
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
                }
              }
            }
          }
        }
      }
      decade60s: pictures_connection(
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
                }
              }
            }
          }
        }
      }
      decade70s: pictures_connection(
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
                }
              }
            }
          }
        }
      }
      decade80s: pictures_connection(
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
                }
              }
            }
          }
        }
      }
      decade90s: pictures_connection(
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
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
