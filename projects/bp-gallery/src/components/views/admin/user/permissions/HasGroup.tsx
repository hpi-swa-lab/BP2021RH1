import { Checkbox, FormControlLabel } from '@mui/material';
import { Operation } from 'bp-graphql/build';
import { ChangeEvent, useCallback } from 'react';
import { FlatArchiveTag } from '../../../../../types/additionalFlatTypes';

export enum HasGroup {
  NONE,
  SOME,
  ALL,
}

export const combineHasGroups = (hasGroups: HasGroup[]) => {
  if (hasGroups.every(has => has === HasGroup.ALL)) {
    return HasGroup.ALL;
  }
  if (hasGroups.every(has => has === HasGroup.NONE)) {
    return HasGroup.NONE;
  }
  return HasGroup.SOME;
};

export const HasGroupCheckbox = ({
  hasGroup,
  operations,
  archive,
  label,
  prompt,
  toggleOperations,
}: {
  hasGroup: HasGroup;
  operations: Operation[];
  archive: FlatArchiveTag | null;
  label: string;
  prompt?: boolean;
  toggleOperations: (
    operations: Operation[],
    archive: FlatArchiveTag | null,
    hasGroup: HasGroup,
    header: string,
    prompt?: boolean
  ) => void;
}) => {
  const checked = hasGroup === HasGroup.ALL;
  const indeterminate = hasGroup === HasGroup.SOME;

  const onClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      toggleOperations(operations, archive, hasGroup, label, prompt);
      // prevent Accordion from toggling
      event.stopPropagation();
    },
    [toggleOperations, operations, archive, hasGroup, label, prompt]
  );

  return (
    <FormControlLabel
      control={<Checkbox indeterminate={indeterminate} checked={checked} onChange={onClick} />}
      label={label}
    />
  );
};
