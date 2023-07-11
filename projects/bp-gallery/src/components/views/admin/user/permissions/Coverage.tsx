import { Checkbox, FormControlLabel } from '@mui/material';
import { Operation } from 'bp-graphql/build';
import { ChangeEvent, useCallback } from 'react';
import { FlatArchiveTag } from '../../../../../types/additionalFlatTypes';

export enum Coverage {
  NONE,
  SOME,
  ALL,
}

export const CoverageCheckbox = ({
  coverage,
  operations,
  archive,
  label,
  prompt,
  toggleOperations,
  clickThrough = false,
}: {
  coverage: Coverage;
  operations: Operation[];
  archive: FlatArchiveTag | null;
  label: string;
  prompt?: boolean;
  toggleOperations: (
    operations: Operation[],
    archive: FlatArchiveTag | null,
    coverage: Coverage,
    header: string,
    prompt?: boolean
  ) => void;
  clickThrough?: boolean;
}) => {
  const checked = coverage === Coverage.ALL;
  const indeterminate = coverage === Coverage.SOME;

  const onClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      toggleOperations(operations, archive, coverage, label, prompt);
      // prevent Accordion from toggling
      event.stopPropagation();
    },
    [toggleOperations, operations, archive, coverage, label, prompt]
  );

  return (
    <FormControlLabel
      control={
        <Checkbox
          className={clickThrough ? 'pointer-events-auto' : ''}
          indeterminate={indeterminate}
          checked={checked}
          onChange={onClick}
        />
      }
      label={label}
      className={clickThrough ? 'pointer-events-none' : ''}
    />
  );
};
