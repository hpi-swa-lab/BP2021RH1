import { Description, Event, Folder, FolderSpecial, Place, Sell } from '@mui/icons-material';
import { Button } from '@mui/material';
import { pick } from 'lodash';
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scalars,
  useCanRunCreateKeywordTagMutation,
  useCanRunCreateLocationTagMutation,
  useCanRunCreatePersonTagMutation,
  useCanRunGetAllCollectionsQuery,
  useCanRunGetAllKeywordTagsQuery,
  useCanRunGetAllLocationTagsQuery,
  useCanRunGetAllPersonTagsQuery,
  useCreateKeywordTagMutation,
  useCreateLocationTagMutation,
  useCreatePersonTagMutation,
  useGetAllCollectionsLazyQuery,
  useGetAllKeywordTagsLazyQuery,
  useGetAllLocationTagsLazyQuery,
  useGetAllPersonTagsLazyQuery,
} from '../../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import { useFaceTagging } from '../../../../../hooks/context-hooks';
import {
  FlatLocationTagWithoutRelations,
  FlatPicture,
  TagType,
} from '../../../../../types/additionalFlatTypes';
import { AlertContext, AlertType } from '../../../../provider/AlertProvider';
import { ExhibitionIdContext } from '../../../../provider/ExhibitionProvider';
import { useAddExhibitionPictures } from '../../../exhibitions/add-exhibition-pictures.hook';
import { FaceTaggingUI } from '../../anchor-tagging/FaceTaggingUI';
import { OrientationTaggingUI } from '../../anchor-tagging/OrientationTaggingUI';
import ArchiveTagField from './ArchiveTagField';
import DateRangeSelectionField from './DateRangeSelectionField';
import DescriptionsEditField from './DescriptionsEditField';
import LinkedInfoField from './LinkedInfoField';
import './PictureInfo.scss';
import PictureInfoField from './PictureInfoField';
import PictureSequenceInfoField from './PictureSequenceInfoField';
import TagSelectionField from './TagSelectionField';

export type Field = Pick<
  FlatPicture,
  | 'time_range_tag'
  | 'descriptions'
  | 'keyword_tags'
  | 'location_tags'
  | 'person_tags'
  | 'collections'
  | 'is_text'
> & { archive_tag?: Scalars['ID'] };

