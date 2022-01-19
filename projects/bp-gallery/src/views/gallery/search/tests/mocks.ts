import { GetPicturesDocument } from '../../../../graphql/APIConnector';

export const GetPicturesSearchMocks = [
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        where: { descriptions: { text_contains: 'Onkel Pelle' } },
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
        ],
      },
    },
  },
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        where: { descriptions: { text_contains: 'invalid params' } },
        limit: 100,
        start: 0,
      },
    },
    result: {
      data: {
        pictures: [],
      },
    },
  },
];
