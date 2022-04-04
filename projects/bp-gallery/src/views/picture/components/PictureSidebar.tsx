import React, { useContext, useRef } from 'react';
import './PictureInfo.scss';
import { PictureViewContext } from '../PictureView';
import PictureViewNavigationBar from './PictureViewNavigationBar';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
import { ApolloError } from '@apollo/client';
import Loading from '../../../components/Loading';
import QueryErrorDisplay from '../../../components/QueryErrorDisplay';
import PictureInfo from '../../../components/PictureInfo';
import CommentsContainer from './comments/CommentsContainer';

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
