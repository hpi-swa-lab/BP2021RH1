import React, { useEffect, useMemo, useState } from 'react';
import JoditEditor from 'jodit-react';
import { FlatDescription } from '../../../graphql/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { Icon, IconButton } from '@mui/material';
import { isEmpty } from 'lodash';

const DescriptionsEditField = ({
  descriptions,
  onChange,
}: {
  descriptions: FlatDescription[];
  onChange: (description: FlatDescription[]) => void;
}) => {
  const { role } = useAuth();
  const [descriptionState, setDescriptionState] = useState<FlatDescription[]>(descriptions);

  useEffect(() => {
    setDescriptionState(descriptions);
  }, [setDescriptionState, descriptions]);

  const config = useMemo(
    () => ({
      readonly: role < AuthRole.CURATOR,
      preset: 'inline',
    }),
    [role]
  );

  return (
    <>
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
                setDescriptionState(allDescriptions => {
                  allDescriptions[index].text = newText;
                  return allDescriptions;
                });
              }}
            />
            {role >= AuthRole.CURATOR && (
              <IconButton
                onClick={() => {
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
