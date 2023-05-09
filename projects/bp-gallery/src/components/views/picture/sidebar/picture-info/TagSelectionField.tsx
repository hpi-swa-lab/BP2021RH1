import { Help, Add } from '@mui/icons-material';
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
import SingleTagElement from './SingleTagElement';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import {
  useGetTagChildren,
  useGetTagSiblings,
  useGetTagSupertagList,
  useGetTagTree,
} from '../../../location-curating/tag-structure-helpers';

interface TagFields {
  name: string;
  id: string;
  verified?: boolean;
  createValue?: string;
  synonyms?: Maybe<Maybe<ComponentCommonSynonyms>[]> | undefined;
  icon?: JSX.Element;
  isNew?: boolean;
  isNewRoot?: boolean;
  isNewSibling?: boolean;
  onClick?: () => void;
}

const TagSelectionField = <T extends TagFields>({
  tags,
  allTags,
  onChange,
  createMutation,
  createChildMutation,
  createParentMutation,
  nonVerifiable = false,
  noContentText,
  type,
  fixedTag,
  fixedTagOnClick,
}: {
  tags: T[];
  allTags: T[];
  onChange?: (tags: T[]) => void;
  createMutation?: (attr: any) => Promise<any>;
  createChildMutation?: (attr: any) => Promise<any>;
  createParentMutation?: (attr: any) => Promise<any>;
  nonVerifiable?: boolean;
  noContentText: string;
  type: TagType;
  fixedTag?: FlatTag;
  fixedTagOnClick?: (id: string) => void;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const prompt = useDialog();

  const [tagList, setTagList] = useState<T[]>(allTags);

  const { allTagsQuery } = useGenericTagEndpoints(type);

  const [lastSelectedTags, setLastSelectedTags] = useState<T[]>();
  const [lastSelectedTag, setLastSelectedTag] = useState<T | undefined>();

  const [lastTags, setLastTags] = useState<T[]>();

  const { data, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined =
    flattened && type !== TagType.COLLECTION ? Object.values(flattened)[0] : undefined;

  //code duplication with LocationPanel
  const tagTree = useGetTagTree(flattenedTags);

  const tagChildTags = useGetTagChildren(tagTree, flattenedTags) as
    | {
        [k: string]: T[];
      }
    | undefined;

  const tagSiblingTags = useGetTagSiblings(
    tagTree,
    flattenedTags,
    tagChildTags as { [k: string]: FlatTag[] } | undefined
  ) as
    | {
        [k: string]: T[];
      }
    | undefined;

  const tagSupertagList = useGetTagSupertagList(tagTree, flattenedTags);

  const tagOrder = useMemo(() => {
    const order: T[] = [];
    const queue: FlatTag[] = [];
    const childQueue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });
    queue.sort((a, b) => a.name.localeCompare(b.name));
    queue.forEach(tag => {
      if (!order.some(existingTag => existingTag.id === tag.id)) {
        order.push(tag as T);
      }
      tag.child_tags
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .forEach(child => {
          childQueue.push(child);
        });
      while (childQueue.length > 0) {
        const childTag = childQueue.shift();
        if (!childTag) continue;
        if (!order.some(existingTag => existingTag.id === childTag.id)) {
          order.push(childTag as T);
        }
        childTag.child_tags
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .forEach(child => {
            childQueue.push(child);
          });
      }
    });

    const finalOrder = order.filter(tag =>
      lastSelectedTags?.some(selectedTag => selectedTag.id === tag.id)
    );
    finalOrder.push(
      ...order.filter(tag => !lastSelectedTags?.some(selectedTag => selectedTag.id === tag.id))
    );

    return finalOrder;
  }, [tagTree, lastSelectedTags]);

  const customSortTags = useCallback(
    (tags: T[]) => {
      return tagOrder.filter(tag => tags.some(existingTag => existingTag.id === tag.id));
    },
    [tagOrder]
  );

  useEffect(() => {
    const sortedTags = customSortTags(allTags);
    setTagList(sortedTags.length ? sortedTags : allTags);
  }, [allTags, setTagList, type, customSortTags]);

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

  const [highlight, setHighlight] = useState<T | null>();

  if (role >= AuthRole.CURATOR) {
    return (
      <div className='tag-selection'>
        <Autocomplete<T, true>
          multiple
          autoHighlight
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={tagList}
          filterOptions={(options, { inputValue }) => {
            let filtered = options;
            if (fixedTag) {
              filtered = filtered.filter(
                tag =>
                  !tags.some(
                    existingTag => existingTag.name === tag.name && existingTag.id !== tag.id
                  )
              );
            }
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
              fixedTag &&
              inputValue !== '' &&
              !tags.some(tag => tag.name === inputValue)
            ) {
              filtered.push({
                name: inputValue,
                icon: <Add sx={{ mr: 2 }} />,
                verified: true,
                createValue: inputValue,
                id: -3,
              } as unknown as T);
            }

            if (
              createParentMutation &&
              fixedTag &&
              inputValue !== '' &&
              !tags.some(tag => tag.name === inputValue)
            ) {
              filtered.push({
                name: inputValue,
                icon: <Add sx={{ mr: 2 }} />,
                verified: true,
                createValue: inputValue,
                id: -4,
              } as unknown as T);
            }

            if (
              createChildMutation &&
              inputValue !== '' &&
              lastSelectedTag &&
              (!isExisting ||
                (tagSiblingTags &&
                  lastSelectedTag.name !== inputValue &&
                  lastSelectedTag.id in tagSiblingTags &&
                  !tagSiblingTags[lastSelectedTag.id].some(tag => tag.name === inputValue)) ||
                (tagChildTags &&
                  lastSelectedTag.id in tagChildTags &&
                  !tagChildTags[lastSelectedTag.id].some(tag => tag.name === inputValue))) &&
              lastSelectedTags &&
              lastSelectedTags.length > 0
            ) {
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
                if (createChildMutation && lastSelectedTag) {
                  const createOption = await prompt({
                    preset: DialogPreset.SELECT_PATH_POSITION,
                    title: t('tag-panel.select-position', { name: addTag.name }),
                    content: { newTag: addTag, lastTag: lastSelectedTag },
                    type: type,
                  });
                  if (!createOption) return;
                  switch (createOption.id) {
                    case '1': {
                      if (
                        tagChildTags &&
                        lastSelectedTag.id in tagChildTags &&
                        tagChildTags[lastSelectedTag.id].some(tag => tag.name === addTag.name)
                      ) {
                        const existingTag = tagChildTags[lastSelectedTag.id].find(
                          tag => tag.name === addTag.name
                        ) as unknown as T;
                        const filteredNewValues = newValue.filter(val => !val.createValue);
                        filteredNewValues.push(existingTag);
                        newValue = filteredNewValues;
                      } else {
                        const { data } = await createChildMutation({
                          variables: { name: addTag.createValue, parentIDs: [lastSelectedTag.id] },
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
                      break;
                    }
                    case '2': {
                      if (
                        tagSiblingTags &&
                        lastSelectedTag.id in tagSiblingTags &&
                        tagSiblingTags[lastSelectedTag.id].some(tag => tag.name === addTag.name)
                      ) {
                        const existingTag = tagSiblingTags[lastSelectedTag.id].find(
                          tag => tag.name === addTag.name
                        ) as unknown as T;
                        const filteredNewValues = newValue.filter(val => !val.createValue);
                        filteredNewValues.push(existingTag);
                        newValue = filteredNewValues;
                      } else if (lastSelectedTag.name !== addTag.name) {
                        const { data } = await createChildMutation({
                          variables: {
                            name: addTag.createValue,
                            parentIDs:
                              tagSupertagList && lastSelectedTag.id in tagSupertagList
                                ? tagSupertagList[lastSelectedTag.id]
                                    .filter(path => path.length)
                                    .map(path => path[path.length - 1].id)
                                : [],
                            root:
                              tagSupertagList &&
                              lastSelectedTag.id in tagSupertagList &&
                              tagSupertagList[lastSelectedTag.id].some(path => !path.length),
                          },
                        });
                        if (data) {
                          const nameOfField = Object.keys(data as { [key: string]: any })[0];
                          const newId = data[nameOfField].data.id;
                          addTag.id = newId;
                          addTag.isNewSibling = true;
                          delete addTag.createValue;
                          delete addTag.icon;
                          setTagList([...allTags, addTag]);
                          setLastSelectedTags([] as T[]);
                        }
                      } else {
                        const filteredNewValues = newValue.filter(val => !val.createValue);
                        newValue = filteredNewValues;
                      }
                      break;
                    }
                    case '0': {
                      if (tagTree?.some(rootTag => rootTag.name === addTag.name)) {
                        const existingTag = tagTree.find(
                          tag => tag.name === addTag.name
                        ) as unknown as T;
                        const filteredNewValues = newValue.filter(val => !val.createValue);
                        filteredNewValues.push(existingTag);
                        newValue = filteredNewValues;
                      } else {
                        const { data } = await createMutation({
                          variables: { name: addTag.createValue },
                        });
                        if (data) {
                          const nameOfField = Object.keys(data as { [key: string]: any })[0];
                          const newId = data[nameOfField].data.id;
                          addTag.id = newId;
                          addTag.isNewRoot = true;
                          delete addTag.createValue;
                          delete addTag.icon;
                          setTagList([...allTags, addTag]);
                          setLastSelectedTags([] as T[]);
                        }
                      }
                      break;
                    }
                    default: {
                      break;
                    }
                  }
                } else {
                  const { data } = await createMutation({
                    variables: { name: addTag.createValue },
                  });
                  if (data) {
                    const nameOfField = Object.keys(data as { [key: string]: any })[0];
                    const newId = data[nameOfField].data.id;
                    addTag.id = newId;
                    addTag.isNewRoot = true;
                    delete addTag.createValue;
                    delete addTag.icon;
                    setTagList([...allTags, addTag]);
                    setLastSelectedTags([] as T[]);
                  }
                }
              }
            }
            const newlyAddedTags = newValue.filter(
              newVal => !tags.some(tag => tag.id === newVal.id)
            );
            newlyAddedTags.forEach(tag => {
              setLastSelectedTag(tag);
              const allSupertags: T[] = [];
              if (!fixedTag && tagSupertagList && tag.id in tagSupertagList) {
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
                // add children and siblings
                const children =
                  tagChildTags && tag.id in tagChildTags
                    ? tagChildTags[tag.id].filter(
                        tag => !newValue.some(newTag => newTag.id === tag.id)
                      )
                    : [];
                const siblings =
                  tagSiblingTags && tag.id in tagSiblingTags
                    ? tagSiblingTags[tag.id].filter(
                        tag =>
                          !newValue.some(newTag => newTag.id === tag.id) &&
                          (!tagChildTags ||
                            !tagChildTags[tag.id].some(childTag => childTag.id === tag.id))
                      )
                    : tag.isNewSibling &&
                      lastSelectedTag &&
                      tagSiblingTags &&
                      lastSelectedTag.id in tagSiblingTags
                    ? [...tagSiblingTags[lastSelectedTag.id], lastSelectedTag].filter(
                        siblingTag => !newValue.some(tag => tag.id === siblingTag.id)
                      )
                    : !tag.isNewRoot &&
                      tagChildTags &&
                      lastSelectedTag &&
                      lastSelectedTag.id in tagChildTags
                    ? tagChildTags[lastSelectedTag.id].filter(
                        tag =>
                          !newValue.some(newTag => newTag.id === tag.id) &&
                          !tagChildTags[tag.id].some(childTag => childTag.id === tag.id)
                      )
                    : tagTree
                    ? tagTree
                        .map(tag => tag as unknown as T)
                        .filter(
                          tag =>
                            !newValue.some(newTag => newTag.id === tag.id) &&
                            (!tagChildTags ||
                              !tagChildTags[tag.id].some(childTag => childTag.id === tag.id))
                        )
                    : [];
                const selectedSiblings =
                  tagSiblingTags && tag.id in tagSiblingTags
                    ? tagSiblingTags[tag.id].filter(siblingTag =>
                        newValue.some(tag => tag.id === siblingTag.id)
                      )
                    : tag.isNewSibling &&
                      lastSelectedTag &&
                      tagSiblingTags &&
                      lastSelectedTag.id in tagSiblingTags
                    ? [...tagSiblingTags[lastSelectedTag.id], lastSelectedTag].filter(siblingTag =>
                        newValue.some(tag => tag.id === siblingTag.id)
                      )
                    : [];
                let selectedSiblingChildren: T[] = [];
                if (tagChildTags) {
                  selectedSiblings.forEach(selectedSibling => {
                    const test =
                      selectedSibling.id in tagChildTags
                        ? tagChildTags[selectedSibling.id].filter(
                            tag => !selectedSiblingChildren.some(t => t.id === tag.id)
                          )
                        : ([] as T[]);
                    selectedSiblingChildren = [...selectedSiblingChildren, ...test];
                  });
                }
                selectedSiblingChildren = selectedSiblingChildren.filter(
                  tag =>
                    !children.some(t => t.id === tag.id) && !siblings.some(t => t.id === tag.id)
                );
                const sortedRecommendations = customSortTags([
                  ...children,
                  ...siblings,
                  ...selectedSiblingChildren,
                ]);
                const sortedNewValues = customSortTags(newValue);
                setLastSelectedTags([
                  ...(sortedNewValues.length
                    ? [
                        ...sortedNewValues,
                        ...newValue.filter(tag =>
                          sortedNewValues.every(sortedTag => sortedTag.id !== tag.id)
                        ),
                      ]
                    : newValue),
                  ...(sortedRecommendations.length
                    ? sortedRecommendations
                    : [...children, ...siblings, ...selectedSiblingChildren]),
                ]);
              }
              tag.isNew = true;
              tag.verified = true;
            });
            if (lastTags && newValue.length < lastTags.length) {
              setLastSelectedTag(undefined);
              setLastSelectedTags([] as T[]);
            }
            if (fixedTag) {
              const addTag = newValue.find(val => val.createValue);
              if (addTag && createChildMutation) {
                const { data } = await createChildMutation({
                  variables: { name: addTag.createValue, parentIDs: [fixedTag.id], accepted: true },
                });
                if (data) {
                  const nameOfField = Object.keys(data as { [key: string]: any })[0];
                  const newId = data[nameOfField].data.id;
                  addTag.id = newId;
                  delete addTag.createValue;
                  delete addTag.icon;
                  setTagList([...allTags, addTag]);
                }
              }

              if (addTag && createParentMutation) {
                const { data } = await createParentMutation({
                  variables: { name: addTag.createValue, childIDs: [fixedTag.id], accepted: true },
                });
                if (data) {
                  const nameOfField = Object.keys(data as { [key: string]: any })[0];
                  const newId = data[nameOfField].data.id;
                  addTag.id = newId;
                  delete addTag.createValue;
                  delete addTag.icon;
                  setTagList([...allTags, addTag]);
                }
              }

              setLastSelectedTags([] as T[]);
              setLastSelectedTag(undefined);
            }
            setLastTags(newValue);
            onChange(newValue);
          }}
          onHighlightChange={(event, option, reason) => {
            setHighlight(option);
          }}
          renderOption={(props, option) => {
            let label = option.name;
            if (option.createValue) {
              if (option.id === '-2') {
                label = option.name;
              } else {
                label = `${t('common.create', { value: option.name })}`;
              }
            }
            return (
              <li {...props} key={option.id}>
                <SingleTagElement
                  tagSupertagList={tagSupertagList}
                  option={option}
                  label={label}
                  highlighted={highlight && highlight.id === option.id ? true : false}
                />
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
                  if (fixedTagOnClick) {
                    fixedTagOnClick(option.id);
                  }
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
