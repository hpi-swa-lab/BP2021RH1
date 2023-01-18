import React from 'react';
import LoginDialog from '../LoginDialog';
import { fireEvent, render } from '@testing-library/react';

describe('LoginScreen', () => {
  it('should render two input fields, a toggle password button and a submit button', () => {
    render(<LoginDialog open={true} onClose={() => {}} />);

    const inputFields = document.getElementsByClassName('input-field');
    expect(inputFields).toHaveLength(2);

    const togglePasswordButton = document.querySelector('.MuiIconButton-root');
    expect(togglePasswordButton).toBeInTheDocument();

    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
  });

  it('should change the input field type when the toggle password button is pressed', () => {
    render(<LoginDialog open={true} onClose={() => {}} />);

    const findInputField = () => {
      return document.getElementById('password');
    };

    expect(findInputField()).toHaveAttribute('type', 'password');

    const togglePasswordButton = document.getElementById('toggleButton');
    fireEvent.click(togglePasswordButton!);
    expect(findInputField()).toHaveAttribute('type', 'text');
  });

  it('should not show any error messages by default', () => {
    render(<LoginDialog open={true} onClose={() => {}} />);

    const errorAlerts = document.getElementsByClassName('MuiAlert-message');
    expect(errorAlerts).toHaveLength(0);

    const inputFieldsInErrorState = document.getElementsByClassName('Mui-error');
    expect(inputFieldsInErrorState).toHaveLength(0);
  });
});
