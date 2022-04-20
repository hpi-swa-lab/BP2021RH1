import { Autocomplete, Chip, createFilterOptions, Icon, Stack, TextField } from '@mui/material';
import { GraphQLError } from 'graphql';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthRole, useAuth } from '../../../AuthWrapper';
import { AlertContext, AlertType } from '../AlertWrapper';

interface TagFields {
  name: string;
  id: string;
  verified?: boolean;
  createValue?: string;
  icon?: string;
  onClick?: () => void;
}

const TagSelectionField = <T extends TagFields>({
  tags,
  allTags,
  onChange,
  createMutation,
}: {
  tags: T[];
  allTags: T[];
  onChange?: (tags: T[]) => void;
  createMutation?: (attr: any) => Promise<any>;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const openAlert = useContext(AlertContext);

  const [tagList, setTagList] = useState<T[]>(allTags);

  useEffect(() => {
    setTagList(allTags);
  }, [allTags, setTagList]);

  const toggleVerified = useCallback(
    (list: T[], index: number) => {
      if (!onChange) {
        return;
      }
      list[index].verified = !list[index].verified;
      onChange(list);
    },
    [onChange]
  );

  const filter = createFilterOptions<T>();

  if (role >= AuthRole.CURATOR) {
    return (
      <div className='tag-selection'>
        <Autocomplete
          multiple
          isOptionEqualToValue={(option, value) => option.name === value.name}
          options={tagList}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;

            const isExisting = options.some(o => o.name === inputValue);

            if (inputValue !== '' && !isExisting) {
              filtered.push({
                name: inputValue,
                icon: 'add',
                verified: true,
                createValue: inputValue,
                id: -1,
              } as unknown as T);
            }

            return filtered;
          }}
          onChange={async (_, newValue) => {
            if (!onChange) return;
            // newValue is an array, but we are sure that only one element can be created at a time
            if (createMutation) {
              const addTag = newValue.find(val => val.createValue);
              if (addTag) {
                const { data, errors }: { data: any; errors?: GraphQLError[] } =
                  await createMutation({ variables: { name: addTag.createValue } });
                if (errors) {
                  // Open alert error
                  openAlert({
                    alertType: AlertType.ERROR,
                    message: errors.map(error => error.message).join(','),
                  });
                } else if (data) {
                  const nameOfField = Object.keys(data as { [key: string]: any })[0];
                  const newId = data[nameOfField].data.id;
                  addTag.id = newId;
                  delete addTag.createValue;
                  delete addTag.icon;
                  setTagList([...allTags, addTag]);
                }
              }
            }
            onChange(newValue);
          }}
          renderOption={(props, option) => {
            let label = option.name;
            if (option.createValue) {
              label = `${t('common.create', { value: option.name })}`;
            }
            return (
              <li {...props}>
                {option.icon ? <Icon sx={{ mr: 2 }}>{option.icon}</Icon> : ''}
                {label}
              </li>
            );
          }}
          renderTags={(value, props) => {
            return value.map((option, index) => (
              <Chip
                {...props({ index })}
                key={index}
                icon={!option.verified ? <Icon>help</Icon> : undefined}
                label={option.name}
                onClick={() => {
                  toggleVerified(value, index);
                }}
              />
            ));
          }}
          getOptionLabel={(option: T) => {
            return option.name;
          }}
          value={tags}
          renderInput={params => <TextField variant='standard' {...params} />}
        />
      </div>
    );
  } else {
    return (
      <Stack direction='row' spacing={1} className='chip-stack'>
        {tags.map(tag => {
          return <Chip key={tag.id} label={tag.name} />;
        })}
      </Stack>
    );
  }
};

export default TagSelectionField;
