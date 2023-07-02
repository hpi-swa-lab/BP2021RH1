import { Filter, LinkOff } from '@mui/icons-material';
import { Button } from '@mui/material';
import { sortBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCanCreatePictureSequence } from '../../../../../hooks/can-do-hooks';
import { TextFilter } from '../../../../../hooks/get-pictures.hook';
import {
  useRemovePictureFromSequence,
  useUpdatePictureSequenceOrder,
} from '../../../../../hooks/sequences.hook';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import ScrollContainer from '../../../../common/ScrollContainer';
import { PicturePreviewAdornment } from '../../../../common/picture-gallery/PicturePreview';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';
import { ScrollProvider } from '../../../../provider/ScrollProvider';
import { HideStats } from '../../../../provider/ShowStatsProvider';
import './LinkedInfoField.scss';
import PictureInfoField from './PictureInfoField';

const PictureSequenceInfoField = ({ picture }: { picture: FlatPicture }) => {
  const { t } = useTranslation();

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
  const { canCreatePictureSequence: canEdit } = useCanCreatePictureSequence(sequencePictureIds);

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
              extraAdornments={canEdit ? [removePictureFromSequenceAdornment] : undefined}
              collapseSequences={false}
              textFilter={TextFilter.PICTURES_AND_TEXTS}
              cacheOnRefetch
              customSort={customSort}
              onSort={canEdit ? onSort : undefined}
            />
          </ScrollContainer>
        </ScrollProvider>
      </HideStats>
      {canEdit && (
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
