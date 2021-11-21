import { renderRoute } from '../../testUtils';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { useTranslation } from 'react-i18next';

test('Nav bar contains picture, details and comment button', async () => {
  const { t } = useTranslation();
  renderRoute('/picture/1');

  await waitForElementToBeRemoved(() => screen.getByText(t('common.loading').toString()));
  const navBarLinks = document.querySelectorAll('.nav-element-title');
  expect(navBarLinks.length).toBe(3);
  expect(
    Array.prototype.every.call(navBarLinks, link =>
      ['common.picture', 'common.details', 'common.comments'].includes(link.innerHTML as string)
    )
  ).toBe(true);
});

test('PictureView should include a picture, and a details,comments container', async () => {
  const { t } = useTranslation();
  renderRoute('/picture/1');

  await waitForElementToBeRemoved(() => screen.getByText(t('common.loading').toString()));
  const pictureContainer = document.querySelectorAll('.picture');
  const detailsContainer = document.querySelectorAll('.pictureDetails');
  const commentsContainer = document.querySelectorAll('.pictureComments');
  expect(pictureContainer.length).toEqual(1);
  expect(detailsContainer.length).toEqual(1);
  expect(commentsContainer.length).toEqual(1);
});
