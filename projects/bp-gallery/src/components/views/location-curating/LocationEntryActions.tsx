import {
  CopyAll,
  Delete,
  Eject,
  MoveDown,
  Visibility,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FlatTag } from '../../../types/additionalFlatTypes';
import IconButtonWithTooltip from '../../common/IconButtonWithTooltip';
import {
  useCopyTag,
  useDeleteTag,
  useDetachTag,
  useRelocateTag,
  useSetRoot,
  useSetVisible,
} from './location-management-helpers';

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
  const { setVisible, canSetVisible } = useSetVisible(locationTag, refetch);
  const { relocateTag, canRelocateTag } = useRelocateTag(locationTag, refetch, parentTag);
  const { detachTag, canDetachTag } = useDetachTag(locationTag, refetch, parentTag);
  const { copyTag, canCopyTag } = useCopyTag(locationTag, refetch);
  const { deleteTag, canDeleteTag } = useDeleteTag(locationTag, refetch, parentTag);
  const { setTagAsRoot, canSetTagAsRoot } = useSetRoot(locationTag, refetch);

  return (
    <div className='location-action-buttons-container'>
      {canDetachTag && (
        <IconButtonWithTooltip
          title={t('tooltips.detach-location')}
          onClick={e => {
            e.stopPropagation();
            detachTag();
          }}
          icon={<Eject />}
        />
      )}
      {canRelocateTag && (
        <IconButtonWithTooltip
          title={t('tooltips.relocate-location')}
          onClick={e => {
            e.stopPropagation();
            relocateTag();
          }}
          icon={<MoveDown />}
        />
      )}
      {canCopyTag && (!locationTag.parent_tags?.length ? canSetTagAsRoot : true) && (
        <IconButtonWithTooltip
          title={t('tooltips.copy-location')}
          onClick={e => {
            e.stopPropagation();
            if (!locationTag.parent_tags?.length) {
              setTagAsRoot(true);
            }
            copyTag();
          }}
          icon={<CopyAll />}
        />
      )}
      <IconButtonWithTooltip
        title={locationTag.visible ? t('tooltips.hide-location') : t('tooltips.show-location')}
        onClick={e => {
          e.stopPropagation();
          setVisible(!locationTag.visible);
        }}
        disabled={!canSetVisible}
        icon={locationTag.visible ? <Visibility /> : <VisibilityOffOutlined />}
      />
      {canDeleteTag && (
        <IconButtonWithTooltip
          title={t('tooltips.delete-location')}
          onClick={e => {
            e.stopPropagation();
            deleteTag();
          }}
          icon={<Delete />}
        />
      )}
    </div>
  );
};

export default LocationEntryActions;
