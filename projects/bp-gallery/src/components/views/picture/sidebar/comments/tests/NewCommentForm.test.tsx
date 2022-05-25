import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithAPIMocks } from '../../../../../../testUtils';
import NewCommentForm from '../NewCommentForm';
import { MOCKED_COMMENT_POST_DATE, PostCommentDocumentMocks } from './mocks';

jest.mock('../helpers/getCurrentDateTimeString', () => () => MOCKED_COMMENT_POST_DATE);

describe('NewCommentForm', () => {
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

  it('does reset the input fields if posting succeeded', async () => {
    const { container } = renderWithAPIMocks(
      <NewCommentForm pictureId='1' />,
      PostCommentDocumentMocks
    );

    const inputFields = container.querySelectorAll('.MuiInputBase-input:not([readonly])');
    const inputFieldForCommentAuthor = inputFields[0];
    const inputFieldForCommentText = inputFields[1];
    const submitButton = container.querySelectorAll('button[type="submit"]')[0];

    fireEvent.change(inputFieldForCommentAuthor, {
      target: { value: 'Onkel Pelle' },
    });
    fireEvent.change(inputFieldForCommentText, {
      target: { value: 'This comment will be posted' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(inputFieldForCommentAuthor).toHaveValue('');
      expect(inputFieldForCommentText).toHaveValue('');
    });
  });

  it('does not reset the input fields if posting failed', async () => {
    const { container } = renderWithAPIMocks(
      <NewCommentForm pictureId='2' />,
      PostCommentDocumentMocks
    );

    const inputFields = container.querySelectorAll('.MuiInputBase-input:not([readonly])');
    const inputFieldForCommentAuthor = inputFields[0];
    const inputFieldForCommentText = inputFields[1];
    const submitButton = container.querySelectorAll('button[type="submit"]')[0];

    fireEvent.change(inputFieldForCommentAuthor, {
      target: { value: 'Onkel Pelle' },
    });
    fireEvent.change(inputFieldForCommentText, {
      target: { value: 'This comment will crash' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(inputFieldForCommentAuthor).not.toHaveValue('');
      expect(inputFieldForCommentText).not.toHaveValue('');
    });
  });
});
