import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatTag } from '../../../types/additionalFlatTypes';
import AddLocationEntry from './AddLocationEntry';
import LocationEntry from './LocationEntry';
import './LocationEntry.scss';
import { useCreateNewTag } from './location-management-helpers';

const LocationBranch = ({
  locationTag,
  parentTag,
  refetch,
}: {
  locationTag: FlatTag;
  parentTag?: FlatTag;
  refetch: () => void;
}) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState<boolean>(false);

  const renderSubBranches = () => {
    if (locationTag.child_tags?.length) {
      return locationTag.child_tags.map((childTag: FlatTag) => {
        return (
          <LocationBranch
            key={childTag.id}
            locationTag={childTag}
            parentTag={locationTag}
            refetch={refetch}
          />
        );
      });
    }
  };

  const { createNewTag, canCreateNewTag } = useCreateNewTag(refetch);

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
      />
      {showMore && (
        <div className='sub-location-container'>
          {renderSubBranches()}
          {canCreateNewTag && (
            <AddLocationEntry
              text={t(`tag-panel.add-sub-location`, { parent: locationTag.name })}
              onClick={() => {
                createNewTag(locationTag.child_tags as FlatTag[], locationTag);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LocationBranch;
