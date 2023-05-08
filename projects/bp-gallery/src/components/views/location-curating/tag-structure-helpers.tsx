import { useMemo } from 'react';
import { FlatTag } from '../../../types/additionalFlatTypes';

export const useGetTagTree = (flattenedTags: FlatTag[] | undefined) => {
  const tagTree = useMemo(() => {
    if (!flattenedTags) return;

    const tagsById = Object.fromEntries(
      flattenedTags.map(tag => [
        tag.id,
        { ...tag, child_tags: [] as FlatTag[], unacceptedSubtags: 0 },
      ])
    );
    for (const tag of Object.values(tagsById)) {
      tag.parent_tags?.forEach(parentTag => {
        tagsById[parentTag.id].child_tags.push(tag);
        // THIS IS JUST FOR THE PROTOTYPE DO NOT USE IT IN THE FUTURE
        tagsById[parentTag.id].child_tags.sort((a, b) => a.name.localeCompare(b.name));
      });
    }
    const sortedTagTree = Object.values(tagsById)
      .filter(tag => !tag.parent_tags?.length || tag.root)
      // THIS IS JUST FOR THE PROTOTYPE DO NOT USE IT IN THE FUTURE
      .sort((a, b) => a.name.localeCompare(b.name));

    return sortedTagTree;
  }, [flattenedTags]);

  return tagTree;
};

export const useGetTagChildren = (
  tagTree: FlatTag[] | undefined,
  flattenedTags: FlatTag[] | undefined
) => {
  const tagChildTags = useMemo(() => {
    if (!flattenedTags) return;

    const tagChildren = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[]]));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      if (nextTag?.child_tags) {
        tagChildren[nextTag.id] = nextTag.child_tags;
      }
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagChildren;
  }, [flattenedTags, tagTree]);

  return tagChildTags;
};

export const useGetTagSiblings = (
  tagTree: FlatTag[] | undefined,
  flattenedTags: FlatTag[] | undefined,
  tagChildTags:
    | {
        [k: string]: FlatTag[];
      }
    | undefined,
  parentTag?: FlatTag,
  isRoot?: boolean
) => {
  const tagSiblings = useMemo(() => {
    if (!flattenedTags || !tagChildTags) return;

    const tagSiblings = Object.fromEntries(flattenedTags.map(tag => [tag.id, [] as FlatTag[]]));
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      nextTag?.parent_tags?.forEach(parent => {
        if (!parentTag || parent.id === parentTag.id) {
          tagSiblings[nextTag.id].push(
            ...tagChildTags[parent.id].filter(
              tag =>
                tag.id !== nextTag.id &&
                !tagSiblings[nextTag.id].some(sibling => sibling.id === tag.id)
            )
          );
        }
      });
      if (nextTag && (isRoot || !nextTag.parent_tags?.length)) {
        tagSiblings[nextTag.id] = flattenedTags.filter(
          tag => (!tag.parent_tags?.length || tag.root) && tag.id !== nextTag.id
        );
      }
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagSiblings;
  }, [flattenedTags, tagTree, tagChildTags, parentTag, isRoot]);

  return tagSiblings;
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
