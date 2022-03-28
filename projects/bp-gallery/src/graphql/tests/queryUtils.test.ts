import { flattenQueryResponseData } from '../queryUtils';

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
