import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture, TagType } from '../../../../../types/additionalFlatTypes';
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
import { Button } from '@mui/material';
import { Crop } from '@mui/icons-material';
import PictureEditDialog from './PictureEditDialog';
import ArchiveTagField from './ArchiveTagField';

const PictureInfo = ({ picture, isMulti }: { picture: FlatPicture; isMulti?: boolean }) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [anyFieldTouched, setAnyFieldTouched] = useState<boolean>(false);
  const [updatePicture, updateMutationResponse] = useUpdatePictureMutation({
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

  const savePictureInfo = useCallback(
    (field: any) => {
      setAnyFieldTouched(false);
      if (isMulti) {
        picture.id.split(',').map(id => {
          updatePicture({
            variables: {
              pictureId: id,
              data: field,
            },
          });
        });
      } else {
        updatePicture({
          variables: {
            pictureId: picture.id,
            data: field,
          },
        });
      }
    },
    [updatePicture, picture.id, isMulti]
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
          timeRangeTag={picture.time_range_tag}
          onChange={range => {
            savePictureInfo({ time_range_tag: range });
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
          descriptions={picture.descriptions ?? []}
          onChange={descriptions => {
            savePictureInfo({ descriptions });
          }}
          onTouch={() => setAnyFieldTouched(true)}
        />
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.people')} icon='person' type='person'>
        <TagSelectionField
          type={TagType.PERSON}
          tags={picture.person_tags ?? []}
          allTags={allPeople ?? []}
          onChange={people => {
            savePictureInfo({ person_tags: people });
          }}
          noContentText={t('pictureFields.noPeople')}
          createMutation={newPersonTagMutation}
        />
      </PictureInfoField>
      <PictureInfoField title={t('pictureFields.locations')} icon='place' type='location'>
        <TagSelectionField
          type={TagType.LOCATION}
          tags={picture.location_tags ?? []}
          allTags={allLocations ?? []}
          onChange={locations => {
            savePictureInfo({ location_tags: locations });
          }}
          noContentText={t('pictureFields.noLocations')}
          createMutation={newLocationTagMutation}
        />
      </PictureInfoField>
      {(role >= AuthRole.CURATOR || Boolean(picture.keyword_tags?.length)) && (
        <PictureInfoField title={t('pictureFields.keywords')} icon='sell' type='keywords'>
          <TagSelectionField
            type={TagType.KEYWORD}
            tags={picture.keyword_tags ?? []}
            allTags={allKeywords ?? []}
            onChange={keywords => {
              savePictureInfo({ keyword_tags: keywords });
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
            tags={picture.collections ?? []}
            allTags={allCollections ?? []}
            onChange={collections => {
              savePictureInfo({ collections });
            }}
            noContentText={t('pictureFields.noCollections')}
            nonVerifyable={true}
          />
        </PictureInfoField>
      )}
      {(role >= AuthRole.CURATOR || Boolean(picture.archive_tag)) && (
        <PictureInfoField
          title={t('pictureFields.archiveTag')}
          icon='folder_special'
          type='archive'
        >
          <ArchiveTagField
            archiveTag={picture.archive_tag}
            onChange={archiveTag => savePictureInfo({ archive_tag: archiveTag.id })}
          />
        </PictureInfoField>
      )}
    </div>
  );
};

export default PictureInfo;
