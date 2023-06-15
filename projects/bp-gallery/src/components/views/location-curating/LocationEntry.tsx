import { Check, ChevronRight, ExpandMore } from '@mui/icons-material';
import { Badge, Chip, IconButton } from '@mui/material';
import { FlatTag } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import './LocationEntry.scss';
import LocationEntryActions from './LocationEntryActions';
import { useAcceptTag, useDeleteSynonym } from './location-management-helpers';

const LocationEntry = ({
  locationTag,
  parentTag,
  showMore,
  onToggleShowMore,
  refetch,
}: {
  locationTag: FlatTag;
  parentTag?: FlatTag;
  showMore: boolean;
  onToggleShowMore: () => void;
  refetch: () => void;
}) => {
  const prompt = useDialog();

  const { acceptTag } = useAcceptTag(locationTag, refetch);
  const { deleteSynonym } = useDeleteSynonym(locationTag, refetch);

  const openLocationManagementDialog = () => {
    prompt({
      preset: DialogPreset.LOCATION_MANAGEMENT,
      title: locationTag.name,
      content: { locationTag, parentTag, refetch },
      maxWidth: false,
    });
  };

  return (
    <div
      className={`location-entry-container ${!locationTag.accepted ? 'location-not-accepted' : ''}`}
      onClick={openLocationManagementDialog}
    >
      <div className='location-entry-content'>
        <Badge
          color='info'
          overlap='circular'
          variant='dot'
          badgeContent={locationTag.unacceptedSubtags}
        >
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
              {locationTag.synonyms?.map(synonym => (
                <div key={synonym!.name} className='location-synonym'>
                  <Chip
                    key={synonym!.name}
                    label={synonym!.name}
                    onDelete={() => deleteSynonym(synonym!.name)}
                  />
                </div>
              ))}
            </div>
            <LocationEntryActions
              locationTag={locationTag}
              parentTag={parentTag}
              refetch={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationEntry;
