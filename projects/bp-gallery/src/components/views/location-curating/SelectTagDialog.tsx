import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import SelectDialogPreset from '../../provider/dialog-presets/SelectDialogPreset';
import { DialogProps } from '../../provider/DialogProvider';
import { useEffect, useMemo, useState } from 'react';
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

  const [tagList, setTagList] = useState<(FlatTag & { appearance?: number })[]>();

  useEffect(() => {
    const tempTagList = [] as (FlatTag & { appearance?: number })[];
    flattenedTags?.forEach(tag => {
      if (!tag.parent_tags?.length) {
        tempTagList.push({ ...tag, appearance: 0 } as FlatTag & { appearance?: number });
      } else {
        let index = 0;
        tag.parent_tags.forEach(parent => {
          if (!tagSupertagList || !tagSupertagList[parent.id].length) {
            tempTagList.push({ ...tag, appearance: index } as FlatTag & { appearance?: number });
            index++;
          } else {
            tagSupertagList[parent.id].forEach(path => {
              tempTagList.push({ ...tag, appearance: index } as FlatTag & { appearance?: number });
              index++;
            });
          }
        });
      }
    });

    setTagList(tempTagList);
  }, [setTagList, flattenedTags, tagSupertagList]);

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{
        ...dialogProps,
        title: t(`tag-panel.relocate-${dialogProps.type ?? TagType.KEYWORD}`),
      }}
      allOptions={tagList ?? []}
      renderOption={(props, option: FlatTag & { appearance?: number }) => {
        return (
          <li
            {...props}
            key={
              option.appearance
                ? +option.id >= option.appearance
                  ? +option.id * +option.id + +option.id + option.appearance
                  : +option.id + option.appearance * option.appearance
                : option.id
            }
          >
            <div className='recommendation-item-container'>
              {tagSupertagList && tagSupertagList[option.id].length > 0 ? (
                <div className='recommendation-item-parents'>
                  {tagSupertagList[option.id][option.appearance ?? 0].map((tag, index) => {
                    return (
                      <div key={index} className='recommendation-item'>
                        {index >= 1 && <ArrowRight />}
                        {tag.name}
                      </div>
                    );
                  })}
                  {tagSupertagList[option.id].length > 0 && <ArrowRight />}
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
