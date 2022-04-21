import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
      const fieldCopy: { [key: string]: any } = cloneDeep(field);
      // We need to stringify the fields here so that the API can handle the data
      // since it only accepts string input, not JSON data
      Object.keys(fieldCopy).forEach(key => {
        if (Array.isArray(fieldCopy[key])) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          fieldCopy[key] = fieldCopy[key].map((f: any) => JSON.stringify(f));
        } else {
          fieldCopy[key] = JSON.stringify(fieldCopy[key]);
        }
      });
      nativeSetPictureState(currentPicture => {
        return { ...currentPicture, ...field };
      });
      setAnyFieldTouched(false);
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
      <PictureInfoField
        title={t('pictureFields.time')}
        icon='event'
        type='date'
        empty={!picture.time_range_tag}
      >
        <DateRangeSelectionField
          timeRangeTag={picture.time_range_tag}
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
        empty={!picture.descriptions?.length}
      >
        <DescriptionsEditField
          descriptions={picture.descriptions ?? []}
          onChange={descriptions => {
            setPictureState({ descriptions });
          }}
          onTouch={() => setAnyFieldTouched(true)}
        />
      </PictureInfoField>
      <PictureInfoField
        title={t('pictureFields.people')}
        icon='person'
        type='person'
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
        icon='place'
        type='location'
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
        type='keywords'
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
