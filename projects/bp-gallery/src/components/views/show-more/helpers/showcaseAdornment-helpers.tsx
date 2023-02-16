import { Star } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetArchiveQuery, useUpdateArchiveMutation } from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatArchiveTag, FlatPicture } from '../../../../types/additionalFlatTypes';
import { PicturePreviewAdornment } from '../../../common/picture-gallery/PicturePreview';

const useGetArchive = (archiveId?: string) => {
  const archiveQueryResult = useGetArchiveQuery({
    variables: { archiveId: archiveId ?? '' },
    skip: archiveId === undefined,
  });

  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(
    archiveQueryResult.data
  )?.archiveTag;

  return archive;
};

export const useGetShowcasePicture = (archiveId?: string) => {
  const archive = useGetArchive(archiveId);

  const showcasePicture: FlatPicture | undefined = archive?.showcasePicture;

  return showcasePicture;
};

export const useGetShowcaseAdornments = (
  archiveId?: string
): PicturePreviewAdornment | undefined => {
  const { t } = useTranslation();

  const archive = useGetArchive(archiveId);

  const showcasePicture = useGetShowcasePicture(archiveId);

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });

  return archiveId === undefined
    ? undefined
    : {
        position: 'top-left',
        icon: picture =>
          picture.id === archive?.showcasePicture?.id ? (
            <Star className='star-selected' />
          ) : (
            <Star />
          ),
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
};
