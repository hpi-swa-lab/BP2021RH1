import { Dangerous, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunRemoveArchiveTagMutation,
  useGetArchiveQuery,
  useRemoveArchiveTagMutation,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../../types/additionalFlatTypes';
import { AlertContext, AlertType } from '../../../provider/AlertProvider';
import { DialogPreset, useDialog } from '../../../provider/DialogProvider';

export const RemoveArchiveButton = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const dialog = useDialog();
  const openAlert = useContext(AlertContext);

  const { data } = useGetArchiveQuery({
    variables: {
      archiveId: id,
    },
  });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [removeArchiveTagMutation] = useRemoveArchiveTagMutation();

  const removeArchive = useCallback(async () => {
    if (!archive) {
      return;
    }
    const { name } = archive;
    const typedName = await dialog({
      title: t('admin.archives.remove.title', { name }),
      content: t('admin.archives.remove.content', { name }),
      preset: DialogPreset.INPUT_FIELD,
    });
    if (typedName === name) {
      await removeArchiveTagMutation({
        variables: {
          id,
        },
      });
      openAlert({
        alertType: AlertType.SUCCESS,
        message: t('admin.archives.remove.success'),
      });
    } else {
      openAlert({
        alertType: AlertType.ERROR,
        message: t('admin.archives.remove.aborted'),
      });
    }
  }, [archive, dialog, t, removeArchiveTagMutation, id, openAlert]);

  const { canRun: canRemoveArchive } = useCanRunRemoveArchiveTagMutation({
    variables: {
      id,
    },
  });

  if (!canRemoveArchive) {
    return null;
  }
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        {t('admin.archives.dangerZone')}
      </AccordionSummary>
      <AccordionDetails>
        <Button
          onClick={removeArchive}
          startIcon={<Dangerous />}
          endIcon={<Dangerous />}
          color='error'
          variant='contained'
        >
          {t('admin.archives.remove.button')}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};
