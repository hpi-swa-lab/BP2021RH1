import React, { useContext, useRef, useState } from 'react';
import './PictureSidebar.scss';
import PictureViewNavigationBar from './PictureViewNavigationBar';
import { ApolloError } from '@apollo/client';
import CommentsContainer from './comments/CommentsContainer';
import { FlatPicture } from '../../types/additionalFlatTypes';
import { PictureViewContext } from './PictureView';
import Loading from '../shared/Loading';
import QueryErrorDisplay from '../shared/QueryErrorDisplay';
import PictureInfo from '../shared/picture-info/PictureInfo';
import { AuthRole, useAuth } from '../../AuthWrapper';
import { Button } from '@mui/material';
import PictureEditDialog from '../shared/picture-info/PictureEditDialog';
import { Crop } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PictureSidebar = ({
  picture,
  loading,
  error,
}: {
  picture?: FlatPicture;
  loading?: boolean;
  error?: ApolloError;
}) => {
  const { sideBarOpen } = useContext(PictureViewContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const { role } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const { t } = useTranslation();

  return (
    <div className={`picture-sidebar${!sideBarOpen ? ' closed' : ''}`} ref={containerRef}>
      {loading && <Loading />}
      {error && <QueryErrorDisplay error={error} />}
      {!loading && !error && picture && (
        <div className='scroll-container'>
          <div className='picture-info'>
            {role >= AuthRole.CURATOR && (
              <div className='curator-ops'>
                <Button startIcon={<Crop />} onClick={() => setEditDialogOpen(true)}>
                  {t('curator.editPicture')}
                </Button>
                <PictureEditDialog
                  picture={picture}
                  open={editDialogOpen}
                  onClose={() => setEditDialogOpen(false)}
                />
                <span className='save-state'>{saveStatus}</span>
              </div>
            )}
            <PictureInfo
              picture={picture}
              onSaveStatusChange={status => {
                setSaveStatus(status);
              }}
            />
          </div>
          <CommentsContainer comments={picture.comments} pictureId={picture.id} />
        </div>
      )}
      <PictureViewNavigationBar />
    </div>
  );
};

export default PictureSidebar;
