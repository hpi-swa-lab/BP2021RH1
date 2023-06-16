import { Filter } from '@mui/icons-material';
import { sortBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdatePictureSequenceOrder } from '../../../../../hooks/sequences.hook';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import ScrollContainer from '../../../../common/ScrollContainer';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { ScrollProvider } from '../../../../provider/ScrollProvider';
import { HideStats } from '../../../../provider/ShowStatsProvider';
import './LinkedInfoField.scss';
import PictureInfoField from './PictureInfoField';

const PictureSequenceInfoField = ({ picture }: { picture: FlatPicture }) => {
  const { t } = useTranslation();
  const { role } = useAuth();

  const sequencePictureIds = useMemo(
    () => picture.picture_sequence?.pictures?.map(picture => picture.id),
    [picture]
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
              filterOutTextsForNonCurators={false}
              collapseSequences={false}
              cacheOnRefetch
              customSort={customSort}
              onSort={role >= AuthRole.CURATOR ? onSort : undefined}
            />
          </ScrollContainer>
        </ScrollProvider>
      </HideStats>
    </PictureInfoField>
  ) : null;
};

export default PictureSequenceInfoField;
