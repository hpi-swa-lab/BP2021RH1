import { Check, ChevronRight, ExpandMore } from '@mui/icons-material';
import { Badge, Chip, IconButton, Skeleton } from '@mui/material';
import { useState } from 'react';
import { useScrollRef } from '../../../hooks/context-hooks';
import { useElementIsVisible } from '../../../hooks/element-is-visible';
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
  const scrollRef = useScrollRef();

  const { acceptTag, canAcceptTag } = useAcceptTag(locationTag, refetch);
  const { deleteSynonym, canDeleteSynonym } = useDeleteSynonym(locationTag, refetch);

  const openLocationManagementDialog = () => {
    prompt({
      preset: DialogPreset.LOCATION_MANAGEMENT,
      title: locationTag.name,
      content: {
        locationTag,
        parentTag,
        refetch,
        scrollPosition: scrollRef.current,
      },
      maxWidth: false,
    });
  };

  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const isVisible = useElementIsVisible(ref, false);

  return (
    <div
      ref={setRef}
      className={`location-entry-container ${!locationTag.accepted ? 'location-not-accepted' : ''}`}
      onClick={openLocationManagementDialog}
    >
      {isVisible ? (
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
                {!locationTag.accepted && canAcceptTag && (
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
                      onDelete={canDeleteSynonym ? () => deleteSynonym(synonym!.name) : undefined}
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
      ) : (
        <Skeleton variant='rectangular' />
      )}
    </div>
  );
};

export default LocationEntry;
