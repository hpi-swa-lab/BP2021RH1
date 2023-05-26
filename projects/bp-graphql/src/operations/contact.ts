import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'archive',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation contact(
      $recipient: String!
      $sender_name: String!
      $reply_email: String!
      $subject: String!
      $message: String!
    ) {
      contact(
        recipient: $recipient
        sender_name: $sender_name
        reply_email: $reply_email
        subject: $subject
        message: $message
      )
    }
  `,
} satisfies Operation;
