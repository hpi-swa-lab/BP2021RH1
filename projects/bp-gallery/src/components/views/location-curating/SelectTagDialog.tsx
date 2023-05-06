import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import SelectDialogPreset from '../../provider/dialog-presets/SelectDialogPreset';
import { DialogProps } from '../../provider/DialogProvider';
import { useEffect, useMemo, useState } from 'react';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';
import { useGetTagTree } from './tag-structure-helpers';

const TagSelectDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();
  const { allTagsQuery } = useGenericTagEndpoints(dialogProps.type as TagType);

  const { data } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const tagTree = useGetTagTree(flattenedTags);

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

  const [tagList, setTagList] = useState<FlatTag[]>();

  useEffect(() => {
    setTagList(flattenedTags);
  }, [setTagList, flattenedTags, tagSupertagList]);

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{
        ...dialogProps,
        title: t(`tag-panel.relocate-${dialogProps.type ?? TagType.KEYWORD}`),
      }}
      allOptions={tagList ?? []}
      renderOption={(props, option: FlatTag, highlight?: any) => {
        return (
          <li {...props} key={option.id}>
            <SingleTagElement
              tagSupertagList={tagSupertagList}
              option={option}
              label={option.name}
              highlighted={highlight && highlight.id === option.id ? true : false}
            />
          </li>
        );
      }}
      inputLabel={t(`tag-panel.${dialogProps.type ?? TagType.KEYWORD}`)}
    />
  );
};

export default TagSelectDialogPreset;
