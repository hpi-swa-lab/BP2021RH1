import { useEffect, useMemo, useRef, useState } from 'react';
import { DialogProps } from '../../provider/DialogProvider';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { TagType, FlatTag } from '../../../types/additionalFlatTypes';
import { Close, Done } from '@mui/icons-material';
import { DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from '@mui/material';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';

const PathPositionSelectDialogPreset = ({
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

  const customOptions = useMemo(() => {
    return [
      {
        ...dialogProps.content[0],
        icon: undefined,
        id: '0',
        position: 'root',
        name: dialogProps.content[0].name,
      },
      {
        ...dialogProps.content[0],
        icon: undefined,
        id: '1',
        position: 'child',
        name: dialogProps.content[0].name,
      },
    ];
  }, [dialogProps.content]);

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

  const customSupertagList = useMemo(() => {
    const customSupertags = Object.fromEntries(
      customOptions.map(tag => [tag.id, [] as FlatTag[][]])
    );
    customSupertags[0] = [];
    // children
    customSupertags[1] = (tagSupertagList ? tagSupertagList[dialogProps.content[1].id] : []).map(
      path => {
        return path.map(tag => {
          return tag;
        });
      }
    );
    for (let i = 0; i < customSupertags[1].length; i++) {
      customSupertags[1][i].push(dialogProps.content[1]);
    }
    if (!customSupertags[1].length) {
      customSupertags[1].push([dialogProps.content[1]]);
    }

    return customSupertags;
  }, [customOptions, dialogProps.content, tagSupertagList]);

  const [tagList, setTagList] = useState<FlatTag[]>();

  useEffect(() => {
    setTagList(flattenedTags);
  }, [setTagList, flattenedTags, tagSupertagList]);

  const selectedOption = useRef<any | undefined>('1');

  return (
    <>
      <DialogTitle>{dialogProps.title ?? t('curator.selectOption')}</DialogTitle>
      <DialogContent>
        <Select
          className='w-full'
          defaultOpen={true}
          onChange={(_, value: any | null) => {
            selectedOption.current = value.props.value ?? undefined;
          }}
          defaultValue={selectedOption.current}
        >
          {customOptions.map((option, index) => {
            return (
              <MenuItem value={option.id} key={index}>
                <SingleTagElement
                  tagSupertagList={customSupertagList}
                  option={option}
                  label={option.name}
                />
              </MenuItem>
            );
          })}
        </Select>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleClose(undefined)} startIcon={<Close />}>
          {t('common.abort')}
        </Button>
        <Button
          onClick={() => handleClose(selectedOption.current ?? undefined)}
          startIcon={<Done />}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </>
  );
};

export default PathPositionSelectDialogPreset;