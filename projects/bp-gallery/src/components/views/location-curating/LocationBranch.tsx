import { MutableRefObject, useEffect, useState } from 'react';
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
  foldoutStatus,
}: {
  locationTag: FlatTag;
  parentTag?: FlatTag;
  refetch: () => void;
  foldoutStatus: MutableRefObject<
    | {
        [key: string]: {
          isOpen: boolean;
        };
      }
    | undefined
  >;
}) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState<boolean>(
    foldoutStatus.current && locationTag.id in foldoutStatus.current
      ? foldoutStatus.current[locationTag.id].isOpen
      : false
  );

  useEffect(() => {
    if (foldoutStatus.current && locationTag.id in foldoutStatus.current) {
      setShowMore(foldoutStatus.current[locationTag.id].isOpen);
    }
  }, [foldoutStatus, locationTag.id]);

  const renderSubBranches = () => {
    if (locationTag.child_tags?.length) {
      return locationTag.child_tags.map((childTag: FlatTag) => {
        return (
          <LocationBranch
            key={childTag.id}
            locationTag={childTag}
            parentTag={locationTag}
            refetch={refetch}
            foldoutStatus={foldoutStatus}
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
          if (foldoutStatus.current) {
            foldoutStatus.current[locationTag.id] = { isOpen: !showMore };
          }
          setShowMore(prev => !prev);
        }}
        refetch={refetch}
        foldoutStatus={foldoutStatus}
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
