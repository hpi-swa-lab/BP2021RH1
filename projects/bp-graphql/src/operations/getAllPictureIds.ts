import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'geo',
  isAllowed: always,
  document: graphql`
    query getAllPictureIds {
      pictures {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
