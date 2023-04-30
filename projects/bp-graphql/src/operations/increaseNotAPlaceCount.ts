import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation increaseNotAPlaceCount($pictureId: ID!) {
      increaseNotAPlaceCount(id: $pictureId)
    }
  `,
} satisfies Operation;
