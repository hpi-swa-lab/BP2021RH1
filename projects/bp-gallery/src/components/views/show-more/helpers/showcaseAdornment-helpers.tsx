import { Star } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetArchiveQuery, useUpdateArchiveMutation } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatArchiveTag, FlatPicture } from '../../../../types/additionalFlatTypes';
import { PicturePreviewAdornment } from '../../../common/picture-gallery/PicturePreview';

const getArchive = (archiveId: string) => {
  const archiveQueryResult = useGetArchiveQuery({ variables: { archiveId } });

  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(
    archiveQueryResult.data
  )?.archiveTag;

  return archive;
};

export const getShowcasePicture = (archiveId: string) => {
  const archive = getArchive(archiveId);

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;

  return showcasePicture;
};

export const getShowcaseAdornments = (archiveId: string = '0') => {
  const { t } = useTranslation();

  const archive = getArchive(archiveId);

  const showcasePicture = getShowcasePicture(archiveId);

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });

  const showcaseAdornment: PicturePreviewAdornment = {
    position: 'top-left',
    icon: picture =>
      picture.id === archive?.showcasePicture?.id ? <Star className='star-selected' /> : <Star />,
    title: t('pictureAdornments.showcase'),
    onClick: picture => {
      if (showcasePicture?.id === picture.id) return;
      updateArchive({
        variables: {
          archiveId,
          data: {
            showcasePicture: picture.id,
          },
        },
      });
    },
  };

  return showcaseAdornment;
};
