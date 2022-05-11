import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderRouteWithAPIMocks } from '../../../../testUtils';
import { GetPicturesSearchMocks } from './mocks';
import { convertSearchParamsToPictureFilters } from '../helpers/search-filters';

const SearchHubMock = () => <div>SearchHubMock</div>;
jest.mock('../searchHub/SearchHub', () => SearchHubMock);

const SearchBarMock = () => <div>SearchBarMock</div>;
jest.mock('../SearchBar', () => SearchBarMock);

describe('SearchView called without any parameters', () => {
  beforeEach(() => renderRouteWithAPIMocks('/search', []));

  it('should render a SearchBar', () => {
    const searchBar = screen.getByText('SearchBarMock');
    expect(searchBar).toBeInTheDocument();
  });

  it('should render a SearchHub', () => {
    const searchHub = screen.getByText('SearchHubMock');
    expect(searchHub).toBeInTheDocument();
  });

  it('should not render any pictures', () => {
    const searchViewContainer = document.getElementsByClassName('search-view')[0];
    const picturesInSearchView = searchViewContainer.getElementsByTagName('img');
    expect(picturesInSearchView.length).toEqual(0);
  });
});

describe('SearchView called with parameters which do not match any pictures', () => {
  beforeEach(() =>
    renderRouteWithAPIMocks(
      `/search?all=${encodeURIComponent('invalid params')}`,
      GetPicturesSearchMocks
    )
  );

  it('should render a SearchBar', async () => {
    await waitFor(() => {
      const searchBar = screen.getByText('SearchBarMock');
      expect(searchBar).toBeInTheDocument();
    });
  });

  it('should not render the SearchHub', async () => {
    await waitFor(() => {
      expect(() => screen.getAllByText('SearchHubMock')).toThrow();
    });
  });
});

describe('SearchView called with parameters which match at least one picture', () => {
  beforeEach(() =>
    renderRouteWithAPIMocks(`/search?all=${encodeURIComponent('Pelle')}`, GetPicturesSearchMocks)
  );

  it('should render a SearchBar', async () => {
    await waitFor(() => {
      const searchBar = screen.getByText('SearchBarMock');
      expect(searchBar).toBeInTheDocument();
    });
  });

  it('should render at least one picture', async () => {
    await waitFor(() => {
      // As every other component besides the PictureScrollGrid is mocked, the remaining image(s) have to be the query results
      const imageTags = document.querySelector('.search-view')?.getElementsByTagName('img');
      expect(imageTags).toBeDefined();
      expect(imageTags?.length).toBeGreaterThan(0);
    });
  });

  it('should not render the SearchHub', async () => {
    await waitFor(() => {
      expect(() => screen.getAllByText('SearchHubMock')).toThrow();
    });
  });
});

describe('convertSearchParamsToPictureFilters', () => {
  it('should append time range tag filter', () => {
    const searchParams = new URLSearchParams({ decade: '70' });

    const result = convertSearchParamsToPictureFilters(searchParams);
    expect(result).toEqual({
      and: [
        {
          or: [
            {
              time_range_tag: {
                start: {
                  gte: '1970-01-01T00:00:00Z',
                },
                end: {
                  lte: '1970-12-31T23:59:59Z',
                },
              },
            },
            {
              verified_time_range_tag: {
                start: {
                  gte: '1970-01-01T00:00:00Z',
                },
                end: {
                  lte: '1970-12-31T23:59:59Z',
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('should append time range tag filter for pre50 decade', () => {
    const searchParams = new URLSearchParams({ decade: 'pre50' });

    const result = convertSearchParamsToPictureFilters(searchParams);

    expect(result).toEqual({
      and: [
        {
          or: [
            {
              time_range_tag: {
                start: {
                  gte: '1900-01-01T00:00:00Z',
                },
                end: {
                  lte: '1949-12-31T23:59:59Z',
                },
              },
            },
            {
              verified_time_range_tag: {
                start: {
                  gte: '1900-01-01T00:00:00Z',
                },
                end: {
                  lte: '1949-12-31T23:59:59Z',
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('should append single keyword tag filter with simple name', () => {
    const keyword = 'Burgberg';
    const searchParams = new URLSearchParams({ keyword });

    const result = convertSearchParamsToPictureFilters(searchParams);

    expect(result).toEqual({
      and: [
        {
          or: [
            {
              keyword_tags: {
                name: {
                  containsi: keyword,
                },
              },
            },
            {
              verified_keyword_tags: {
                name: {
                  containsi: keyword,
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('should append single keyword tag filter with URL encoded name', () => {
    const keyword = 'Harzburg';
    const searchParams = new URLSearchParams({
      keyword: encodeURIComponent(keyword),
    });

    const result = convertSearchParamsToPictureFilters(searchParams);

    expect(result).toEqual({
      and: [
        {
          or: [
            {
              keyword_tags: {
                name: {
                  containsi: keyword,
                },
              },
            },
            {
              verified_keyword_tags: {
                name: {
                  containsi: keyword,
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('should append multiple keyword tag filters', () => {
    const keyword1 = 'Burgberg';
    const keyword2 = 'Winterberg';
    const searchParams = new URLSearchParams({ keyword: keyword1 });
    searchParams.append('keyword', encodeURIComponent(keyword2));

    const result = convertSearchParamsToPictureFilters(searchParams);

    expect(result).toEqual({
      and: [
        {
          or: [
            {
              keyword_tags: {
                name: {
                  containsi: keyword1,
                },
              },
            },
            {
              verified_keyword_tags: {
                name: {
                  containsi: keyword1,
                },
              },
            },
          ],
        },
        {
          or: [
            {
              keyword_tags: {
                name: {
                  containsi: keyword2,
                },
              },
            },
            {
              verified_keyword_tags: {
                name: {
                  containsi: keyword2,
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('should append single description filter', () => {
    const description = 'Pelle';
    const searchParams = new URLSearchParams({
      description: encodeURIComponent(description),
    });

    const result = convertSearchParamsToPictureFilters(searchParams);

    expect(result).toEqual({
      and: [
        {
          descriptions: {
            text: {
              containsi: description,
            },
          },
        },
      ],
    });
  });

  it('should append multiple description filters', () => {
    const description1 = 'Pelle';
    const description2 = 'Winterberg';
    const searchParams = new URLSearchParams({
      description: encodeURIComponent(description1),
    });
    searchParams.append('description', encodeURIComponent(description2));

    const result = convertSearchParamsToPictureFilters(searchParams);

    expect(result).toEqual({
      and: [
        {
          descriptions: {
            text: {
              containsi: description1,
            },
          },
        },
        {
          descriptions: {
            text: {
              containsi: description2,
            },
          },
        },
      ],
    });
  });
});
