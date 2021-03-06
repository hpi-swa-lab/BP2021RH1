import { Autocomplete, Chip, Icon, Stack, TextField } from '@mui/material';
import Fuse from 'fuse.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { ComponentCommonSynonyms, Maybe } from '../../../../../graphql/APIConnector';
import { SearchType } from '../../../search/SearchView';
import { TagType } from '../../../../../types/additionalFlatTypes';
import useAdvancedSearch from '../../../search/helpers/useAdvancedSearch';
import { addNewParamToSearchPath } from '../../../search/helpers/addNewParamToSearchPath';

interface TagFields {
  name: string;
  id: string;
  verified?: boolean;
  createValue?: string;
  synonyms?: Maybe<Maybe<ComponentCommonSynonyms>[]> | undefined;
  icon?: string;
  isNew?: boolean;
  onClick?: () => void;
}

const TagSelectionField = <T extends TagFields>({
  tags,
  allTags,
  onChange,
  createMutation,
  nonVerifyable = false,
  noContentText,
  type,
}: {
  tags: T[];
  allTags: T[];
  onChange?: (tags: T[]) => void;
  createMutation?: (attr: any) => Promise<any>;
  nonVerifyable?: boolean;
  noContentText: string;
  type: TagType;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [tagList, setTagList] = useState<T[]>(allTags);
  const [selectedTags, setSelectedTags] = useState<T[]>(tags);

  useEffect(() => {
    setTagList(allTags);
  }, [allTags, setTagList]);

  useEffect(() => {
    setSelectedTags(tags);
  }, [tags, setSelectedTags]);

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

  if (role >= AuthRole.CURATOR) {
    return (
      <div className='tag-selection'>
        <Autocomplete
          multiple
          autoHighlight
          isOptionEqualToValue={(option, value) => option.name === value.name}
          options={tagList}
          filterOptions={(options, { inputValue }) => {
            let filtered = options;
            if (inputValue !== '') {
              // Only fuzzy match "real" inputs.
              const fuzzyMatcher = new Fuse(options, {
                // Consider the name of the tag as well its synonyms
                keys: ['name', 'synonyms.name'],
                // Slightly decrease the threshold in order to higher rank exact matches
                threshold: 0.4,
              });
              filtered = fuzzyMatcher
                .search(inputValue)
                // Ignore the fuzzy score or anything like that
                .map(fuzzyResult => fuzzyResult.item);
            }

            const isExisting = options.some(o => o.name === inputValue);

            if (createMutation && inputValue !== '' && !isExisting) {
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
                const { data } = await createMutation({ variables: { name: addTag.createValue } });
                if (data) {
                  const nameOfField = Object.keys(data as { [key: string]: any })[0];
                  const newId = data[nameOfField].data.id;
                  addTag.id = newId;
                  delete addTag.createValue;
                  delete addTag.icon;
                  setTagList([...allTags, addTag]);
                }
              }
            }
            const newlyAddedTags = newValue.filter(
              newVal => !selectedTags.some(tag => tag.id === newVal.id)
            );
            newlyAddedTags.forEach(tag => {
              tag.isNew = true;
              tag.verified = true;
            });
            setSelectedTags(newValue);
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
                icon={nonVerifyable || option.verified ? undefined : <Icon>help</Icon>}
                label={option.name}
                onClick={() => {
                  if (!nonVerifyable) {
                    toggleVerified(value, index);
                  }
                }}
              />
            ));
          }}
          getOptionLabel={(option: T) => {
            return option.name;
          }}
          value={selectedTags}
          renderInput={params => <TextField variant='standard' {...params} />}
        />
      </div>
    );
  } else {
    return !selectedTags.length ? (
      <div className='none-found'>{noContentText}</div>
    ) : (
      <Stack direction='row' spacing={1} className='chip-stack'>
        {selectedTags.map(tag => {
          return (
            <Chip
              key={tag.id}
              label={tag.name}
              onClick={() => {
                const { searchPath } = addNewParamToSearchPath(
                  useAdvancedSearch ? type : SearchType.ALL,
                  encodeURIComponent(tag.name)
                );
                window.open(searchPath, '_blank');
              }}
            />
          );
        })}
      </Stack>
    );
  }
};

export default TagSelectionField;
