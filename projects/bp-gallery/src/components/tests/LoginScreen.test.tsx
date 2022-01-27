import React from 'react';
import LoginScreen from '../LoginScreen';
import { render } from '@testing-library/react';

describe('LoginScreen', () => {
  it('should render two input fields and a submit button', () => {
    const { container } = render(<LoginScreen />);

    const inputFields = container.getElementsByClassName('input-field');
    expect(inputFields).toHaveLength(2);

    const submitButton = container.getElementsByTagName('button');
    expect(submitButton).toHaveLength(1);
    expect(submitButton[0]).toHaveAttribute('type', 'submit');
  });

  it('should not show any error messages by default', () => {
    const { container } = render(<LoginScreen />);

    const errorAlert = container.getElementsByClassName('MuiAlert-message');
    expect(errorAlert.length).toBe(0);

    const inputFielsInErrorState = container.getElementsByClassName('Mui-error');
    expect(inputFielsInErrorState.length).toBe(0);
  });
});
