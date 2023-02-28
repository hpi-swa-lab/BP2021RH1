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
  const { allTagsQuery } = useGenericTagEndpoints(dialogProps.type as TagType);

  const { data } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const allTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{ ...dialogProps, title: 'Welchem Ort wollen Sie folgenden Ort unterordnen?' }}
      allOptions={allTags ?? []}
      inputLabel={'Ort'}
    />
  );
};

export default TagSelectDialogPreset;
