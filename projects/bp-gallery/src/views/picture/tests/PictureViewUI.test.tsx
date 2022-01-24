import { render } from '@testing-library/react';
import React from 'react';
import PictureViewUI from '../PictureViewUI';

describe('Picture View UI', () => {
  it('should display bh-logo', async () => {
    const { container } = render(<PictureViewUI maxHeight='500px' calledViaLink={true} />);

    const logo = container.querySelector('.bh-logo');
    expect(logo).toBeInTheDocument();
    expect(logo?.children[0].getAttribute('src')).toBe('/bad-harzburg-stiftung-logo.png');
  });

  describe('Back button', () => {
    it('should render the back to home button on called via link', async () => {
      const { container } = render(<PictureViewUI maxHeight='500px' calledViaLink={true} />);

      const backButton: HTMLButtonElement | null = container.querySelector(
        '.picture-toolbar > button'
      );
      expect(backButton).toBeInTheDocument();
      expect(backButton?.innerHTML).toContain('common.back-to-home');
    });

    it('should render the back button on not called via link', async () => {
      const { container } = render(<PictureViewUI maxHeight='500px' calledViaLink={false} />);

      const backButton: HTMLButtonElement | null = container.querySelector(
        '.picture-toolbar > button'
      );
      expect(backButton).toBeInTheDocument();
      expect(backButton?.innerHTML).toContain('common.back');
      expect(backButton?.innerHTML).not.toContain('common.back-to-home');
    });
  });
});
