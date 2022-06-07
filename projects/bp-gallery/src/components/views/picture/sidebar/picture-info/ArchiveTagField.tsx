import { DialogContext, DialogPreset } from '../../../../provider/DialogProvider';
import React, { useCallback, useContext } from 'react';
import { FlatArchiveTag } from '../../../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';

const ArchiveTagField = ({
  archiveTag,
  onChange,
}: {
  onChange: (archiveTag: FlatArchiveTag) => void;
  archiveTag?: FlatArchiveTag;
}) => {
  const dialog = useContext(DialogContext);
  const { role } = useAuth();

  const selectTag = useCallback(async () => {
    const selectedTag = await dialog({
      preset: DialogPreset.SELECT_ARCHIVE_TAG,
    });
    if (selectedTag && selectedTag.id !== archiveTag?.id) {
      onChange(selectedTag);
    }
  }, [dialog, onChange, archiveTag]);

  return <div onClick={role >= AuthRole.CURATOR ? selectTag : undefined}>{archiveTag?.name}</div>;
};

export default ArchiveTagField;
