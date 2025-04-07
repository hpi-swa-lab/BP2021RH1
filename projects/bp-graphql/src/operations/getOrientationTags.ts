import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getOrientationTags($pictureId: ID!) {
      orientationTags(filters: { picture: { id: { eq: $pictureId } } }) {
        data {
          id
          attributes {
            x
            y
            tag_direction
            location_tag {
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
  `,
} satisfies Operation;
