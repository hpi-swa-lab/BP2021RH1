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
