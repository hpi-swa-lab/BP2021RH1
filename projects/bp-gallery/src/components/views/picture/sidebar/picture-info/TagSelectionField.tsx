import { Add, Help } from '@mui/icons-material';
import { Autocomplete, Chip, Stack, TextField } from '@mui/material';
import Fuse from 'fuse.js';
import { unionWith } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentCommonSynonyms, Maybe } from '../../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../../../types/additionalFlatTypes';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import { DialogPreset, useDialog } from '../../../../provider/DialogProvider';
import { RelativeTagPosition } from '../../../location-curating/SelectPathPositionDialog';
import {
  useGetBreadthFirstOrder,
  useGetTagStructures,
} from '../../../location-curating/tag-structure-helpers';
import { addNewParamToSearchPath } from '../../../search/helpers/addNewParamToSearchPath';
import { SearchType } from '../../../search/helpers/search-filters';
import useAdvancedSearch from '../../../search/helpers/useAdvancedSearch';
import SingleTagElement from './SingleTagElement';
import './TagSelection.scss';

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

  const { tagTree, tagChildTags, tagSiblingTags, tagSupertagList } =
    useGetTagStructures(flattenedTags);
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

  const handleAfterCreate = (
    addTag: T,
    data: any,
    createdAsRoot?: boolean,
    createdAsSibling?: boolean
  ) => {
    if (data) {
      const nameOfField = Object.keys(data as { [key: string]: any })[0];
      const newId = data[nameOfField].data.id;
      addTag.id = newId;
      addTag.isNewRoot = createdAsRoot;
      addTag.isNewSibling = createdAsSibling;
      delete addTag.createValue;
      delete addTag.icon;
      setOptions([...allTags, addTag]);
      setPrioritizedOptions([] as T[]);
    }
  };

  const getAllNotSelectedSupertags = (tag: T) => {
    const supertags: T[] = [];
    if (!fixedChildTag && !fixedParentTag && tagSupertagList && tag.id in tagSupertagList) {
      tagSupertagList[tag.id].forEach(path => {
        supertags.push(
          ...(path.filter(
            supertag =>
              !tags.some(tag => tag.id === supertag.id) &&
              !supertags.some(tag => tag.id === supertag.id)
          ) as T[])
        );
      });
    }
    return supertags;
  };

  const getTagChildrenRecommendations = (tag: T, filterOutValues: T[]) => {
    return tagChildTags && tag.id in tagChildTags
      ? tagChildTags[tag.id].filter(tag => !filterOutValues.some(t => t.id === tag.id))
      : [];
  };

  const getTagSiblingRecommendations = (tag: T, filterOutValues: T[]) => {
    if (tagSiblingTags && tag.id in tagSiblingTags) {
      // add siblings for tag if siblings are in data structure
      return tagSiblingTags[tag.id].filter(
        siblingTag => !filterOutValues.some(t => t.id === siblingTag.id)
      );
    } else if (
      tag.isNewSibling &&
      lastAddedTag &&
      tagSiblingTags &&
      lastAddedTag.id in tagSiblingTags
    ) {
      // add siblings for lastAddedTag if tag was added as sibling of lastSelectedTag
      return [...tagSiblingTags[lastAddedTag.id], lastAddedTag].filter(
        siblingTag => !filterOutValues.some(t => t.id === siblingTag.id)
      );
    } else if (!tag.isNewRoot && tagChildTags && lastAddedTag && lastAddedTag.id in tagChildTags) {
      // add children for lastAddedTag if tag was added as child of lastSelectedTag
      return tagChildTags[lastAddedTag.id].filter(
        siblingTag => !filterOutValues.some(t => t.id === siblingTag.id)
      );
    } else if (tag.isNewRoot && tagTree) {
      // add root tags if tag was added as root tag
      return tagTree
        .map(tag => tag as unknown as T)
        .filter(siblingTag => !filterOutValues.some(t => t.id === siblingTag.id));
    } else {
      return [];
    }
  };

  const getTagSelectedSiblings = (tag: T, selectedValues: T[]) => {
    if (tagSiblingTags && tag.id in tagSiblingTags) {
      return tagSiblingTags[tag.id].filter(siblingTag =>
        selectedValues.some(t => t.id === siblingTag.id)
      );
    } else if (
      tag.isNewSibling &&
      lastAddedTag &&
      tagSiblingTags &&
      lastAddedTag.id in tagSiblingTags
    ) {
      return [...tagSiblingTags[lastAddedTag.id], lastAddedTag].filter(siblingTag =>
        selectedValues.some(t => t.id === siblingTag.id)
      );
    } else {
      return [];
    }
  };

  const getSelectedSiblingsChildren = (selectedSiblings: T[], filterOutValues: T[]) => {
    let selectedSiblingChildren: T[] = [];
    if (tagChildTags) {
      selectedSiblings.forEach(selectedSibling => {
        const siblingChildren =
          selectedSibling.id in tagChildTags
            ? tagChildTags[selectedSibling.id].filter(
                tag => !selectedSiblingChildren.some(t => t.id === tag.id)
              )
            : ([] as T[]);
        selectedSiblingChildren.push(...(siblingChildren as T[]));
      });
    }
    selectedSiblingChildren = selectedSiblingChildren.filter(
      tag => !filterOutValues.some(t => t.id === tag.id)
    );

    return selectedSiblingChildren;
  };

  const addNewChildTag = async (addTag: T, newValue: T[]) => {
    if (
      tagChildTags &&
      lastAddedTag!.id in tagChildTags &&
      tagChildTags[lastAddedTag!.id].some(tag => tag.name === addTag.name)
    ) {
      // if yes then just add it to the selected tags
      const existingTag = tagChildTags[lastAddedTag!.id].find(
        tag => tag.name === addTag.name
      ) as unknown as T;
      const filteredNewValues = newValue.filter(val => !val.createValue);
      filteredNewValues.push(existingTag);
      newValue = filteredNewValues;
    } else {
      // if not create a new tag in the corresponding position
      const { data } = await createChildMutation!({
        variables: { name: addTag.createValue, parentIDs: [lastAddedTag!.id] },
      });
      handleAfterCreate(addTag, data);
    }
  };

  const addNewSiblingTag = async (addTag: T, newValue: T[]) => {
    if (
      tagSiblingTags &&
      lastAddedTag!.id in tagSiblingTags &&
      tagSiblingTags[lastAddedTag!.id].some(tag => tag.name === addTag.name)
    ) {
      // if yes just add it
      const existingTag = tagSiblingTags[lastAddedTag!.id].find(
        tag => tag.name === addTag.name
      ) as unknown as T;
      const filteredNewValues = newValue.filter(val => !val.createValue);
      filteredNewValues.push(existingTag);
      newValue = filteredNewValues;
    } else if (lastAddedTag!.name !== addTag.name) {
      // if not create a new tag
      const { data } = await createChildMutation!({
        variables: {
          name: addTag.createValue,
          parentIDs:
            tagSupertagList && lastAddedTag!.id in tagSupertagList
              ? tagSupertagList[lastAddedTag!.id]
                  .filter(path => path.length)
                  .map(path => path[path.length - 1].id)
              : [],
          root:
            tagSupertagList &&
            lastAddedTag!.id in tagSupertagList &&
            tagSupertagList[lastAddedTag!.id].some(path => !path.length),
        },
      });
      handleAfterCreate(addTag, data, false, true);
    } else {
      const filteredNewValues = newValue.filter(val => !val.createValue);
      newValue = filteredNewValues;
    }
  };

  const addNewRootTag = async (addTag: T, newValue: T[]) => {
    if (tagTree?.some(rootTag => rootTag.name === addTag.name)) {
      const existingTag = tagTree.find(tag => tag.name === addTag.name) as unknown as T;
      const filteredNewValues = newValue.filter(val => !val.createValue);
      filteredNewValues.push(existingTag);
      newValue = filteredNewValues;
    } else {
      const { data } = await createMutation!({
        variables: { name: addTag.createValue },
      });
      handleAfterCreate(addTag, data, true);
    }
  };

  const unitedOptions = useMemo(
    () => unionWith(options, tags, (a, b) => a.id === b.id),
    [options, tags]
  );

  if (role >= AuthRole.CURATOR) {
    return (
      <div className='tag-selection'>
        <Autocomplete<T, true>
          multiple
          autoHighlight
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={unitedOptions}
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
            const isExistingAsRoot = tagTree?.some(tag => tag.name === inputValue);

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
            const addTag = newValue.find(val => val.createValue);
            if (addTag && createMutation) {
              // create new tag relative to lastAddedTag
              if (createChildMutation && lastAddedTag) {
                const createOption = await prompt({
                  preset: DialogPreset.SELECT_PATH_POSITION,
                  title: t('tag-panel.select-position', { name: addTag.name }),
                  content: { newTag: addTag, lastTag: lastAddedTag },
                });
                if (!createOption) return;
                switch (createOption.id) {
                  case RelativeTagPosition.CHILD: {
                    await addNewChildTag(addTag, newValue);
                    break;
                  }
                  case RelativeTagPosition.SIBLING: {
                    await addNewSiblingTag(addTag, newValue);
                    break;
                  }
                  case RelativeTagPosition.ROOT: {
                    await addNewRootTag(addTag, newValue);
                    break;
                  }
                  default: {
                    break;
                  }
                }
              } else {
                await addNewRootTag(addTag, newValue);
              }
            }

            if (addTag && createChildMutation && fixedParentTag) {
              const { data } = await createChildMutation({
                variables: {
                  name: addTag.createValue,
                  parentIDs: [fixedParentTag.id],
                  accepted: true,
                },
              });
              handleAfterCreate(addTag, data);
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
              handleAfterCreate(addTag, data);
              setLastAddedTag(undefined);
            }

            const newlyAddedTags = newValue.filter(
              newVal => !tags.some(tag => tag.id === newVal.id)
            );
            newlyAddedTags.forEach(tag => {
              setLastAddedTag(tag);
              const allSupertags: T[] = getAllNotSelectedSupertags(tag);
              newValue = newValue.concat(
                allSupertags.map(superTag => ({ ...superTag, verified: true, isNew: true }))
              );

              if (type === TagType.LOCATION) {
                const children = getTagChildrenRecommendations(tag, newValue);
                const siblings = getTagSiblingRecommendations(tag, [
                  ...newValue,
                  ...(children as T[]),
                ]);
                const selectedSiblings = getTagSelectedSiblings(tag, newValue);
                const selectedSiblingsChildren = getSelectedSiblingsChildren(
                  selectedSiblings as T[],
                  [...newValue, ...(children as T[]), ...(siblings as T[])]
                );

                const sortedChildren = customSortTags(children as T[]);
                const sortedSiblings = customSortTags(siblings as T[]);
                const sortedSelectedSiblingsChildren = customSortTags(selectedSiblingsChildren);
                const sortedNewValues = customSortTags(newValue);

                setPrioritizedOptions([
                  ...sortedNewValues,
                  ...newValue.filter(
                    tag => !sortedNewValues.some(sortedTag => sortedTag.id === tag.id)
                  ),
                  ...sortedSiblings,
                  ...sortedChildren,
                  ...sortedSelectedSiblingsChildren,
                ]);
              } else {
                setLastAddedTag(undefined);
                setPrioritizedOptions([] as T[]);
              }
              tag.isNew = true;
              tag.verified = true;
            });
            // handle if tags get removed from selection
            if (newValue.length < tags.length) {
              setLastAddedTag(undefined);
              setPrioritizedOptions([] as T[]);
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
                  tagSupertags={tagSupertagList ? tagSupertagList[option.id] : []}
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
