import { Dangerous, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertContext, AlertType } from '../../provider/AlertProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';

export const DangerousRemoveButton = ({
  entity,
  removeMutation,
  canRemove,
  removeTranslation,
  dialogTitleTranslation,
  dialogContentTranslation,
  successTranslation,
  abortTranslation,
}: {
  entity?: { id: string; name: string };
  removeMutation: (params: { variables: { id: string } }) => Promise<unknown>;
  canRemove: boolean;
  removeTranslation: string;
  dialogTitleTranslation: string;
  dialogContentTranslation: string;
  successTranslation: string;
  abortTranslation: string;
}) => {
  const { t } = useTranslation();
  const dialog = useDialog();
  const openAlert = useContext(AlertContext);

  const remove = useCallback(async () => {
    if (!entity) {
      return;
    }
    const { name } = entity;
    const typedName = await dialog({
      title: t(dialogTitleTranslation, { name }),
      content: t(dialogContentTranslation, { name }),
      preset: DialogPreset.INPUT_FIELD,
    });
    if (typedName === name) {
      await removeMutation({
        variables: {
          id: entity.id,
        },
      });
      openAlert({
        alertType: AlertType.SUCCESS,
        message: t(successTranslation),
      });
    } else {
      openAlert({
        alertType: AlertType.ERROR,
        message: t(abortTranslation),
      });
    }
  }, [
    entity,
    dialog,
    t,
    dialogTitleTranslation,
    dialogContentTranslation,
    removeMutation,
    openAlert,
    successTranslation,
    abortTranslation,
  ]);

  if (!canRemove || !entity) {
    return null;
  }
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>{t('admin.dangerZone')}</AccordionSummary>
      <AccordionDetails>
        <Button
          onClick={remove}
          startIcon={<Dangerous />}
          endIcon={<Dangerous />}
          color='error'
          variant='contained'
        >
          {t(removeTranslation)}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};
