import React from 'react';
import { RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinCommentDocument, UnpinCommentDocument } from '../../../../../../graphql/APIConnector';
import { renderWithAPIMocks } from '../../../../../../testUtils';
import { AuthRole, AuthContext } from '../../../../../provider/AuthProvider';
import FormattedComment from '../FormattedComment';
import { comments } from './mocks';
import { vi } from 'vitest';

const PictureViewMock = vi.fn();
const PictureViewMockComponent = (props: any) => {
  PictureViewMock(props);
  return <div>PictureViewMock</div>;
};
vi.doMock('../views/picture/PictureView', () => ({ default: PictureViewMockComponent }));

const mocks = [
  {
    request: {
      query: PinCommentDocument,
      variables: { commentId: '1' },
    },
    result: { data: comments.publishedAndUnpinned },
  },
  {
    request: {
      query: UnpinCommentDocument,
      variables: { commentId: '1' },
    },
    result: { data: comments.publishedAndPinned },
  },
];

const waitForReRender = async (component: RenderResult) => {
  await waitFor(() => {
    component.container.querySelector('.comment-details');
  });
};

const renderWithAuth = (role: AuthRole, component: JSX.Element) => {
  return renderWithAPIMocks(
    <AuthContext.Provider
      value={{
        role: role,
        login: (username: string, password: string) => {
          return new Promise(() => {});
        },
        logout: () => {},
        loading: false,
      }}
    >
      {component}
    </AuthContext.Provider>,
    mocks
  );
};

describe('FormattedComment', () => {
  it('shows a comment pin button as a curator', () => {
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <FormattedComment comment={comments.publishedAndPinned} />
    );
    expect(container.querySelector('.pin-button')).toBeInTheDocument();
    expect(container.querySelector('.pin-icon')).toBeNull();
  });

  it('doesnt show a pin button as an userand shows a pin icon instead', () => {
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <FormattedComment comment={comments.publishedAndPinned} />
    );
    expect(container.querySelector('.pin-button')).toBeNull();
    expect(container.querySelector('.pin-icon')).toBeInTheDocument();
  });
  it('shouldnt show a button if the comment is unpublished', () => {
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <FormattedComment comment={comments.unpublishedAndPinned} />
    );
    expect(container.querySelector('.pin-button')).toBeNull();
  });
  it('pressing on the pin button pins and unpins a comment', async () => {
    const component = renderWithAuth(
      AuthRole.CURATOR,
      <FormattedComment comment={comments.publishedAndUnpinned} />
    );
    expect(component.container.querySelector('.pinned')).toBeNull();
    const button = await component.findByRole('button');
    userEvent.click(button);
    await waitForReRender(component);
    expect(component.container.querySelector('.pinned')).toBeInTheDocument();
    userEvent.click(button);
    await waitForReRender(component);
    expect(component.container.querySelector('.pinned')).toBeNull();
  });
});
