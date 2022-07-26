import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import BrowseView from '../BrowseView';
import { renderWithAPIMocks } from '../../../../testUtils';
import { GetCollectionInfoDocumentMocks, GetRootCollectionMocks } from './mocks';

const CollectionDescriptionMock = jest.fn();
const CollectionDescriptionMockComponent = (props: any) => {
  CollectionDescriptionMock(props);
  return <div>CollectionDescriptionMock</div>;
};
jest.mock('../CollectionDescription', () => CollectionDescriptionMockComponent);

const SubCollectionsMock = jest.fn();
const SubCollectionsMockComponent = (props: any) => {
  SubCollectionsMock(props);
  return <div>SubCollectionsMock</div>;
};
jest.mock('../SubCollections', () => SubCollectionsMockComponent);

const PictureScrollGridMock = jest.fn();
const PictureScrollGridMockComponent = (props: any) => {
  PictureScrollGridMock(props);
  return <div>PictureScrollGridMock</div>;
};
jest.mock(
  '../../../common/picture-gallery/PictureScrollGrid',
  () => PictureScrollGridMockComponent
);

const BrowseViewMocks = [...GetCollectionInfoDocumentMocks, ...GetRootCollectionMocks];

describe('BrowseView', () => {
  const rootCollectionData = {
    id: '1',
    name: 'Das Herbert-Ahrens-Bilderarchiv',
  };

  test('Renders CollectionDescription component', async () => {
    renderWithAPIMocks(<BrowseView />, BrowseViewMocks);

    await waitFor(() => {
      const collectionDescriptionDetails = screen.getByText('CollectionDescriptionMock');
      expect(collectionDescriptionDetails).toBeInTheDocument();

      expect(CollectionDescriptionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: rootCollectionData.name,
        })
      );
    });
  });

  test('Renders SubCollections component', async () => {
    renderWithAPIMocks(<BrowseView />, BrowseViewMocks);

    await waitFor(() => {
      const subCollectionsDetails = screen.getByText('SubCollectionsMock');
      expect(subCollectionsDetails).toBeInTheDocument();

      expect(SubCollectionsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          childCollections: expect.arrayContaining([
            expect.objectContaining({ id: 2 }),
            expect.objectContaining({ id: 42 }),
            expect.objectContaining({ id: 49 }),
          ]),
        })
      );
    });
  });

  test('Renders PictureScrollGrid component', async () => {
    renderWithAPIMocks(<BrowseView />, BrowseViewMocks);

    await waitFor(() => {
      const pictureScrollGridDetails = screen.getByText('PictureScrollGridMock');
      expect(pictureScrollGridDetails).toBeInTheDocument();

      expect(PictureScrollGridMock).toHaveBeenCalledWith(
        expect.objectContaining({
          hashbase: rootCollectionData.name,
          queryParams: {
            and: [
              {
                collections: {
                  id: {
                    eq: rootCollectionData.id,
                  },
                },
              },
            ],
          },
        })
      );
    });
  });
});
