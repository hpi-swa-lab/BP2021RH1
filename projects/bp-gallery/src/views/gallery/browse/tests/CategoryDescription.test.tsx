//Falls description länger als 4 Zeilen button zum ausklappen
//class Name closed
//button funktioniert
//falls kürzer kein Button
// class name open

import React from 'react';
import { render, screen } from '@testing-library/react';
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

test('If the category description is shorter then 4 lines there is no button and the name is open', () => {
  const descr = 'category description';
  const name = 'category name';
  const { container } = render(<CategoryDescription description={descr} name={name} />);

  const ButtonElements = container.getElementsByTagName('button');
  const categoryDescriptionElements = container.getElementsByClassName('category-description open');

  expect(ButtonElements).toHaveLength(0);

  expect(categoryDescriptionElements).toHaveLength(1);
  expect(categoryDescriptionElements.item(0)).toHaveTextContent(descr);
});

test('category description shows a button for long text', () => {
  const descr = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   
    
    Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse`;

  const name = 'category name';
  const { container } = render(<CategoryDescription description={descr} name={name} />);
  console.log(container);
  const ButtonElements = container.getElementsByTagName('button');
  const categoryOpenElements = container.getElementsByClassName('category-description open');
  const categoryClosedElements = container.getElementsByClassName('category-description closed');

  expect(ButtonElements).toHaveLength(1);
  expect(categoryOpenElements).toHaveLength(0);
  expect(categoryClosedElements).toHaveLength(1);
});
