import { useMemo } from 'react';
import { FlatTag } from '../../../types/additionalFlatTypes';
import { uniqBy } from 'lodash';

export const useGetTagTree = (
  flattenedTags: FlatTag[] | undefined,
  currentParentTag?: FlatTag,
  currentIsRoot?: boolean
) => {
  const { tagTree, tagChildTags, tagSiblingTags } = useMemo(() => {
    if (!flattenedTags) return { tagTree: undefined, tagChildTags: undefined };

    const tagsById = Object.fromEntries(
      flattenedTags.map(tag => [
        tag.id,
        { ...tag, child_tags: [] as FlatTag[], unacceptedSubtags: 0 },
      ])
    );
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

    return {
      tagTree: sortedTagTree,
      tagChildTags: Object.fromEntries(
        flattenedTags.map(tag => [tag.id, tagsById[tag.id].child_tags])
      ),
      tagSiblingTags: tagSiblings,
    };
  }, [flattenedTags, currentIsRoot, currentParentTag]);

  return { tagTree, tagChildTags, tagSiblingTags };
};

export const useGetTagSupertagList = (
  tagTree: FlatTag[] | undefined,
  flattenedTags: FlatTag[] | undefined
) => {
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

      if (nextTag && nextTag.root) {
        tagSupertags[nextTag.id].push([]);
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

  return tagSupertagList;
};

export const useGetBreadthFirstOrder = (
  tagTree: FlatTag[] | undefined,
  prioritizedOptions: FlatTag[] | undefined
) => {
  const tagOrder = useMemo(() => {
    const order: FlatTag[] = [];

    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      if (nextTag) {
        if (!order.some(tag => tag.id === nextTag.id)) {
          order.push(nextTag);
        }
        nextTag.child_tags?.forEach(child => {
          queue.push(child);
        });
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
