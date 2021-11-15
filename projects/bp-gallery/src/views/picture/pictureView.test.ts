import { renderRoute } from '../../testUtils';
import { getByText, render, waitForElementToBeRemoved, screen, act } from '@testing-library/react';
import { useTranslation } from 'react-i18next';

test('Nav bar contains picture, details and commen button', () => {
  renderRoute('/picture/1');

  const navBarLinks = document.querySelectorAll('.nav-bar > .nav-element > .nav-element-title');

  expect(navBarLinks.length).toBe(3);
  expect(
    Array.prototype.every.call(navBarLinks, link =>
      ['common.picture', 'common.details', 'common.comments'].includes(link.innerHTML as string)
    )
  ).toBe(true);
});

test('PictureView should include a picture, and a details,comments container', async () => {
  const { t } = useTranslation();
  const { container } = renderRoute('/picture/1');

  await waitForElementToBeRemoved(() => screen.getByText(t('common.loading').toString()));
  const pictureContainer = document.querySelectorAll('.picture-view > .picture');
  const detailsContainer = document.querySelectorAll('.picture-view > .pictureDetails');
  const commentsContainer = document.querySelectorAll('.picture-view > .pictureComments');
  expect(pictureContainer.length).toEqual(1);
  expect(detailsContainer.length).toEqual(1);
  expect(commentsContainer.length).toEqual(1);
});
