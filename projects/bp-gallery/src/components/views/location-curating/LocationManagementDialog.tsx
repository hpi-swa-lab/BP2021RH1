import {
  AccountTree,
  ArrowBackIos,
  ArrowForwardIos,
  Check,
  Close,
  Delete,
  Edit,
  Place,
  Subtitles,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Button, ButtonProps, Chip, DialogContent, IconButton, TextField } from '@mui/material';
import { Icon, LatLng, Map } from 'leaflet';
import myMarkerIcon from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { pick } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, TileLayer, ZoomControl, useMapEvent } from 'react-leaflet';
import {
  useCanRunCreateLocationTagMutation,
  useCanRunUpdateLocationCoordinatesMutation,
  useCreateLocationTagMutation,
  useUpdateLocationCoordinatesMutation,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useVisit } from '../../../helpers/history';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogProps } from '../../provider/DialogProvider';
import PictureInfoField from '../picture/sidebar/picture-info/PictureInfoField';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';
import TagSelectionField from '../picture/sidebar/picture-info/TagSelectionField';
import { useFoldoutStatus } from './FoldoutStatusContext';
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
import { BAD_HARZBURG_COORDINATES, useGetTagStructures } from './tag-structure-helpers';

const LocationMarker = ({
  position,
  setPosition,
}: {
  position?: LatLng;
  setPosition?: (pos: LatLng) => void;
}) => {
  useMapEvent('click', event => {
    setPosition?.(event.latlng.clone());
  });

  const myIcon = new Icon({
    ...pick(Icon.Default.prototype.options, [
      'iconSize',
      'iconAnchor',
      'popupAnchor',
      'shadowSize',
      'shadowAnchor',
    ]),
    iconUrl: myMarkerIcon,
    shadowUrl: markerShadow,
  });

  return position ? <Marker icon={myIcon} position={position} /> : null;
};

const mapControlKeys = [
  'dragging',
  'touchZoom',
  'scrollWheelZoom',
  'boxZoom',
  'doubleClickZoom',
  'keyboard',
] as const;

const LocationManagementDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();
  const { visit } = useVisit();

  const foldoutStatus = useFoldoutStatus();

  const scrollPosition = dialogProps.content.scrollPosition;

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

  const tagPicturesQueryResponse = tagPictures({
    variables: { tagIDs: [locationTag.id] },
    fetchPolicy: 'no-cache',
  });
  const flattenedPictures = useSimplifiedQueryResponseData(tagPicturesQueryResponse.data);

  const currentSiblings = [
    ...(tagSiblingTags && locationTag.id in tagSiblingTags ? tagSiblingTags[locationTag.id] : []),
    locationTag,
  ].sort((a, b) => a.name.localeCompare(b.name));

  const currentIndex = currentSiblings.indexOf(locationTag);

  const { deleteSynonym, canDeleteSynonym } = useDeleteSynonym(locationTag, refetch);
  const { addSynonym, canAddSynonym } = useAddSynonym(locationTag, refetch);
  const { updateName, canUpdateName } = useUpdateName(locationTag, refetch);
  const { acceptTag, canAcceptTag } = useAcceptTag(locationTag, refetch);
  const { setVisible, canSetVisible } = useSetVisible(locationTag, refetch);
  const { setTagAsRoot, canSetTagAsRoot } = useSetRoot(locationTag, refetch);
  const { setParentTags, canSetParentTags } = useSetParentTags(locationTag, refetch);
  const { setChildTags, canSetChildTags } = useSetChildTags(locationTag, refetch);

  const map = useRef<Map>(null);

  const [newLocationTagMutation] = useCreateLocationTagMutation({
    refetchQueries: ['getAllLocationTags'],
    awaitRefetchQueries: true,
  });
  const { canRun: canCreateLocationTag } = useCanRunCreateLocationTagMutation();

  const [localVisibility, setLocalVisibility] = useState<boolean>(locationTag.visible ?? false);
  const [isRoot, setIsRoot] = useState<boolean>(
    locationTag.root ?? !locationTag.parent_tags?.length
  );
  const [title, setTitle] = useState<string>(locationTag.name);
  const [position, setPosition] = useState<LatLng | undefined>(
    locationTag.coordinates
      ? new LatLng(locationTag.coordinates.latitude, locationTag.coordinates.longitude)
      : undefined
  );

  useEffect(() => {
    setLocalVisibility(locationTag.visible ?? false);
    setIsRoot(locationTag.root ?? !locationTag.parent_tags?.length);
    setTitle(locationTag.name);
    setPosition(
      locationTag.coordinates
        ? new LatLng(locationTag.coordinates.latitude, locationTag.coordinates.longitude)
        : undefined
    );
  }, [locationTag]);

  const [updateLocationCoordinatesMutation] = useUpdateLocationCoordinatesMutation({
    onCompleted: refetch,
  });
  const { canRun: canUpdateLocationCoordinates } = useCanRunUpdateLocationCoordinatesMutation({
    variables: {
      tagId: locationTag.id,
    },
  });

  useEffect(() => {
    for (const key of mapControlKeys) {
      const handler = map.current?.[key];
      if (canUpdateLocationCoordinates) {
        handler?.enable();
      } else {
        handler?.disable();
      }
    }
  }, [canUpdateLocationCoordinates]);

  const initialMapValues = useMemo(() => {
    return {
      center: position ?? BAD_HARZBURG_COORDINATES,
      zoom: 10,
    };
  }, [position]);

  useEffect(() => {
    if (!map.current || !position) return;
    map.current.flyTo(position, 10);
  }, [position]);

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
              {!locationTag.accepted && !editName && canAcceptTag ? (
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
              {canUpdateName && (
                <div className='location-management-edit-location'>
                  <IconButton
                    onClick={() => {
                      setEditName(editName => !editName);
                    }}
                  >
                    {editName ? <Check /> : <Edit />}
                  </IconButton>
                </div>
              )}
            </div>
            <div className='location-management-location-path'>
              <SingleTagElement
                option={locationTag}
                label={locationTag.name}
                tagSupertags={tagSupertagList ? tagSupertagList[locationTag.id] : []}
              />
            </div>
            <div className='location-management-left-content'>
              {canAddSynonym && (
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
                                    onDelete={
                                      canDeleteSynonym
                                        ? () => deleteSynonym(synonym.name)
                                        : undefined
                                    }
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
              )}
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
                    onChange={
                      canSetChildTags
                        ? locations => {
                            setChildTags(locations as FlatTag[]);
                          }
                        : undefined
                    }
                    noContentText={''}
                    fixedParentTag={locationTag}
                    customChipOnClick={(id: string) => {
                      parentTagHistory.current.push(parentTag);
                      setParentTag(locationTag);
                      setLocationTagID(id);
                    }}
                    createChildMutation={canCreateLocationTag ? newLocationTagMutation : undefined}
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
                    onChange={
                      canSetParentTags
                        ? locations => {
                            setParentTags(locations as FlatTag[]);
                          }
                        : undefined
                    }
                    noContentText={''}
                    fixedChildTag={locationTag}
                    customChipOnClick={(id: string) => {
                      setParentTag(parentTagHistory.current.pop());
                      setLocationTagID(id);
                    }}
                    createParentMutation={canCreateLocationTag ? newLocationTagMutation : undefined}
                  />
                </PictureInfoField>
              </div>
            </div>
          </div>
          <div className='location-management-right'>
            <div
              className={`location-management-map ${
                canUpdateLocationCoordinates ? '' : 'grayscale'
              }`}
            >
              <MapContainer
                center={initialMapValues.center}
                zoom={initialMapValues.zoom}
                className='map-container w-full h-full mb-1'
                {...Object.fromEntries(
                  mapControlKeys.map(key => [key, canUpdateLocationCoordinates] as const)
                )}
                zoomControl={false}
                ref={map}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {canUpdateLocationCoordinates && <ZoomControl />}
                <LocationMarker
                  position={position}
                  setPosition={
                    canUpdateLocationCoordinates
                      ? pos => {
                          updateLocationCoordinatesMutation({
                            variables: {
                              tagId: locationTag.id,
                              coordinate: {
                                latitude: pos.lat,
                                longitude: pos.lng,
                              },
                            },
                          });
                          setPosition(pos);
                        }
                      : undefined
                  }
                />
              </MapContainer>
            </div>
            <div className='location-management-actions'>
              <LocationManagementButton
                onClick={() => {
                  updateLocationCoordinatesMutation({
                    variables: {
                      tagId: locationTag.id,
                      coordinate: null,
                    },
                  });
                  setPosition(undefined);
                }}
                disabled={!canUpdateLocationCoordinates}
                endIcon={<Delete />}
              >
                {t('tag-panel.delete-coordinate')}
              </LocationManagementButton>
              <div className='location-management-picture-count'>
                {flattenedPictures &&
                  t('tag-panel.location-pictures', {
                    count: flattenedPictures.locationTags[0].pictures.length,
                  })}
              </div>
              <LocationManagementButton
                onClick={() => {
                  handleClose(undefined);
                  visit(`/show-more/location/${locationTag.id}`, {
                    openBranches: foldoutStatus?.current,
                    customScrollPos: scrollPosition,
                  });
                }}
                endIcon={<ArrowForwardIos />}
              >
                {t('common.show-pictures')}
              </LocationManagementButton>
              <LocationManagementButton
                onClick={() => {
                  setVisible(!localVisibility);
                  setLocalVisibility(localVisibility => !localVisibility);
                }}
                disabled={!canSetVisible}
                color={localVisibility ? 'primary' : 'grey'}
                endIcon={localVisibility ? <Visibility /> : <VisibilityOff />}
              >
                {localVisibility ? t('common.visible') : t('common.invisible')}
              </LocationManagementButton>
              <LocationManagementButton
                onClick={() => {
                  if (locationTag.parent_tags?.length) {
                    setTagAsRoot(!isRoot);
                    setIsRoot(isRoot => !isRoot);
                  }
                }}
                color={isRoot ? 'primary' : 'grey'}
                disabled={!canSetTagAsRoot}
                endIcon={<AccountTree />}
              >
                {isRoot ? t('common.root') : t('common.no-root')}
              </LocationManagementButton>
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

const LocationManagementButton = (props: ButtonProps) => {
  return <Button className='!my-1' fullWidth color='primary' variant='contained' {...props} />;
};

export default LocationManagementDialogPreset;
