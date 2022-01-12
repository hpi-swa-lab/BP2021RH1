import React from 'react';
import { Button, Icon } from '@mui/material';
import PictureInfo from './components/PictureInfo';
import PictureNavigationButtons from './components/PictureNavigationButtons';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../graphql/additionalFlatTypes';

export enum PictureNavigationTarget {
  NEXT,
  PREVIOUS,
}

export const PictureViewUI = ({
  picture,
  hasPrevious,
  hasNext,
  navigateCallback,
  calculateHeight,
}: {
  picture: FlatPicture;
  hasPrevious?: boolean;
  hasNext?: boolean;
  navigateCallback?: (target: PictureNavigationTarget) => void;
  calculateHeight: (container: HTMLElement) => void;
}) => {
  const { t } = useTranslation();

  const onBack = () => {
    window.history.back();
  };

  return (
    <div className='picture-ui'>
      <PictureInfo picture={picture} pictureId={picture.id} calculateHeight={calculateHeight} />
      {navigateCallback && (
        <PictureNavigationButtons
          onNextPicture={hasNext ? () => navigateCallback(PictureNavigationTarget.NEXT) : undefined}
          onPreviousPicture={
            hasPrevious ? () => navigateCallback(PictureNavigationTarget.PREVIOUS) : undefined
          }
        />
      )}
      <div className='picture-toolbar'>
        <Button onClick={onBack}>
          <Icon>arrow_back</Icon>
          {t('common.back')}
        </Button>
      </div>
    </div>
  );
};

export default PictureViewUI;
