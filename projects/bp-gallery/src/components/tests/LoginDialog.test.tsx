import React from 'react';
import LoginDialog from '../LoginDialog';
import { render } from '@testing-library/react';

describe('LoginScreen', () => {
  it('should render two input fields and a submit button', () => {
    render(<LoginDialog open={true} onClose={() => {}} />);

    const inputFields = document.getElementsByClassName('input-field');
    expect(inputFields).toHaveLength(2);

    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
  });

  it('should not show any error messages by default', () => {
    render(<LoginDialog open={true} onClose={() => {}} />);

    const errorAlert = document.getElementsByClassName('MuiAlert-message');
    expect(errorAlert.length).toBe(0);

    const inputFielsInErrorState = document.getElementsByClassName('Mui-error');
    expect(inputFielsInErrorState.length).toBe(0);
  });
});
