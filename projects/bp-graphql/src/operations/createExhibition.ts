import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createExhibition($title: String!, $sectionId: ID!) {
      createExhibition(data: { title: $title, exhibition_sections: [$sectionId] }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
