import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibitionSection($title: String!) {
      createExhibitionSection(data: { title: $title }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
