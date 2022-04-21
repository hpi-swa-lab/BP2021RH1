import { GetPicturesDocument } from '../../../../graphql/APIConnector';
import { GraphQLError } from 'graphql';

export const GetPicturesDocumentMocks = [
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        filters: {},
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
                    id: 1,
                    attributes: {
                      formats: {
                        small: {
                          url: 'test-image.jpg',
                        },
                      },
                      width: 1,
                      height: 1,
                      updatedAt: '21042022',
                    },
                  },
                },
              },
            },
            {
              id: '2',
              attributes: {
                media: {
                  data: {
                    id: 1,
                    attributes: {
                      formats: {
                        small: {
                          url: 'test-image2.jpg',
                        },
                      },
                      width: 1,
                      height: 1,
                      updatedAt: '21042022',
                    },
                  },
                },
              },
            },
            {
              id: '3',
              attributes: {
                media: {
                  data: {
                    id: 1,
                    attributes: {
                      formats: {
                        small: {
                          url: 'test-image3.jpg',
                        },
                      },
                      width: 1,
                      height: 1,
                      updatedAt: '21042022',
                    },
                  },
                },
              },
            },
            {
              id: '4',
              attributes: {
                media: {
                  data: {
                    id: 1,
                    attributes: {
                      formats: {
                        small: {
                          url: 'test-image4.jpg',
                        },
                      },
                      width: 1,
                      height: 1,
                      updatedAt: '21042022',
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
        filters: {},
        pagination: {
          start: 4,
          limit: 100,
        },
      },
    },
    result: {
      data: {
        pictures: {
          data: [
            {
              id: '5',
              attributes: {
                media: {
                  data: {
                    id: 1,
                    attributes: {
                      formats: {
                        small: {
                          url: 'test-image5.jpg',
                        },
                      },
                      width: 1,
                      height: 1,
                      updatedAt: '21042022',
                    },
                  },
                },
              },
            },
            {
              id: '6',
              attributes: {
                media: {
                  data: {
                    id: 1,
                    attributes: {
                      formats: {
                        small: {
                          url: 'test-image6.jpg',
                        },
                      },
                      width: 1,
                      height: 1,
                      updatedAt: '21042022',
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
        filters: { id: { eq: '0' } },
        pagination: {
          start: 0,
          limit: 100,
        },
      },
    },
    error: new Error('mocked network error'),
  },
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        filters: { id: { eq: '-1' } },
        pagination: {
          start: 0,
          limit: 100,
        },
      },
    },
    result: {
      errors: [new GraphQLError('mocked api error')],
    },
  },
];
