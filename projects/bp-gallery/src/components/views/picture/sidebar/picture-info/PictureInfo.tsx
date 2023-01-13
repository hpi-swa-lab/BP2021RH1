import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
  useGetMultiplePictureInfoQuery,
} from '../../../../../graphql/APIConnector';
import TagSelectionField from './TagSelectionField';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import DescriptionsEditField from './DescriptionsEditField';
import DateRangeSelectionField from './DateRangeSelectionField';
import ArchiveTagField from './ArchiveTagField';
import ScrollContainer from '../../../../common/ScrollContainer';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';
import { useClipboard } from '../../../../provider/ClipboardProvider';
import { Button } from '@mui/material';
import { ContentCopy, ContentPasteGo, LinkOff } from '@mui/icons-material';
import { union, isEqual, unionWith, differenceWith } from 'lodash';
import CheckboxButton from '../../../../common/CheckboxButton';
import { ClipboardEditorButtons } from '../../../../common/clipboard/ClipboardEditorContext';

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

  // null means there is nothing in the database
  // while undefined means the caller (e. g. BulkEdit)
  // doesn't want to show anything related to texts
  const isText = picture.is_text === null ? false : picture.is_text;

  const linked = useMemo(
    () =>
      isText
        ? {
            name: 'pictures',
            collection: picture.linked_pictures,
            collectionName: 'linked_pictures',
          }
        : {
            name: 'texts',
            collection: picture.linked_texts,
            collectionName: 'linked_texts',
          },
    [isText, picture.linked_pictures, picture.linked_texts]
  );

  const [clipboardData, setClipboardData] = useClipboard();

  const {
    data: clipboardPicturesData,
    loading: clipboardPicturesLoading,
    error: clipboardPicturesError,
  } = useGetMultiplePictureInfoQuery({
    variables: {
      pictureIds: clipboardData.pictureIds,
    },
  });
  const clipboardPictures: FlatPicture[] | undefined =
    useSimplifiedQueryResponseData(clipboardPicturesData)?.pictures;

  const shouldCopy =
    !clipboardPicturesLoading &&
    !clipboardPicturesError &&
    clipboardPictures?.every(picture => (picture.is_text ?? false) === isText);

  const shouldPaste =
    !clipboardPicturesLoading &&
    !clipboardPicturesError &&
    Boolean(clipboardPictures?.length) &&
    clipboardPictures?.every(picture => !(picture.is_text ?? false) === isText);

  const copyToClipboard = useCallback(() => {
    setClipboardData(data => ({
      ...data,
      pictureIds: union(data.pictureIds, [picture.id]),
    }));
  }, [setClipboardData, picture.id]);

  const pasteFromClipboard = useCallback(() => {
    savePictureInfo({
      [linked.collectionName]: unionWith(
        linked.collection ?? [],
        clipboardData.pictureIds.map(id => ({ id })),
        isEqual
      ),
    });
  }, [savePictureInfo, linked, clipboardData.pictureIds]);

  const removeLinkAdornment = useMemo(
    () => ({
      position: 'top-right' as const,
      onClick: (link: FlatPicture) => {
        savePictureInfo({
          [linked.collectionName]: differenceWith(
            linked.collection ?? [],
            [{ id: link.id }],
            isEqual
          ),
        });
      },
      icon: <LinkOff />,
      title: t('pictureFields.links.remove'),
    }),
    [savePictureInfo, linked, t]
  );

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
      {role >= AuthRole.CURATOR && isText !== undefined && (
        <div className='links-operations'>
          <CheckboxButton
            checked={isText}
            onChange={isText => {
              savePictureInfo({ is_text: isText });
            }}
          >
            {t('common.mark-as-text')}
          </CheckboxButton>
          {shouldCopy && (
            <ClipboardEditorButtons>
              <Button
                className='clipboard-button'
                startIcon={<ContentCopy />}
                variant='contained'
                onClick={copyToClipboard}
                title={t('common.clipboard.copy-explanation')}
              >
                {t('common.clipboard.copy')}
              </Button>
            </ClipboardEditorButtons>
          )}
        </div>
      )}
      {(role >= AuthRole.CURATOR || Boolean(linked.collection?.length)) && isText !== undefined && (
        <PictureInfoField title={t(`pictureFields.links.${linked.name}`)} icon='link' type='links'>
          <ScrollContainer>
            {(scrollPos: number, scrollHeight: number) => (
              <PictureScrollGrid
                queryParams={{ id: { in: linked.collection?.map(link => link.id) ?? [] } }}
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'links'}
                showCount={false}
                showDefaultAdornments={false}
                extraAdornments={role >= AuthRole.CURATOR ? [removeLinkAdornment] : []}
              />
            )}
          </ScrollContainer>
          {shouldPaste ? (
            <Button
              className='clipboard-button'
              startIcon={<ContentPasteGo />}
              variant='contained'
              onClick={pasteFromClipboard}
              title={t('common.clipboard.paste-explanation')}
            >
              {t('common.clipboard.paste', {
                count: clipboardData.pictureIds.length,
              })}
            </Button>
          ) : clipboardPicturesError ? (
            t('common.error')
          ) : !shouldCopy && !clipboardPicturesLoading ? (
            <Button
              className='clipboard-button'
              variant='contained'
              disabled
              title={t('common.clipboard.mixed-explanation')}
            >
              {t('common.clipboard.paste', {
                count: clipboardData.pictureIds.length,
              })}
            </Button>
          ) : (
            []
          )}
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
