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
  useCreateLocationMutation,
  useCreateSuperLocationMutation,
  useGetLocationTagByIdQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import PictureInfoField from '../picture/sidebar/picture-info/PictureInfoField';
import TagSelectionField from '../picture/sidebar/picture-info/TagSelectionField';
import { useEffect, useRef, useState } from 'react';
import Loading from '../../common/Loading';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';
import {
  useGetTagChildren,
  useGetTagSiblings,
  useGetTagSupertagList,
  useGetTagTree,
} from './tag-structure-helpers';
import {
  useAcceptTag,
  useAddSynonym,
  useDeleteSynonym,
  useSetChildTags,
  useSetParentTags,
  useSetRoot,
  useSetVisible,
  useUpdateName,
} from './location-management-helpers';

const LocationManagementDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const history: History = useHistory();
  const refetch: () => void = dialogProps.content.refetch;
  const [parentTag, setParentTag] = useState<any>(dialogProps.content.parentTag);
  const [parentTagHistory, setParentTagHistory] = useState<any[]>([]);

  const [locationTagID, setLocationTagID] = useState<any>(dialogProps.content.locationTag.id);
  const [editName, setEditName] = useState<boolean>(false);

  const { data, loading } = useGetLocationTagByIdQuery({
    variables: { locationID: locationTagID },
  });
  const locationTag: FlatTag =
    useSimplifiedQueryResponseData(data)?.locationTag ?? dialogProps.content.locationTag;

  const { allTagsQuery, tagPictures } = useGenericTagEndpoints(TagType.LOCATION);

  const allTagQueryResponse = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(allTagQueryResponse.data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const tagPicturesQueryResponse = tagPictures({ variables: { tagID: locationTag.id } });
  const flattenedPictures = useSimplifiedQueryResponseData(tagPicturesQueryResponse.data);

  const tagTree = useGetTagTree(flattenedTags);

  const tagChildTags = useGetTagChildren(tagTree as FlatTag[], flattenedTags);

  const tagSiblingTags = useGetTagSiblings(
    tagTree as FlatTag[],
    flattenedTags,
    tagChildTags,
    parentTag as FlatTag,
    !parentTag
  );

  const tagSupertagList = useGetTagSupertagList(tagTree, flattenedTags);

  const { deleteSynonym } = useDeleteSynonym(locationTag, refetch);
  const { addSynonym } = useAddSynonym(locationTag, refetch);
  const { updateName } = useUpdateName(locationTag, refetch);
  const { acceptTag } = useAcceptTag(locationTag, refetch);
  const { setVisible } = useSetVisible(locationTag, refetch);
  const { setTagAsRoot } = useSetRoot(locationTag, refetch);
  const { setParentTags } = useSetParentTags(locationTag, refetch);
  const { setChildTags } = useSetChildTags(locationTag, refetch);

  const [newLocationTagMutation, newLocationTagMutationResponse] = useCreateLocationMutation({
    refetchQueries: ['getAllLocationTags'],
    awaitRefetchQueries: true,
  });

  const [newParentLocationTagMutation, newParentLocationTagMutationResponse] =
    useCreateSuperLocationMutation({
      refetchQueries: ['getAllLocationTags'],
      awaitRefetchQueries: true,
    });

  const [localVisibility, setLocalVisibility] = useState<boolean>(locationTag.visible ?? false);
  const [isRoot, setIsRoot] = useState<boolean>(
    locationTag.root || !locationTag.parent_tags?.length
  );

  const currentSiblings = [
    ...(tagSiblingTags && locationTag.id in tagSiblingTags ? tagSiblingTags[locationTag.id] : []),
    locationTag,
  ].sort((a, b) => a.name.localeCompare(b.name));

  const currentIndex = currentSiblings.indexOf(locationTag);

  const title = useRef<string>(locationTag.name);
  const [changed, setChanged] = useState<boolean>(false);

  useEffect(() => {
    setLocalVisibility(locationTag.visible ?? false);
    setIsRoot(locationTag.root || !locationTag.parent_tags?.length);
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
                      updateName(event.target.value);
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
                        acceptTag();
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
                              onDelete={() => deleteSynonym(synonym!.name)}
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
                            addSynonym(event.target.value as string);
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
                        setChildTags(locations.map(t => t.id));
                      }}
                      noContentText={''}
                      fixedTag={locationTag}
                      fixedTagOnClick={(id: string) => {
                        parentTagHistory.push(parentTag);
                        setParentTag(locationTag);
                        setLocationTagID(id);
                      }}
                      createChildMutation={newLocationTagMutation}
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
                        setParentTags(locations.map(t => t.id));
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
                {localVisibility ? (
                  <Button
                    className='location-management-show-button'
                    onClick={() => {
                      setVisible(false);
                      setLocalVisibility(false);
                    }}
                    endIcon={<Visibility />}
                  >
                    Sichtbar
                  </Button>
                ) : (
                  <Button
                    className='location-management-not-show-button'
                    onClick={() => {
                      setVisible(true);
                      setLocalVisibility(true);
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
                      if (locationTag.parent_tags?.length) {
                        setTagAsRoot(false);
                        setIsRoot(false);
                      }
                    }}
                    endIcon={<AccountTree />}
                  >
                    Wurzel
                  </Button>
                ) : (
                  <Button
                    className='location-management-not-root-button'
                    onClick={() => {
                      setTagAsRoot(true);
                      setIsRoot(true);
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
