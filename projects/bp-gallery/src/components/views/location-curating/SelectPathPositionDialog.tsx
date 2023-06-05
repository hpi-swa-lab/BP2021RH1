import { Close, Done } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogProps } from '../../provider/DialogProvider';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';
import { useGetTagStructures } from './tag-structure-helpers';

export enum RelativeTagPosition {
  ROOT = '0',
  CHILD = '1',
  SIBLING = '2',
}

const PathPositionSelectDialogPreset = ({
  handleClose,
  dialogProps,
}: {
  handleClose: (value: any) => void;
  dialogProps: DialogProps;
}) => {
  const { t } = useTranslation();
  const { allTagsQuery } = useGenericTagEndpoints(TagType.LOCATION);

  const { data } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const { tagSupertagList } = useGetTagStructures(flattenedTags);

  const newTag: FlatTag = dialogProps.content.newTag;
  const lastTag: FlatTag = dialogProps.content.lastTag;

  const customOptions = useMemo(() => {
    return [RelativeTagPosition.ROOT, RelativeTagPosition.CHILD, RelativeTagPosition.SIBLING].map(
      id => ({
        ...newTag,
        icon: undefined,
        id,
      })
    );
  }, [newTag]);

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
              pathString = t('tag-panel.multiple-paths') + ' ▸ ';
            } else if (
              option.id in customSupertagList &&
              customSupertagList[option.id].length === 1
            ) {
              customSupertagList[option.id][0].forEach((supertag: any) => {
                pathString += (supertag.name as string) + ' ▸ ';
              });
            }

            return pathString !== ''
              ? (option.name as string) + ' ( ' + pathString + (option.name as string) + ' )'
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
