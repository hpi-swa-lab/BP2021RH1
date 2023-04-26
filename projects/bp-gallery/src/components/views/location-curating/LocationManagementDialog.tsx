import {
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  CopyAll,
  Delete,
  Eject,
  MoveDown,
  Place,
  RemoveRedEye,
  Subtitles,
} from '@mui/icons-material';
import { Button, Chip, DialogContent, Grid, IconButton, TextField } from '@mui/material';
import { DialogProps } from '../../provider/DialogProvider';
import './LocationManagementDialog.scss';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import {
  ComponentCommonSynonymsInput,
  useCreateSubLocationMutation,
  useCreateSuperLocationMutation,
  useGetLocationTagByIdQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import PictureInfoField from '../picture/sidebar/picture-info/PictureInfoField';
import TagSelectionField from '../picture/sidebar/picture-info/TagSelectionField';

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

  const {
    updateSynonymsMutationSource,
    allTagsQuery,
    updateTagParentMutationSource,
    updateTagChildMutationSource,
  } = useGenericTagEndpoints(TagType.LOCATION);

  const allTagQueryResponse = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(allTagQueryResponse.data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

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

  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const [updateTagChildMutation] = updateTagChildMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const [newChildLocationTagMutation, newChildLocationTagMutationResponse] =
    useCreateSubLocationMutation({
      refetchQueries: ['getAllLocationTags'],
      awaitRefetchQueries: true,
    });

  const [newParentLocationTagMutation, newParentLocationTagMutationResponse] =
    useCreateSuperLocationMutation({
      refetchQueries: ['getAllLocationTags'],
      awaitRefetchQueries: true,
    });

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
              <h2 className='location-management-location-name'>{dialogProps.title}</h2>
              <IconButton onClick={() => {}}>
                <Delete />
              </IconButton>
            </div>
            <div className='location-management-left-content'>
              <div className='location-management-synonyms-container'>
                <div>Synonyme</div>
                <PictureInfoField title={'Synonyme'} icon={<Subtitles />} type='location'>
                  <div className='location-management-synonyms'>
                    <Grid
                      className='location-management-synonyms-grid'
                      container
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
                      onKeyDown={(event: any) => {
                        if (event.key === 'Enter' && event.target.value.length > 0) {
                          addSynonym(
                            locationTag.id,
                            locationTag.name,
                            event.target.value as string
                          );
                          event.target.value = '';
                        }
                      }}
                    />
                  </div>
                </PictureInfoField>
              </div>
              <div className='location-management-children-container'>
                <div>Unterorte</div>
                <PictureInfoField title={'Unterorte'} icon={<Place />} type='location'>
                  <TagSelectionField
                    type={TagType.LOCATION}
                    tags={
                      (locationTag.child_tags?.map(tag => ({ ...tag, verified: true })) as any) ??
                      []
                    }
                    allTags={(flattenedTags as any) ?? []}
                    onChange={locations => {
                      updateTagChildMutation({
                        variables: {
                          tagID: locationTag.id,
                          childIDs: locations.map(t => t.id),
                        },
                      });
                    }}
                    noContentText={''}
                    fixedTag={locationTag}
                    createChildMutation={newChildLocationTagMutation}
                  />
                </PictureInfoField>
              </div>
              <div className='location-management-parents-container'>
                <div>Oberorte</div>
                <PictureInfoField title={'Oberorte'} icon={<Place />} type='location'>
                  <TagSelectionField
                    type={TagType.LOCATION}
                    tags={
                      (locationTag.parent_tags?.map(tag => ({ ...tag, verified: true })) as any) ??
                      []
                    }
                    allTags={(flattenedTags as any) ?? []}
                    onChange={locations => {
                      updateTagParentMutation({
                        variables: {
                          tagID: locationTag.id,
                          parentIDs: locations.map(t => t.id),
                        },
                      });
                    }}
                    noContentText={''}
                    fixedTag={locationTag}
                    createParentMutation={newParentLocationTagMutation}
                  />
                </PictureInfoField>
              </div>
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
