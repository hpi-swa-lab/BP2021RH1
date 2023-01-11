import React, { useCallback, useMemo } from 'react';
import { ChevronLeft, ContentPaste, ContentPasteOff } from '@mui/icons-material';
import { Badge, Button } from '@mui/material';
import { useState } from 'react';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { useClipboard } from '../../provider/ClipboardProvider';
import ScrollContainer from '../ScrollContainer';
import { useTranslation } from 'react-i18next';
import PictureScrollGrid from '../picture-gallery/PictureScrollGrid';
import './ClipboardEditor.scss';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import { difference } from 'lodash';

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

  if (role < AuthRole.CURATOR) {
    return null;
  }

  return (
    <div className={`clipboard-editor ${open ? 'open' : ''}`}>
      <div className='clipboard-editor-panel'>
        <h3>{t('common.clipboard.name')}</h3>
        {data.pictureIds.length === 0 ? (
          <div className='no-pictures'>{t('common.noPictures')}</div>
        ) : (
          <>
            <Button variant='contained' onClick={clear}>
              {t('common.clipboard.clear')}
            </Button>
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
