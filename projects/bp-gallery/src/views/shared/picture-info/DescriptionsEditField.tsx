import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import JoditEditor from 'jodit-react';
import { FlatDescription } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { Icon, IconButton } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { DialogContext, DialogPreset } from '../DialogWrapper';
import { useRef } from 'react';
import defaultJoditConfig from '../jodit-config';

const DescriptionsEditField = ({
  descriptions,
  onChange,
  onTouch,
}: {
  descriptions: FlatDescription[];
  onChange: (description: FlatDescription[]) => void;
  onTouch: () => void;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const [descriptionState, setDescriptionState] = useState<FlatDescription[]>(descriptions);
  const dialog = useContext(DialogContext);

  useEffect(() => {
    setDescriptionState([...descriptions]);
  }, [setDescriptionState, descriptions]);

  const config = useMemo(
    () => ({
      ...defaultJoditConfig,
      readonly: role < AuthRole.CURATOR,
    }),
    [role]
  );

  // This solution is necessary because of this jodit issue:
  // https://github.com/jodit/jodit-react/issues/101
  // problem: jodit keeps stale references to events
  const onBlurCallback = useCallback(
    (newText: string, description: FlatDescription) => {
      onChange(
        descriptionState
          .map(d => (d === description ? { ...d, text: newText } : d))
          .filter(description => !isEmpty(description.text))
      );
    },
    [descriptionState, onChange]
  );

  const onChangeCallback = useCallback(
    (newText: string, description: FlatDescription) => {
      if (description.text !== newText) {
        onTouch();
      }
    },
    [onTouch]
  );

  const onBlurRef = useRef<(newText: string, description: FlatDescription) => void>(onBlurCallback);
  const onChangeRef =
    useRef<(newText: string, description: FlatDescription) => void>(onChangeCallback);

  onBlurRef.current = onBlurCallback;
  onChangeRef.current = onChangeCallback;

  return (
    <>
      {descriptionState.length <= 0 && (
        <div
          className='none-found'
          style={role >= AuthRole.CURATOR ? { marginBottom: '4rem' } : undefined}
        >
          {t('pictureFields.noDescription')}
        </div>
      )}
      {descriptionState.map((description, index) => {
        return (
          <div
            className='description-content'
            key={isEmpty(description.id) ? `new-description-${index}` : description.id}
          >
            <JoditEditor
              value={description.text}
              config={config}
              onBlur={newText => onBlurRef.current(newText, description)}
              onChange={newText => onChangeRef.current(newText, description)}
            />
            {role >= AuthRole.CURATOR && (
              <IconButton
                onClick={async () => {
                  const reallyDelete = await dialog({
                    title: t('curator.reallyDeleteDescription'),
                    content: '',
                    preset: DialogPreset.CONFIRM,
                  });
                  if (!reallyDelete) {
                    return;
                  }
                  const allDescriptions = descriptionState.filter(d => d !== description);
                  onChange(allDescriptions.filter(description => !isEmpty(description.text)));
                  return [...allDescriptions];
                }}
                className='delete-button'
              >
                <Icon>delete</Icon>
              </IconButton>
            )}
          </div>
        );
      })}
      {role >= AuthRole.CURATOR && !descriptionState.some(d => isEmpty(d.id)) && (
        <IconButton
          onClick={() => {
            setDescriptionState(allDescriptions => [
              ...allDescriptions,
              {
                text: '',
                id: ``,
              },
            ]);
          }}
          className='add-button'
        >
          <Icon>add</Icon>
        </IconButton>
      )}
    </>
  );
};

export default DescriptionsEditField;
