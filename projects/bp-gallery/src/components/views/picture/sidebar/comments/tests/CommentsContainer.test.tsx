import React from 'react';
import CommentsContainer from '../CommentsContainer';
import { FlatComment } from '../../../../../../types/additionalFlatTypes';
import { renderWithAPIMocks } from '../../../../../../testUtils';
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

describe('Comments Container behavior as a public user', () => {
  it("shows no badge if there aren't any comments", async () => {
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={[]} />
    );
    const badge = await container.querySelector('.MuiBadge-badge');
    expect(badge).toBeNull();
  });

  it('shows badge and counts only verified comments', async () => {
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={comments} />
    );
    const badge = await container.querySelector('.MuiBadge-badge');
    expect(badge?.textContent).toEqual('1');
  });
});

describe('Comments behavior as Curator user', () => {
  it('shows badge counting all comments (verified and unverified)', async () => {
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <CommentsContainer pictureId='test' comments={comments} />
    );
    const badge = await container.querySelector('.MuiBadge-badge');
    expect(badge?.textContent).toEqual('2');
  });
});
