import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateExhibitionPicture($id: ID!, $subtitle: String, $order: Int!) {
      updateExhibitionPicture(id: $id, data: { subtitle: $subtitle, order: $order }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
