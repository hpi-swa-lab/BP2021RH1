import { ChevronLeft, ContentPaste, ContentPasteOff } from '@mui/icons-material';
import { Badge, Button } from '@mui/material';
import { difference } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClipboard, useClipboardEditorButtons } from '../../../hooks/context-hooks';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import PictureScrollGrid from '../picture-gallery/PictureScrollGrid';
import ScrollContainer from '../ScrollContainer';
import './ClipboardEditor.scss';

export const ClipboardEditor = () => {
  const [data, setData] = useClipboard();

  const [open, setOpen] = useState(false);

  const { role } = useAuth();
  const { t } = useTranslation();

  const clear = useCallback(() => {
    setData(data => ({ ...data, pictureIds: [] }));
  }, [setData]);

  const remove = useMemo(
    () => ({
      position: 'top-right' as const,
      onClick: (picture: FlatPicture) => {
        setData(data => ({ ...data, pictureIds: difference(data.pictureIds, [picture.id]) }));
      },
      icon: <ContentPasteOff />,
      title: t('common.clipboard.remove'),
    }),
    [setData, t]
  );

  const clipboardButtons = useClipboardEditorButtons();

  if (role < AuthRole.CURATOR) {
    return null;
  }

  return (
    <div className={`clipboard-editor ${open ? 'open' : ''}`}>
      <div className='clipboard-editor-panel'>
        <h3>{t('common.clipboard.name')}</h3>
        {data.pictureIds.length === 0 ? (
          <>
            <div className='clipboard-editor-buttons'>{clipboardButtons}</div>
            <div className='no-pictures'>{t('common.pictureCount', { count: 0 })}</div>
          </>
        ) : (
          <>
            <Button variant='contained' onClick={clear}>
              {t('common.clipboard.clear')}
            </Button>
            <div key='buttons' className='clipboard-editor-buttons'>
              {clipboardButtons}
            </div>
            <ScrollContainer>
              {(scrollPos: number, scrollHeight: number) => (
                <PictureScrollGrid
                  queryParams={{ id: { in: data.pictureIds } }}
                  scrollPos={scrollPos}
                  scrollHeight={scrollHeight}
                  hashbase={'clipboard'}
                  showCount={false}
                  showDefaultAdornments={false}
                  extraAdornments={[remove]}
                />
              )}
            </ScrollContainer>
          </>
        )}
      </div>
      <Button
        className='clipboard-editor-open'
        variant='contained'
        onClick={() => {
          setOpen(open => !open);
        }}
      >
        {open ? (
          <ChevronLeft />
        ) : data.pictureIds.length > 0 ? (
          <Badge
            badgeContent={data.pictureIds.length}
            color='info'
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            max={99}
          >
            <ContentPaste />
          </Badge>
        ) : (
          <ContentPaste />
        )}
      </Button>
    </div>
  );
};
