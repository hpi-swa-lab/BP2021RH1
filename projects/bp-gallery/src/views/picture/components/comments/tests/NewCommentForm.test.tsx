import React from 'react';
import { renderWithAPIMocks } from '../../../../../testUtils';
import NewCommentForm from '../NewCommentForm';
import { MOCKED_COMMENT_POST_DATE, PostCommentDocumentMocks } from './mocks';

describe('NewCommentForm', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(MOCKED_COMMENT_POST_DATE).getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('contains two input fields and a submit button', () => {
    const { container } = renderWithAPIMocks(
      <NewCommentForm pictureId='1' />,
      PostCommentDocumentMocks
    );

    const inputFields = container.querySelectorAll('.MuiInputBase-input:not([readonly])');
    expect(inputFields).toHaveLength(2);
    inputFields.forEach(input => expect(input).toBeInTheDocument());

    const submitButtons = container.querySelectorAll('button[type="submit"]');
    expect(submitButtons).toHaveLength(1);
    expect(submitButtons[0]).toBeInTheDocument();
  });
});
