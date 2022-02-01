import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderRoute, renderRouteWithAPIMocks, renderWithAPIMocks } from '../../../../testUtils';
import CommunityView from '../CommunityView';
import { GetCategoryInfoDocumentMocks, GetCategoryTagsByPicturePublishingDateMocks } from './mocks';
import { CommentMocks } from '../../../picture/tests/mocks';
import { GetCategoryTagsByPicturePublishingDateDocument } from '../../../../graphql/APIConnector';

// const CommunityViewFirstLevelMock = () => <CommunityView scrollPos={0} scrollHeight={0} />;
// jest.mock('../CommunityView', () => CommunityViewFirstLevelMock);

describe('CommunityView', () => {
  describe('Integration', () => {
    describe('With PictureScrollGrid Mock', () => {
      const PictureScrollGridMock = () => <div>PictureScrollGridMock</div>;
      jest.mock('../../common/PictureScrollGrid', () => PictureScrollGridMock);

      test('CommunityView does not render/contain Das Herbert-Ahrens-Bilderarchiv as a category', () => {
        renderRoute('/browse/latest');

        const communityView = screen.getByText('Das Herbert-Ahrens-Bilderarchiv');
        expect(communityView).not.toBeInTheDocument();

        //const communityView = screen.get;
      });

      test('When visiting browse/latest/Sole-Therme it renders and shows the sub categories of Sole-Therme that are latest categories', async () => {
        const { container, unmount } = renderRouteWithAPIMocks('/browse/latest/Sole-Therme', [
          ...GetCategoryTagsByPicturePublishingDateMocks,
          ...GetCategoryInfoDocumentMocks,
        ]);

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt == 'Sole-Therme 1956-1970';
          });
          const testImgSole2 = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt == 'Sole-Therme 1980-1990';
          });
          expect(testImgSole).toHaveLength(1);
          expect(testImgSole2).toHaveLength(1);
        });
      });

      test('When visiting browse/latest/Sole-Therme it renders and does not show the sub categories of Sole-Therme that are not latest categories', async () => {
        const { container, unmount } = renderRouteWithAPIMocks('/browse/latest/Sole-Therme', [
          ...GetCategoryTagsByPicturePublishingDateMocks,
          ...GetCategoryInfoDocumentMocks,
        ]);

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt == 'Sole-Therme not latest';
          });
          expect(testImgSole).toHaveLength(0);
          const items = container.getElementsByClassName('item');
          expect(items.length).toBe(2);
        });
      });

      test('When visiting browse/latest/ it renders and shows the sub categories of the first level category that are latest categories', async () => {
        const { container, unmount } = renderRouteWithAPIMocks('/browse/latest/', [
          ...GetCategoryTagsByPicturePublishingDateMocks,
          ...GetCategoryInfoDocumentMocks,
        ]);

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt == 'Sole-Therme';
          });
          const testImgSole2 = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt == 'Onkel-Pelle';
          });
          expect(testImgSole).toHaveLength(1);
          expect(testImgSole2).toHaveLength(1);
        });
      });

      test('When visiting browse/latest/ it renders and does not show the sub categories of first level category that are not latest categories', async () => {
        const { container, unmount } = renderRouteWithAPIMocks('/browse/latest/', [
          ...GetCategoryTagsByPicturePublishingDateMocks,
          ...GetCategoryInfoDocumentMocks,
        ]);

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt == 'Not latest';
          });
          expect(testImgSole).toHaveLength(0);
          const items = container.getElementsByClassName('item');
          expect(items.length).toBe(2);
        });
      });

      test('When visiting browse/latest/ it does not show the first level category', async () => {
        const { container, unmount } = renderRouteWithAPIMocks('/browse/latest/', [
          ...GetCategoryTagsByPicturePublishingDateMocks,
          ...GetCategoryInfoDocumentMocks,
        ]);

        await waitFor(() => {
          const testElements = container.getElementsByTagName('img');
          const testImgSole = Array.prototype.filter.call(testElements, function (testElement) {
            return testElement.alt == 'Herbert-Ahrens-Bilder-Archiv';
          });
          expect(testImgSole).toHaveLength(0);

          //count occurences of tags displayed-has to be 2
          const items = container.getElementsByClassName('item');
          expect(items.length).toBe(2);
        });
      });
    });
  });

  describe('Unit', () => {
    const communityDate = '2021-11-24T10:50:45.978Z';

    const CategoryPictureDisplayMock = jest.fn();
    const CategoryPictureDisplayMockComponent = (props: any) => {
      CategoryPictureDisplayMock(props);
      return <div>CategoryPictureMock</div>;
    };
    //jest.mock('../CategoryPictureDisplay', () => CategoryPictureDisplayMockComponent);

    test('CommunitView renders contains Sole-Therme', async () => {
      renderWithAPIMocks(<CommunityView scrollPos={0} scrollHeight={0} />, [
        ...GetCategoryTagsByPicturePublishingDateMocks,
        ...GetCategoryInfoDocumentMocks,
      ]);

      await waitFor(() => {
        const categoryContainer = screen.getByText('CategoryPictureMock');
        expect(categoryContainer).toBeInTheDocument();

        expect(categoryContainer).toHaveBeenCalledWith(
          expect.objectContaining({
            date: new Date(communityDate),
          })
        );
      });
    });
  });
});
