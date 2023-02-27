import { useGetAllLocationTagsQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatTag } from '../../../types/additionalFlatTypes';
import SelectDialogPreset from '../../provider/dialog-presets/SelectDialogPreset';
import { DialogProps } from '../../provider/DialogProvider';

const TagSelectDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { data } = useGetAllLocationTagsQuery();
  const allTags: FlatTag[] | undefined = useSimplifiedQueryResponseData(data)?.locationTags;

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
