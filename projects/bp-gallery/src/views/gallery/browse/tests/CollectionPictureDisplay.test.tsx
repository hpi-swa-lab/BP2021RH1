import React from 'react';
import { render, screen } from '@testing-library/react';
import CollectionPictureDisplay from '../CollectionPictureDisplay';

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
jest.mock('../../common/PictureScrollGrid', () => PictureScrollGridMockComponent);
describe('CollectionPictureDisplay', () => {
  describe('CommunityViewMode', () => {
    describe('Unit', () => {
      //potentially not necessary to specify child collections
      const childCollections = [
        {
          name: 'Hohegeiß',
          thumbnail: {
            media: {
              formats: {
                medium: {
                  ext: '.jpg',
                  url: 'test-image2.jpg',
                  hash: '',
                  mime: 'image2/jpeg',
                  name: 'Hohegeiß',
                  path: null,
                  size: -1,
                },
              },
            },
          },
          id: '6',
        },
        {
          name: 'Walpurgis',
          thumbnail: {
            media: {
              formats: {
                medium: {
                  ext: '.jpg',
                  url: 'test-image2.jpg',
                  hash: '',
                  mime: 'image2/jpeg',
                  name: 'Walpurgis',
                  path: null,
                  size: -1,
                },
              },
            },
          },
          id: '3',
        },
      ];
      const collections = [
        {
          name: 'Das Herbert-Ahrens-Bilderarchiv',
          description: 'Einen „unglaublichen Schatz“ ...',
          child_collections: childCollections,
          id: '1',
        },
      ];
      const path = ['test/path'];
      const picturePublishingDate = '05.05.2000';

      test('Renders CollectionDescription component', async () => {
        render(
          <CollectionPictureDisplay
            path={path}
            scrollPos={0}
            scrollHeight={0}
            collections={collections}
            picturePublishingDate={picturePublishingDate}
          />
        );

        const collectionDescriptionDetails = screen.getByText('CollectionDescriptionMock');
        expect(collectionDescriptionDetails).toBeInTheDocument();
        expect(CollectionDescriptionMock).toHaveBeenCalledWith(
          expect.objectContaining({
            description: collections[0].description,
            name: collections[0].name,
          })
        );
      });

      test('Renders SubCollections component', async () => {
        render(
          <CollectionPictureDisplay
            path={path}
            scrollPos={0}
            scrollHeight={0}
            collections={collections}
            picturePublishingDate={picturePublishingDate}
          />
        );

        const subCollectionsDetails = screen.getByText('SubCollectionsMock');
        expect(subCollectionsDetails).toBeInTheDocument();
        expect(SubCollectionsMock).toHaveBeenCalledWith(
          expect.objectContaining({
            childCollections: collections[0].child_collections as unknown as {
              thumbnail: any[];
              name: string;
            }[],
            path: path,
            communityView: !!picturePublishingDate,
          })
        );
      });

      test('Renders PictureScrollGrid component', () => {
        render(
          <CollectionPictureDisplay
            path={path}
            scrollPos={0}
            scrollHeight={0}
            collections={collections}
            picturePublishingDate={picturePublishingDate}
          />
        );

        const pictureScrollGridDetails = screen.getByText('PictureScrollGridMock');
        expect(pictureScrollGridDetails).toBeInTheDocument();

        expect(PictureScrollGridMock).toHaveBeenCalledWith(
          expect.objectContaining({
            filters: {
              and: [
                { collections: { id: { eq: collections[0].id } } },
                { publishedAt: { gt: picturePublishingDate } },
              ],
            },
            scrollPos: 0,
            scrollHeight: 0,
            hashbase: collections[0].name,
          })
        );
      });
    });
  });
});
