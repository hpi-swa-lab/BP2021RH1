import {
  GetCategoryInfoDocument,
  GetCategoryTagsPublishedAfterDateDocument,
} from '../../../../graphql/APIConnector';

export const RelatedTagsMocks = [
  {
    data: {
      id: 51,
      attributes: {
        name: 'Sole-Therme 1956-1970',
        thumbnail: [
          {
            data: {
              attributes: {
                media: {
                  data: {
                    attributes: {
                      formats: {
                        medium: {
                          ext: '.jpg',
                          url: 'test-image2.jpg',
                          hash: '',
                          mime: 'image2/jpeg',
                          name: 'Sole-Therme 1956-1970',
                          path: null,
                          size: -1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 50,
      attributes: {
        name: 'Sole-Therme 1980-1990',
        thumbnail: [
          {
            data: {
              attributes: {
                media: {
                  data: {
                    attributes: {
                      formats: {
                        medium: {
                          ext: '.jpg',
                          url: 'test-image.jpg',
                          hash: '',
                          mime: 'image/jpeg',
                          name: 'Sole-Therme 1980-1990',
                          path: null,
                          size: -1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 52,
      attributes: {
        name: 'Sole-Therme not latest',
        thumbnail: [
          {
            data: {
              attributes: {
                media: {
                  data: {
                    attributes: {
                      formats: {
                        medium: {
                          ext: '.jpg',
                          url: 'test-image.jpg',
                          hash: '',
                          mime: 'image/jpeg',
                          name: 'Sole-Therme not latest',
                          path: null,
                          size: -1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
];

export const RelatedTagsFirstLevelMocks = [
  {
    data: {
      id: 49,
      attributes: {
        name: 'Sole-Therme',
        thumbnail: [
          {
            data: {
              attributes: {
                media: {
                  data: {
                    attributes: {
                      formats: {
                        medium: {
                          ext: '.jpg',
                          url: 'test-image2.jpg',
                          hash: '',
                          mime: 'image2/jpeg',
                          name: 'Sole-Therme',
                          path: null,
                          size: -1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 42,
      attributes: {
        name: 'Onkel-Pelle',
        thumbnail: [
          {
            data: {
              attributes: {
                media: {
                  data: {
                    attributes: {
                      formats: {
                        medium: {
                          ext: '.jpg',
                          url: 'test-image.jpg',
                          hash: '',
                          mime: 'image/jpeg',
                          name: 'Onkel-Pelle',
                          path: null,
                          size: -1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: 2,
      attributes: {
        name: 'Not latest',
        thumbnail: [
          {
            data: {
              attributes: {
                media: {
                  data: {
                    attributes: {
                      formats: {
                        medium: {
                          ext: '.jpg',
                          url: 'test-image.jpg',
                          hash: '',
                          mime: 'image/jpeg',
                          name: 'Not latest',
                          path: null,
                          size: -1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
];

export const GetCategoryInfoDocumentMocks = [
  {
    request: {
      query: GetCategoryInfoDocument,
      variables: {
        categoryPriority: 1,
      },
    },
    result: {
      data: {
        categoryTags: {
          data: [
            {
              id: '1',
              attributes: {
                name: 'Herbert-Ahrens-Bilder-Archiv',
                description: '',
                related_tags: RelatedTagsFirstLevelMocks,
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GetCategoryInfoDocument,
      variables: {
        categoryName: 'Sole-Therme',
      },
    },
    result: {
      data: {
        categoryTags: {
          data: [
            {
              id: '49',
              attributes: {
                name: 'Sole-Therme',
                description: '',
                related_tags: RelatedTagsMocks,
              },
            },
          ],
        },
      },
    },
  },
];

const communityDate = '2022-01-03T17:25:00Z';
export const GetCategoryTagsPublishedAfterDateMocks = [
  {
    request: {
      query: GetCategoryTagsPublishedAfterDateDocument,
      variables: {
        date: communityDate,
      },
    },
    result: {
      data: {
        categoryTags: {
          data: [{ id: 51 }, { id: 49 }, { id: 50 }, { id: 42 }],
        },
      },
    },
  },
];
