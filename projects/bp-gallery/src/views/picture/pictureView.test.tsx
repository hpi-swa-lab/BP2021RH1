import { renderRoute } from '../../testUtils';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { useTranslation } from 'react-i18next';

test('Nav bar contains picture, details and comment button', async () => {
  const { t } = useTranslation();
  const { container } = renderRoute('/picture/1');

  await waitForElementToBeRemoved(() => screen.getByText(t('common.loading').toString()));
  const navBarLinks = container.querySelectorAll('.nav-element-title');
  expect(navBarLinks).toHaveLength(3);
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
  const pictureContainer = container.querySelectorAll('.picture');
  const detailsContainer = container.querySelectorAll('.pictureDetails');
  const commentsContainer = container.querySelectorAll('.pictureComments');
  expect(pictureContainer).toHaveLength(1);
  expect(detailsContainer).toHaveLength(1);
  expect(commentsContainer).toHaveLength(1);
});
