import { Help, Add, ArrowRight, ExitToApp } from '@mui/icons-material';
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
  createChildMutation,
  nonVerifiable = false,
  noContentText,
  type,
}: {
  tags: T[];
  allTags: T[];
  onChange?: (tags: T[]) => void;
  createMutation?: (attr: any) => Promise<any>;
  createChildMutation?: (attr: any) => Promise<any>;
  nonVerifiable?: boolean;
  noContentText: string;
  type: TagType;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [tagList, setTagList] = useState<T[]>(allTags);

  const { allTagsQuery } = useGenericTagEndpoints(type);

  const [lastSelectedTags, setLastSelectedTags] = useState<T[]>();
  const [lastSelectedTag, setLastSelectedTag] = useState<T>();

  const { data, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined =
    flattened && type !== TagType.COLLECTION ? Object.values(flattened)[0] : undefined;

  //code duplication with LocationPanel
  const tagTree = useMemo(() => {
    if (!flattenedTags) return;

    const tagsById = Object.fromEntries(
      flattenedTags.map(tag => [tag.id, { ...tag, child_tags: [] as FlatTag[] }])
    );

    for (const tag of Object.values(tagsById)) {
      tag.parent_tags?.forEach(parentTag => {
        tagsById[parentTag.id].child_tags.push(tag);
      });
    }
    return Object.values(tagsById).filter(tag => !tag.parent_tags?.length);
  }, [flattenedTags]);

  const tagSupertagList = useMemo(() => {
    if (!flattenedTags) return;

    const tagSupertags = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[][]]));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });
    while (queue.length > 0) {
      const nextTag = queue.shift();

      // override if clone was filled already to avoid duplicates
      if (nextTag && tagSupertags[nextTag.id].length > 0) {
        tagSupertags[nextTag.id] = [];
      }

      nextTag?.parent_tags?.forEach(parent => {
        tagSupertags[parent.id].forEach(parentParents => {
          tagSupertags[nextTag.id].push([...parentParents, parent]);
        });
        // because roots do not have parents
        if (tagSupertags[parent.id].length === 0) {
          tagSupertags[nextTag.id].push([parent]);
        }
      });
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagSupertags;
  }, [flattenedTags, tagTree]);

  const tagChildTags = useMemo(() => {
    if (!flattenedTags) return;

    const tagChildren = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as T[]]));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      if (nextTag?.child_tags) {
        tagChildren[nextTag.id] = nextTag.child_tags as T[];
      }
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagChildren;
  }, [flattenedTags, tagTree]);

  useEffect(() => {
    setTagList(type === TagType.COLLECTION ? allTags : (flattenedTags as T[]));
  }, [allTags, setTagList, flattenedTags, tagSupertagList, type]);

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
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={lastSelectedTags && lastSelectedTags.length > 0 ? lastSelectedTags : tagList}
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

            if (createMutation && inputValue !== '' && !isExisting && !lastSelectedTags?.length) {
              filtered.push({
                name: inputValue,
                icon: <Add sx={{ mr: 2 }} />,
                verified: true,
                createValue: inputValue,
                id: -1,
              } as unknown as T);
            }

            if (
              createChildMutation &&
              inputValue !== '' &&
              !isExisting &&
              lastSelectedTags &&
              lastSelectedTags.length > 0
            ) {
              filtered.push({
                name: inputValue,
                icon: <Add sx={{ mr: 2 }} />,
                verified: true,
                createValue: inputValue,
                id: '-3',
              } as unknown as T);
            }

            if (lastSelectedTags && lastSelectedTags.length > 0) {
              if (inputValue.length > 1) {
                filtered.push({
                  name: 'Hierarchie verlassen',
                  icon: <ExitToApp sx={{ mr: 2 }} />,
                  verified: true,
                  createValue: 'Hierarchie verlassen',
                  id: '-2',
                } as unknown as T);
              } else {
                filtered = [
                  {
                    name: 'Hierarchie verlassen',
                    icon: <ExitToApp sx={{ mr: 2 }} />,
                    verified: true,
                    createValue: 'Hierarchie verlassen',
                    id: '-2',
                  } as unknown as T,
                  ...filtered,
                ];
              }
            }

            return filtered;
          }}
          onChange={async (_, newValue) => {
            if (!onChange) return;
            // newValue is an array, but we are sure that only one element can be created at a time
            if (createMutation) {
              const addTag = newValue.find(val => val.createValue);
              if (addTag) {
                if (addTag.id === '-2') {
                  setLastSelectedTags([] as T[]);
                  setLastSelectedTag(undefined);
                } else if (addTag.id === '-3' && createChildMutation && lastSelectedTag) {
                  const { data } = await createChildMutation({
                    variables: { name: addTag.createValue, parentID: lastSelectedTag.id },
                  });
                  if (data) {
                    const nameOfField = Object.keys(data as { [key: string]: any })[0];
                    const newId = data[nameOfField].data.id;
                    addTag.id = newId;
                    delete addTag.createValue;
                    delete addTag.icon;
                    setTagList([...allTags, addTag]);
                    setLastSelectedTags([] as T[]);
                  }
                } else {
                  const { data } = await createMutation({
                    variables: { name: addTag.createValue },
                  });
                  if (data) {
                    const nameOfField = Object.keys(data as { [key: string]: any })[0];
                    const newId = data[nameOfField].data.id;
                    addTag.id = newId;
                    delete addTag.createValue;
                    delete addTag.icon;
                    setTagList([...allTags, addTag]);
                    setLastSelectedTags([] as T[]);
                  }
                }
              }
            }
            newValue = newValue.filter(value => value.id !== '-2' && value.id !== '-3');
            const newlyAddedTags = newValue.filter(
              newVal => !tags.some(tag => tag.id === newVal.id)
            );
            newlyAddedTags.forEach(tag => {
              setLastSelectedTag(tag);
              const allSupertags: T[] = [];
              if (tagSupertagList && tag.id in tagSupertagList) {
                tagSupertagList[tag.id].forEach(supertags => {
                  allSupertags.push(
                    ...(supertags.filter(
                      value =>
                        !tags.some(tag => tag.id === value.id) &&
                        !allSupertags.some(tag => tag.id === value.id)
                    ) as T[])
                  );
                });
              }

              newValue = newValue.concat(allSupertags);
              if (type === TagType.PERSON || type === TagType.COLLECTION) {
                setLastSelectedTag(undefined);
                setLastSelectedTags([] as T[]);
              } else {
                setLastSelectedTags([
                  ...newValue,
                  ...(tagChildTags && tag.id in tagChildTags ? tagChildTags[tag.id] : []),
                ]);
              }
              tag.isNew = true;
              tag.verified = true;
            });
            onChange(newValue);
          }}
          renderOption={(props, option) => {
            let label = option.name;
            if (option.createValue) {
              if (option.id === '-2') {
                label = option.name;
              } else if (option.id === '-3') {
                label = `${option.name} als Untertag hinzufügen`;
              } else {
                label = `${t('common.create', { value: option.name })}`;
              }
            }
            return (
              <li {...props} key={option.id}>
                <div className='recommendation-item-container'>
                  {tagSupertagList &&
                  typeof option.id === 'string' &&
                  option.id !== '-2' &&
                  option.id !== '-3' &&
                  tagSupertagList[option.id].length > 0 ? (
                    <>
                      {tagSupertagList[option.id].length > 1 ? (
                        // multiple paths tag
                        <div className='recommendation-item-parents'>
                          <div className='recommendation-item-multiple-paths'>
                            {t('tag-panel.multiple-paths')}
                          </div>
                          <ArrowRight />
                          <div className='recommendation-item-name'>{option.name}</div>
                        </div>
                      ) : (
                        // single path tag
                        <div className='recommendation-item-parents'>
                          {tagSupertagList[option.id][0].map((tag, index) => {
                            return (
                              <div key={index} className='recommendation-item'>
                                {index >= 1 && <ArrowRight />}
                                <div className='recommendation-item-name'>{tag.name}</div>
                              </div>
                            );
                          })}
                          {option.icon ?? ''}
                          <ArrowRight />
                          <div className='recommendation-item-name'>{label}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    // root tag
                    <div className='recommendation-item-name'>
                      {option.icon ?? ''}
                      {label}
                    </div>
                  )}
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
                onDelete={event => {
                  setLastSelectedTag(undefined);
                  setLastSelectedTags([] as T[]);
                  props({ index }).onDelete(event);
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
