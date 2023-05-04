import { useApolloClient } from '@apollo/client';
import { Close, Save } from '@mui/icons-material';
import { AppBar, Button, Dialog, DialogContent, Toolbar, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { memo, useCallback, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type TuiImageEditor from 'tui-image-editor';
import { asUploadPath } from '../../../../../helpers/app-helpers';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import { PictureViewContext } from '../../PictureView';
import ImageEditor from './../../../../common/editors/ImageEditor';
import './PictureEditDialog.scss';
import replaceMediaFile from './replace-media-file';

const isDefaultCropZone = (rect: any) => {
  return rect.width < 1 || rect.height < 1;
};

const PictureEditDialog = memo(function PictureEditDialog({
  picture,
  open,
  onClose,
}: {
  picture: FlatPicture;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const editorRef = useRef<TuiImageEditor | null>(null);
  const apolloClient = useApolloClient();
  const { calledViaLink } = useContext(PictureViewContext);
  const imgSrc = useMemo(() => asUploadPath(picture.media), [picture.media]);

  const save = useCallback(async () => {
    if (!picture.media?.id || !editorRef.current) {
      return;
    }

    try {
      if (!isDefaultCropZone(editorRef.current.getCropzoneRect())) {
        await editorRef.current.crop(editorRef.current.getCropzoneRect());
      }
    } catch (err) {
      // If an error is catched here, the picture was saved when in rotate/filter mode
    }

    const dataUrl = editorRef.current.toDataURL({
      format: 'jpeg',
    });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${dayjs().format('YYYYMMDDHHmm_ss')}.jpg`, {
      type: 'image/jpeg',
      lastModified: new Date().getTime(),
    });
    await replaceMediaFile(file, picture.media.id);
    // Close dialog
    onClose();
    const queriesToRefetch = ['getPictureInfo'];
    if (!calledViaLink) {
      queriesToRefetch.push('getPictures');
    }
    apolloClient.refetchQueries({
      include: queriesToRefetch,
    });
  }, [picture.media?.id, onClose, apolloClient, calledViaLink]);

  if (!picture.media?.url) {
    return null;
  }

  return (
    <Dialog open={open} fullScreen className='picture-edit-dialog'>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Button
            startIcon={<Close />}
            color='inherit'
            onClick={() => {
              onClose();
            }}
          >
            {t('common.abort')}
          </Button>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            {t('curator.editPicture')}
          </Typography>
          <Button startIcon={<Save />} autoFocus color='inherit' onClick={save}>
            {t('curator.save')}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <ImageEditor
          editorRef={editorRef}
          options={{
            usageStatistics: false,
            includeUI: {
              loadImage: {
                path: imgSrc,
                name: 'SampleImage',
              },
              initMenu: 'crop',
              menu: ['crop', 'rotate', 'flip', 'filter'],
              menuBarPosition: 'right',
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
});

export default PictureEditDialog;
