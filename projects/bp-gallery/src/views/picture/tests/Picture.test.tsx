import React from 'react';
import { render } from '@testing-library/react';
import { apiBase } from '../../../App';
import Picture from '../Picture';

test('Picture renders blur-background and actual picture', () => {
  const pictureUrl = 'test-image.jpg';

  const { container } = render(<Picture url={pictureUrl} />);

  const imageTags = container.getElementsByTagName('img');
  expect(imageTags).toHaveLength(2);

  expect(imageTags.item(0)).toHaveAttribute('src', `${apiBase}${pictureUrl}`);
  expect(imageTags.item(0)).toHaveClass('blur-background');
  expect(imageTags.item(1)).toHaveAttribute('src', `${apiBase}${pictureUrl}`);
  expect(imageTags.item(1)).not.toHaveClass('blur-background');
});
