import React from 'react';
import CategoryPictureDisplay from '../CategoryPictureDisplay';
import { render, screen } from '@testing-library/react';

const CategoryDescriptionMock = jest.fn();
const CategoryDescriptionMockComponent = (props: any) => {
  CategoryDescriptionMock(props);
  return <div>CategoryDescriptionMock</div>;
};
jest.mock('../CategoryDescription', () => CategoryDescriptionMockComponent);

const SubCategoriesMock = jest.fn();
const SubCategoriesMockComponent = (props: any) => {
  SubCategoriesMock(props);
  return <div>SubCategoriesMock</div>;
};
jest.mock('../SubCategories', () => SubCategoriesMockComponent);

const PictureScrollGridMock = jest.fn();
const PictureScrollGridMockComponent = (props: any) => {
  PictureScrollGridMock(props);
  return <div>PictureScrollGridMock</div>;
};
jest.mock('../../common/PictureScrollGrid', () => PictureScrollGridMockComponent);
describe('CategoryPictureDisplay', () => {
  describe('CommunityViewMode', () => {
    describe('Unit', () => {
      //potentially not necessary to specify relatedTags
      const relatedTags = [
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
      const categoryTags = [
        {
          name: 'Das Herbert-Ahrens-Bilderarchiv',
          description: 'Einen „unglaublichen Schatz“ ...',
          related_tags: relatedTags,
          id: '1',
        },
      ];
      const path = ['test/path'];
      const picturePublishingDate = '05.05.2000';

      test('Renders CategoryDescription component', async () => {
        render(
          <CategoryPictureDisplay
            path={path}
            scrollPos={0}
            scrollHeight={0}
            categoryTags={categoryTags}
            picturePublishingDate={picturePublishingDate}
          />
        );

        const categoryDescriptionDetails = screen.getByText('CategoryDescriptionMock');
        expect(categoryDescriptionDetails).toBeInTheDocument();
        expect(CategoryDescriptionMock).toHaveBeenCalledWith(
          expect.objectContaining({
            description: categoryTags[0].description,
            name: categoryTags[0].name,
          })
        );
      });

      test('Renders SubCategories component', async () => {
        render(
          <CategoryPictureDisplay
            path={path}
            scrollPos={0}
            scrollHeight={0}
            categoryTags={categoryTags}
            picturePublishingDate={picturePublishingDate}
          />
        );

        const subCategoriesDetails = screen.getByText('SubCategoriesMock');
        expect(subCategoriesDetails).toBeInTheDocument();
        expect(SubCategoriesMock).toHaveBeenCalledWith(
          expect.objectContaining({
            relatedTags: categoryTags[0].related_tags as unknown as {
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
          <CategoryPictureDisplay
            path={path}
            scrollPos={0}
            scrollHeight={0}
            categoryTags={categoryTags}
            picturePublishingDate={picturePublishingDate}
          />
        );

        const pictureScrollGridDetails = screen.getByText('PictureScrollGridMock');
        expect(pictureScrollGridDetails).toBeInTheDocument();

        expect(PictureScrollGridMock).toHaveBeenCalledWith(
          expect.objectContaining({
            filters: {
              and: [
                { category_tags: { id: { eq: categoryTags[0].id } } },
                { publishedAt: { gt: picturePublishingDate } },
              ],
            },
            scrollPos: 0,
            scrollHeight: 0,
            hashbase: categoryTags[0].name,
          })
        );
      });
    });
  });
});
