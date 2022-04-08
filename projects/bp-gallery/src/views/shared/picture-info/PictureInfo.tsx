import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture } from '../../../graphql/additionalFlatTypes';
import './PictureInfo.scss';
import PictureInfoField from './PictureInfoField';
import {
  useGetAllKeywordTagsLazyQuery,
  useGetAllLocationTagsLazyQuery,
  useGetAllPersonTagsLazyQuery,
  useCreatePersonTagMutation,
  useCreateLocationTagMutation,
  useCreateKeywordTagMutation,
} from '../../../graphql/APIConnector';
import { formatTimeStamp } from '../helpers/format-timestamp';
import TagSelectionField from './TagSelectionField';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';

const PictureInfo = ({ picture }: { picture: FlatPicture }) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [pictureState, setPictureState] = useState<FlatPicture>(picture);

  const [getAllKeywords, keywordsResponse] = useGetAllKeywordTagsLazyQuery();
  const [getAllLocations, locationsResponse] = useGetAllLocationTagsLazyQuery();
  const [getAllPeople, peopleResponse] = useGetAllPersonTagsLazyQuery();

  const allPeople = useSimplifiedQueryResponseData(peopleResponse.data)?.personTags;
  const allLocations = useSimplifiedQueryResponseData(locationsResponse.data)?.locationTags;
  const allKeywords = useSimplifiedQueryResponseData(keywordsResponse.data)?.keywordTags;

  const [newPersonTagMutation] = useCreatePersonTagMutation({
    refetchQueries: ['getAllPersonTags'],
  });
  const [newLocationTagMutation] = useCreateLocationTagMutation();
  const [newKeywordTagMutation] = useCreateKeywordTagMutation();

  useEffect(() => {
    if (role >= AuthRole.CURATOR) {
      getAllKeywords();
      getAllLocations();
      getAllPeople();
    }
  }, [role, getAllKeywords, getAllLocations, getAllPeople]);

  return (
    <div className='picture-info'>
      <PictureInfoField title={t('pictureFields.time')} icon='event'>
        {formatTimeStamp(picture.time_range_tag)}
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.descriptions')} icon='description'>
        1970
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.people')} icon='person'>
        <TagSelectionField
          tags={pictureState.person_tags ?? []}
          allTags={allPeople ?? []}
          onChange={people => {
            setPictureState(oldPicture => ({ ...oldPicture, person_tags: people }));
          }}
          createMutation={newPersonTagMutation}
        />
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.locations')} icon='map'>
        <TagSelectionField
          tags={pictureState.location_tags ?? []}
          allTags={allLocations ?? []}
          onChange={locations => {
            setPictureState(oldPicture => ({ ...oldPicture, location_tags: locations }));
          }}
          createMutation={newLocationTagMutation}
        />
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.keywords')} icon='sell'>
        <TagSelectionField
          tags={pictureState.keyword_tags ?? []}
          allTags={allKeywords ?? []}
          onChange={keywords => {
            setPictureState(oldPicture => ({ ...oldPicture, keyword_tags: keywords }));
          }}
          createMutation={newKeywordTagMutation}
        />
      </PictureInfoField>
    </div>
  );
};

export default PictureInfo;
