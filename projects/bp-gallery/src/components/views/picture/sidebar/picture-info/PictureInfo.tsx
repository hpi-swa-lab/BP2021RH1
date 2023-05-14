import { Description, Event, Folder, FolderSpecial, Place, Sell } from '@mui/icons-material';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scalars,
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
import { FlatPicture, TagType } from '../../../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { FaceTaggingUI } from '../../face-tagging/FaceTaggingUI';
import ArchiveTagField from './ArchiveTagField';
import DateRangeSelectionField from './DateRangeSelectionField';
import DescriptionsEditField from './DescriptionsEditField';
import LinkedInfoField from './LinkedInfoField';
import './PictureInfo.scss';
import PictureInfoField from './PictureInfoField';
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
  onSave: (field: Field) => void;
  topInfo?: (anyFieldTouched: boolean, isSaving: boolean) => ReactNode;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [anyFieldTouched, setAnyFieldTouched] = useState<boolean>(false);
  const faceTaggingContext = useFaceTagging();

  const savePictureInfo = useCallback(
    (field: Field) => {
      setAnyFieldTouched(false);
      onSave(field);
    },
    [onSave]
  );

  const [getAllKeywords, keywordsResponse] = useGetAllKeywordTagsLazyQuery();
  const [getAllLocations, locationsResponse] = useGetAllLocationTagsLazyQuery();
  const [getAllPeople, peopleResponse] = useGetAllPersonTagsLazyQuery();
  const [getAllCollections, collectionsResponse] = useGetAllCollectionsLazyQuery();

  const allKeywords = useSimplifiedQueryResponseData(keywordsResponse.data)?.keywordTags;
  const allLocations = useSimplifiedQueryResponseData(locationsResponse.data)?.locationTags;
  const allPeople = useSimplifiedQueryResponseData(peopleResponse.data)?.personTags;
  const allCollections = useSimplifiedQueryResponseData(collectionsResponse.data)?.collections;

  const [newPersonTagMutation, newPersonTagMutationResponse] = useCreatePersonTagMutation({
    refetchQueries: ['getAllPersonTags'],
    awaitRefetchQueries: true,
  });
  const [newLocationTagMutation, newLocationTagMutationResponse] = useCreateLocationTagMutation({
    refetchQueries: ['getAllLocationTags'],
    awaitRefetchQueries: true,
  });
  const [newKeywordTagMutation, newKeywordTagMutationResponse] = useCreateKeywordTagMutation({
    refetchQueries: ['getAllKeywordTags'],
    awaitRefetchQueries: true,
  });

  const isSaving =
    newPersonTagMutationResponse.loading ||
    newLocationTagMutationResponse.loading ||
    newKeywordTagMutationResponse.loading;

  useEffect(() => {
    if (role >= AuthRole.CURATOR) {
      getAllKeywords();
      getAllLocations();
      getAllPeople();
      getAllCollections();
    }
  }, [role, getAllKeywords, getAllLocations, getAllPeople, getAllCollections]);

  return (
    <div className='picture-info'>
      {topInfo?.(anyFieldTouched, isSaving)}
      <PictureInfoField title={t('pictureFields.time')} icon={<Event />} type='date'>
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
        icon={<Description />}
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
      <FaceTaggingUI
        tags={picture.person_tags ?? []}
        allTags={allPeople ?? []}
        onChange={people => {
          savePictureInfo({ person_tags: people });
          /*unfortunately I did not find a way to get the id of a person tag that is being deleted, so i had to go
           through all facetags and all persontags, every time something about the persontag collection is changed, 
           to find out wether a facetag needs to be deleted */
          {
            faceTaggingContext?.tags.forEach(ftag => {
              if (!people.find(person => person.id === ftag.personTagId) && ftag.id) {
                faceTaggingContext.removeTag(ftag.id);
              }
            });
          }
        }}
        createMutation={newPersonTagMutation}
      />
      <PictureInfoField title={t('pictureFields.locations')} icon={<Place />} type='location'>
        <TagSelectionField
          type={TagType.LOCATION}
          tags={picture.location_tags ?? []}
          allTags={allLocations ?? []}
          onChange={locations => {
            savePictureInfo({
              location_tags: locations.map(location => {
                return (({ name, id, visible }) => ({ name, id, visible }))(location);
              }),
            });
          }}
          noContentText={t('pictureFields.noLocations')}
          createMutation={newLocationTagMutation}
          createChildMutation={newLocationTagMutation}
        />
      </PictureInfoField>
      {(role >= AuthRole.CURATOR || Boolean(picture.keyword_tags?.length)) && (
        <PictureInfoField title={t('pictureFields.keywords')} icon={<Sell />} type='keywords'>
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
      <LinkedInfoField
        picture={picture}
        pictureIds={pictureIds}
        hasHiddenLinks={hasHiddenLinks}
        savePictureInfo={savePictureInfo}
      />
      {role >= AuthRole.CURATOR && (
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
      {(role >= AuthRole.CURATOR || Boolean(picture.archive_tag)) && (
        <PictureInfoField
          title={t('pictureFields.archiveTag')}
          icon={<FolderSpecial />}
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
