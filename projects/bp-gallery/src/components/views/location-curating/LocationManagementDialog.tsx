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
import { useMemo, useState } from 'react';
import Loading from '../../common/Loading';

const LocationManagementDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const refetch = dialogProps.content.refetch;

  const [locationTagID, setLocationTagID] = useState<any>(dialogProps.content.locationTag.id);

  const { data, loading } = useGetLocationTagByIdQuery({
    variables: { locationID: locationTagID },
  });
  const locationTag: FlatTag =
    useSimplifiedQueryResponseData(data)?.locationTag ?? dialogProps.content.locationTag;

  const {
    updateSynonymsMutationSource,
    allTagsQuery,
    updateTagParentMutationSource,
    updateTagChildMutationSource,
  } = useGenericTagEndpoints(TagType.LOCATION);

  const allTagQueryResponse = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(allTagQueryResponse.data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const tagTree = useMemo(() => {
    if (!flattenedTags) return;

    const tagsById = Object.fromEntries(
      flattenedTags.map(tag => [tag.id, { ...tag, child_tags: [] as FlatTag[] }])
    );
    for (const tag of Object.values(tagsById)) {
      tag.parent_tags?.forEach(parentTag => {
        tagsById[parentTag.id].child_tags.push(tag);
        // THIS IS JUST FOR THE PROTOTYPE DO NOT USE IT IN THE FUTURE
        tagsById[parentTag.id].child_tags.sort((a, b) => a.name.localeCompare(b.name));
      });
    }
    const sortedTagTree = Object.values(tagsById)
      .filter(tag => !tag.parent_tags?.length)
      // THIS IS JUST FOR THE PROTOTYPE DO NOT USE IT IN THE FUTURE
      .sort((a, b) => a.name.localeCompare(b.name));

    return sortedTagTree;
  }, [flattenedTags]);

  const tagChildTags = useMemo(() => {
    if (!flattenedTags) return;

    const tagChildren = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[]]));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      if (nextTag?.child_tags) {
        tagChildren[nextTag.id] = nextTag.child_tags;
      }
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagChildren;
  }, [flattenedTags, tagTree]);

  const tagSiblingTags = useMemo(() => {
    if (!flattenedTags || !tagChildTags) return;

    const tagSiblings = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[]]));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      nextTag?.parent_tags?.forEach(parent => {
        tagSiblings[nextTag.id].push(
          ...tagChildTags[parent.id].filter(
            tag =>
              tag.id !== nextTag.id &&
              !tagSiblings[nextTag.id].some(sibling => sibling.id === tag.id)
          )
        );
      });
      if (nextTag && !nextTag.parent_tags?.length) {
        tagSiblings[nextTag.id] = flattenedTags.filter(
          tag => !tag.parent_tags?.length && tag.id !== nextTag.id
        );
      }
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagSiblings;
  }, [flattenedTags, tagTree, tagChildTags]);

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

  const currentSiblings = [
    ...(tagSiblingTags && locationTag.id in tagSiblingTags ? tagSiblingTags[locationTag.id] : []),
    locationTag,
  ].sort((a, b) => a.name.localeCompare(b.name));

  const currentIndex = currentSiblings.indexOf(locationTag);

  if (loading) {
    return (
      <div className='location-management-placeholder'>
        <Loading />
      </div>
    );
  } else {
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
                <h2 className='location-management-location-name'>{locationTag.name}</h2>
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
                        (locationTag.parent_tags?.map(tag => ({
                          ...tag,
                          verified: true,
                        })) as any) ?? []
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
          {currentIndex && currentIndex > 0 ? (
            <Button
              className='location-management-previous-button'
              onClick={() => {
                const nextTag = currentSiblings[currentIndex - 1];
                setLocationTagID(nextTag.id);
              }}
              startIcon={<ArrowBackIos />}
            >
              {currentSiblings[currentIndex - 1].name}
            </Button>
          ) : (
            <div></div>
          )}
          {typeof currentIndex !== 'undefined' &&
          currentIndex < currentSiblings.length &&
          currentSiblings.length > 1 ? (
            <Button
              className='location-management-next-button'
              onClick={() => {
                const nextTag = currentSiblings[currentIndex + 1];
                setLocationTagID(nextTag.id);
              }}
              endIcon={<ArrowForwardIos />}
            >
              {currentSiblings[currentIndex + 1].name}
            </Button>
          ) : (
            <div className='h-8'></div>
          )}
        </div>
      </>
    );
  }
};

export default LocationManagementDialogPreset;
