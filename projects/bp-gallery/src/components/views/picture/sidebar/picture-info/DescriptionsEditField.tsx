import { Add, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatDescription } from '../../../../../types/additionalFlatTypes';
import RichText from '../../../../common/RichText';
import TextEditor from '../../../../common/editors/TextEditor';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';

const DescriptionsEditField = ({
  descriptions,
  onChange,
  onTouch,
}: {
  descriptions: FlatDescription[];
  onChange?: (description: FlatDescription[]) => void;
  onTouch: () => void;
}) => {
  const { t } = useTranslation();
  const [newDescription, setNewDescription] = useState<FlatDescription | null>(null);
  const dialog = useDialog();

  const allDescriptions = useMemo(
    () => (newDescription ? [...descriptions, newDescription] : descriptions),
    [descriptions, newDescription]
  );

  // This solution is necessary because of this jodit issue:
  // https://github.com/jodit/jodit-react/issues/101
  // problem: jodit keeps stale references to events
  const onBlurCallback = useCallback(
    (newText: string, description: FlatDescription) => {
      if (!onChange) {
        return;
      }
      if (description === newDescription) {
        setNewDescription(null);
      }
      onChange(
        allDescriptions
          .map(d => (d.id === description.id ? { ...d, text: newText } : d))
          .filter(description => !isEmpty(description.text))
      );
    },
    [onChange, allDescriptions, newDescription]
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
      {allDescriptions.length <= 0 && (
        <div className='none-found' style={onChange ? { marginBottom: '4rem' } : undefined}>
          {t('pictureFields.noDescription')}
        </div>
      )}
      {allDescriptions.map((description, index) => {
        return (
          <div
            className='description-wrapper'
            key={isEmpty(description.id) ? `new-description-${index}` : description.id}
          >
            <div className='description-content'>
              {onChange ? (
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
              {onChange && (
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
                    if (description === newDescription) {
                      setNewDescription(null);
                    } else {
                      const withoutThis = descriptions.filter(d => d !== description);
                      onChange(withoutThis.filter(description => !isEmpty(description.text)));
                    }
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
      {onChange && !newDescription && (
        <IconButton
          onClick={() => {
            setNewDescription({
              text: '',
              id: '',
            });
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
