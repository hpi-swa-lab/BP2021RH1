import React, { useContext, useRef } from 'react';
import './PictureInfo.scss';
import PictureViewNavigationBar from './PictureViewNavigationBar';
import { ApolloError } from '@apollo/client';
import CommentsContainer from './comments/CommentsContainer';
import { FlatPicture } from '../../graphql/additionalFlatTypes';
import { PictureViewContext } from './PictureView';
import Loading from '../shared/Loading';
import QueryErrorDisplay from '../shared/QueryErrorDisplay';
import PictureInfo from '../shared/PictureInfo';

const PictureSidebar = ({
  picture,
  loading,
  error,
}: {
  picture?: FlatPicture;
  pictureId: string;
  loading?: boolean;
  error?: ApolloError;
}) => {
  const { sideBarOpen } = useContext(PictureViewContext);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`picture-info-container${!sideBarOpen ? ' closed' : ''}`} ref={containerRef}>
      {loading && <Loading />}
      {error && <QueryErrorDisplay error={error} />}
      {!loading && !error && picture && (
        <PictureInfo picture={picture}>
          <CommentsContainer comments={picture.comments} pictureId={picture.id} />
        </PictureInfo>
      )}
      <PictureViewNavigationBar />
    </div>
  );
};

export default PictureSidebar;
