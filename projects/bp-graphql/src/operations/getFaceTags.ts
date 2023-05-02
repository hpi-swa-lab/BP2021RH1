import { Operation, graphql } from '../Operation.js';

export default {
  group: 'viewPicture',
  document: graphql`
    query getFaceTags($pictureId: ID!) {
      faceTags(filters: { picture: { id: { eq: $pictureId } } }) {
        data {
          id
          attributes {
            x
            y
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
