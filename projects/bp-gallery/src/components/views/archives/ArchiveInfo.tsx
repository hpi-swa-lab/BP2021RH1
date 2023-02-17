import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import TextEditor from '../../common/editors/TextEditor';

interface ArchiveInfoProps {
  description: string;
}

const ArchiveInfo = ({ description }: ArchiveInfoProps) => {
  const { t } = useTranslation();

  const extraOptions = useMemo(
    () => ({
      readonly: true,
      showPlaceholder: true,
      placeholder: t('curator.insertDescriptionHere'),
    }),
    [t]
  );

  return (
    <div className='archive-info-container'>
      <TextEditor
        value={description || t('archives.defaultLongDescription')}
        extraOptions={extraOptions}
      />
    </div>
  );
};

export default ArchiveInfo;
