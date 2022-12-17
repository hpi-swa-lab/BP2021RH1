import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sanitize } from 'dompurify';
import { Icon, IconButton } from '@mui/material';
import getLineBreaks from '../../../helpers/get-linebreaks';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { useUpdateArchiveMutation } from '../../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
import Editor from '../../common/editor/Editor';

interface ArchiveInfoProps {
  archive: FlatArchiveTag;
}

const ArchiveInfo = ({ archive }: ArchiveInfoProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { role } = useAuth();
  const description = archive.longDescription as string;

  const isDescriptionLong = useMemo(() => {
    const buffer = document.createElement('div');
    buffer.className = 'collection-description open';
    buffer.innerText = description;
    document.body.appendChild(buffer);
    const split = getLineBreaks(buffer.childNodes[0]);
    buffer.remove();

    return split.length > 3;
  }, [description]);

  return (
    <div className='archive-info-container'>
      {role >= AuthRole.CURATOR ? (
        <EditableArchiveInfo initialDescription={description} archiveId={archive.id} />
      ) : (
        <>
          {description && (
            <div
              className={
                isOpen || !isDescriptionLong
                  ? 'collection-description open'
                  : 'collection-description closed'
              }
              dangerouslySetInnerHTML={{ __html: sanitize(description) }}
            />
          )}
          {isDescriptionLong && (
            <IconButton
              className='icon-button'
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <Icon className='icon'>{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
            </IconButton>
          )}
        </>
      )}
    </div>
  );
};

const EditableArchiveInfo = ({
  initialDescription,
  archiveId,
}: {
  initialDescription: string;
  archiveId: string;
}) => {
  const description = useRef<string>(initialDescription);

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });
  const { t } = useTranslation();

  useEffect(() => {
    description.current = initialDescription;
  }, [initialDescription]);

  const extraOptions = useMemo(
    () => ({
      readonly: true,
      showPlaceholder: true,
      placeholder: t('curator.insertDescriptionHere'),
    }),
    [t]
  );

  const onBlur = useCallback(() => {
    // Save description
    updateArchive({
      variables: {
        archiveId,
        data: {
          longDescription: description.current,
        },
      },
    });
  }, [description, archiveId, updateArchive]);

  return (
    <Editor
      value={description.current}
      extraOptions={extraOptions}
      onBlur={onBlur}
      onChange={newText => {
        description.current = newText;
      }}
    />
  );
};

export default ArchiveInfo;
