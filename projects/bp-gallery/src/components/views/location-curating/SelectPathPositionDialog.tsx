import { useEffect, useMemo, useRef, useState } from 'react';
import { DialogProps } from '../../provider/DialogProvider';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { TagType, FlatTag } from '../../../types/additionalFlatTypes';
import { Close, Done } from '@mui/icons-material';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';
import { useGetTagSupertagList, useGetTagTree } from './tag-structure-helpers';

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

  const tagTree = useGetTagTree(flattenedTags);

  const newTag: FlatTag = dialogProps.content.newTag;
  const lastTag: FlatTag = dialogProps.content.lastTag;

  const customOptions = useMemo(() => {
    return [
      {
        ...newTag,
        icon: undefined,
        id: '0',
        position: 'root',
        name: newTag.name,
      },
      {
        ...newTag,
        icon: undefined,
        id: '1',
        position: 'child',
        name: newTag.name,
      },
      {
        ...newTag,
        icon: undefined,
        id: '2',
        position: 'sibling',
        name: newTag.name,
      },
    ];
  }, [newTag]);

  const tagSupertagList = useGetTagSupertagList(tagTree, flattenedTags);

  const customSupertagList = useMemo(() => {
    const customSupertags = Object.fromEntries(
      customOptions.map(tag => [tag.id, [] as FlatTag[][]])
    );
    customSupertags[0] = [];
    // children
    customSupertags[1] = (tagSupertagList ? tagSupertagList[lastTag.id] : []).map(path => {
      return path.map(tag => {
        return tag;
      });
    });
    for (let i = 0; i < customSupertags[1].length; i++) {
      customSupertags[1][i].push(lastTag);
    }
    if (!customSupertags[1].length) {
      customSupertags[1].push([lastTag]);
    }

    // siblings
    customSupertags[2] = (tagSupertagList ? tagSupertagList[lastTag.id] : []).map(path => {
      return path.map(tag => {
        return tag;
      });
    });

    return customSupertags;
  }, [customOptions, lastTag, tagSupertagList]);

  const [tagList, setTagList] = useState<FlatTag[]>();

  useEffect(() => {
    setTagList(flattenedTags);
  }, [setTagList, flattenedTags, tagSupertagList]);

  const selectedOption = useRef<any | undefined>(customOptions[1]);
  const [highlight, setHighlight] = useState<any>();

  return (
    <>
      <DialogTitle>{dialogProps.title ?? t('curator.selectOption')}</DialogTitle>
      <DialogContent>
        <Autocomplete
          autoHighlight
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={customOptions}
          onChange={(_, value: any | null) => {
            selectedOption.current = value ?? undefined;
          }}
          onHighlightChange={(event, option, reason) => {
            setHighlight(option);
          }}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                <SingleTagElement
                  tagSupertagList={customSupertagList}
                  option={option}
                  label={option.name}
                  highlighted={highlight && highlight.id === option.id ? true : false}
                />
              </li>
            );
          }}
          getOptionLabel={(option: any) => {
            let pathString = '';
            if (option.id in customSupertagList && customSupertagList[option.id].length > 1) {
              pathString = 'Mehrere Pfade';
            } else if (
              option.id in customSupertagList &&
              customSupertagList[option.id].length === 1
            ) {
              customSupertagList[option.id][0].forEach((supertag: any) => {
                pathString += (supertag.name as string) + ' ';
              });
            }

            return pathString !== ''
              ? (option.name as string) + ' ( ' + pathString + ')'
              : option.name;
          }}
          renderInput={params => {
            return <TextField variant='standard' {...params} />;
          }}
          defaultValue={selectedOption.current}
        />
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
