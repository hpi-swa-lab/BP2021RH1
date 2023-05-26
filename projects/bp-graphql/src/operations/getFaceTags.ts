import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  group: 'viewPicture',
  isAllowed: checkPicture('pictureId'),
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
