import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import SelectDialogPreset from '../../provider/dialog-presets/SelectDialogPreset';
import { DialogProps } from '../../provider/DialogProvider';
import { useEffect, useState } from 'react';
import SingleTagElement from '../picture/sidebar/picture-info/SingleTagElement';
import { useGetTagStructures, useGetTagSupertagList } from './tag-structure-helpers';

const TagSelectDialogPreset = ({
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

  const { tagTree } = useGetTagStructures(flattenedTags);

  const tagSupertagList = useGetTagSupertagList(tagTree, flattenedTags);

  const [tagList, setTagList] = useState<FlatTag[]>();

  useEffect(() => {
    setTagList(flattenedTags);
  }, [setTagList, flattenedTags, tagSupertagList]);

  return (
    <SelectDialogPreset
      handleClose={handleClose}
      dialogProps={{
        ...dialogProps,
        title: t(`tag-panel.relocate-location`),
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
      inputLabel={t(`tag-panel.location`)}
    />
  );
};

export default TagSelectDialogPreset;
