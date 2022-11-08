import React from 'react';
import CommentsContainer from '../CommentsContainer';
import { FlatComment } from '../../../../../../types/additionalFlatTypes';
import { renderWithAPIMocks } from '../../../../../../testUtils';
import userEvent from '@testing-library/user-event';
import { AuthContext, AuthRole } from '../../../../../provider/AuthProvider';

const comments = [
  {
    id: '1',
    text: 'My fancy comment',
    author: 'Onkel Pelle',
    date: new Date('2021-04-21'),
    publishedAt: new Date('2021-04-21'),
  },
  {
    id: '2',
    text: 'My fancy comment yeah',
    author: 'Onkel Pelle',
    date: new Date('2021-04-22'),
  },
] as FlatComment[];

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
    </AuthContext.Provider>
  );
};

const collapseComments = (container: HTMLElement) => {
  const commentsHeader = container.querySelector('.picture-comments-header');
  if (commentsHeader === null) throw "comments-header doesn't exist anymore";
  userEvent.click(commentsHeader);
};

describe('Comments Container behavior as a public user', () => {
  it('shows comments when first rendered', () => {
    // if changed, the following tests need to be adjusted
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={[]} />
    );
    expect(container.querySelector('.open.pictureComments')).toBeInTheDocument();
  });

  it("shows no badge if there aren't any comments", () => {
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={[]} />
    );

    collapseComments(container);
    const badge = container.querySelector('.MuiBadge-badge');
    expect(badge).toBeNull();
  });

  it('shows badge and counts only verified comments', () => {
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={comments} />
    );

    collapseComments(container);
    const badge = container.querySelector('.MuiBadge-badge');
    expect(badge?.textContent).toEqual('1');
  });

  it("doesn't show badge count over 99", () => {
    let manyComments = [];
    for (let i = 0; i < 120; i++) {
      manyComments.push({
        id: i.toString(),
        text: 'comment',
        author: 'Simon',
        date: new Date('21-04-2021'),
        publishedAt: new Date('22-04-2022'),
      } as FlatComment);
    }
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={manyComments} />
    );
    collapseComments(container);
    const badge = container.querySelector('.MuiBadge-badge');
    expect(badge?.textContent).toEqual('99+');
  });
});

describe('Comments behavior as Curator user', () => {
  it('hides comments when first rendered', () => {
    // if changed, the following tests need to be adjusted
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <CommentsContainer pictureId='test' comments={[]} />
    );
    expect(container.querySelector('.open.pictureComments')).not.toBeInTheDocument();
  });

  it('shows badge counting all comments (verified and unverified)', () => {
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <CommentsContainer pictureId='test' comments={comments} />
    );
    const badge = container.querySelector('.MuiBadge-badge');
    expect(badge?.textContent).toEqual('2');
  });
});
