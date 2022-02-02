import { GraphQLError } from 'graphql';
import { PostCommentDocument } from '../../../../../graphql/APIConnector';

export const MOCKED_COMMENT_POST_DATE = '2022-02-02T10:00:00Z';

export const PostCommentDocumentMocks = [
  {
    request: {
      query: PostCommentDocument,
      variables: {
        id: '1',
        author: 'Onkel Pelle',
        text: 'This comment will be posted',
        date: MOCKED_COMMENT_POST_DATE,
      },
    },
    result: {
      data: {
        createComment: {
          data: {
            attributes: {
              text: 'This comment will be posted',
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: PostCommentDocument,
      variables: {
        id: '2',
        author: 'Onkel Pelle',
        text: 'This comment will crash',
        date: MOCKED_COMMENT_POST_DATE,
      },
    },
    result: {
      errors: [new GraphQLError('mocked api error')],
    },
  },
];
