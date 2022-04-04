import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithPictureContextMocks } from '../../picture/tests/pictureTestUtils';
import { DescriptionMocks, PictureMocks } from '../../picture/tests/mocks';
import { flattenQueryResponseData } from '../../../graphql/queryUtils';
import PictureInfo from '../PictureInfo';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';

const PictureDetailsMock = jest.fn();
const PictureDetailsMockComponent = (props: any) => {
  PictureDetailsMock(props);
  return <div>PictureDetailsMock</div>;
};
jest.mock('../PictureDetails', () => PictureDetailsMockComponent);

describe('PictureInfo', () => {
  it('should render the pictures time range tag', async () => {
    renderWithPictureContextMocks(
      <PictureInfo picture={flattenQueryResponseData(PictureMocks) as FlatPicture}>
        <span></span>
      </PictureInfo>
    );

    const timeRangeTags = screen.getByText('10.10.1955 - 12.10.1955');
    expect(timeRangeTags).toBeInTheDocument();
  });

  it('should render the picture details', async () => {
    renderWithPictureContextMocks(
      <PictureInfo picture={flattenQueryResponseData(PictureMocks) as FlatPicture}>
        <span></span>
      </PictureInfo>
    );

    const pictureDetails = screen.getByText('PictureDetailsMock');
    expect(pictureDetails).toBeInTheDocument();

    expect(PictureDetailsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        descriptions: flattenQueryResponseData(DescriptionMocks),
      })
    );
  });
});
