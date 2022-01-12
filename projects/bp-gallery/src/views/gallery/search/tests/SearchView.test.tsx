import React from 'react';
import { renderRoute } from '../../../../testUtils';
import { screen } from '@testing-library/react';

const SearchHubMock = () => <div>SearchHubMock</div>;
jest.mock('../searchHub/SearchHub', () => SearchHubMock);

const SearchBarMock = () => <div>SearchBarMock</div>;
jest.mock('../SearchBar', () => SearchBarMock);

const SearchResultBannerMock = () => <div>SearchResultBannerMock</div>;
jest.mock('../SearchResultBanner', () => SearchResultBannerMock);

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

  it('should not render a SearchResultBanner', () => {
    expect(() => screen.getAllByText('SearchResultBannerMock')).toThrow();
  });

  it('should not render any pictures', () => {
    const searchViewContainer = document.getElementsByClassName('search-view')[0];
    const picturesInSearchView = searchViewContainer.getElementsByTagName('img');
    expect(picturesInSearchView.length).toEqual(0);
  });
});
