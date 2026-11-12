import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getFaceTags($pictureId: ID!) {
      faceTags: faceTags_connection(filters: { picture: { id: { eq: $pictureId } } }) {
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
