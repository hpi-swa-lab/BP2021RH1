import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatCollection, FlatPicture, TagType } from '../../../../../types/additionalFlatTypes';
import './PictureInfo.scss';
import PictureInfoField from './PictureInfoField';
import {
  useCreateKeywordTagMutation,
  useCreateLocationTagMutation,
  useCreatePersonTagMutation,
  useGetAllCollectionsLazyQuery,
  useGetAllKeywordTagsLazyQuery,
  useGetAllLocationTagsLazyQuery,
  useGetAllPersonTagsLazyQuery,
  useUpdatePictureMutation,
} from '../../../../../graphql/APIConnector';
import TagSelectionField from './TagSelectionField';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import DescriptionsEditField from './DescriptionsEditField';
import DateRangeSelectionField from './DateRangeSelectionField';
import { cloneDeep } from 'lodash';
import { Button } from '@mui/material';
import { Crop } from '@mui/icons-material';
import PictureEditDialog from './PictureEditDialog';

const PictureInfo = ({ picture }: { picture: FlatPicture }) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [anyFieldTouched, setAnyFieldTouched] = useState<boolean>(false);
  const [pictureState, nativeSetPictureState] = useState<FlatPicture>(picture);
  const [savePicture, updateMutationResponse] = useUpdatePictureMutation({
    refetchQueries: ['getPictureInfo'],
  });

  const saveStatus = useMemo(() => {
    if (anyFieldTouched) {
      return t('curator.saveStatus.pending');
    }
    if (updateMutationResponse.loading) {
      return t('curator.saveStatus.saving');
    }
    if (updateMutationResponse.error) {
      return t('curator.saveStatus.error');
    }
    return t('curator.saveStatus.saved');
  }, [updateMutationResponse, anyFieldTouched, t]);

  const pictureId = pictureState.id;

  const setPictureState = useCallback(
    (field: any) => {
      const fieldForAPI: { [key: string]: any } = cloneDeep(field);
      // We need to stringify the fields here so that the API can handle the data
      // since it only accepts string input, not JSON data
      Object.keys(fieldForAPI).forEach(key => {
        if (key === 'collections') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          fieldForAPI[key] = fieldForAPI[key].map((collection: FlatCollection) => collection.id);
        } else if (Array.isArray(fieldForAPI[key])) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          fieldForAPI[key] = fieldForAPI[key].map((f: any) => JSON.stringify(f));
        } else {
          fieldForAPI[key] = JSON.stringify(fieldForAPI[key]);
        }
      });
      nativeSetPictureState(currentPicture => {
        return { ...currentPicture, ...field };
      });
      setAnyFieldTouched(false);
      savePicture({
        variables: {
          pictureId,
          data: fieldForAPI,
        },
      });
    },
    [nativeSetPictureState, savePicture, pictureId]
  );

  const [getAllKeywords, keywordsResponse] = useGetAllKeywordTagsLazyQuery();
  const [getAllLocations, locationsResponse] = useGetAllLocationTagsLazyQuery();
  const [getAllPeople, peopleResponse] = useGetAllPersonTagsLazyQuery();
  const [getAllCollections, collectionsResponse] = useGetAllCollectionsLazyQuery();

  const allKeywords = useSimplifiedQueryResponseData(keywordsResponse.data)?.keywordTags;
  const allLocations = useSimplifiedQueryResponseData(locationsResponse.data)?.locationTags;
  const allPeople = useSimplifiedQueryResponseData(peopleResponse.data)?.personTags;
  const allCollections = useSimplifiedQueryResponseData(collectionsResponse.data)?.collections;

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
      getAllCollections();
    }
  }, [role, getAllKeywords, getAllLocations, getAllPeople, getAllCollections]);

  useEffect(() => {
    nativeSetPictureState(picture);
  }, [picture]);

  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  return (
    <div className='picture-info'>
      {role >= AuthRole.CURATOR && (
        <div className='curator-ops'>
          <Button startIcon={<Crop />} onClick={() => setEditDialogOpen(true)}>
            {t('curator.editPicture')}
          </Button>
          <PictureEditDialog
            picture={picture}
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
          />
          <span className='save-state'>{saveStatus}</span>
        </div>
      )}
      <PictureInfoField title={t('pictureFields.time')} icon='event' type='date'>
        <DateRangeSelectionField
          timeRangeTag={pictureState.time_range_tag}
          onChange={range => {
            setPictureState({ time_range_tag: range });
          }}
          onTouch={() => setAnyFieldTouched(true)}
          onResetTouch={() => setAnyFieldTouched(false)}
        />
      </PictureInfoField>
      <PictureInfoField
        title={t('pictureFields.descriptions')}
        icon='description'
        type='description'
      >
        <DescriptionsEditField
          descriptions={pictureState.descriptions ?? []}
          onChange={descriptions => {
            setPictureState({ descriptions });
          }}
          onTouch={() => setAnyFieldTouched(true)}
        />
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.people')} icon='person' type='person'>
        <TagSelectionField
          type={TagType.PERSON}
          tags={pictureState.person_tags ?? []}
          allTags={allPeople ?? []}
          onChange={people => {
            setPictureState({ person_tags: people });
          }}
          noContentText={t('pictureFields.noPeople')}
          createMutation={newPersonTagMutation}
        />
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.locations')} icon='place' type='location'>
        <TagSelectionField
          type={TagType.LOCATION}
          tags={pictureState.location_tags ?? []}
          allTags={allLocations ?? []}
          onChange={locations => {
            setPictureState({ location_tags: locations });
          }}
          noContentText={t('pictureFields.noLocations')}
          createMutation={newLocationTagMutation}
        />
      </PictureInfoField>
      {(role >= AuthRole.CURATOR || Boolean(pictureState.keyword_tags?.length)) && (
        <PictureInfoField title={t('pictureFields.keywords')} icon='sell' type='keywords'>
          <TagSelectionField
            type={TagType.KEYWORD}
            tags={pictureState.keyword_tags ?? []}
            allTags={allKeywords ?? []}
            onChange={keywords => {
              setPictureState({ keyword_tags: keywords });
            }}
            noContentText={t('pictureFields.noKeywords')}
            createMutation={newKeywordTagMutation}
          />
        </PictureInfoField>
      )}
      {role >= AuthRole.CURATOR && (
        <PictureInfoField title={t('pictureFields.collections')} icon='folder' type='collections'>
          <TagSelectionField
            type={TagType.COLLECTION}
            tags={pictureState.collections ?? []}
            allTags={allCollections ?? []}
            onChange={collections => {
              setPictureState({ collections });
            }}
            noContentText={t('pictureFields.noCollections')}
            nonVerifyable={true}
          />
        </PictureInfoField>
      )}
    </div>
  );
};

export default PictureInfo;
