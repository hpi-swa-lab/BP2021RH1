import React, { useState, ReactComponentElement } from 'react';
import { render } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';
import { PictureViewContext, PictureViewContextFields } from '../PictureView';
import { renderWithAPIMocks } from '../../../testUtils';

const MockedPictureView = ({
  state,
  children,
}: {
  state?: PictureViewContextFields;
  children: any;
}) => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  return (
    <PictureViewContext.Provider
      value={
        state ?? {
          sideBarOpen,
          setSideBarOpen,
        }
      }
    >
      {children}
    </PictureViewContext.Provider>
  );
};

export const renderWithPictureContextMocks = (
  component: ReactComponentElement<any>,
  state?: PictureViewContextFields
) => {
  return render(<MockedPictureView state={state}>{component}</MockedPictureView>);
};

export const renderWithAPIMocksAndMockedPictureContext = (
  component: ReactComponentElement<any>,
  state?: PictureViewContextFields,
  apiMocks: MockedResponse[] = [],
  enableCache: boolean = false
) => {
  return renderWithAPIMocks(
    <MockedPictureView state={state}>{component}</MockedPictureView>,
    apiMocks,
    enableCache
  );
};
