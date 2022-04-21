import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';
import { renderRouteWithAPIMocks } from '../../../../testUtils';
import {
  GetCollectionInfoDocumentMocks,
  GetCollectionsPublishedAfterDateMocks,
  GetRootCollectionMocks,
} from './mocks';

const CommunityViewMocks: MockedResponse[] = [
  ...GetCollectionsPublishedAfterDateMocks,
  ...GetCollectionInfoDocumentMocks,
  ...GetRootCollectionMocks,
];

describe('BrowseView', () => {
  describe('CommunityView', () => {
    describe('Integration', () => {
      describe('With PictureScrollOverview Mock', () => {
        const PictureScrollOverviewMock = () => <div>PictureScrollOverviewMock</div>;
        jest.mock('../../shared/PictureScrollOverview', () => PictureScrollOverviewMock);

        test('CommunityView does not render/contain Das Herbert-Ahrens-Bilderarchiv as a collection', () => {
          renderRouteWithAPIMocks('/browse/latest', CommunityViewMocks);

          const communityView = screen.queryByText('Das Herbert-Ahrens-Bilderarchiv');
          expect(communityView).toBeNull();
        });

        test('When visiting browse/latest/Sole-Therme it renders and shows the sub collections of Sole-Therme that are latest collections', async () => {
          const { container } = renderRouteWithAPIMocks(
            '/browse/latest/Sole-Therme',
            CommunityViewMocks
          );

          await waitFor(() => {
            const testElements = Array.from(container.getElementsByTagName('img'));
            const testImgSole = testElements.filter(
              testElement => testElement.alt === 'Sole-Therme 1956-1970'
            );
            const testImgSole2 = testElements.filter(
              testElement => testElement.alt === 'Sole-Therme 1980-1990'
            );
            expect(testImgSole).toHaveLength(1);
            expect(testImgSole2).toHaveLength(1);
          });
        });

        test('When visiting browse/latest/Sole-Therme it renders and does not show the sub collections of Sole-Therme that are not latest collections', async () => {
          const { container } = renderRouteWithAPIMocks(
            '/browse/latest/Sole-Therme',
            CommunityViewMocks
          );

          await waitFor(() => {
            const testElements = Array.from(container.getElementsByTagName('img'));
            const testImgSoleNotLatest = testElements.filter(
              testElement => testElement.alt === 'Sole-Therme not latest'
            );
            expect(testImgSoleNotLatest).toHaveLength(0);
            const items = container.getElementsByClassName('item');
            expect(items.length).toBe(2);
          });
        });

        test('When visiting browse/latest/ it renders and shows the sub collections of the first level collection that are latest collections', async () => {
          const { container } = renderRouteWithAPIMocks('/browse/latest/', CommunityViewMocks);

          await waitFor(() => {
            // Component Test approach - black box
            const pictureDetails = screen.getByText('SOLE-THERME');
            expect(pictureDetails).toBeInTheDocument();

            // White Box approach
            const testElements = Array.from(container.getElementsByTagName('img'));
            const testImgSole = testElements.filter(
              testElement => testElement.alt === 'Sole-Therme'
            );
            const testImgOnkelPelle = testElements.filter(
              testElement => testElement.alt === 'Onkel-Pelle'
            );
            expect(testImgSole).toHaveLength(1);
            expect(testImgOnkelPelle).toHaveLength(1);
          });
        });

        test('When visiting browse/latest/ it renders and does not show the sub collections of first level collection that are not latest collections', async () => {
          const { container } = renderRouteWithAPIMocks('/browse/latest/', CommunityViewMocks);

          await waitFor(() => {
            const testElements = Array.from(container.getElementsByTagName('img'));
            const testImgNotLatest = testElements.filter(
              testElement => testElement.alt === 'Not latest'
            );
            expect(testImgNotLatest).toHaveLength(0);
            const items = container.getElementsByClassName('item');
            expect(items.length).toBe(2);
          });
        });

        test('When visiting browse/latest/ it does not show the first level collection', async () => {
          const { container } = renderRouteWithAPIMocks('/browse/latest/', CommunityViewMocks);

          await waitFor(() => {
            const testElements = Array.from(container.getElementsByTagName('img'));
            const testImgHerbertAhrens = testElements.filter(
              testElement => testElement.alt === 'Herbert-Ahrens-Bilder-Archiv'
            );
            expect(testImgHerbertAhrens).toHaveLength(0);

            // count occurrences of tags displayed-has to be 2
            const items = container.getElementsByClassName('item');
            expect(items.length).toBe(2);
          });
        });
      });
    });
  });
});
