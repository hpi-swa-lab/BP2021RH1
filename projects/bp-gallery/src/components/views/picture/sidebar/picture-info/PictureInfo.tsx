import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatPicture, TagType } from '../../../../../types/additionalFlatTypes';
import './PictureInfo.scss';
import PictureInfoField from './PictureInfoField';
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
import TagSelectionField from './TagSelectionField';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import DescriptionsEditField from './DescriptionsEditField';
import DateRangeSelectionField from './DateRangeSelectionField';
import ArchiveTagField from './ArchiveTagField';
import ScrollContainer from '../../../../common/ScrollContainer';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';

export type Field = Pick<
  FlatPicture,
  | 'time_range_tag'
  | 'descriptions'
  | 'keyword_tags'
  | 'location_tags'
  | 'person_tags'
  | 'collections'
> & { archive_tag?: Scalars['ID'] };

const PictureInfo = ({
  picture,
  onSave,
  topInfo,
}: {
  picture: FlatPicture;
  onSave: (field: Field) => void;
  topInfo?: (anyFieldTouched: boolean) => ReactNode;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [anyFieldTouched, setAnyFieldTouched] = useState<boolean>(false);

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

  return (
    <div className='picture-info'>
      {topInfo?.(anyFieldTouched)}
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
      {(role >= AuthRole.CURATOR || Boolean(picture /* TODO */)) && (
        <PictureInfoField title={t('pictureFields.links')} icon='link' type='links'>
          <ScrollContainer>
            {(scrollPos: number, scrollHeight: number) => (
              <PictureScrollGrid
                // temporary workaround to simulate a few linked pictures
                queryParams={{ id: { in: new Array(1000).fill(0).map((_, i) => i.toString()) } }}
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'links'}
                showCount={false}
                showDefaultAdornments={false}
              />
            )}
          </ScrollContainer>
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
