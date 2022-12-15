import React from 'react';
import { screen } from '@testing-library/react';
import { PictureMocks } from '../../../tests/mocks';
import { flattenQueryResponseData } from '../../../../../../graphql/queryUtils';
import PictureInfo from '../PictureInfo';
import { FlatPicture } from '../../../../../../types/additionalFlatTypes';
import { renderWithAPIMocks } from '../../../../../../testUtils';

describe('PictureInfo', () => {
  it('should render the pictures time range tag', async () => {
    renderWithAPIMocks(
      <PictureInfo
        picture={flattenQueryResponseData(PictureMocks) as FlatPicture}
        onSave={() => {}}
      />
    );

    const timeRangeTags = screen.getByText('10.10.1955 - 12.10.1955');
    expect(timeRangeTags).toBeInTheDocument();
  });

  it('should render the pictures descriptions', async () => {
    renderWithAPIMocks(
      <PictureInfo
        picture={flattenQueryResponseData(PictureMocks) as FlatPicture}
        onSave={() => {}}
      />
    );

    const description1 = screen.getByText('My fancy description');
    expect(description1).toBeInTheDocument();
    const description2 = screen.getByText('My fancy description yeah');
    expect(description2).toBeInTheDocument();
  });

  it('should render the pictures keyword tags', async () => {
    renderWithAPIMocks(
      <PictureInfo
        picture={flattenQueryResponseData(PictureMocks) as FlatPicture}
        onSave={() => {}}
      />
    );

    const tag = screen.getByText('keyword_tag');
    expect(tag).toBeInTheDocument();
  });

  it('should render the pictures person tags', async () => {
    renderWithAPIMocks(
      <PictureInfo
        picture={flattenQueryResponseData(PictureMocks) as FlatPicture}
        onSave={() => {}}
      />
    );

    const tag = screen.getByText('Person test');
    expect(tag).toBeInTheDocument();
  });

  it('should render the pictures location tags', async () => {
    renderWithAPIMocks(
      <PictureInfo
        picture={flattenQueryResponseData(PictureMocks) as FlatPicture}
        onSave={() => {}}
      />
    );

    const tag = screen.getByText('A place in Bad Harzburg');
    expect(tag).toBeInTheDocument();
  });
});
