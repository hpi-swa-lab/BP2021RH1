import { ContentCopy, ContentPasteGo, Link, LinkOff } from '@mui/icons-material';
import { Button } from '@mui/material';
import { differenceWith, isEqual, union, unionWith } from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunGetMultiplePictureInfoQuery,
  useGetMultiplePictureInfoLazyQuery,
} from '../../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import { useClipboard, useSetClipboardEditorButtons } from '../../../../../hooks/context-hooks';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import CheckboxButton from '../../../../common/CheckboxButton';
import { HelpTooltip } from '../../../../common/HelpTooltip';
import ScrollContainer from '../../../../common/ScrollContainer';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import { ScrollProvider } from '../../../../provider/ScrollProvider';
import { HideStats } from '../../../../provider/ShowStatsProvider';
import './LinkedInfoField.scss';
import { Field } from './PictureInfo';
import PictureInfoField from './PictureInfoField';

const LinkedInfoField = ({
  picture,
  pictureIds,
  hasHiddenLinks,
  savePictureInfo,
}: {
  picture: FlatPicture;
  pictureIds: string[];
  hasHiddenLinks: boolean;
  savePictureInfo?: (field: Field) => void;
}) => {
  const { t } = useTranslation();
  const dialog = useDialog();

  // null means there is nothing in the database
  // while undefined means the caller (e. g. BulkEdit)
  // doesn't want to show anything related to texts
  const isText = picture.is_text === null ? false : picture.is_text;

  const pictureType = isText ? 'texts' : 'pictures';

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

  const [
    getClipboardPictureInfo,
    {
      data: clipboardPicturesData,
      loading: clipboardPicturesLoading,
      error: clipboardPicturesError,
    },
  ] = useGetMultiplePictureInfoLazyQuery();

  const { canRun: canGetClipboardPictureInfo } = useCanRunGetMultiplePictureInfoQuery({
    variables: {
      pictureIds: clipboardData.pictureIds,
    },
  });

  useEffect(() => {
    if (canGetClipboardPictureInfo) {
      getClipboardPictureInfo({
        variables: {
          pictureIds: clipboardData.pictureIds,
        },
      });
    }
  }, [canGetClipboardPictureInfo, getClipboardPictureInfo, clipboardData.pictureIds]);

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

  const isClipboardMixed = !(
    (shouldCopy ?? false) ||
    (shouldPaste ?? false) ||
    clipboardPicturesLoading ||
    clipboardPicturesError
  );

  const copyToClipboard = useCallback(() => {
    setClipboardData(data => ({
      ...data,
      pictureIds: union(data.pictureIds, pictureIds),
    }));
  }, [setClipboardData, pictureIds]);

  const pasteFromClipboard = useCallback(() => {
    savePictureInfo?.({
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
        savePictureInfo?.({
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
  const adornments = useMemo(
    () => (savePictureInfo ? [removeLinkAdornment] : []),
    [savePictureInfo, removeLinkAdornment]
  );

  const removeAllLinks = useCallback(() => {
    savePictureInfo?.({
      [linked.collectionName]: [],
    });
  }, [savePictureInfo, linked.collectionName]);

  const removeAllLinksWithPrompt = useCallback(() => {
    dialog({
      preset: DialogPreset.CONFIRM,
      title: t('pictureFields.links.removeAll.really-prompt'),
      content: '',
    }).then(really => {
      if (really) {
        removeAllLinks();
      }
    });
  }, [dialog, t, removeAllLinks]);

  const setClipboardEditorButtons = useSetClipboardEditorButtons();

  useEffect(() => {
    setClipboardEditorButtons?.(
      shouldCopy && (
        <Button
          className='clipboard-button'
          startIcon={<ContentCopy />}
          variant='contained'
          onClick={copyToClipboard}
        >
          {t(`pictureFields.links.${pictureType}.copy`, { count: pictureIds.length })}
        </Button>
      )
    );
    return () => {
      setClipboardEditorButtons?.(null);
    };
  }, [setClipboardEditorButtons, shouldCopy, copyToClipboard, t, pictureType, pictureIds.length]);

  return (
    <>
      {savePictureInfo && isText !== undefined && (
        <div className='links-operations'>
          <CheckboxButton
            checked={isText}
            onChange={isText => {
              if ((linked.collection?.length ?? 0) > 0 || hasHiddenLinks) {
                dialog({
                  title: t(`common.mark-as-text.still-linked.${linked.name}.title`),
                  content: t(
                    `common.mark-as-text.still-linked.${linked.name}.content${
                      hasHiddenLinks ? '-hidden' : ''
                    }`
                  ),
                  options: [
                    {
                      name: t('common.ok'),
                      value: null,
                    },
                  ],
                });
              } else {
                savePictureInfo({ is_text: isText });
              }
            }}
          >
            {t('common.mark-as-text.label')}
          </CheckboxButton>
        </div>
      )}
      {(savePictureInfo || Boolean(linked.collection?.length)) && isText !== undefined && (
        <PictureInfoField
          title={t(`pictureFields.links.${linked.name}.label`)}
          icon={<Link />}
          type='links'
        >
          <HideStats>
            <ScrollProvider>
              <ScrollContainer>
                <PictureScrollGrid
                  queryParams={{ id: { in: linked.collection?.map(link => link.id) ?? [] } }}
                  hashbase={'links'}
                  showCount={false}
                  showDefaultAdornments={false}
                  extraAdornments={adornments}
                  filterOutTextsForNonCurators={false}
                />
              </ScrollContainer>
            </ScrollProvider>
          </HideStats>
          {savePictureInfo &&
            (shouldPaste || isClipboardMixed ? (
              <div className='clipboard-buttons'>
                <Button
                  className='clipboard-button'
                  startIcon={<ContentPasteGo />}
                  variant='contained'
                  onClick={shouldPaste ? pasteFromClipboard : undefined}
                  disabled={isClipboardMixed}
                >
                  {t(`pictureFields.links.${linked.name}.paste`, {
                    count: clipboardData.pictureIds.length,
                  })}
                </Button>
                {isClipboardMixed && (
                  <HelpTooltip
                    title={t('common.clipboard.mixed.title')}
                    content={t('common.clipboard.mixed.content')}
                  />
                )}
              </div>
            ) : clipboardPicturesError ? (
              t('common.error')
            ) : (
              []
            ))}
          {savePictureInfo && Boolean(linked.collection?.length) && (
            <Button
              className='clipboard-button'
              startIcon={<LinkOff />}
              variant='contained'
              onClick={removeAllLinksWithPrompt}
            >
              {t('pictureFields.links.removeAll.label')}
            </Button>
          )}
        </PictureInfoField>
      )}
    </>
  );
};

export default LinkedInfoField;
