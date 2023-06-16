import { Filter, LinkOff } from '@mui/icons-material';
import { Button } from '@mui/material';
import { sortBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useRemovePictureFromSequence,
  useUpdatePictureSequenceOrder,
} from '../../../../../hooks/sequences.hook';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import ScrollContainer from '../../../../common/ScrollContainer';
import { PicturePreviewAdornment } from '../../../../common/picture-gallery/PicturePreview';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { ScrollProvider } from '../../../../provider/ScrollProvider';
import { HideStats } from '../../../../provider/ShowStatsProvider';
import './LinkedInfoField.scss';
import PictureInfoField from './PictureInfoField';

const PictureSequenceInfoField = ({ picture }: { picture: FlatPicture }) => {
  const { t } = useTranslation();
  const { role } = useAuth();

  const sequencePictures = picture.picture_sequence?.pictures;

  const sequencePictureIds = useMemo(
    () => sequencePictures?.map(picture => picture.id),
    [sequencePictures]
  );

  const [currentOrder, setCurrentOrder] = useState(sequencePictureIds);
  useEffect(() => {
    setCurrentOrder(sequencePictureIds);
  }, [sequencePictureIds]);

  const customSort = useCallback(
    (pictures: FlatPicture[]) => sortBy(pictures, picture => currentOrder?.indexOf(picture.id)),
    [currentOrder]
  );

  const updatePictureSequenceOrder = useUpdatePictureSequenceOrder();
  const onSort = useCallback(
    (pictures: FlatPicture[]) => {
      updatePictureSequenceOrder(pictures);
      setCurrentOrder(pictures.map(picture => picture.id));
    },
    [updatePictureSequenceOrder]
  );

  const removePictureFromSequence = useRemovePictureFromSequence();

  const removeThisPictureFromSequence = useCallback(() => {
    removePictureFromSequence(picture);
  }, [removePictureFromSequence, picture]);

  const removeEntireSequence = useCallback(() => {
    if (!sequencePictures) {
      return;
    }
    for (const picture of sequencePictures) {
      removePictureFromSequence(picture);
    }
  }, [sequencePictures, removePictureFromSequence]);

  const removePictureFromSequenceAdornment: PicturePreviewAdornment = useMemo(
    () => ({
      position: 'top-right',
      icon: <LinkOff />,
      title: t('pictureFields.sequence.remove'),
      onClick(picture) {
        removePictureFromSequence(picture);
      },
      onlyShowOnHover: true,
    }),
    [t, removePictureFromSequence]
  );

  return sequencePictureIds?.length ? (
    <PictureInfoField title={t(`pictureFields.sequence.label`)} icon={<Filter />} type='sequence'>
      <HideStats>
        <ScrollProvider>
          <ScrollContainer>
            <PictureScrollGrid
              queryParams={{ id: { in: sequencePictureIds } }}
              hashbase={'sequence'}
              showCount={false}
              showDefaultAdornments={false}
              extraAdornments={
                role >= AuthRole.CURATOR ? [removePictureFromSequenceAdornment] : undefined
              }
              filterOutTextsForNonCurators={false}
              collapseSequences={false}
              cacheOnRefetch
              customSort={customSort}
              onSort={role >= AuthRole.CURATOR ? onSort : undefined}
            />
          </ScrollContainer>
        </ScrollProvider>
      </HideStats>
      {role >= AuthRole.CURATOR && (
        <>
          <Button onClick={removeThisPictureFromSequence} variant='contained' fullWidth>
            {t('pictureFields.sequence.remove')}
          </Button>
          <Button onClick={removeEntireSequence} variant='contained' fullWidth>
            {t('pictureFields.sequence.removeEntire')}
          </Button>
        </>
      )}
    </PictureInfoField>
  ) : null;
};

export default PictureSequenceInfoField;
