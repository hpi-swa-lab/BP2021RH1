import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { ReactComponentElement } from 'react';
import { PictureViewContext } from '../PictureView';

const MockedPictureView = ({ children }: { children: any }) => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  return (
    <PictureViewContext.Provider
      value={{
        sideBarOpen,
        setSideBarOpen,
      }}
    >
      {children}
    </PictureViewContext.Provider>
  );
};

export const renderWithPictureContextMocks = (component: ReactComponentElement<any>) => {
  return render(<MockedPictureView>{component}</MockedPictureView>);
};
