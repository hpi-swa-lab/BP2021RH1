import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCanRunUpdateCollectionMutation,
  useUpdateCollectionMutation,
} from '../../../graphql/APIConnector';
import { getIsLong } from '../../../helpers/get-linebreaks';
import CollapsibleContainer from '../../common/CollapsibleContainer';
import RichText from '../../common/RichText';
import TextEditor from '../../common/editors/TextEditor';
import './CollectionDescription.scss';

const CollectionDescription = ({
  description,
  name,
  id,
}: {
  description: string;
  name: string;
  id: string;
}) => {
  const [open, setOpen] = useState(false);
  const [long, setLong] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);

  const { canRun: canEditCollectionDescription } = useCanRunUpdateCollectionMutation();

  useEffect(() => {
    setLong(getIsLong(textRef.current, description, 4));
  }, [description]);

  return (
    <div className='collection-container mb-2'>
      <h2>{name}</h2>
      {canEditCollectionDescription ? (
        <EditableCollectionDescription initialDescription={description} collectionId={id} />
      ) : (
        <>
          {description && (
            <CollapsibleContainer
              collapsedHeight='125px'
              onToggle={open => setOpen(open)}
              long={long}
            >
              <div className='text-lg break-words'>
                <RichText
                  value={description}
                  textRef={textRef}
                  className={`collection-description mx-auto ${!open ? 'line-clamp-4' : ''}`}
                />
              </div>
            </CollapsibleContainer>
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
    refetchQueries: ['getCollectionInfoByName', 'getPublishedCollectionInfoByName'],
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
    <TextEditor
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
