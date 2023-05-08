import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'geo',
  isAllowed: always,
  document: graphql`
    mutation increaseNotAPlaceCount($pictureId: ID!) {
      increaseNotAPlaceCount(id: $pictureId)
    }
  `,
} satisfies Operation;
