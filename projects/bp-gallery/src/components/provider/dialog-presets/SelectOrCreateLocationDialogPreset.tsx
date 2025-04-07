import { Close, Done } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunCreateLocationTagMutation,
  useCreateLocationTagMutation,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import { DialogProps } from '../../provider/DialogProvider';
import TagSelectionField from '../../views/picture/sidebar/picture-info/TagSelectionField';

const SelectOrCreateLocationDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();
  const { allTagsQuery } = useGenericTagEndpoints(TagType.LOCATION);

  const { data } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const [tag, setTag] = useState<FlatTag | null>(null);

  const [createLocationTagMutation, createLocationTagMutationResponse] =
    useCreateLocationTagMutation({
      refetchQueries: ['getAllLocationTags'],
      awaitRefetchQueries: true,
    });
  const { canRun: canCreateLocationTag } = useCanRunCreateLocationTagMutation();

  return (
    <>
      <DialogTitle>{dialogProps.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogProps.content}</DialogContentText>
        <TagSelectionField
          tags={tag ? [tag] : []}
          allTags={flattenedTags ?? []}
          type={TagType.LOCATION}
          onChange={newTags => {
            setTag(currentTag => {
              if (newTags.length > 1) {
                const nonCurrent = newTags.filter(tag => tag.id !== currentTag?.id);
                return nonCurrent[0];
              }
              if (newTags.length === 1) {
                return newTags[0];
              }
              return null;
            });
          }}
          noContentText={t('pictureFields.noLocations')}
          createMutation={canCreateLocationTag ? createLocationTagMutation : undefined}
        />
        {createLocationTagMutationResponse.loading && <Loading />}
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleClose(undefined)} startIcon={<Close />}>
          {t('common.abort')}
        </Button>
        <Button onClick={() => handleClose(tag)} startIcon={<Done />}>
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </>
  );
};

export default SelectOrCreateLocationDialogPreset;
