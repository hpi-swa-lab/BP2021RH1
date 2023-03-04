import { Help, Add, ArrowRight } from '@mui/icons-material';
import { Autocomplete, Chip, Stack, TextField } from '@mui/material';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentCommonSynonyms, Maybe } from '../../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { addNewParamToSearchPath } from '../../../search/helpers/addNewParamToSearchPath';
import { SearchType } from '../../../search/helpers/search-filters';
import useAdvancedSearch from '../../../search/helpers/useAdvancedSearch';
import './TagSelection.scss';

interface TagFields {
  name: string;
  id: string;
  verified?: boolean;
  createValue?: string;
  synonyms?: Maybe<Maybe<ComponentCommonSynonyms>[]> | undefined;
  icon?: JSX.Element;
  isNew?: boolean;
  onClick?: () => void;
}

const TagSelectionField = <T extends TagFields>({
  tags,
  allTags,
  onChange,
  createMutation,
  nonVerifiable = false,
  noContentText,
  type,
}: {
  tags: T[];
  allTags: T[];
  onChange?: (tags: T[]) => void;
  createMutation?: (attr: any) => Promise<any>;
  nonVerifiable?: boolean;
  noContentText: string;
  type: TagType;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [tagList, setTagList] = useState<T[]>(allTags);

  const { allTagsQuery } = useGenericTagEndpoints(type);

  const { data, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const tagTree = useMemo(() => {
    if (!flattenedTags) return;

    const tagsById = Object.fromEntries(
      flattenedTags.map(tag => [tag.id, { ...tag, child_tags: [] as FlatTag[] }])
    );
    for (const tag of Object.values(tagsById)) {
      if (tag.parent_tag?.id) {
        tagsById[tag.parent_tag.id].child_tags.push(tag);
      }
    }
    return Object.values(tagsById).filter(tag => !tag.parent_tag);
  }, [flattenedTags]);

  const tagParentNamesList = useMemo(() => {
    if (!flattenedTags) return;

    const tagParentStrings = Object.fromEntries(flattenedTags.map(tag => [tag.id, '']));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      tagParentStrings[nextTag!.id] = nextTag?.parent_tag
        ? tagParentStrings[nextTag.parent_tag.id] + ' ' + nextTag.parent_tag.name
        : '';
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagParentStrings;
  }, [flattenedTags, tagTree]);

  useEffect(() => {
    setTagList(allTags);
  }, [allTags, setTagList]);

  const toggleVerified = useCallback(
    (list: T[], index: number) => {
      if (!onChange) {
        return;
      }
      const newList = list.map((tag, newIndex) =>
        newIndex === index
          ? {
              ...tag,
              verified: !tag.verified,
            }
          : tag
      );
      onChange(newList);
    },
    [onChange]
  );

  if (role >= AuthRole.CURATOR) {
    return (
      <div className='tag-selection'>
        <Autocomplete<T, true>
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
                icon: <Add sx={{ mr: 2 }} />,
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
              newVal => !tags.some(tag => tag.id === newVal.id)
            );
            newlyAddedTags.forEach(tag => {
              tag.isNew = true;
              tag.verified = true;
            });
            onChange(newValue);
          }}
          renderOption={(props, option) => {
            let label = option.name;
            if (option.createValue) {
              label = `${t('common.create', { value: option.name })}`;
            }
            return (
              <li {...props} key={option.id}>
                <div className='recommendation-item-container'>
                  {tagParentNamesList &&
                    typeof option.id === 'string' &&
                    tagParentNamesList[option.id] !== '' && (
                      <div className='recommendation-item-parents'>
                        {tagParentNamesList[option.id].split(' ').map((name, index) => {
                          return (
                            <div key={index} className='recommendation-item'>
                              {index > 1 && <ArrowRight />}
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  {option.icon ?? ''}
                  <div className='recommendation-item-name'>
                    {tagParentNamesList &&
                      typeof option.id === 'string' &&
                      tagParentNamesList[option.id] !== '' && <ArrowRight />}
                    {label}
                  </div>
                </div>
              </li>
            );
          }}
          renderTags={(value, props) => {
            return value.map((option, index) => (
              <Chip
                {...props({ index })}
                key={index}
                icon={nonVerifiable || option.verified ? undefined : <Help />}
                label={option.name}
                onClick={() => {
                  if (!nonVerifiable) {
                    toggleVerified(value, index);
                  }
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
    return !tags.length ? (
      <div className='none-found'>{noContentText}</div>
    ) : (
      <Stack direction='row' spacing={1} className='chip-stack'>
        {tags.map(tag => {
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
