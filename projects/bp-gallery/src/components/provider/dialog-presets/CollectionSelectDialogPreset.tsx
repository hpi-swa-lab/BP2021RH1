import SelectDialogPreset from './SelectDialogPreset';
import { DialogProps } from '../DialogProvider';
import { useGetAllCollectionsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatCollection } from '../../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';

const CollectionSelectDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();

  const { data } = useGetAllCollectionsQuery();
  const allCollections: FlatCollection[] | undefined =
    useSimplifiedQueryResponseData(data)?.collections;

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{ ...dialogProps, title: t('curator.selectCollection') }}
      allOptions={allCollections ?? []}
      inputLabel={t('common.collection')}
    />
  );
};

export default CollectionSelectDialogPreset;
