import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation updatePicture($pictureId: ID!, $data: JSON!) {
      updatePictureWithTagCleanup(id: $pictureId, data: $data)
    }
  `,
} satisfies Operation;
