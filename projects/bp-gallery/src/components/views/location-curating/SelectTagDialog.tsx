import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import SelectDialogPreset from '../../provider/dialog-presets/SelectDialogPreset';
import { DialogProps } from '../../provider/DialogProvider';
import { useMemo } from 'react';
import { ArrowRight } from '@mui/icons-material';

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

  const tagParentNamesList = useMemo(() => {
    if (!flattenedTags) return;

    const tagParentStrings = Object.fromEntries(
      flattenedTags.map(tag => [tag.id, [] as FlatTag[]])
    );
    // setup queue
    const queue: FlatTag[] = [];
    tagTree?.forEach(tag => {
      queue.push(tag);
    });
    // TODO: Add support for multiple paths
    while (queue.length > 0) {
      const nextTag = queue.shift();
      if (nextTag?.parent_tags && nextTag.parent_tags.length >= 1) {
        tagParentStrings[nextTag.id] = tagParentStrings[nextTag.id].concat([
          ...tagParentStrings[nextTag.parent_tags[0].id],
          nextTag.parent_tags[0],
        ]);
      }
      nextTag?.child_tags?.forEach(tag => {
        queue.push(tag);
      });
    }

    return tagParentStrings;
  }, [flattenedTags, tagTree]);

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{
        ...dialogProps,
        title: t(`tag-panel.relocate-${dialogProps.type ?? TagType.KEYWORD}`),
      }}
      allOptions={flattenedTags ?? []}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            <div className='recommendation-item-container'>
              {tagParentNamesList && tagParentNamesList[option.id].length > 0 ? (
                <div className='recommendation-item-parents'>
                  {tagParentNamesList[option.id].map((tag, index) => {
                    return (
                      <div key={index} className='recommendation-item'>
                        {index >= 1 && <ArrowRight />}
                        {tag.name}
                      </div>
                    );
                  })}
                  {tagParentNamesList[option.id].length > 0 && <ArrowRight />}
                  {option.name}
                </div>
              ) : (
                <div className='recommendation-item-name'>{option.name}</div>
              )}
            </div>
          </li>
        );
      }}
      inputLabel={t(`tag-panel.${dialogProps.type ?? TagType.KEYWORD}`)}
    />
  );
};

export default TagSelectDialogPreset;
