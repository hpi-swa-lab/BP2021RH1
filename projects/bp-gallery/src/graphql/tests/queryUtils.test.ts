import { flattenQueryResponseData, mergeVerifiedWithUnverifiedData } from '../queryUtils';

describe('flattenQueryResponseData', () => {
  it('should not throw when passed undefined', () => {
    expect(flattenQueryResponseData(undefined)).not.toBeDefined();
  });

  it('should replace data key with array inside it', () => {
    const input = {
      collectionData: {
        data: [{ id: '1' }, { id: '2' }],
      },
    };

    const expectedOutput = {
      collectionData: [{ id: '1' }, { id: '2' }],
    };

    expect(flattenQueryResponseData(input)).toEqual(expectedOutput);
  });

  it('should replace data key with null value inside it', () => {
    const input = {
      singleData: {
        data: null,
      },
    };

    const expectedOutput = {
      singleData: null,
    };

    expect(flattenQueryResponseData(input)).toEqual(expectedOutput);
  });

  it('should replace data and attributes key with objects inside them', () => {
    const input = {
      singleData: {
        data: {
          id: '1',
          attributes: {
            test1: 'test1',
            test2: 'test2',
          },
        },
      },
    };

    const expectedOutput = {
      singleData: {
        id: '1',
        test1: 'test1',
        test2: 'test2',
      },
    };

    expect(flattenQueryResponseData(input)).toEqual(expectedOutput);
  });

  it('should flatten the passed object recursively', () => {
    const input = {
      singleData: {
        data: {
          id: '1',
          attributes: {
            test1: 'test1',
            collectionData: {
              data: [
                {
                  id: '1_1',
                  attributes: {
                    test1_1: 'test1_1',
                  },
                },
                {
                  id: '1_2',
                  attributes: {
                    test1_2: 'test1_2',
                  },
                },
              ],
            },
          },
        },
      },
    };

    const expectedOutput = {
      singleData: {
        id: '1',
        test1: 'test1',
        collectionData: [
          {
            id: '1_1',
            test1_1: 'test1_1',
          },
          {
            id: '1_2',
            test1_2: 'test1_2',
          },
        ],
      },
    };

    expect(flattenQueryResponseData(input)).toEqual(expectedOutput);
  });

  it('should flatten each element when directly passed an array', () => {
    const input = [
      { id: '1', attributes: { test1: 'test1' } },
      { id: '2', attributes: { test2: 'test2' } },
    ];

    const expectedOutput = [
      { id: '1', test1: 'test1' },
      { id: '2', test2: 'test2' },
    ];

    expect(flattenQueryResponseData(input)).toEqual(expectedOutput);
  });
});

describe('mergeVerifiedWithUnverifiedData', () => {
  it('should not throw when passed undefined', () => {
    expect(mergeVerifiedWithUnverifiedData(undefined)).not.toBeDefined();
  });

  it('should merge verified with unverified entities', () => {
    const input = {
      keywordTag: {
        id: '15',
        pictures: [
          {
            id: '661',
          },
        ],
        verified_pictures: [
          {
            id: '660',
          },
        ],
      },
    };

    const expectedOutput = {
      keywordTag: {
        id: '15',
        pictures: [
          {
            id: '660',
            verified: true,
          },
          {
            id: '661',
            verified: false,
          },
        ],
      },
    };

    expect(mergeVerifiedWithUnverifiedData(input)).toEqual(expectedOutput);
  });

  it('should prefer a verified over a unverified single entity ', () => {
    const input = {
      keywordTag: {
        id: '15',
        time_range_tag: {
          id: '14',
        },
        verified_time_range_tag: {
          id: '63',
        },
      },
    };

    const expectedOutput = {
      keywordTag: {
        id: '15',
        time_range_tag: {
          id: '63',
          verified: true,
        },
      },
    };

    expect(mergeVerifiedWithUnverifiedData(input)).toEqual(expectedOutput);
  });

  it('should use an unverified single entity when the there is no verified one', () => {
    const input = {
      keywordTag: {
        id: '15',
        time_range_tag: {
          id: '14',
        },
        verified_time_range_tag: null,
      },
    };

    const expectedOutput = {
      keywordTag: {
        id: '15',
        time_range_tag: {
          id: '14',
          verified: false,
        },
      },
    };

    expect(mergeVerifiedWithUnverifiedData(input)).toEqual(expectedOutput);
  });

  it('should merge verified with unverified data recursively', () => {
    const input = {
      keywordTag: {
        id: '15',
        pictures: [
          {
            id: '661',
            time_range_tag: {
              id: '14',
            },
            verified_time_range_tag: {
              id: '63',
            },
          },
          {
            id: '670',
            time_range_tag: {
              id: '14',
            },
            verified_time_range_tag: null,
          },
        ],
        verified_pictures: [
          {
            id: '660',
            time_range_tag: null,
            verified_time_range_tag: {
              id: '14',
            },
          },
        ],
      },
    };

    const expectedOutput = {
      keywordTag: {
        id: '15',
        pictures: [
          {
            id: '660',
            time_range_tag: {
              id: '14',
              verified: true,
            },
            verified: true,
          },
          {
            id: '661',
            time_range_tag: {
              id: '63',
              verified: true,
            },
            verified: false,
          },
          {
            id: '670',
            time_range_tag: {
              id: '14',
              verified: false,
            },
            verified: false,
          },
        ],
      },
    };

    expect(mergeVerifiedWithUnverifiedData(input)).toEqual(expectedOutput);
  });

  it('should merge verified with unverified data ignoring the order', () => {
    const input = {
      keywordTag: {
        id: '15',
        pictures: [
          {
            id: '661',
            verified_time_range_tag: {
              id: '63',
            },
            time_range_tag: {
              id: '14',
            },
          },
        ],
        verified_pictures: [
          {
            id: '660',
            verified_time_range_tag: {
              id: '63',
            },
            time_range_tag: {
              id: '14',
            },
          },
        ],
      },
    };

    const expectedOutput = {
      keywordTag: {
        id: '15',
        pictures: [
          {
            id: '660',
            time_range_tag: {
              id: '63',
              verified: true,
            },
            verified: true,
          },
          {
            id: '661',
            time_range_tag: {
              id: '63',
              verified: true,
            },
            verified: false,
          },
        ],
      },
    };

    expect(mergeVerifiedWithUnverifiedData(input)).toEqual(expectedOutput);
  });
});
