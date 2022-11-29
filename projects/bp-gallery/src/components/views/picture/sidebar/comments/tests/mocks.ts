import { GraphQLError } from 'graphql';
import { PostCommentDocument } from '../../../../../../graphql/APIConnector';
import { FlatComment } from '../../../../../../types/additionalFlatTypes';

export const MOCKED_COMMENT_POST_DATE = '2022-02-02T10:00:00.000Z';

export const comments = {
  publishedAndPinned: {
    id: '1',
    text: 'My fancy comment',
    author: 'Onkel Pelle',
    date: new Date('2021-04-21'),
    publishedAt: new Date('2021-04-21'),
    pinned: true,
  } as FlatComment,
  publishedAndUnpinned: {
    id: '1',
    text: 'My fancy comment',
    author: 'Onkel Pelle',
    date: new Date('2021-04-21'),
    publishedAt: new Date('2021-04-21'),
    pinned: false,
  } as FlatComment,
  unpublishedAndPinned: {
    id: '2',
    text: 'My fancy comment yeah',
    author: 'Onkel Pelle',
    date: new Date('2021-04-22'),
    pinned: true,
  } as FlatComment,
  unpublishedAndUnpinned: {
    id: '2',
    text: 'My fancy comment yeah',
    author: 'Onkel Pelle',
    date: new Date('2021-04-22'),
    pinned: false,
  } as FlatComment,
};

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
