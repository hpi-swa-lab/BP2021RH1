import { Button, Icon } from '@mui/material';
import React, { Dispatch, RefObject, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export enum FocusArea {
  PICTURE,
  DETAILS,
  COMMENTS,
}

const PictureViewNavigationBar = ({
  focusedArea,
  setFocusedArea,
  containerRef,
}: {
  focusedArea: FocusArea;
  setFocusedArea: Dispatch<React.SetStateAction<FocusArea>>;
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (containerRef.current) {
      let top = 0;
      if (focusedArea) {
        const target =
          containerRef.current.querySelectorAll(`.picture-info-section`)[focusedArea - 1];
        const rect = target.getBoundingClientRect();
        top =
          rect.top -
          (target.parentElement?.getBoundingClientRect().top ?? 0) +
          0.85 * window.innerHeight -
          256;
      }
      containerRef.current.querySelector('.ps')?.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }, [focusedArea, containerRef]);

  return (
    <div className='quick-access-buttons mobile-only'>
      <Button
        className={focusedArea === FocusArea.PICTURE ? 'selected' : ''}
        onClick={() => setFocusedArea(FocusArea.PICTURE)}
      >
        <Icon>image</Icon>
        <span>{t('common.picture')}</span>
      </Button>
      <Button
        className={focusedArea === FocusArea.DETAILS ? 'selected' : ''}
        onClick={() => setFocusedArea(FocusArea.DETAILS)}
      >
        <Icon>info</Icon>
        <span>{t('common.details')}</span>
      </Button>
      <Button
        className={focusedArea === FocusArea.COMMENTS ? 'selected' : ''}
        onClick={() => setFocusedArea(FocusArea.COMMENTS)}
      >
        <Icon>question_answer</Icon>
        <span>{t('common.comments')}</span>
      </Button>
    </div>
  );
};

export default PictureViewNavigationBar;
