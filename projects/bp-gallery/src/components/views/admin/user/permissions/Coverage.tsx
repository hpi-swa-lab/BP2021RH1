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
      control={<Checkbox indeterminate={indeterminate} checked={checked} onChange={onClick} />}
      label={label}
    />
  );
};
