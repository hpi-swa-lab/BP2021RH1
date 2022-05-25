import React from 'react';
import { render } from '@testing-library/react';
import ItemList from '../ItemList';
import { ItemListItemModel } from '../ItemListItem';

const items: ItemListItemModel[] = [
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

test('Item List should show elements', () => {
  const { container } = render(<ItemList items={items} />);
  const links = container.querySelectorAll('.item');
  expect(links).toHaveLength(items.length);
  links.forEach((link: Element, key: number) => {
    expect(link.querySelector('img')?.src).toBe(items[key].background);
    expect(link.querySelector('.text-container')).toHaveTextContent(
      String(items[key].name).toUpperCase()
    );
    expect(link.querySelector('.color-overlay')).toHaveStyle({ backgroundColor: items[key].color });
  });
});

test('Item list should be able to go compact', () => {
  let { container } = render(<ItemList items={items} />);
  expect(container.querySelector('.item-list')?.classList).toContain('large');
  expect(container.querySelector('.item-list')?.classList).not.toContain('compact');

  container = render(<ItemList items={items} compact={true} />).container;
  expect(container.querySelector('.item-list')?.classList).not.toContain('large');
  expect(container.querySelector('.item-list')?.classList).toContain('compact');
});
