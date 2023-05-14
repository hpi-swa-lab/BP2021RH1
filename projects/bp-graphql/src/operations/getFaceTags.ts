import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getFaceTags($pictureId: ID!) {
      faceTags(filters: { picture: { id: { eq: $pictureId } } }) {
        data {
          id
          attributes {
            x
            y
            tag_direction
            person_tag {
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
