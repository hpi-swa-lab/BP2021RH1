import { waitFor } from '@testing-library/react';
import userEvent, { TargetElement } from '@testing-library/user-event';
import { PinCommentDocument, UnpinCommentDocument } from '../../../../../../graphql/APIConnector';
import { renderWithAPIMocks } from '../../../../../../testUtils';
import { FlatComment } from '../../../../../../types/additionalFlatTypes';
import { AuthRole, AuthContext } from '../../../../../provider/AuthProvider';
import FormattedComment from '../FormattedComment';
import { PostCommentDocumentMocks } from './mocks';

const comments = [
  {
    id: '1',
    text: 'My fancy comment',
    author: 'Onkel Pelle',
    date: new Date('2021-04-21'),
    publishedAt: new Date('2021-04-21'),
    pinned: true,
  },
  {
    id: '2',
    text: 'My fancy comment yeah',
    author: 'Onkel Pelle',
    date: new Date('2021-04-22'),
    publishedAt: new Date('2021-04-21'),
    pinned: false,
  },
  {
    id: '1',
    text: 'My fancy comment',
    author: 'Onkel Pelle',
    date: new Date('2021-04-21'),
    publishedAt: new Date('2021-04-21'),
    pinned: false,
  },
] as FlatComment[];

const mocks = [
  {
    request: {
      query: PinCommentDocument,
      variables: { id: '1' },
    },
    result: { data: comments[0] },
  },
  {
    request: {
      query: UnpinCommentDocument,
      variables: { id: '1' },
    },
    result: { data: comments[2] },
  },
];

const renderWithAuth = (role: AuthRole, component: JSX.Element) => {
  return renderWithAPIMocks(
    <AuthContext.Provider
      value={{
        role: role,
        login: (username: string, password: string) => {
          return new Promise(() => {});
        },
        logout: () => {},
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
      <FormattedComment comment={comments[0]} />
    );
    expect(container.querySelector('.pin-button')).toBeInTheDocument();
  });

  it('doesnt show a pin button as an user', () => {
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <FormattedComment comment={comments[0]} />
    );
    expect(container.querySelector('.pin-button')).toBeNull();
  });
  it('pressing on the pin button pins and unpins a comment', async () => {
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <FormattedComment comment={comments[2]} />
    );
    const button = container.querySelector('.pin-button') as TargetElement;
    expect(container.querySelector('.pinned')).toBeNull();
    userEvent.click(button);

    await waitFor(() => {
      container.querySelector('.comment-details');
    });

    expect(container.querySelector('.pinned')).toBeInTheDocument();
  });
});
