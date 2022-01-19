import React from 'react';
import { renderRoute, renderRouteWithAPIMocks } from '../../../../testUtils';
import { screen, waitFor } from '@testing-library/react';
import { GetPicturesSearchMocks } from './mocks';

const SearchHubMock = () => <div>SearchHubMock</div>;
jest.mock('../searchHub/SearchHub', () => SearchHubMock);

const SearchBarMock = () => <div>SearchBarMock</div>;
jest.mock('../SearchBar', () => SearchBarMock);

describe('SearchView called without any parameters', () => {
  beforeEach(() => renderRoute('/search'));

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
  beforeEach(() => renderRouteWithAPIMocks('/search?q=invalid+params', GetPicturesSearchMocks));

  it('should render a SearchBar', async () => {
    await waitFor(() => {
      const searchBar = screen.getByText('SearchBarMock');
      expect(searchBar).toBeInTheDocument();
    });
  });

  it('should render a text which informs, that there is no matching picture', async () => {
    await waitFor(() => {
      const noPictureMessage = screen.getByText('common.no-picture');
      expect(noPictureMessage).toBeInTheDocument();
    });
  });

  it('should not render the SearchHub', async () => {
    await waitFor(() => {
      expect(() => screen.getAllByText('SearchHubMock')).toThrow();
    });
  });
});

describe('SearchView called with parameters which match at least one picture', () => {
  beforeEach(() => renderRouteWithAPIMocks('/search?q=Onkel+Pelle', GetPicturesSearchMocks));

  it('should render a SearchBar', async () => {
    await waitFor(() => {
      const searchBar = screen.getByText('SearchBarMock');
      expect(searchBar).toBeInTheDocument();
    });
  });

  it('should render at least one picture', async () => {
    await waitFor(() => {
      //As every other component besides the PictureScrollGrid is mocked, the remaining image(s) have to be the query results
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
