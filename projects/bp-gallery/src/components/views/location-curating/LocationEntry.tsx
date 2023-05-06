import {
  Check,
  ChevronRight,
  CopyAll,
  Delete,
  Eject,
  ExpandMore,
  MoveDown,
  Visibility,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import { Badge, Chip, IconButton, Tooltip } from '@mui/material';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import './LocationEntry.scss';
import {
  useAcceptTag,
  useCopyTag,
  useDeleteSynonym,
  useDeleteTag,
  useDetachTag,
  useRelocateTag,
  useSetVisible,
} from './location-management-helpers';
import { t } from 'i18next';

const LocationEntry = ({
  locationTag,
  parentTag,
  showMore,
  onToggleShowMore,
  refetch,
  type,
  unacceptedSubtags = 0,
}: {
  locationTag: FlatTag;
  parentTag?: FlatTag;
  showMore: boolean;
  onToggleShowMore: () => void;
  refetch: () => void;
  type: TagType;
  unacceptedSubtags?: number;
}) => {
  const prompt = useDialog();

  const { setVisible } = useSetVisible(locationTag, refetch);
  const { relocateTag } = useRelocateTag(locationTag, refetch, parentTag);
  const { detachTag } = useDetachTag(locationTag, refetch);
  const { copyTag } = useCopyTag(locationTag, refetch);
  const { acceptTag } = useAcceptTag(locationTag, refetch);
  const { deleteSynonym } = useDeleteSynonym(locationTag, refetch);
  const { deleteTag } = useDeleteTag(locationTag, refetch, parentTag);

  const openLocationManagementDialog = () => {
    prompt({
      preset: DialogPreset.LOCATION_MANAGEMENT,
      title: locationTag.name,
      content: { locationTag: locationTag, parentTag: parentTag, refetch: refetch },
      maxWidth: false,
    });
  };

  return (
    <div
      className={`location-entry-container ${!locationTag.accepted ? 'location-not-accepted' : ''}`}
      onClick={openLocationManagementDialog}
    >
      <div className='location-entry-content'>
        <Badge color='info' overlap='circular' variant='dot' badgeContent={unacceptedSubtags}>
          <IconButton
            className='show-more-button'
            onClick={e => {
              e.stopPropagation();
              onToggleShowMore();
            }}
          >
            {showMore ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
        </Badge>
        <div className='location-entry-inner-content-container'>
          <div className='location-entry-inner-content'>
            <div className='location-name'>
              {locationTag.name}
              {!locationTag.accepted && (
                <IconButton
                  className='accept-location-name'
                  onClick={e => {
                    e.stopPropagation();
                    acceptTag();
                  }}
                >
                  <Check />
                </IconButton>
              )}
            </div>
            <div className='location-synonyms'>
              {locationTag.synonyms?.map((synonym, index) => (
                <div key={index} className='location-synonym'>
                  <Chip
                    key={synonym!.name}
                    label={synonym!.name}
                    onDelete={() => deleteSynonym(synonym!.name)}
                  />
                </div>
              ))}
            </div>
            <div className='location-action-buttons-container'>
              <Tooltip
                title={t('tooltips.detach-location')}
                arrow={true}
                followCursor={true}
                placement='left'
              >
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    detachTag();
                  }}
                >
                  <Eject />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t('tooltips.relocate-location')}
                arrow={true}
                followCursor={true}
                placement='left'
              >
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    relocateTag();
                  }}
                >
                  <MoveDown />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t('tooltips.copy-location')}
                arrow={true}
                followCursor={true}
                placement='left'
              >
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    copyTag();
                  }}
                >
                  <CopyAll />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  locationTag.visible ? t('tooltips.hide-location') : t('tooltips.show-location')
                }
                arrow={true}
                followCursor={true}
                placement='left'
              >
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    setVisible();
                  }}
                >
                  {locationTag.visible ? <Visibility /> : <VisibilityOffOutlined />}
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t('tooltips.delete-location')}
                arrow={true}
                followCursor={true}
                placement='left'
              >
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    deleteTag();
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationEntry;
