import { GetPicturesDocument } from '../../../../graphql/APIConnector';

export const GetPicturesSearchMocks = [
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        filters: {
          and: [
            {
              descriptions: {
                text: {
                  containsi: 'Onkel Pelle',
                },
              },
            },
          ],
        },
        pagination: {
          start: 0,
          limit: 100,
        },
      },
    },
    result: {
      data: {
        pictures: {
          data: [
            {
              id: '1',
              attributes: {
                media: {
                  data: {
                    attributes: {
                      formats: {
                        small: {
                          url: 'test-image.jpg',
                        },
                      },
                      width: 1,
                      height: 1,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        filters: {
          and: [
            {
              descriptions: {
                text: {
                  containsi: 'invalid params',
                },
              },
            },
          ],
        },
        pagination: {
          start: 0,
          limit: 100,
        },
      },
    },
    result: {
      data: {
        pictures: [],
      },
    },
  },
];
