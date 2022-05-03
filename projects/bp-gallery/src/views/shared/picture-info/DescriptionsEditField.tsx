import React, { useContext, useEffect, useMemo, useState } from 'react';
import JoditEditor from 'jodit-react';
import { FlatDescription } from '../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { Icon, IconButton } from '@mui/material';
import { isEmpty, cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import { DialogContext, DialogPreset } from '../DialogWrapper';

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
  const prompt = useContext(DialogContext);

  useEffect(() => {
    setDescriptionState(cloneDeep(descriptions));
  }, [setDescriptionState, descriptions]);

  const config = useMemo(
    () => ({
      readonly: role < AuthRole.CURATOR,
      preset: 'inline',
      enter: 'BR', //Not 'P' to avoid addition of <p> to descriptions
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
    }),
    [role]
  );

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
          <div className='description-content' key={description.id}>
            <JoditEditor
              value={description.text}
              config={config}
              onBlur={() =>
                onChange(descriptionState.filter(description => !isEmpty(description.text)))
              }
              onChange={newText => {
                const allDescriptions = [...descriptionState];
                const oldValue = allDescriptions[index].text;
                allDescriptions[index].text = newText;
                if (oldValue !== newText) {
                  onTouch();
                }
                setDescriptionState(allDescriptions);
              }}
            />
            {role >= AuthRole.CURATOR && (
              <IconButton
                onClick={async () => {
                  const reallyDelete = await prompt({
                    title: t('curator.reallyDeleteDescription'),
                    content: '',
                    preset: DialogPreset.CONFIRM,
                  });
                  if (!reallyDelete) {
                    return;
                  }
                  setDescriptionState(allDescriptions => {
                    allDescriptions.splice(index, 1);
                    onChange(allDescriptions.filter(description => !isEmpty(description.text)));
                    return [...allDescriptions];
                  });
                }}
                className='delete-button'
              >
                <Icon>delete</Icon>
              </IconButton>
            )}
          </div>
        );
      })}
      {role >= AuthRole.CURATOR && (
        <IconButton
          onClick={() => {
            setDescriptionState(allDescriptions => {
              return [
                ...allDescriptions,
                {
                  text: '',
                  id: `${allDescriptions.length + 1}`,
                },
              ];
            });
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
