import {
  Eject,
  MoveDown,
  CopyAll,
  Visibility,
  VisibilityOffOutlined,
  Delete,
} from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';
import { FlatTag } from '../../../types/additionalFlatTypes';
import {
  useSetVisible,
  useRelocateTag,
  useDetachTag,
  useCopyTag,
  useDeleteTag,
  useSetRoot,
} from './location-management-helpers';
import { useTranslation } from 'react-i18next';

const LocationEntryActions = ({
  locationTag,
  parentTag,
  refetch,
}: {
  locationTag: FlatTag;
  parentTag?: FlatTag;
  refetch: () => void;
}) => {
  const { t } = useTranslation();
  const { setVisible } = useSetVisible(locationTag, refetch);
  const { relocateTag } = useRelocateTag(locationTag, refetch, parentTag);
  const { detachTag } = useDetachTag(locationTag, refetch, parentTag);
  const { copyTag } = useCopyTag(locationTag, refetch);
  const { deleteTag } = useDeleteTag(locationTag, refetch, parentTag);
  const { setTagAsRoot } = useSetRoot(locationTag, refetch);

  return (
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
            if (!locationTag.parent_tags?.length) {
              setTagAsRoot(true);
            }
            copyTag();
          }}
        >
          <CopyAll />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={locationTag.visible ? t('tooltips.hide-location') : t('tooltips.show-location')}
        arrow={true}
        followCursor={true}
        placement='left'
      >
        <IconButton
          onClick={e => {
            e.stopPropagation();
            setVisible(!locationTag.visible);
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
  );
};

export default LocationEntryActions;
