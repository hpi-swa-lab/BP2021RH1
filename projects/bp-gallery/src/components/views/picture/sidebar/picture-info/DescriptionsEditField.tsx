import { Add, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatDescription } from '../../../../../types/additionalFlatTypes';
import TextEditor from '../../../../common/editors/TextEditor';
import RichText from '../../../../common/RichText';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';

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
  const dialog = useDialog();

  useEffect(() => {
    setDescriptionState([...descriptions]);
  }, [setDescriptionState, descriptions]);

  // This solution is necessary because of this jodit issue:
  // https://github.com/jodit/jodit-react/issues/101
  // problem: jodit keeps stale references to events
  const onBlurCallback = useCallback(
    (newText: string, description: FlatDescription) => {
      onChange(
        descriptionState
          .map(d => (d.id === description.id ? { ...d, text: newText } : d))
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
            className='description-wrapper'
            key={isEmpty(description.id) ? `new-description-${index}` : description.id}
          >
            <div className='description-content'>
              {role >= AuthRole.CURATOR ? (
                <TextEditor
                  value={description.text}
                  onBlur={newText => onBlurRef.current(newText, description)}
                  onChange={newText => onChangeRef.current(newText, description)}
                />
              ) : (
                <RichText className='break-words overflow-x-hidden' value={description.text} />
              )}
            </div>
            <div>
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
                  <Delete />
                </IconButton>
              )}
            </div>
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
          <Add />
        </IconButton>
      )}
    </>
  );
};

export default DescriptionsEditField;
