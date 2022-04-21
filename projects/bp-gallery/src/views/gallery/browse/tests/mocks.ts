import {
  GetCollectionInfoDocument,
  GetCollectionWithPicturesPublishedAfterDocument,
  GetRootCollectionDocument,
} from '../../../../graphql/APIConnector';

export const ChildCollectionsMocks = [
  {
    data: {
      id: 51,
      attributes: {
        name: 'Sole-Therme 1956-1970',
        thumbnail: 'test-image2.jpg',
      },
    },
  },
  {
    data: {
      id: 50,
      attributes: {
        name: 'Sole-Therme 1980-1990',
        thumbnail: 'test-image.jpg',
      },
    },
  },
  {
    data: {
      id: 52,
      attributes: {
        name: 'Sole-Therme not latest',
        thumbnail: 'test-image.jpg',
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
        thumbnail: 'test-image2.jpg',
      },
    },
  },
  {
    data: {
      id: 42,
      attributes: {
        name: 'Onkel-Pelle',
        thumbnail: 'test-image.jpg',
      },
    },
  },
  {
    data: {
      id: 2,
      attributes: {
        name: 'Not latest',
        thumbnail: 'test-image.jpg',
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
      query: GetCollectionInfoDocument,
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
      query: GetCollectionInfoDocument,
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
