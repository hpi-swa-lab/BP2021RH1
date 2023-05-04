import {
  AccountTree,
  ArrowBackIos,
  ArrowForwardIos,
  Check,
  Close,
  Edit,
  Place,
  Subtitles,
  Visibility,
  VisibilityOff,
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
import { useEffect, useMemo, useRef, useState } from 'react';
import Loading from '../../common/Loading';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';

const LocationManagementDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const history: History = useHistory();
  const refetch = dialogProps.content.refetch;
  const [parentTag, setParentTag] = useState<any>(dialogProps.content.parentTag);
  const [parentTagHistory, setParentTagHistory] = useState<any[]>([]);

  const [locationTagID, setLocationTagID] = useState<any>(dialogProps.content.locationTag.id);
  const [editName, setEditName] = useState<boolean>(false);

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
    updateTagNameMutationSource,
    updateTagAcceptanceMutationSource,
    updateVisibilityMutationSource,
    tagPictures,
    updateRootMutationSource,
  } = useGenericTagEndpoints(TagType.LOCATION);

  const allTagQueryResponse = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(allTagQueryResponse.data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const tagPicturesQueryResponse = tagPictures({ variables: { tagID: locationTag.id } });
  const flattenedPictures = useSimplifiedQueryResponseData(tagPicturesQueryResponse.data);

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
      .filter(tag => !tag.parent_tags?.length || tag.root)
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
        if (parentTag && parent.id === parentTag.id) {
          tagSiblings[nextTag.id].push(
            ...tagChildTags[parent.id].filter(
              tag =>
                tag.id !== nextTag.id &&
                !tagSiblings[nextTag.id].some(sibling => sibling.id === tag.id)
            )
          );
        }
      });
      if (nextTag && typeof parentTag === 'undefined') {
        tagSiblings[nextTag.id] = flattenedTags.filter(
          tag => (!tag.parent_tags?.length || tag.root) && tag.id !== nextTag.id
        );
      }
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagSiblings;
  }, [flattenedTags, tagTree, tagChildTags, parentTag]);

  const tagSupertagList = useMemo(() => {
    if (!flattenedTags) return;

    const tagSupertags = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[][]]));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });
    while (queue.length > 0) {
      const nextTag = queue.shift();

      // override if clone was filled already to avoid duplicates
      if (nextTag && tagSupertags[nextTag.id].length > 0) {
        tagSupertags[nextTag.id] = [];
      }

      if (nextTag && nextTag.root) {
        tagSupertags[nextTag.id].push([]);
      }

      nextTag?.parent_tags?.forEach(parent => {
        tagSupertags[parent.id].forEach(parentParents => {
          tagSupertags[nextTag.id].push([...parentParents, parent]);
        });

        // because roots do not have parents
        if (tagSupertags[parent.id].length === 0) {
          tagSupertags[nextTag.id].push([parent]);
        }
      });
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagSupertags;
  }, [flattenedTags, tagTree]);

  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const deleteSynonym = async (tagId: string, synonymName: string) => {
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

  const [updateTagNameMutation] = updateTagNameMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const updateName = async (tagID: string, tagName: string = '') => {
    updateTagNameMutation({
      variables: {
        name: tagName,
        tagId: tagID,
      },
    });
  };

  const [updateAcceptedMutation] = updateTagAcceptanceMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const acceptTag = async (tagId: string) => {
    updateAcceptedMutation({
      variables: {
        tagId,
        accepted: true,
      },
    });
  };

  const [visible, setVisible] = useState<boolean>(locationTag.visible ?? false);
  const [isRoot, setIsRoot] = useState<boolean>(
    locationTag.root || !locationTag.parent_tags?.length
  );

  useEffect(() => {
    setVisible(locationTag.visible ?? false);
    setIsRoot(locationTag.root || !locationTag.parent_tags?.length);
  }, [locationTag]);

  const [updateVisibilityMutation] = updateVisibilityMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const setVisibility = async (tagId: string, tagVisible: boolean) => {
    setVisible(tagVisible);
    updateVisibilityMutation({
      variables: {
        tagId: tagId,
        visible: tagVisible,
      },
    });
  };

  const setTagAsRoot = async (tagId: string, tagIsRoot: boolean) => {
    if (tagIsRoot) {
      setIsRoot(tagIsRoot);
      updateRootMutation({
        variables: {
          tagId: tagId,
          root: tagIsRoot,
        },
      });
    } else {
      if (locationTag.parent_tags?.length) {
        setIsRoot(tagIsRoot);
        updateRootMutation({
          variables: {
            tagId: tagId,
            root: tagIsRoot,
          },
        });
      }
    }
  };

  const currentSiblings = [
    ...(tagSiblingTags && locationTag.id in tagSiblingTags ? tagSiblingTags[locationTag.id] : []),
    locationTag,
  ].sort((a, b) => a.name.localeCompare(b.name));

  const currentIndex = currentSiblings.indexOf(locationTag);

  const title = useRef<string>(locationTag.name);
  const [changed, setChanged] = useState<boolean>(false);

  useEffect(() => {
    setChanged(false);
    title.current = locationTag.name;
  }, [locationTag]);

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
                {editName ? (
                  <TextField
                    variant='standard'
                    margin='none'
                    defaultValue={title.current}
                    onBlur={event => {
                      updateName(locationTag.id, event.target.value);
                      setEditName(!editName);
                    }}
                    onChange={event => {
                      title.current = event.target.value;
                      setChanged(true);
                    }}
                  />
                ) : (
                  <h2
                    className={`location-management-location-name ${
                      !locationTag.accepted ? 'text-gray-400' : ''
                    }`}
                  >
                    {title.current !== locationTag.name && !changed
                      ? locationTag.name
                      : title.current}
                  </h2>
                )}
                {!locationTag.accepted && !editName ? (
                  <div className='location-management-accept-location'>
                    <IconButton
                      onClick={() => {
                        acceptTag(locationTag.id);
                      }}
                    >
                      <Check />
                    </IconButton>
                  </div>
                ) : (
                  <div></div>
                )}
                <div className='location-management-edit-location'>
                  <IconButton
                    onClick={() => {
                      setEditName(!editName);
                    }}
                  >
                    {editName ? <Check /> : <Edit />}
                  </IconButton>
                </div>
              </div>
              <div className='location-management-location-path'>
                <SingleTagElement
                  option={locationTag}
                  label={locationTag.name}
                  tagSupertagList={tagSupertagList}
                />
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
                      fixedTagOnClick={(id: string) => {
                        parentTagHistory.push(parentTag);
                        setParentTag(locationTag);
                        setLocationTagID(id);
                      }}
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
                      fixedTagOnClick={(id: string) => {
                        setParentTag(parentTagHistory.pop());
                        setLocationTagID(id);
                      }}
                      createParentMutation={newParentLocationTagMutation}
                    />
                  </PictureInfoField>
                </div>
              </div>
            </div>
            <div className='location-management-right'>
              <div className='location-management-map'></div>
              <div className='location-management-actions'>
                <div className='location-management-picture-count'>{`${
                  flattenedPictures?.locationTag.pictures.length as string
                } Bild/er in diesem Ort`}</div>
                <Button
                  className='location-management-show-pictures-button'
                  onClick={() => {
                    handleClose(undefined);
                    history.push(`/show-more/location/${locationTag.id}`, {
                      showBack: true,
                    });
                  }}
                  endIcon={<ArrowForwardIos />}
                >
                  Bilder Anzeigen
                </Button>
                {visible ? (
                  <Button
                    className='location-management-show-button'
                    onClick={() => {
                      setVisibility(locationTag.id, false);
                    }}
                    endIcon={<Visibility />}
                  >
                    Sichtbar
                  </Button>
                ) : (
                  <Button
                    className='location-management-not-show-button'
                    onClick={() => {
                      setVisibility(locationTag.id, true);
                    }}
                    endIcon={<VisibilityOff />}
                  >
                    Unsichtbar
                  </Button>
                )}
                {isRoot ? (
                  <Button
                    className='location-management-root-button'
                    onClick={() => {
                      setTagAsRoot(locationTag.id, false);
                    }}
                    endIcon={<AccountTree />}
                  >
                    Wurzel
                  </Button>
                ) : (
                  <Button
                    className='location-management-not-root-button'
                    onClick={() => {
                      setTagAsRoot(locationTag.id, true);
                    }}
                    endIcon={<AccountTree />}
                  >
                    Keine Wurzel
                  </Button>
                )}
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
          {typeof currentIndex !== 'undefined' && currentIndex < currentSiblings.length - 1 ? (
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
