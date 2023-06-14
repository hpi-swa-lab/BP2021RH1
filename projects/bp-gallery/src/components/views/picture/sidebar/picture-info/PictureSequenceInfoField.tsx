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
  const sequencePictures = picture.picture_sequence?.pictures;

  return sequencePictures?.length ? (
    <PictureInfoField title={t(`pictureFields.sequence.label`)} icon={<Filter />} type='sequence'>
      <HideStats>
        <ScrollProvider>
          <ScrollContainer>
            <PictureScrollGrid
              queryParams={{ id: { in: sequencePictures.map(picture => picture.id) } }}
              hashbase={'sequence'}
              showCount={false}
              showDefaultAdornments={false}
              filterOutTextsForNonCurators={false}
              collapseSequences={false}
            />
          </ScrollContainer>
        </ScrollProvider>
      </HideStats>
    </PictureInfoField>
  ) : null;
};

export default PictureSequenceInfoField;
