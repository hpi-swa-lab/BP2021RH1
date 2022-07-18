import { DialogContext, DialogPreset } from '../../../../provider/DialogProvider';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatArchiveTag } from '../../../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { useTranslation } from 'react-i18next';
import { addNewParamToSearchPath, SearchType } from '../../../search/SearchView';
import useAdvancedSearch from '../../../search/helpers/useAdvancedSearch';

const ArchiveTagField = ({
  archiveTag,
  onChange,
}: {
  onChange: (archiveTag: FlatArchiveTag) => void;
  archiveTag?: FlatArchiveTag;
}) => {
  const dialog = useContext(DialogContext);
  const { role } = useAuth();
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
      onChange(newTag);
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
    <div onClick={role >= AuthRole.CURATOR ? selectNewTag : searchForCurrentTag}>
      {selectedTag?.name ?? t('curator.noArchive')}
    </div>
  );
};

export default ArchiveTagField;
