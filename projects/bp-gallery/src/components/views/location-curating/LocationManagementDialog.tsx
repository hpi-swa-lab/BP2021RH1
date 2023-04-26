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
import { Button, Chip, DialogContent, Grid, IconButton, TextField } from '@mui/material';
import { DialogProps } from '../../provider/DialogProvider';
import './LocationManagementDialog.scss';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import {
  ComponentCommonSynonymsInput,
  useGetLocationTagByIdQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';

const LocationManagementDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  let locationTag = dialogProps.content.locationTag as FlatTag;

  const refetch = dialogProps.content.refetch;
  const { data } = useGetLocationTagByIdQuery({ variables: { locationID: locationTag.id } });
  locationTag = useSimplifiedQueryResponseData(data)?.locationTag ?? locationTag;

  const { updateSynonymsMutationSource } = useGenericTagEndpoints(TagType.LOCATION);

  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const deleteSynonym = (tagId: string, synonymName: string) => {
    updateSynonymsMutation({
      variables: {
        tagId,
        synonyms:
          locationTag.synonyms?.filter(s => s?.name !== '' && s?.name !== synonymName) ??
          ([] as any),
      },
    });
  };

  const addSynonym = async (tagId: string, tagName: string, synonymName: string) => {
    if (!tagId) return;
    if (synonymName.length) {
      const synonyms: ComponentCommonSynonymsInput[] =
        locationTag.synonyms?.map(s => ({ name: s?.name })) ?? [];
      synonyms.push({ name: synonymName });
      updateSynonymsMutation({
        variables: {
          tagId,
          synonyms,
        },
      });
    }
  };

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
              <div className='location-management-synonyms'>
                <Grid
                  className='location-management-synonyms-grid'
                  container
                  justifyContent='space-evenly'
                  rowSpacing={0}
                  columnSpacing={0}
                >
                  {locationTag.synonyms?.map((synonym, index) => (
                    <div key={index}>
                      <Chip
                        key={synonym!.name}
                        label={synonym!.name}
                        className='location-management-synonym'
                        onDelete={() => deleteSynonym(locationTag.id, synonym!.name)}
                      />
                    </div>
                  ))}
                </Grid>
                <TextField
                  className='location-management-synonyms-input'
                  variant='standard'
                  margin='dense'
                  placeholder='Neues Synonym hinzufügen'
                  onKeyDown={(event: any) => {
                    if (event.key === 'Enter' && event.target.value.length > 0) {
                      addSynonym(locationTag.id, locationTag.name, event.target.value as string);
                      event.target.value = '';
                    }
                  }}
                />
              </div>
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
