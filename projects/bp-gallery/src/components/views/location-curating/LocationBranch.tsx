import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useCreateSubLocationMutation } from '../../../graphql/APIConnector';
import { FlatTag } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import LocationEntry from './LocationEntry';
import './LocationEntry.scss';

const LocationBranch = ({
  locationTag,
  refetch,
}: {
  locationTag: FlatTag;
  refetch: () => void;
}) => {
  const dialog = useDialog();

  const [showMore, setShowMore] = useState<boolean>(false);

  const renderSubBranch = () => {
    if (locationTag.child_tags && locationTag.child_tags.length > 0) {
      return locationTag.child_tags.map(tag => {
        return <LocationBranch key={tag.id} locationTag={tag} refetch={refetch} />;
      });
    }
  };

  const onToggle = () => {
    setShowMore(prev => !prev);
  };

  const [createSubLocationTag] = useCreateSubLocationMutation({
    onCompleted: _ => {
      refetch();
    },
  });

  const addNewSubLocation = async () => {
    const collectionName = await dialog({
      preset: DialogPreset.INPUT_FIELD,
      title: `Name des neuen Unterorts für ${locationTag.name}`,
    });
    if (collectionName?.length) {
      createSubLocationTag({
        variables: {
          name: collectionName,
          parentId: locationTag.id,
        },
      });
    }
  };

  return (
    <div className='location-branch-container'>
      <LocationEntry
        locationTag={locationTag}
        showMore={showMore}
        onToggle={onToggle}
        refetch={refetch}
      />
      {showMore && (
        <div className='sub-location-container'>
          {renderSubBranch()}
          <div className='add-tag-container' onClick={addNewSubLocation}>
            <Add className='add-tag-icon' />
            <div className='add-tag-text'>{`Unterort für ${locationTag.name} hinzufügen`}</div>
          </div>
          <hr />
        </div>
      )}
    </div>
  );
};

export default LocationBranch;
