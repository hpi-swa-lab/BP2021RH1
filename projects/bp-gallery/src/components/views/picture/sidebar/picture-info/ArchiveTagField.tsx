import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatArchiveTag } from '../../../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import { addNewParamToSearchPath } from '../../../search/helpers/addNewParamToSearchPath';
import { SearchType } from '../../../search/helpers/search-filters';
import useAdvancedSearch from '../../../search/helpers/useDeprecatedAdvancedSearch';

const ArchiveTagField = ({
  archiveTag,
  onChange,
}: {
  onChange?: (archiveTag: FlatArchiveTag) => void;
  archiveTag?: FlatArchiveTag;
}) => {
  const dialog = useDialog();
  const { t } = useTranslation();

  const [selectedTag, setSelectedTag] = useState<FlatArchiveTag | undefined>(archiveTag);

  useEffect(() => {
    setSelectedTag(archiveTag);
  }, [archiveTag, setSelectedTag]);

  const selectNewTag = useCallback(async () => {
    const newTag: FlatArchiveTag | undefined = await dialog({
      preset: DialogPreset.SELECT_ARCHIVE_TAG,
    });
    if (newTag && newTag.id !== selectedTag?.id) {
      setSelectedTag(newTag);
      onChange?.(newTag);
    }
  }, [dialog, onChange, selectedTag, setSelectedTag]);

  const searchForCurrentTag = useCallback(() => {
    if (!selectedTag) {
      return;
    }
    const { searchPath } = addNewParamToSearchPath(
      useAdvancedSearch ? SearchType.ARCHIVE : SearchType.ALL,
      encodeURIComponent(selectedTag.name)
    );
    window.open(searchPath, '_blank');
  }, [selectedTag]);

  return (
    <div onClick={onChange ? selectNewTag : searchForCurrentTag}>
      {selectedTag?.name ?? t('curator.noArchive')}
    </div>
  );
};

export default ArchiveTagField;
