import { Help, Add } from '@mui/icons-material';
import { Autocomplete, Chip, Stack, TextField } from '@mui/material';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useState } from 'react';
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
  useGetBreadthFirstOrder,
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
  fixedParentTag,
  fixedChildTag,
  customChipOnClick,
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
  fixedParentTag?: FlatTag;
  fixedChildTag?: FlatTag;
  customChipOnClick?: (id: string) => void;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();
  const prompt = useDialog();

  const { allTagsQuery } = useGenericTagEndpoints(type);

  const [options, setOptions] = useState<T[]>(allTags);
  // TODO: check the conditions using this
  const [prioritizedOptions, setPrioritizedOptions] = useState<T[]>();
  const [lastAddedTag, setLastAddedTag] = useState<T | undefined>();
  const [highlight, setHighlight] = useState<T | null>();

  const { data } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined =
    flattened && type !== TagType.COLLECTION ? Object.values(flattened)[0] : undefined;

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
  const tagOrder = useGetBreadthFirstOrder(tagTree, prioritizedOptions as FlatTag[]) as T[];

  const customSortTags = useCallback(
    (tags: T[]) => {
      return tagOrder.filter(tag => tags.some(existingTag => existingTag.id === tag.id));
    },
    [tagOrder]
  );

  useEffect(() => {
    const sortedTags = customSortTags(allTags);
    setOptions(sortedTags.length ? sortedTags : allTags);
  }, [allTags, setOptions, customSortTags]);

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
          options={options}
          filterOptions={(options, { inputValue }) => {
            let filtered = options;
            // avoid tags with the same name in the same position in path
            if (fixedParentTag) {
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
            const isExistingInSiblings =
              lastAddedTag &&
              tagSiblingTags &&
              lastAddedTag.name !== inputValue &&
              lastAddedTag.id in tagSiblingTags &&
              tagSiblingTags[lastAddedTag.id].some(tag => tag.name === inputValue);
            const isExistingInChildren =
              lastAddedTag &&
              tagChildTags &&
              lastAddedTag.id in tagChildTags &&
              tagChildTags[lastAddedTag.id].some(tag => tag.name === inputValue);
            const isExistingAsRoot = tagTree && tagTree.some(tag => tag.name === inputValue);

            // option to add a tag as root or relative to last selected tag
            if (
              createMutation &&
              inputValue !== '' &&
              (!isExisting || !isExistingInSiblings || !isExistingInChildren || !isExistingAsRoot)
            ) {
              filtered.push({
                name: inputValue,
                icon: <Add sx={{ mr: 2 }} />,
                verified: true,
                createValue: inputValue,
                id: -1,
              } as unknown as T);
            }
            // option to add a child tag for a fixed parent
            if (
              createChildMutation &&
              fixedParentTag &&
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
            // option to add a parent tag for a fixed child
            if (createParentMutation && fixedChildTag && inputValue !== '' && !isExisting) {
              filtered.push({
                name: inputValue,
                icon: <Add sx={{ mr: 2 }} />,
                verified: true,
                createValue: inputValue,
                id: -4,
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
                if (createChildMutation && lastAddedTag) {
                  const createOption = await prompt({
                    preset: DialogPreset.SELECT_PATH_POSITION,
                    title: t('tag-panel.select-position', { name: addTag.name }),
                    content: { newTag: addTag, lastTag: lastAddedTag },
                  });
                  if (!createOption) return;
                  switch (createOption.id) {
                    case '1': {
                      if (
                        tagChildTags &&
                        lastAddedTag.id in tagChildTags &&
                        tagChildTags[lastAddedTag.id].some(tag => tag.name === addTag.name)
                      ) {
                        const existingTag = tagChildTags[lastAddedTag.id].find(
                          tag => tag.name === addTag.name
                        ) as unknown as T;
                        const filteredNewValues = newValue.filter(val => !val.createValue);
                        filteredNewValues.push(existingTag);
                        newValue = filteredNewValues;
                      } else {
                        const { data } = await createChildMutation({
                          variables: { name: addTag.createValue, parentIDs: [lastAddedTag.id] },
                        });
                        if (data) {
                          const nameOfField = Object.keys(data as { [key: string]: any })[0];
                          const newId = data[nameOfField].data.id;
                          addTag.id = newId;
                          delete addTag.createValue;
                          delete addTag.icon;
                          setOptions([...allTags, addTag]);
                          setPrioritizedOptions([] as T[]);
                        }
                      }
                      break;
                    }
                    case '2': {
                      if (
                        tagSiblingTags &&
                        lastAddedTag.id in tagSiblingTags &&
                        tagSiblingTags[lastAddedTag.id].some(tag => tag.name === addTag.name)
                      ) {
                        const existingTag = tagSiblingTags[lastAddedTag.id].find(
                          tag => tag.name === addTag.name
                        ) as unknown as T;
                        const filteredNewValues = newValue.filter(val => !val.createValue);
                        filteredNewValues.push(existingTag);
                        newValue = filteredNewValues;
                      } else if (lastAddedTag.name !== addTag.name) {
                        const { data } = await createChildMutation({
                          variables: {
                            name: addTag.createValue,
                            parentIDs:
                              tagSupertagList && lastAddedTag.id in tagSupertagList
                                ? tagSupertagList[lastAddedTag.id]
                                    .filter(path => path.length)
                                    .map(path => path[path.length - 1].id)
                                : [],
                            root:
                              tagSupertagList &&
                              lastAddedTag.id in tagSupertagList &&
                              tagSupertagList[lastAddedTag.id].some(path => !path.length),
                          },
                        });
                        if (data) {
                          const nameOfField = Object.keys(data as { [key: string]: any })[0];
                          const newId = data[nameOfField].data.id;
                          addTag.id = newId;
                          addTag.isNewSibling = true;
                          delete addTag.createValue;
                          delete addTag.icon;
                          setOptions([...allTags, addTag]);
                          setPrioritizedOptions([] as T[]);
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
                          setOptions([...allTags, addTag]);
                          setPrioritizedOptions([] as T[]);
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
                    setOptions([...allTags, addTag]);
                    setPrioritizedOptions([] as T[]);
                  }
                }
              }
            }
            const newlyAddedTags = newValue.filter(
              newVal => !tags.some(tag => tag.id === newVal.id)
            );
            newlyAddedTags.forEach(tag => {
              setLastAddedTag(tag);
              const allSupertags: T[] = [];
              if (
                !fixedChildTag &&
                !fixedParentTag &&
                tagSupertagList &&
                tag.id in tagSupertagList
              ) {
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
                setLastAddedTag(undefined);
                setPrioritizedOptions([] as T[]);
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
                      lastAddedTag &&
                      tagSiblingTags &&
                      lastAddedTag.id in tagSiblingTags
                    ? [...tagSiblingTags[lastAddedTag.id], lastAddedTag].filter(
                        siblingTag => !newValue.some(tag => tag.id === siblingTag.id)
                      )
                    : !tag.isNewRoot &&
                      tagChildTags &&
                      lastAddedTag &&
                      lastAddedTag.id in tagChildTags
                    ? tagChildTags[lastAddedTag.id].filter(
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
                      lastAddedTag &&
                      tagSiblingTags &&
                      lastAddedTag.id in tagSiblingTags
                    ? [...tagSiblingTags[lastAddedTag.id], lastAddedTag].filter(siblingTag =>
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
                setPrioritizedOptions([
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
            if (newValue.length < tags.length) {
              setLastAddedTag(undefined);
              setPrioritizedOptions([] as T[]);
            }
            const addTag = newValue.find(val => val.createValue);
            if (addTag && createChildMutation && fixedParentTag) {
              const { data } = await createChildMutation({
                variables: {
                  name: addTag.createValue,
                  parentIDs: [fixedParentTag.id],
                  accepted: true,
                },
              });
              if (data) {
                const nameOfField = Object.keys(data as { [key: string]: any })[0];
                const newId = data[nameOfField].data.id;
                addTag.id = newId;
                delete addTag.createValue;
                delete addTag.icon;
                setOptions([...allTags, addTag]);
              }
              setPrioritizedOptions([] as T[]);
              setLastAddedTag(undefined);
            }

            if (addTag && createParentMutation && fixedChildTag) {
              const { data } = await createParentMutation({
                variables: {
                  name: addTag.createValue,
                  childIDs: [fixedChildTag.id],
                  accepted: true,
                },
              });
              if (data) {
                const nameOfField = Object.keys(data as { [key: string]: any })[0];
                const newId = data[nameOfField].data.id;
                addTag.id = newId;
                delete addTag.createValue;
                delete addTag.icon;
                setOptions([...allTags, addTag]);
              }
              setPrioritizedOptions([] as T[]);
              setLastAddedTag(undefined);
            }
            onChange(newValue);
          }}
          onHighlightChange={(event, option, reason) => {
            setHighlight(option);
          }}
          renderOption={(props, option) => {
            let label = option.name;
            if (option.createValue) {
              label = `${t('common.create', { value: option.name })}`;
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
                  if (customChipOnClick) {
                    customChipOnClick(option.id);
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
