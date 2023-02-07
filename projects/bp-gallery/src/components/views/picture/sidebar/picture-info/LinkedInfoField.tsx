import { ContentCopy, ContentPasteGo, LinkOff } from '@mui/icons-material';
import { Button } from '@mui/material';
import { differenceWith, isEqual, union, unionWith } from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetMultiplePictureInfoLazyQuery } from '../../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import { FlatPicture } from '../../../../../types/additionalFlatTypes';
import CheckboxButton from '../../../../common/CheckboxButton';
import { useSetClipboardEditorButtons } from '../../../../common/clipboard/ClipboardEditorContext';
import { HelpTooltip } from '../../../../common/HelpTooltip';
import PictureScrollGrid from '../../../../common/picture-gallery/PictureScrollGrid';
import ScrollContainer from '../../../../common/ScrollContainer';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { useClipboard } from '../../../../provider/ClipboardProvider';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import { Field } from './PictureInfo';
import PictureInfoField from './PictureInfoField';
import './LinkedInfoField.scss';

const LinkedInfoField = ({
  picture,
  pictureIds,
  savePictureInfo,
}: {
  picture: FlatPicture;
  pictureIds: string[];
  savePictureInfo: (field: Field) => void;
}) => {
  const { t } = useTranslation();
  const { role } = useAuth();
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

  useEffect(() => {
    if (role >= AuthRole.CURATOR) {
      getClipboardPictureInfo({
        variables: {
          pictureIds: clipboardData.pictureIds,
        },
      });
    }
  }, [role, getClipboardPictureInfo, clipboardData.pictureIds]);

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
  const removeAllLinks = useCallback(() => {
    savePictureInfo({
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
          {t(
            `pictureFields.links.${pictureType}.copy.${
              pictureIds.length > 1 ? 'multiple' : 'single'
            }`
          )}
        </Button>
      )
    );
    return () => {
      setClipboardEditorButtons?.(null);
    };
  }, [setClipboardEditorButtons, shouldCopy, copyToClipboard, t, pictureType, pictureIds.length]);

  return (
    <>
      {role >= AuthRole.CURATOR && isText !== undefined && (
        <div className='links-operations'>
          <CheckboxButton
            checked={isText}
            onChange={isText => {
              if ((linked.collection?.length ?? 0) > 0) {
                dialog({
                  title: t(`common.mark-as-text.still-linked.${linked.name}.title`),
                  content: t(`common.mark-as-text.still-linked.${linked.name}.content`),
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
      {(role >= AuthRole.CURATOR || Boolean(linked.collection?.length)) && isText !== undefined && (
        <PictureInfoField
          title={t(`pictureFields.links.${linked.name}.label`)}
          icon='link'
          type='links'
        >
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
          {role >= AuthRole.CURATOR &&
            (shouldPaste || isClipboardMixed ? (
              <div className='clipboard-buttons'>
                <Button
                  className='clipboard-button'
                  startIcon={<ContentPasteGo />}
                  variant='contained'
                  onClick={shouldPaste ? pasteFromClipboard : undefined}
                  disabled={isClipboardMixed}
                >
                  {clipboardData.pictureIds.length > 1
                    ? t(`pictureFields.links.${linked.name}.paste.multiple`, {
                        count: clipboardData.pictureIds.length,
                      })
                    : t(`pictureFields.links.${linked.name}.paste.single`)}
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
          {role >= AuthRole.CURATOR && Boolean(linked.collection?.length) && (
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
