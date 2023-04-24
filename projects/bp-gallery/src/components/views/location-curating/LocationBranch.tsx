import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import LocationEntry from './LocationEntry';
import './LocationEntry.scss';

const LocationBranch = ({
  locationTag,
  parentTag,
  refetch,
  type,
}: {
  locationTag: any;
  parentTag?: FlatTag;
  refetch: () => void;
  type: TagType;
}) => {
  const dialog = useDialog();
  const { t } = useTranslation();

  const { createSubTagMutationSource } = useGenericTagEndpoints(type);

  const [showMore, setShowMore] = useState<boolean>(false);

  const renderSubBranch = () => {
    if (locationTag.child_tags && locationTag.child_tags.length > 0) {
      return locationTag.child_tags.map((tag: any) => {
        return (
          <LocationBranch
            key={tag.id}
            locationTag={tag}
            parentTag={locationTag}
            refetch={refetch}
            type={type}
          />
        );
      });
    }
  };

  const onToggle = () => {
    setShowMore(prev => !prev);
  };

  const [createSubLocationTag] = createSubTagMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const addNewSubLocation = async () => {
    const collectionName = await dialog({
      preset: DialogPreset.INPUT_FIELD,
      title: t(`tag-panel.name-of-sub-${type}`, { parent: locationTag.name }),
    });
    if (collectionName?.length) {
      createSubLocationTag({
        variables: {
          name: collectionName,
          parentIDs: [locationTag.id],
          accepted: true,
        },
      });
    }
  };

  return (
    <div className='location-branch-container'>
      <LocationEntry
        locationTag={locationTag}
        parentTag={parentTag}
        showMore={showMore}
        onToggle={onToggle}
        refetch={refetch}
        type={type}
        unacceptedSubtags={locationTag.unacceptedSubtags}
      />
      {showMore && (
        <div className='sub-location-container'>
          {renderSubBranch()}
          <div className='add-tag-container' onClick={addNewSubLocation}>
            <Add className='add-tag-icon' />
            <div className='add-tag-text'>
              {t(`tag-panel.add-sub-${type}`, { parent: locationTag.name })}
            </div>
          </div>
          <hr />
        </div>
      )}
    </div>
  );
};

export default LocationBranch;
