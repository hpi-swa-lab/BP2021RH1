import React, { useEffect, useMemo, useState } from 'react';
import JoditEditor from 'jodit-react';
import { FlatDescription } from '../../../graphql/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../AuthWrapper';

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
      {descriptions.map((description, index) => {
        return (
          <JoditEditor
            key={description.id}
            value={description.text}
            config={config}
            onBlur={() => onChange(descriptionState)}
            onChange={newText => {
              setDescriptionState(allDescriptions => {
                allDescriptions[index].text = newText;
                (allDescriptions[index] as any).updatePrevious = true;
                return allDescriptions;
              });
            }}
          />
        );
      })}
    </>
  );
};

export default DescriptionsEditField;
