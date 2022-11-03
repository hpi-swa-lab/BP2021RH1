import React, { useContext, useRef } from 'react';
import './PictureSidebar.scss';
import PictureViewNavigationBar from '../overlay/PictureViewNavigationBar';
import { ApolloError } from '@apollo/client';
import CommentsContainer from './comments/CommentsContainer';
import { FlatPicture } from '../../../../types/additionalFlatTypes';
import { PictureViewContext } from '../PictureView';
import Loading from '../../../common/Loading';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import PictureInfo from './picture-info/PictureInfo';

const PictureSidebar = ({
  picture,
  loading,
  error,
  isMulti,
}: {
  picture?: FlatPicture;
  loading?: boolean;
  error?: ApolloError;
  isMulti?: boolean;
}) => {
  const { sideBarOpen } = useContext(PictureViewContext);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`picture-sidebar${!sideBarOpen ? ' closed' : ''}`}
      ref={containerRef}
      onKeyUp={event => event.stopPropagation()}
    >
      {loading && <Loading />}
      {error && <QueryErrorDisplay error={error} />}
      {!loading && !error && picture && (
        <>
          <PictureInfo picture={picture} isMulti={isMulti} />
          <CommentsContainer comments={picture.comments} pictureId={picture.id} />
        </>
      )}
      <PictureViewNavigationBar />
    </div>
  );
};

export default PictureSidebar;
