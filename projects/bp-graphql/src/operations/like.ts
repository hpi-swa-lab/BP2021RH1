import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation like($pictureId: ID!, $dislike: Boolean) {
      doLike(pictureId: $pictureId, dislike: $dislike)
    }
  `,
} satisfies Operation;
