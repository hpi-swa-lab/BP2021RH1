import { GraphQLError } from 'graphql';
import {
  ComponentContentComment,
  Description,
  GetPictureInfoDocument,
} from '../../../graphql/APIConnector';

export const CommentMocks: ComponentContentComment[] = [
  {
    text: 'My fancy comment',
    author: 'Onkel Pelle',
    id: '1',
    date: new Date('2021-04-21'),
  },
  {
    text: 'My fancy comment yeah',
    author: 'Onkel Pelle',
    id: '2',
    date: new Date('2021-04-22'),
  },
];

export const DescriptionMocks: Description[] = [
  {
    text: 'My fancy description',
    id: '1',
    updated_at: undefined,
    created_at: undefined,
  },
  {
    text: 'My fancy description yeah',
    id: '2',
    updated_at: undefined,
    created_at: undefined,
  },
];

export const GetInfoPictureDocumentMocks = [
  {
    request: {
      query: GetPictureInfoDocument,
      variables: {
        pictureId: '1',
      },
    },
    result: {
      data: {
        picture: {
          title: {
            id: '1',
            text: 'Picture with comments and descriptions',
          },
          media: {
            url: 'test-image.jpg',
          },
          descriptions: DescriptionMocks,
          Comment: CommentMocks,
        },
      },
    },
  },
  {
    request: {
      query: GetPictureInfoDocument,
      variables: {
        pictureId: '2',
      },
    },
    error: new Error('mocked network error'),
  },
  {
    request: {
      query: GetPictureInfoDocument,
      variables: {
        pictureId: '3',
      },
    },
    result: {
      errors: [new GraphQLError('mocked api error')],
    },
  },
];
