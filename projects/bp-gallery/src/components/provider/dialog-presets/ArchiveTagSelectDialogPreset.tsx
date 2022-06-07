import React from 'react';
import SelectDialogPreset from './SelectDialogPreset';
import { DialogProps } from '../DialogProvider';
import { useGetAllArchiveTagsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useTranslation } from 'react-i18next';

const ArchiveTagSelectDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();

  const { data } = useGetAllArchiveTagsQuery();
  const allArchiveTags = useSimplifiedQueryResponseData(data)?.archiveTags;

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{ title: t('curator.archiveTag'), ...dialogProps }}
      allOptions={allArchiveTags ?? []}
      inputLabel={t('common.archiveTag')}
    />
  );
};

export default ArchiveTagSelectDialogPreset;
