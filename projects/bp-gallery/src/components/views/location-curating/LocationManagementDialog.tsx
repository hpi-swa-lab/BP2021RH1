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
import { Button, Chip, DialogContent, IconButton, TextField } from '@mui/material';
import { History } from 'history';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useCreateLocationTagMutation } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogProps } from '../../provider/DialogProvider';
import PictureInfoField from '../picture/sidebar/picture-info/PictureInfoField';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';
import TagSelectionField from '../picture/sidebar/picture-info/TagSelectionField';
import './LocationManagementDialog.scss';
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
import { useGetTagStructures } from './tag-structure-helpers';

const LocationManagementDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();
  const history: History = useHistory();
  const { allTagsQuery, tagPictures } = useGenericTagEndpoints(TagType.LOCATION);

  const refetch: () => void = dialogProps.content.refetch;

  const [parentTag, setParentTag] = useState<any>(dialogProps.content.parentTag);
  const [locationTagID, setLocationTagID] = useState<any>(dialogProps.content.locationTag.id);
  const [editName, setEditName] = useState<boolean>(false);

  const parentTagHistory = useRef<any[]>([]);

  const allTagQueryResponse = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(allTagQueryResponse.data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const { tagSiblingTags, tagSupertagList, flattenedTagTree } = useGetTagStructures(
    flattenedTags,
    parentTag as FlatTag | undefined,
    !parentTag
  );

  const locationTag = flattenedTagTree
    ? flattenedTagTree[locationTagID]
    : (dialogProps.content.locationTag as FlatTag);

  const tagPicturesQueryResponse = tagPictures({ variables: { tagID: locationTag.id } });
  const flattenedPictures = useSimplifiedQueryResponseData(tagPicturesQueryResponse.data);

  const currentSiblings = [
    ...(tagSiblingTags && locationTag.id in tagSiblingTags ? tagSiblingTags[locationTag.id] : []),
    locationTag,
  ].sort((a, b) => a.name.localeCompare(b.name));

  const currentIndex = currentSiblings.indexOf(locationTag);

  const { deleteSynonym } = useDeleteSynonym(locationTag, refetch);
  const { addSynonym } = useAddSynonym(locationTag, refetch);
  const { updateName } = useUpdateName(locationTag, refetch);
  const { acceptTag } = useAcceptTag(locationTag, refetch);
  const { setVisible } = useSetVisible(locationTag, refetch);
  const { setTagAsRoot } = useSetRoot(locationTag, refetch);
  const { setParentTags } = useSetParentTags(locationTag, refetch);
  const { setChildTags } = useSetChildTags(locationTag, refetch);

  const [newLocationTagMutation] = useCreateLocationTagMutation({
    refetchQueries: ['getAllLocationTags'],
    awaitRefetchQueries: true,
  });

  const [localVisibility, setLocalVisibility] = useState<boolean>(locationTag.visible ?? false);
  const [isRoot, setIsRoot] = useState<boolean>(
    locationTag.root ?? !locationTag.parent_tags?.length
  );

  const [title, setTitle] = useState<string>(locationTag.name);

  useEffect(() => {
    setLocalVisibility(locationTag.visible ?? false);
    setIsRoot(locationTag.root ?? !locationTag.parent_tags?.length);
    setTitle(locationTag.name);
  }, [locationTag]);

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
                  defaultValue={title}
                  onBlur={event => {
                    updateName(event.target.value);
                    setEditName(editName => !editName);
                  }}
                  onChange={event => {
                    setTitle(event.target.value);
                  }}
                />
              ) : (
                <h2
                  className={`location-management-location-name ${
                    !locationTag.accepted ? 'text-gray-400' : ''
                  }`}
                >
                  {title}
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
                    setEditName(editName => !editName);
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
                tagSupertags={tagSupertagList ? tagSupertagList[locationTag.id] : []}
              />
            </div>
            <div className='location-management-left-content'>
              <div className='location-management-synonyms-container'>
                <div>{t('curator.synonyms')}</div>
                <PictureInfoField
                  title={t('curator.synonyms')}
                  icon={<Subtitles />}
                  type='location'
                >
                  <div className='location-management-synonyms'>
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
                      onBlur={(event: any) => {
                        event.target.value = '';
                      }}
                      InputProps={{
                        startAdornment: (
                          <>
                            {locationTag.synonyms?.map(synonym =>
                              synonym ? (
                                <Chip
                                  key={synonym.name}
                                  label={synonym.name}
                                  className='location-management-synonym'
                                  onDelete={() => deleteSynonym(synonym.name)}
                                />
                              ) : undefined
                            )}
                          </>
                        ),
                      }}
                    />
                  </div>
                </PictureInfoField>
              </div>
              <div className='location-management-children-container'>
                <div>{t('common.sublocations')}</div>
                <PictureInfoField title={t('common.sublocations')} icon={<Place />} type='location'>
                  <TagSelectionField
                    type={TagType.LOCATION}
                    tags={
                      (locationTag.child_tags?.map(tag => ({ ...tag, verified: true })) as any) ??
                      []
                    }
                    allTags={(flattenedTags as any) ?? []}
                    onChange={locations => {
                      setChildTags(locations as FlatTag[]);
                    }}
                    noContentText={''}
                    fixedParentTag={locationTag}
                    customChipOnClick={(id: string) => {
                      parentTagHistory.current.push(parentTag);
                      setParentTag(locationTag);
                      setLocationTagID(id);
                    }}
                    createChildMutation={newLocationTagMutation}
                  />
                </PictureInfoField>
              </div>
              <div className='location-management-parents-container'>
                <div>{t('common.superlocations')}</div>
                <PictureInfoField
                  title={t('common.superlocations')}
                  icon={<Place />}
                  type='location'
                >
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
                      setParentTags(locations as FlatTag[]);
                    }}
                    noContentText={''}
                    fixedChildTag={locationTag}
                    customChipOnClick={(id: string) => {
                      setParentTag(parentTagHistory.current.pop());
                      setLocationTagID(id);
                    }}
                    createParentMutation={newLocationTagMutation}
                  />
                </PictureInfoField>
              </div>
            </div>
          </div>
          <div className='location-management-right'>
            <div className='location-management-map'>
              Work in Progress/Hier wird noch dran gearbeitet
            </div>
            <div className='location-management-actions'>
              <div className='location-management-picture-count'>
                {flattenedPictures &&
                  t('tag-panel.location-pictures', {
                    count: flattenedPictures.locationTag.pictures.length,
                  })}
              </div>
              <Button
                className='location-management-button location-management-primary'
                onClick={() => {
                  handleClose(undefined);
                  history.push(`/show-more/location/${locationTag.id}`, {
                    showBack: true,
                  });
                }}
                endIcon={<ArrowForwardIos />}
              >
                {t('common.show-pictures')}
              </Button>
              <Button
                className={`${
                  localVisibility ? 'location-management-primary' : 'location-management-gray'
                } location-management-button`}
                onClick={() => {
                  setVisible(!localVisibility);
                  setLocalVisibility(localVisibility => !localVisibility);
                }}
                endIcon={localVisibility ? <Visibility /> : <VisibilityOff />}
              >
                {localVisibility ? t('common.visible') : t('common.invisible')}
              </Button>
              <Button
                className={`${
                  isRoot ? 'location-management-primary' : 'location-management-gray'
                } location-management-button`}
                onClick={() => {
                  if (locationTag.parent_tags?.length) {
                    setTagAsRoot(!isRoot);
                    setIsRoot(isRoot => !isRoot);
                  }
                }}
                endIcon={<AccountTree />}
              >
                {isRoot ? t('common.root') : t('common.no-root')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      <div className='location-management-navigation'>
        {currentIndex > 0 ? (
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
        {currentIndex < currentSiblings.length - 1 ? (
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
};

export default LocationManagementDialogPreset;
