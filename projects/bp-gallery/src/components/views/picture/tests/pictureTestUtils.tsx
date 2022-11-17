import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { ReactComponentElement } from 'react';
import { PictureViewContext, PictureViewContextFields } from '../PictureView';
import { renderWithAPIMocks } from '../../../../testUtils';
import { MockedResponse } from '@apollo/client/testing';

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
  state?: PictureViewContextFields,
  mocks?: MockedResponse<Record<string, any>>[] | undefined
) => {
  return mocks
    ? renderWithAPIMocks(<MockedPictureView state={state}>{component}</MockedPictureView>, mocks)
    : render(<MockedPictureView state={state}>{component}</MockedPictureView>);
};
