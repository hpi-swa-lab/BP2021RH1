import React from 'react';
import { render } from '@testing-library/react';
import { flattenQueryResponseData } from '../../../graphql/queryUtils';
import { DescriptionMocks } from '../../picture/tests/mocks';
import PictureDetails from '../PictureDetails';
import { FlatDescription } from '../../../graphql/additionalFlatTypes';

test('PictureDetails renders passed descriptions', () => {
  const { container } = render(
    <PictureDetails
      descriptions={flattenQueryResponseData(DescriptionMocks) as FlatDescription[]}
    />
  );

  const descriptions = container.querySelectorAll('.pictureDetails > .description');
  expect(descriptions).toHaveLength(2);

  expect(descriptions.item(0)).toHaveTextContent('My fancy description');
  expect(descriptions.item(1)).toHaveTextContent('My fancy description yeah');
});

test('PictureDetails renders correctly when passed empty description array', () => {
  const { container } = render(<PictureDetails descriptions={[]} />);

  const pictureDetails = container.querySelector('.pictureDetails');
  expect(pictureDetails).toBeEmptyDOMElement();
});

test('PictureDetails renders correctly when passed undefined description array', () => {
  const { container } = render(<PictureDetails descriptions={undefined} />);

  const pictureDetails = container.querySelector('.pictureDetails');
  expect(pictureDetails).toBeEmptyDOMElement();
});
