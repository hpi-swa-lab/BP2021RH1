import {
  GetCollectionInfoByNameDocument,
  GetCollectionWithPicturesPublishedAfterDocument,
  GetRootCollectionDocument,
} from '../../../../graphql/APIConnector';

export const ChildCollectionsMocks = [
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

export const ChildCollectionsFirstLevelMocks = [
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

export const GetRootCollectionMocks = [
  {
    request: {
      query: GetRootCollectionDocument,
    },
    result: {
      data: {
        browseRootCollection: {
          data: {
            attributes: {
              current: {
                data: {
                  id: '1',
                  attributes: {
                    name: 'Das Herbert-Ahrens-Bilderarchiv',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
];

export const GetCollectionInfoDocumentMocks = [
  {
    request: {
      query: GetCollectionInfoByNameDocument,
      variables: {
        collectionName: 'Das Herbert-Ahrens-Bilderarchiv',
      },
    },
    result: {
      data: {
        collections: {
          data: [
            {
              id: '1',
              attributes: {
                name: 'Herbert-Ahrens-Bilder-Archiv',
                description: '',
                child_collections: ChildCollectionsFirstLevelMocks,
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GetCollectionInfoByNameDocument,
      variables: {
        collectionName: 'Sole-Therme',
      },
    },
    result: {
      data: {
        collections: {
          data: [
            {
              id: '49',
              attributes: {
                name: 'Sole-Therme',
                description: '',
                child_collections: ChildCollectionsMocks,
              },
            },
          ],
        },
      },
    },
  },
];

const communityDate = '2022-01-03T17:25:00Z';
export const GetCollectionsPublishedAfterDateMocks = [
  {
    request: {
      query: GetCollectionWithPicturesPublishedAfterDocument,
      variables: {
        date: communityDate,
      },
    },
    result: {
      data: {
        collections: {
          data: [{ id: 51 }, { id: 49 }, { id: 50 }, { id: 42 }],
        },
      },
    },
  },
];
