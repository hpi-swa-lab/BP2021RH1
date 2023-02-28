import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import SelectDialogPreset from '../../provider/dialog-presets/SelectDialogPreset';
import { DialogProps } from '../../provider/DialogProvider';

const TagSelectDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();
  const { allTagsQuery } = useGenericTagEndpoints(dialogProps.type as TagType);

  const { data } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const allTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{
        ...dialogProps,
        title: t(`tag-panel.relocate-${dialogProps.type ?? TagType.KEYWORD}`),
      }}
      allOptions={allTags ?? []}
      inputLabel={t(`tag-panel.${dialogProps.type ?? TagType.KEYWORD}`)}
    />
  );
};

export default TagSelectDialogPreset;
