import { Filter } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import ScrollContainer from '../../../../common/ScrollContainer';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';
import { ScrollProvider } from '../../../../provider/ScrollProvider';
import { HideStats } from '../../../../provider/ShowStatsProvider';
import './LinkedInfoField.scss';
import PictureInfoField from './PictureInfoField';

const PictureSequenceInfoField = ({ picture }: { picture: FlatPicture }) => {
  const { t } = useTranslation();
  const sequencePictureIds = useMemo(
    () => picture.picture_sequence?.pictures?.map(picture => picture.id),
    [picture]
  );

  const customSort = useCallback(
    (pictures: FlatPicture[]) =>
      sortBy(pictures, picture => sequencePictureIds?.indexOf(picture.id)),
    [sequencePictureIds]
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
              customSort={customSort}
            />
          </ScrollContainer>
        </ScrollProvider>
      </HideStats>
    </PictureInfoField>
  ) : null;
};

export default PictureSequenceInfoField;