const PictureInfo = ({
  picture,
  pictureIds,
  hasHiddenLinks,
  onSave,
  topInfo,
}: {
  picture: FlatPicture;
  pictureIds: string[];
  hasHiddenLinks: boolean;
  onSave?: (field: Field) => void;
  topInfo?: (anyFieldTouched: boolean, isSaving: boolean) => ReactNode;
}) => {
  const { t } = useTranslation();

  const [anyFieldTouched, setAnyFieldTouched] = useState<boolean>(false);
  const faceTaggingContext = useFaceTagging();

  const savePictureInfo = useMemo(
    () =>
      onSave
        ? (field: Field) => {
            setAnyFieldTouched(false);
            onSave(field);
          }
        : undefined,
    [onSave]
  );

  const [getAllKeywords, keywordsResponse] = useGetAllKeywordTagsLazyQuery();
  const [getAllLocations, locationsResponse] = useGetAllLocationTagsLazyQuery();
  const [getAllPeople, peopleResponse] = useGetAllPersonTagsLazyQuery();
  const [getAllCollections, collectionsResponse] = useGetAllCollectionsLazyQuery();

  const { canRun: canGetAllKeywords } = useCanRunGetAllKeywordTagsQuery();
  const { canRun: canGetAllLocations } = useCanRunGetAllLocationTagsQuery();
  const { canRun: canGetAllPeople } = useCanRunGetAllPersonTagsQuery();
  const { canRun: canGetAllCollections } = useCanRunGetAllCollectionsQuery();

  const addExhibitionPictures = useAddExhibitionPictures();
  const openAlert = useContext(AlertContext);

  const allKeywords = useSimplifiedQueryResponseData(keywordsResponse.data)?.keywordTags;
  const allLocations = useSimplifiedQueryResponseData(locationsResponse.data)?.getAllLocationTags;
  const allPeople = useSimplifiedQueryResponseData(peopleResponse.data)?.personTags;
  const allCollections = useSimplifiedQueryResponseData(collectionsResponse.data)?.collections;

  const [newPersonTagMutation, newPersonTagMutationResponse] = useCreatePersonTagMutation({
    refetchQueries: ['getAllPersonTags'],
    awaitRefetchQueries: true,
  });
  const { canRun: canCreatePersonTag } = useCanRunCreatePersonTagMutation();

  const [newLocationTagMutation, newLocationTagMutationResponse] = useCreateLocationTagMutation({
    refetchQueries: ['getAllLocationTags'],
    awaitRefetchQueries: true,
  });
  const { canRun: canCreateLocationTag } = useCanRunCreateLocationTagMutation();

  const [newKeywordTagMutation, newKeywordTagMutationResponse] = useCreateKeywordTagMutation({
    refetchQueries: ['getAllKeywordTags'],
    awaitRefetchQueries: true,
  });
  const { canRun: canCreateKeywordTag } = useCanRunCreateKeywordTagMutation();

  const isSaving =
    newPersonTagMutationResponse.loading ||
    newLocationTagMutationResponse.loading ||
    newKeywordTagMutationResponse.loading;

  useEffect(() => {
    if (onSave && canGetAllKeywords) {
      getAllKeywords();
    }
  }, [onSave, canGetAllKeywords, getAllKeywords]);
  useEffect(() => {
    if (onSave && canGetAllLocations) {
      getAllLocations();
    }
  }, [onSave, canGetAllLocations, getAllLocations]);
  useEffect(() => {
    if (onSave && canGetAllPeople) {
      getAllPeople();
    }
  }, [onSave, canGetAllPeople, getAllPeople]);
  useEffect(() => {
    if (onSave && canGetAllCollections) {
      getAllCollections();
    }
  }, [onSave, canGetAllCollections, getAllCollections]);

  const exhibitionId = useContext(ExhibitionIdContext);
  return (
    <div className='picture-info'>
      {topInfo?.(anyFieldTouched, isSaving)}
      {exhibitionId && (
        <div className='m-2 grid place-content-stretch'>
          <Button
            variant='contained'
            onClick={() => {
              if (!exhibitionId)
                return openAlert({
                  alertType: AlertType.SUCCESS,
                  message: t('exhibition.add-picture-to-collection-fail'),
                });
              addExhibitionPictures(exhibitionId, [picture]);
              openAlert({
                alertType: AlertType.SUCCESS,
                message: t('exhibition.add-picture-to-collection-success', { count: 1 }),
                duration: 2000,
              });
            }}
          >
            {t('curator.addToExhibition')}
          </Button>
        </div>
      )}
      <PictureInfoField title={t('pictureFields.time')} icon={<Event />} type='date'>
        <DateRangeSelectionField
          timeRangeTag={picture.time_range_tag}
          onChange={
            savePictureInfo
              ? range => {
                  savePictureInfo({ time_range_tag: range });
                }
              : undefined
          }
          onTouch={() => setAnyFieldTouched(true)}
          onResetTouch={() => setAnyFieldTouched(false)}
        />
      </PictureInfoField>
      <PictureInfoField
        title={t('pictureFields.descriptions')}
        icon={<Description />}
        type='description'
      >
        <DescriptionsEditField
          descriptions={picture.descriptions ?? []}
          onChange={
            savePictureInfo
              ? descriptions => {
                  savePictureInfo({ descriptions });
                }
              : undefined
          }
          onTouch={() => setAnyFieldTouched(true)}
        />
      </PictureInfoField>
      <FaceTaggingUI
        tags={picture.person_tags ?? []}
        allTags={allPeople ?? []}
        onChange={
          savePictureInfo
            ? people => {
                savePictureInfo({ person_tags: people });
                /* unfortunately I did not find a way to get the id of a person tag that is being deleted, so i had to go
                   through all facetags and all persontags, every time something about the persontag collection is changed,
                   to find out wether a facetag needs to be deleted */
                {
                  faceTaggingContext?.tags.forEach(ftag => {
                    if (!people.find(person => person.id === ftag.tagId) && ftag.id) {
                      faceTaggingContext.removeTag(ftag.id);
                    }
                  });
                }
              }
            : undefined
        }
        createMutation={canCreatePersonTag ? newPersonTagMutation : undefined}
      />
      <PictureInfoField title={t('pictureFields.locations')} icon={<Place />} type='location'>
        <TagSelectionField
          type={TagType.LOCATION}
          tags={picture.location_tags ?? []}
          allTags={allLocations ?? []}
          onChange={
            savePictureInfo
              ? (locations: (FlatLocationTagWithoutRelations & { verified?: boolean })[]) => {
                  savePictureInfo({
                    location_tags: locations.map(location => {
                      return pick(location, ['name', 'id', 'visible', 'verified']);
                    }),
                  });
                }
              : undefined
          }
          noContentText={t('pictureFields.noLocations')}
          createMutation={canCreateLocationTag ? newLocationTagMutation : undefined}
          createChildMutation={canCreateLocationTag ? newLocationTagMutation : undefined}
        />
      </PictureInfoField>
      <OrientationTaggingUI allLocations={allLocations ?? []} />
      {(savePictureInfo || Boolean(picture.keyword_tags?.length)) && (
        <PictureInfoField title={t('pictureFields.keywords')} icon={<Sell />} type='keywords'>
          <TagSelectionField
            type={TagType.KEYWORD}
            tags={picture.keyword_tags ?? []}
            allTags={allKeywords ?? []}
            onChange={
              savePictureInfo
                ? keywords => {
                    savePictureInfo({ keyword_tags: keywords });
                  }
                : undefined
            }
            noContentText={t('pictureFields.noKeywords')}
            createMutation={canCreateKeywordTag ? newKeywordTagMutation : undefined}
          />
        </PictureInfoField>
      )}
      <LinkedInfoField
        picture={picture}
        pictureIds={pictureIds}
        hasHiddenLinks={hasHiddenLinks}
        savePictureInfo={savePictureInfo}
      />
      <PictureSequenceInfoField picture={picture} />
      {savePictureInfo && (
        <PictureInfoField
          title={t('pictureFields.collections')}
          icon={<Folder />}
          type='collections'
        >
          <TagSelectionField
            type={TagType.COLLECTION}
            tags={picture.collections ?? []}
            allTags={allCollections ?? []}
            onChange={collections => {
              savePictureInfo({ collections });
            }}
            noContentText={t('pictureFields.noCollections')}
            nonVerifiable={true}
          />
        </PictureInfoField>
      )}
      {(savePictureInfo || Boolean(picture.archive_tag)) && (
        <PictureInfoField
          title={t('pictureFields.archiveTag')}
          icon={<FolderSpecial />}
          type='archive'
        >
          <ArchiveTagField
            archiveTag={picture.archive_tag}
            onChange={
              savePictureInfo
                ? archiveTag => savePictureInfo({ archive_tag: archiveTag.id })
                : undefined
            }
          />
        </PictureInfoField>
      )}
    </div>
  );
};

export default PictureInfo;
