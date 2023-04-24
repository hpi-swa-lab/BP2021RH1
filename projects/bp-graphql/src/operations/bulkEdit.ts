import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation bulkEdit($pictureIds: [ID!]!, $data: JSON!) {
      doBulkEdit(ids: $pictureIds, data: $data)
    }
  `,
} satisfies Operation;
