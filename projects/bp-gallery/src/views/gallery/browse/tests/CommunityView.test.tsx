import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';
import { renderRouteWithAPIMocks } from '../../../../testUtils';
import { GetCategoryInfoDocumentMocks, GetCategoryTagsByPicturePublishingDateMocks } from './mocks';

const CommunityViewMocks: MockedResponse[] = [
  ...GetCategoryTagsByPicturePublishingDateMocks,
  ...GetCategoryInfoDocumentMocks,
];

describe('CommunityView', () => {
  describe('Integration', () => {
    describe('With PictureScrollGrid Mock', () => {
      const PictureScrollGridMock = () => <div>PictureScrollGridMock</div>;
      jest.mock('../../common/PictureScrollGrid', () => PictureScrollGridMock);

      test('CommunityView does not render/contain Das Herbert-Ahrens-Bilderarchiv as a category', () => {
        renderRouteWithAPIMocks('/browse/latest', CommunityViewMocks);

        const communityView = screen.queryByText('Das Herbert-Ahrens-Bilderarchiv');
        expect(communityView).toBeNull();

        //const communityView = screen.get;
      });

      test('When visiting browse/latest/Sole-Therme it renders and shows the sub categories of Sole-Therme that are latest categories', async () => {
        const { container } = renderRouteWithAPIMocks(
          '/browse/latest/Sole-Therme',
          CommunityViewMocks
        );

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt === 'Sole-Therme 1956-1970';
          });
          const testImgSole2 = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt === 'Sole-Therme 1980-1990';
          });
          expect(testImgSole).toHaveLength(1);
          expect(testImgSole2).toHaveLength(1);
        });
      });

      test('When visiting browse/latest/Sole-Therme it renders and does not show the sub categories of Sole-Therme that are not latest categories', async () => {
        const { container } = renderRouteWithAPIMocks(
          '/browse/latest/Sole-Therme',
          CommunityViewMocks
        );

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt === 'Sole-Therme not latest';
          });

          expect(testImgSole).toHaveLength(0);
          const items = container.getElementsByClassName('item');
          expect(items.length).toBe(2);
        });
      });

      test('When visiting browse/latest/ it renders and shows the sub categories of the first level category that are latest categories', async () => {
        const { container } = renderRouteWithAPIMocks('/browse/latest/', CommunityViewMocks);

        await waitFor(() => {
          //Component Test approach - black box
          const pictureDetails = screen.getByText('SOLE-THERME');
          expect(pictureDetails).toBeInTheDocument();

          //White Box approach
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt === 'Sole-Therme';
          });

          const testImgSole2 = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt === 'Onkel-Pelle';
          });
          expect(testImgSole).toHaveLength(1);
          expect(testImgSole2).toHaveLength(1);
        });
      });

      test('When visiting browse/latest/ it renders and does not show the sub categories of first level category that are not latest categories', async () => {
        const { container } = renderRouteWithAPIMocks('/browse/latest/', CommunityViewMocks);

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt === 'Not latest';
          });
          expect(testImgSole).toHaveLength(0);
          const items = container.getElementsByClassName('item');
          expect(items.length).toBe(2);
        });
      });

      test('When visiting browse/latest/ it does not show the first level category', async () => {
        const { container } = renderRouteWithAPIMocks('/browse/latest/', CommunityViewMocks);

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt === 'Herbert-Ahrens-Bilder-Archiv';
          });
          expect(testImgSole).toHaveLength(0);

          //count occurences of tags displayed-has to be 2
          const items = container.getElementsByClassName('item');
          expect(items.length).toBe(2);
        });
      });
    });
  });
});
