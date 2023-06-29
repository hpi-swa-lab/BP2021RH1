import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    mutation increaseNotAPlaceCount($pictureId: ID!) {
      increaseNotAPlaceCount(id: $pictureId)
    }
  `,
} satisfies Operation;
