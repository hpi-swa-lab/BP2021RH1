//tests for changing open/closed description based on description length do not work here
// as we render the text in getLineBreaks which does not have a specific width

import React from 'react';
import { render } from '@testing-library/react';
import CategoryDescription from '../CategoryDescription';

test('category page shows the coresponding category info', () => {
  const descr = 'category description';
  const name = 'category name';
  const { container } = render(<CategoryDescription description={descr} name={name} />);

  const categoryNameElements = container.getElementsByTagName('h2');
  const categoryDescriptionElements = container.getElementsByClassName('category-description');

  expect(categoryNameElements).toHaveLength(1);
  expect(categoryNameElements.item(0)).toHaveTextContent(name);

  expect(categoryDescriptionElements).toHaveLength(1);
  expect(categoryDescriptionElements.item(0)).toHaveTextContent(descr);
});
