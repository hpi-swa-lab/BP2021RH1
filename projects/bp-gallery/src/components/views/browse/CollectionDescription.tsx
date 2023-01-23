import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sanitize } from 'isomorphic-dompurify';
import './CollectionDescription.scss';
import { Icon, IconButton } from 'mui';
import getLineBreaks from '../../../helpers/get-linebreaks';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { useUpdateCollectionMutation } from '../../../graphql/APIConnector';
import { useTranslation } from 'react-i18next';
import Editor from '../../common/editor/Editor';

const CollectionDescription = ({
  description,
  name,
  id,
}: {
  description: string;
  name: string;
  id: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { role } = useAuth();

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
    <div className='collection-container'>
      <h2>{name}</h2>
      {role >= AuthRole.CURATOR ? (
        <EditableCollectionDescription initialDescription={description} collectionId={id} />
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

const EditableCollectionDescription = ({
  initialDescription,
  collectionId,
}: {
  initialDescription: string;
  collectionId: string;
}) => {
  const description = useRef<string>(initialDescription);

  const [updateCollection] = useUpdateCollectionMutation({
    refetchQueries: ['getCollectionInfoByName'],
  });
  const { t } = useTranslation();

  useEffect(() => {
    description.current = initialDescription;
  }, [initialDescription]);

  const extraOptions = useMemo(
    () => ({
      readonly: false,
      showPlaceholder: true,
      placeholder: t('curator.insertDescriptionHere'),
    }),
    [t]
  );

  const onBlur = useCallback(() => {
    // Save description
    updateCollection({
      variables: {
        collectionId,
        data: {
          description: description.current,
        },
      },
    });
  }, [description, collectionId, updateCollection]);

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

export default CollectionDescription;
