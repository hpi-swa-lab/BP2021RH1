import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import LocationEntry from './LocationEntry';
import './LocationEntry.scss';
import { useCreateNewTag } from './location-management-helpers';

const LocationBranch = ({
  locationTag,
  parentTag,
  refetch,
  type,
}: {
  locationTag: FlatTag;
  parentTag?: FlatTag;
  refetch: () => void;
  type: TagType;
}) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState<boolean>(false);

  const renderSubBranch = () => {
    if (locationTag.child_tags?.length) {
      return locationTag.child_tags.map((childTag: FlatTag) => {
        return (
          <LocationBranch
            key={childTag.id}
            locationTag={childTag}
            parentTag={locationTag}
            refetch={refetch}
            type={type}
          />
        );
      });
    }
  };

  const { createNewTag } = useCreateNewTag(refetch);

  return (
    <div className='location-branch-container'>
      <LocationEntry
        locationTag={locationTag}
        parentTag={parentTag}
        showMore={showMore}
        onToggleShowMore={() => {
          setShowMore(prev => !prev);
        }}
        refetch={refetch}
        type={type}
        unacceptedSubtags={locationTag.unacceptedSubtags}
      />
      {showMore && (
        <div className='sub-location-container'>
          {renderSubBranch()}
          <div
            className='add-tag-container'
            onClick={() => {
              createNewTag(locationTag.child_tags as FlatTag[], locationTag);
            }}
          >
            <Add className='add-tag-icon' />
            <div className='add-tag-text'>
              {t(`tag-panel.add-sub-${type}`, { parent: locationTag.name })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationBranch;
