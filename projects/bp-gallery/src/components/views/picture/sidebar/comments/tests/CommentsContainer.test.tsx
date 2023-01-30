import React from 'react';
import CommentsContainer from '../CommentsContainer';
import { renderWithAPIMocks } from '../../../../../../testUtils';
import userEvent from '@testing-library/user-event';
import { AuthContext, AuthRole } from '../../../../../provider/AuthProvider';
import { comments } from './mocks';

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
    </AuthContext.Provider>
  );
};

const testComments = [comments.publishedAndPinned, comments.unpublishedAndUnpinned];

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
      <CommentsContainer pictureId='test' comments={[]} likeCount={0} />
    );
    expect(container.querySelector('.open.pictureComments')).toBeInTheDocument();
  });

  it("shows no badge if there aren't any comments", () => {
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={[]} likeCount={0} />
    );

    collapseComments(container);
    const badge = container.querySelector('.MuiBadge-badge');
    expect(badge).toBeNull();
  });
});

describe('Comments behavior as Curator user', () => {
  it('hides comments when first rendered', () => {
    // if changed, the following tests need to be adjusted
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <CommentsContainer pictureId='test' comments={[]} likeCount={0} />
    );
    expect(container.querySelector('.open.pictureComments')).not.toBeInTheDocument();
  });

  it('shows badge counting all comments (verified and unverified)', () => {
    const { container } = renderWithAuth(
      AuthRole.CURATOR,
      <CommentsContainer pictureId='test' comments={testComments} likeCount={0} />
    );
    const badge = container.querySelector('.MuiBadge-badge');
    expect(badge?.textContent).toEqual('2');
  });
  it('sorts all pinned comments to the top', () => {
    const manyComments = [];
    for (let i = 0; i < 10; i = i + 2) {
      manyComments.push({ ...comments.publishedAndPinned, ...{ id: i.toString() } });
      manyComments.push({ ...comments.publishedAndUnpinned, ...{ id: (i + 1).toString() } });
    }
    const { container } = renderWithAuth(
      AuthRole.PUBLIC,
      <CommentsContainer pictureId='test' comments={manyComments} likeCount={0} />
    );

    const commentDivs = container.getElementsByClassName('comment');

    for (let i = 0; i < 5; i++) {
      expect(commentDivs[i]).toHaveClass('pinned');
    }
    for (let i = 5; i < 10; i++) {
      expect(commentDivs[i]).not.toHaveClass('pinned');
    }
  });
});
