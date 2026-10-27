import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    mutation contact(
      $recipient: String!
      $sender_name: String!
      $reply_email: String!
      $subject: String!
      $message: String!
      $honeypot: String!
      $fill_time: Int!
    ) {
      contact(
        recipient: $recipient
        sender_name: $sender_name
        reply_email: $reply_email
        subject: $subject
        message: $message
        honeypot: $honeypot
        fill_time: $fill_time
      )
    }
  `,
} satisfies Operation;
