import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetArchivePictureIdsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';

const ArchivePictureCount = ({ archiveId }: { archiveId: string }) => {
  const { data: picturesData } = useGetArchivePictureIdsQuery({
    variables: { archiveId: archiveId },
  });
  const archivePictures: FlatArchiveTag | undefined =
    useSimplifiedQueryResponseData(picturesData)?.archiveTag;
  const { t } = useTranslation();

  const pictureCount = useMemo(() => archivePictures?.pictures?.length, [archivePictures]);

  return (
    <div className='text-right h-4 mt-auto'>
      {pictureCount !== undefined &&
        t('common.pictureCount', {
          count: pictureCount,
        })}
    </div>
  );
};

export default ArchivePictureCount;
