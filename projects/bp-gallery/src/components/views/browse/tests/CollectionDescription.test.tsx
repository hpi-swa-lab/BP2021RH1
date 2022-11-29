//tests for changing open/closed description based on description length do not work here
// as we render the text in getLineBreaks which does not have a specific width

import React from 'react';
import { render } from '@testing-library/react';
import CollectionDescription from '../CollectionDescription';

test('collection page shows the coresponding collection info', () => {
  const id = '1';
  const descr = 'collection description';
  const name = 'collection name';
  const { container } = render(<CollectionDescription id={id} description={descr} name={name} />);

  const collectionNameElements = container.getElementsByTagName('h2');
  const collectionDescriptionElements = container.getElementsByClassName('collection-description');

  expect(collectionNameElements).toHaveLength(1);
  expect(collectionNameElements.item(0)).toHaveTextContent(name);

  expect(collectionDescriptionElements).toHaveLength(1);
  expect(collectionDescriptionElements.item(0)).toHaveTextContent(descr);
});
