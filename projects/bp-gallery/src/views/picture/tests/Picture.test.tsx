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

test('Picture calls onPictureHeightChange function back', () => {
  const pictureUrl = 'test-image.jpg';
  const callback = jest.fn();

  const { rerender } = render(
    <Picture url={pictureUrl} onPictureHeightChange={callback} scrollPos={0} />
  );
  // callback on initial render
  expect(callback).toHaveBeenCalledTimes(1);

  callback.mockReset();
  // rerender without props update
  rerender(<Picture url={pictureUrl} onPictureHeightChange={callback} scrollPos={0} />);
  // no callback because nothing changed
  expect(callback).toHaveBeenCalledTimes(0);

  // rerender with updated scrollPos
  rerender(<Picture url={pictureUrl} onPictureHeightChange={callback} scrollPos={100} />);
  // callback because scrollPos changed
  expect(callback).toHaveBeenCalledTimes(1);
});
