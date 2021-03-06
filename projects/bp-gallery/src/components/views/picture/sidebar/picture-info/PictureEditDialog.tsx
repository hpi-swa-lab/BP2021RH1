import React, { useCallback, useContext, useRef } from 'react';
import { AppBar, Button, Dialog, DialogContent, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImageEditor from '@toast-ui/react-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import { Close, Save } from '@mui/icons-material';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import { asApiPath } from '../../../../App';
import './PictureEditDialog.scss';
import replaceMediaFile from './replace-media-file';
import dayjs from 'dayjs';
import { useApolloClient } from '@apollo/client';
import { PictureViewContext } from '../../PictureView';

const isDefaultCropZone = (rect: any) => {
  return rect.width < 1 || rect.height < 1;
};

const PictureEditDialog = ({
  picture,
  open,
  onClose,
}: {
  picture: FlatPicture;
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const editorRef = useRef<any>();
  const apolloClient = useApolloClient();
  const { calledViaLink } = useContext(PictureViewContext);

  const save = useCallback(async () => {
    if (!picture.media?.id) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const editorInstance = editorRef.current?.getInstance();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (!isDefaultCropZone(editorInstance?.getCropzoneRect())) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        editorInstance.crop(editorInstance.getCropzoneRect());
      }
      // eslint-disable-next-line no-empty
    } catch (err) {
      // If an error is catched here, the picture was saved when in rotate/filter mode
    }

    // I don't know why we have to do this, but without it it doesn't work
    // Ask the ImageEditor library why this happens 🤷🏻‍♀️
    await new Promise(resolve => setTimeout(resolve, 0));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const dataUrl = editorInstance.toDataURL({
      format: 'jpeg',
    }) as string;
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
          usageStatistics={false}
          ref={editorRef}
          includeUI={{
            loadImage: {
              path: asApiPath(picture.media.url),
              name: 'SampleImage',
            },
            initMenu: 'crop',
            menu: ['crop', 'rotate', 'filter'],
            menuBarPosition: 'right',
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PictureEditDialog;
