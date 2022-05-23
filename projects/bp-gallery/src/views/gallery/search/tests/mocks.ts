import { GetPicturesDocument } from '../../../../graphql/APIConnector';

export const GetPicturesSearchMocks = [
  {
    request: {
      query: GetPicturesDocument,
      variables: {
        filters: {
          and: [
            {
              or: [
                {
                  keyword_tags: {
                    name: {
                      containsi: 'Onkel Pelle',
                    },
                  },
                },
                {
                  verified_keyword_tags: {
                    name: {
                      containsi: 'Onkel Pelle',
                    },
                  },
                },
              ],
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
                    id: '1',
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
              or: [
                {
                  keyword_tags: {
                    name: {
                      containsi: 'not matching',
                    },
                  },
                },
                {
                  verified_keyword_tags: {
                    name: {
                      containsi: 'not matching',
                    },
                  },
                },
              ],
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
