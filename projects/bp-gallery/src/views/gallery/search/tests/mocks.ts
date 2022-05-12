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
                      containsi: 'Pelle',
                    },
                  },
                },
                {
                  verified_keyword_tags: {
                    name: {
                      containsi: 'Pelle',
                    },
                  },
                },
                {
                  time_range_tag: {},
                },
                {
                  verified_time_range_tag: {},
                },
                {
                  person_tags: {
                    name: {
                      containsi: 'Pelle',
                    },
                  },
                },
                {
                  verified_person_tags: {
                    name: {
                      containsi: 'Pelle',
                    },
                  },
                },
                {
                  collections: {
                    name: {
                      containsi: 'Pelle',
                    },
                  },
                },
                {
                  location_tags: {
                    name: {
                      containsi: 'Pelle',
                    },
                  },
                },
                {
                  verified_location_tags: {
                    name: {
                      containsi: 'Pelle',
                    },
                  },
                },
                {
                  descriptions: {
                    text: {
                      containsi: 'Pelle',
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
                {
                  time_range_tag: {},
                },
                {
                  verified_time_range_tag: {},
                },
                {
                  person_tags: {
                    name: {
                      containsi: 'not matching',
                    },
                  },
                },
                {
                  verified_person_tags: {
                    name: {
                      containsi: 'not matching',
                    },
                  },
                },
                {
                  collections: {
                    name: {
                      containsi: 'not matching',
                    },
                  },
                },
                {
                  location_tags: {
                    name: {
                      containsi: 'not matching',
                    },
                  },
                },
                {
                  verified_location_tags: {
                    name: {
                      containsi: 'not matching',
                    },
                  },
                },
                {
                  descriptions: {
                    text: {
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
