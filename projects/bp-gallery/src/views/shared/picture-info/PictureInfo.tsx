import React, { useCallback, useEffect, useState } from 'react';
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
  useUpdatePictureMutation,
} from '../../../graphql/APIConnector';
import TagSelectionField from './TagSelectionField';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import DescriptionsEditField from './DescriptionsEditField';
import DateRangeSelectionField from './DateRangeSelectionField';
import { cloneDeep } from 'lodash';

const PictureInfo = ({ picture }: { picture: FlatPicture }) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [pictureState, nativeSetPictureState] = useState<FlatPicture>(picture);
  const [savePicture] = useUpdatePictureMutation({
    refetchQueries: ['getPictureInfo'],
  });

  const pictureId = pictureState.id;

  const setPictureState = useCallback(
    (field: any) => {
      const fieldCopy: { [key: string]: any } = cloneDeep(field);
      Object.keys(fieldCopy).forEach(key => {
        if (Array.isArray(fieldCopy[key])) {
          fieldCopy[key] = fieldCopy[key].map((f: any) => JSON.stringify(f));
        } else {
          fieldCopy[key] = JSON.stringify(fieldCopy[key]);
        }
      });
      nativeSetPictureState(currentPicture => {
        return { ...currentPicture, ...field };
      });
      savePicture({
        variables: {
          pictureId,
          data: fieldCopy,
        },
      });
    },
    [nativeSetPictureState, savePicture, pictureId]
  );

  const [getAllKeywords, keywordsResponse] = useGetAllKeywordTagsLazyQuery();
  const [getAllLocations, locationsResponse] = useGetAllLocationTagsLazyQuery();
  const [getAllPeople, peopleResponse] = useGetAllPersonTagsLazyQuery();

  const allPeople = useSimplifiedQueryResponseData(peopleResponse.data)?.personTags;
  const allLocations = useSimplifiedQueryResponseData(locationsResponse.data)?.locationTags;
  const allKeywords = useSimplifiedQueryResponseData(keywordsResponse.data)?.keywordTags;

  const [newPersonTagMutation] = useCreatePersonTagMutation({
    refetchQueries: ['getAllPersonTags'],
  });
  const [newLocationTagMutation] = useCreateLocationTagMutation({
    refetchQueries: ['getAllLocationTags'],
  });
  const [newKeywordTagMutation] = useCreateKeywordTagMutation({
    refetchQueries: ['getAllKeywordTags'],
  });

  useEffect(() => {
    if (role >= AuthRole.CURATOR) {
      getAllKeywords();
      getAllLocations();
      getAllPeople();
    }
  }, [role, getAllKeywords, getAllLocations, getAllPeople]);

  return (
    <div className='picture-info'>
      <PictureInfoField
        title={t('pictureFields.time')}
        icon='event'
        empty={!picture.time_range_tag}
      >
        <DateRangeSelectionField
          timeRangeTag={picture.time_range_tag}
          onChange={range => {
            setPictureState({ time_range_tag: range });
          }}
        />
      </PictureInfoField>
      <PictureInfoField
        title={t('pictureFields.descriptions')}
        icon='description'
        empty={!picture.descriptions?.length}
      >
        <DescriptionsEditField
          descriptions={picture.descriptions ?? []}
          onChange={descriptions => {
            setPictureState({ descriptions });
          }}
        />
      </PictureInfoField>
      <PictureInfoField
        title={t('pictureFields.people')}
        icon='person'
        empty={!picture.person_tags?.length}
      >
        <TagSelectionField
          tags={pictureState.person_tags ?? []}
          allTags={allPeople ?? []}
          onChange={people => {
            setPictureState({ person_tags: people });
          }}
          createMutation={newPersonTagMutation}
        />
      </PictureInfoField>
      <PictureInfoField
        title={t('pictureFields.locations')}
        icon='map'
        empty={!picture.location_tags?.length}
      >
        <TagSelectionField
          tags={pictureState.location_tags ?? []}
          allTags={allLocations ?? []}
          onChange={locations => {
            setPictureState({ location_tags: locations });
          }}
          createMutation={newLocationTagMutation}
        />
      </PictureInfoField>
      <PictureInfoField
        title={t('pictureFields.keywords')}
        icon='sell'
        empty={!picture.keyword_tags?.length}
      >
        <TagSelectionField
          tags={pictureState.keyword_tags ?? []}
          allTags={allKeywords ?? []}
          onChange={keywords => {
            setPictureState({ keyword_tags: keywords });
          }}
          createMutation={newKeywordTagMutation}
        />
      </PictureInfoField>
    </div>
  );
};

export default PictureInfo;
