import {
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  CopyAll,
  Delete,
  Eject,
  MoveDown,
  RemoveRedEye,
} from '@mui/icons-material';
import { Button, DialogContent, IconButton } from '@mui/material';
import { DialogProps } from '../../provider/DialogProvider';
import './LocationManagementDialog.scss';

const LocationManagementDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  return (
    <>
      <div className={'location-management-close-dialog'}>
        <IconButton onClick={() => handleClose(undefined)}>
          <Close />
        </IconButton>
      </div>
      <DialogContent>
        <div className='location-management-dialog-container'>
          <div className='location-management-left'>
            <div className='location-management-name-container'>
              <h3 className='location-management-location-name'>{dialogProps.title}</h3>
              <IconButton onClick={() => {}}>
                <Delete />
              </IconButton>
            </div>
            <div className='location-management-synonyms-container'>
              <div>Synonyme</div>
              <div className='location-management-synonyms'></div>
            </div>
            <div className='location-management-children-container'>
              <div>Unterorte</div>
              <div className='location-management-children'></div>
            </div>
            <div className='location-management-parents-container'>
              <div>Oberorte</div>
              <div className='location-management-parents'></div>
            </div>
          </div>
          <div className='location-management-right'>
            <div className='location-management-map'></div>
            <div className='location-management-actions'>
              <div className='location-management-actions-first-row'>
                <Button
                  className='location-management-show-pictures-button'
                  onClick={() => {}}
                  endIcon={<ArrowForwardIos />}
                >
                  Bilder Anzeigen
                </Button>
              </div>
              <div className='location-management-actions-second-row'>
                <Button
                  className='location-management-eject-button'
                  onClick={() => {}}
                  endIcon={<Eject />}
                >
                  Loslösen
                </Button>
                <Button
                  className='location-management-move-button'
                  onClick={() => {}}
                  endIcon={<MoveDown />}
                >
                  Unterordnen
                </Button>
              </div>
              <div className='location-management-actions-third-row'>
                <Button
                  className='location-management-copy-button'
                  onClick={() => {}}
                  endIcon={<CopyAll />}
                >
                  Kopieren
                </Button>
                <Button
                  className='location-management-show-button'
                  onClick={() => {}}
                  endIcon={<RemoveRedEye />}
                >
                  Sichtbar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <div className='location-management-navigation'>
        <Button
          className='location-management-previous-button'
          onClick={() => {}}
          startIcon={<ArrowBackIos />}
        >
          Vorheriger Orstname
        </Button>
        <Button
          className='location-management-next-button'
          onClick={() => {}}
          endIcon={<ArrowForwardIos />}
        >
          Nächster Ortsname
        </Button>
      </div>
    </>
  );
};

export default LocationManagementDialogPreset;
