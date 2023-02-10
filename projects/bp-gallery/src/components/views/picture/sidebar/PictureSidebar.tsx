import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import './PictureSidebar.scss';
import PictureViewNavigationBar from '../overlay/PictureViewNavigationBar';
import { ApolloError } from '@apollo/client';
import CommentsContainer from './comments/CommentsContainer';
import { FlatPicture } from '../../../../types/additionalFlatTypes';
import { PictureViewContext } from '../PictureView';
import Loading from '../../../common/Loading';
import QueryErrorDisplay from '../../../common/QueryErrorDisplay';
import PictureInfo, { Field } from './picture-info/PictureInfo';
import { AuthRole, useAuth } from '../../../provider/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Crop } from '@mui/icons-material';
import PictureEditDialog from './picture-info/PictureEditDialog';
import { useUpdatePictureMutation } from '../../../../graphql/APIConnector';

const PictureSidebar = ({
  picture,
  loading,
  error,
}: {
  picture?: FlatPicture;
  loading?: boolean;
  error?: ApolloError;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const { sideBarOpen } = useContext(PictureViewContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [updatePicture, updateMutationResponse] = useUpdatePictureMutation({
    refetchQueries: ['getPictureInfo'],
    awaitRefetchQueries: true,
  });

  const onSave = useCallback(
    (field: Field) => {
      updatePicture({
        variables: {
          pictureId: picture!.id,
          data: field,
        },
      });
    },
    [updatePicture, picture]
  );

  const saveStatus = useCallback(
    (anyFieldTouched: boolean, isSaving: boolean) => {
      if (anyFieldTouched) {
        return t('curator.saveStatus.pending');
      }
      if (updateMutationResponse.loading || isSaving) {
        return t('curator.saveStatus.saving');
      }
      if (updateMutationResponse.error) {
        return t('curator.saveStatus.error');
      }
      return t('curator.saveStatus.saved');
    },
    [updateMutationResponse, t]
  );

  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  // Memoization is important here: if this is not memoized,
  // the following loop will sometimes trigger a continuous rerender
  // of all involved components, resulting in a "maximum update
  // depth exceeded" react error:
  // - ClipboardEditor
  // - PictureScrollGrid (if some pictures are copied)
  // - PictureGrid
  // - PictureView (if focused, i. e. the user clicked on a
  //                picture preview inside the clipboard editor)
  // - PictureSidebar
  // - PictureInfo
  // - LinkedInfoField
  // In the LinkedInfoField, a useEffect, which sets the clipboard
  // editor buttons, indirectly depends on pictureIds (via copyToClipboard).
  // Thus, if pictureIds is not memoized, the useEffect triggers
  // on every render and sets the clipboard editor buttons,
  // which triggers a rerender of the ClipboardEditor, completing the loop.
  const pictureIds = useMemo(() => (picture ? [picture.id] : []), [picture]);

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
          <PictureInfo
            picture={picture}
            pictureIds={pictureIds}
            onSave={onSave}
            topInfo={(anyFieldTouched, isSaving) =>
              role >= AuthRole.CURATOR && (
                <div className='curator-ops'>
                  <Button startIcon={<Crop />} onClick={() => setEditDialogOpen(true)}>
                    {t('curator.editPicture')}
                  </Button>
                  <PictureEditDialog
                    picture={picture}
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                  />
                  <span className='save-state'>{saveStatus(anyFieldTouched, isSaving)}</span>
                </div>
              )
            }
          />
          <CommentsContainer
            comments={picture.comments}
            pictureId={picture.id}
            likeCount={picture.likes ?? 0}
          />
        </>
      )}
      <PictureViewNavigationBar />
    </div>
  );
};

export default PictureSidebar;
