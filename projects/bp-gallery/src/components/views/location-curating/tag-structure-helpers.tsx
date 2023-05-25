import { useMemo } from 'react';
import { FlatTag } from '../../../types/additionalFlatTypes';
import { uniqBy } from 'lodash';

export const useGetTagStructures = (
  flattenedTags: FlatTag[] | undefined,
  currentParentTag?: FlatTag,
  currentIsRoot?: boolean
) => {
  const tagsById = useMemo(() => {
    if (!flattenedTags) return;
    return Object.fromEntries(
      flattenedTags.map(tag => [
        tag.id,
        { ...tag, child_tags: [] as FlatTag[], unacceptedSubtags: 0 },
      ])
    );
  }, [flattenedTags]);

  const tagTree = useMemo(() => {
    if (!flattenedTags || !tagsById) return undefined;

    // set child tags for each tag in tree
    for (const tag of Object.values(tagsById)) {
      tag.parent_tags?.forEach(parentTag => {
        tagsById[parentTag.id].child_tags.push(tag);
      });
    }
    for (const tag of Object.values(tagsById)) {
      tagsById[tag.id].child_tags.sort((a, b) => a.name.localeCompare(b.name));
    }
    // filter for roots of tree
    const sortedTagTree = Object.values(tagsById)
      .filter(tag => !tag.parent_tags?.length || tag.root)
      .sort((a, b) => a.name.localeCompare(b.name));

    //replace stubs with complete parent tags
    for (const flatTag of flattenedTags) {
      if (!(flatTag.id in tagsById)) {
        continue;
      }
      const tag = tagsById[flatTag.id];
      tag.parent_tags = tag.parent_tags
        ?.map(parentTag => tagsById[parentTag.id])
        .filter(parentTag => !!parentTag);
    }

    return sortedTagTree;
  }, [flattenedTags, tagsById]);

  const tagSiblingTags = useMemo(() => {
    if (!flattenedTags || !tagsById) return undefined;
    //set sibling tags for tags
    const tagSiblings = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[]]));
    const rootTags = flattenedTags.filter(tag => tag.root || !tag.parent_tags?.length);

    for (const flatTag of flattenedTags) {
      if (!(flatTag.id in tagsById)) {
        continue;
      }
      const tag = tagsById[flatTag.id];
      tagSiblings[flatTag.id] = uniqBy(
        tag.parent_tags?.length
          ? tag.parent_tags.flatMap(parent => {
              if (currentIsRoot) {
                return rootTags.map(rootTag => tagsById[rootTag.id]);
              }
              return !currentParentTag || currentParentTag.id === parent.id
                ? parent.child_tags ?? []
                : [];
            })
          : rootTags.map(rootTag => tagsById[rootTag.id]),
        a => a.id
      ).filter(siblingTag => siblingTag.id !== tag.id);
    }

    return tagSiblings;
  }, [flattenedTags, currentIsRoot, currentParentTag, tagsById]);

  return {
    tagTree: tagTree,
    tagChildTags:
      flattenedTags && tagsById
        ? Object.fromEntries(flattenedTags.map(tag => [tag.id, tagsById[tag.id].child_tags]))
        : undefined,
    tagSiblingTags: tagSiblingTags,
  };
};

export const useGetTagSupertagList = (
  tagTree: FlatTag[] | undefined,
  flattenedTags: FlatTag[] | undefined
) => {
  const tagSupertagList = useMemo(() => {
    if (!flattenedTags || !tagTree) return;

    const paths = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[][]]));

    const visit = (tag: FlatTag) => {
      if (!tag.child_tags) {
        return;
      }
      for (const child of tag.child_tags) {
        const childPaths = paths[tag.id].map(path => [...path, tag]);
        paths[child.id].push(...childPaths);
      }
    };

    const queue: FlatTag[] = tagTree.map(tag => tag);
    // setup paths for root tags
    for (const tag of tagTree) {
      paths[tag.id] = [[]];
    }

    while (queue.length) {
      const tag = queue.shift();
      if (!tag) {
        continue;
      }
      visit(tag);
    }

    return paths;
  }, [flattenedTags, tagTree]);

  return tagSupertagList;
};

export const useGetBreadthFirstOrder = (
  tagTree: FlatTag[] | undefined,
  prioritizedOptions: FlatTag[] | undefined
) => {
  const tagOrder = useMemo(() => {
    const order: FlatTag[] = [];
    const alreadySeenTags = new Set();

    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      if (nextTag) {
        const lengthOfSet = alreadySeenTags.size;
        if (lengthOfSet !== alreadySeenTags.add(nextTag).size) {
          console.log(nextTag.name);
          order.push(nextTag);
          nextTag.child_tags?.forEach(child => {
            queue.push(child);
          });
        }
      }
    }

    const finalOrder = [
      ...(prioritizedOptions ?? []),
      ...order.filter(
        tag => !prioritizedOptions?.some(prioritizedTag => prioritizedTag.id === tag.id)
      ),
    ];

    return finalOrder;
  }, [tagTree, prioritizedOptions]);

  return tagOrder;
};
