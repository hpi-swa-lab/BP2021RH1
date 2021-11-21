import React from 'react';
import { render } from '@testing-library/react';
import ItemList, { ItemListItem } from './ItemList';

test('Item List should show elements', () => {
  const items: ItemListItem[] = [
    {
      background: window.location.origin + '/test-image.jpg',
      name: 'test item list 1',
      color: 'red',
    },
    {
      background: window.location.origin + '/test-image.jpg',
      name: 'test item list 2',
      color: 'white',
    },
    {
      background: window.location.origin + '/test-image.jpg',
      name: 'test item list 3',
      color: 'blue',
    },
  ];
  const { container } = render(<ItemList items={items} />);
  const links = container.querySelectorAll('.item');
  expect(links).toHaveLength(items.length);
  links.forEach((link: Element, key: number) => {
    expect(link.querySelector('img')?.src).toBe(items[key].background);
    expect(link.querySelector('.text-container')).toHaveTextContent(items[key].name.toUpperCase());
    expect(link.querySelector('.color-overlay')).toHaveStyle({ backgroundColor: items[key].color });
  });
});
