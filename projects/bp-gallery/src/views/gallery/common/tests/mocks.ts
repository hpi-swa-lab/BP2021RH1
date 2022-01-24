import { GetPicturesDocument } from '../../../../graphql/APIConnector';
import { GraphQLError } from 'graphql';

export const GetPicturesDocumentMocks = [
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        where: '',
        limit: 100,
        start: 0,
      },
    },
    result: {
      data: {
        pictures: [
          {
            id: '1',
            media: {
              formats: {
                small: {
                  url: 'test-image.jpg',
                },
              },
              width: 1,
              height: 1,
            },
          },
          {
            id: '2',
            media: {
              formats: {
                small: {
                  url: 'test-image2.jpg',
                },
              },
              width: 1,
              height: 1,
            },
          },
          {
            id: '3',
            media: {
              formats: {
                small: {
                  url: 'test-image3.jpg',
                },
              },
              width: 1,
              height: 1,
            },
          },
          {
            id: '4',
            media: {
              formats: {
                small: {
                  url: 'test-image4.jpg',
                },
              },
              width: 1,
              height: 1,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        where: '',
        limit: 100,
        start: 4,
      },
    },
    result: {
      data: {
        pictures: [
          {
            id: '5',
            media: {
              formats: {
                small: {
                  url: 'test-image5.jpg',
                },
              },
              width: 1,
              height: 1,
            },
          },
          {
            id: '6',
            media: {
              formats: {
                small: {
                  url: 'test-image6.jpg',
                },
              },
              width: 1,
              height: 1,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        where: '{id: 0}',
        limit: 100,
        start: 0,
      },
    },
    error: new Error('mocked network error'),
  },
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        where: '{id: -1}',
        limit: 100,
        start: 0,
      },
    },
    result: {
      errors: [new GraphQLError('mocked api error')],
    },
  },
];
