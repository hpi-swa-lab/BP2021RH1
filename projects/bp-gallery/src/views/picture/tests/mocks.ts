import { GraphQLError } from 'graphql';
import {
  CommentEntity,
  DescriptionEntity,
  GetPictureInfoDocument,
} from '../../../graphql/APIConnector';

export const CommentMocks: CommentEntity[] = [
  {
    id: '1',
    attributes: {
      text: 'My fancy comment',
      author: 'Onkel Pelle',
      date: new Date('2021-04-21'),
    },
  },
  {
    id: '2',
    attributes: {
      text: 'My fancy comment yeah',
      author: 'Onkel Pelle',
      date: new Date('2021-04-22'),
    },
  },
];

export const DescriptionMocks: DescriptionEntity[] = [
  {
    id: '1',
    attributes: {
      text: 'My fancy description',
    },
  },
  {
    id: '2',
    attributes: {
      text: 'My fancy description yeah',
    },
  },
];

export const GetPictureInfoDocumentMocks = [
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
          data: {
            attributes: {
              title: {
                data: {
                  id: '1',
                  attributes: {
                    text: 'Picture with comments and descriptions',
                  },
                },
              },
              media: {
                data: {
                  attributes: {
                    url: 'test-image.jpg',
                  },
                },
              },
              descriptions: {
                data: DescriptionMocks,
              },
              comments: {
                data: CommentMocks,
              },
            },
          },
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
