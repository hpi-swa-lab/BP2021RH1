import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Operation } from 'bp-graphql/build';
import { Maybe } from 'bp-graphql/build/db-types';
import { useCallback, useMemo } from 'react';
import {
  FlatArchiveTag,
  FlatParameterizedPermission,
} from '../../../../../types/additionalFlatTypes';
import { KeysWithValueExtending } from '../../../../../types/helper';
import { Parameters } from '../PermissionsView';

export const BooleanParameter = ({
  parameter,
  operations,
  archive,
  findPermission,
  deletePermission,
  addPermission,
  falseTitle,
  trueTitle,
}: {
  parameter: KeysWithValueExtending<Parameters, Maybe<boolean> | undefined>;
  operations: Operation[];
  archive: FlatArchiveTag | null;
  findPermission: (
    operation: Operation,
    archive: FlatArchiveTag | null
  ) => FlatParameterizedPermission | null;
  deletePermission: (options: { variables: { id: string } }) => Promise<unknown>;
  addPermission: (operation: Operation, parameters: Parameters) => void;
  falseTitle: string;
  trueTitle: string;
}) => {
  const onSelectChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      if (typeof event.target.value === 'number') {
        operations.forEach(async operation => {
          const permission = findPermission(operation, archive);
          if (permission) {
            await deletePermission({
              variables: {
                id: permission.id,
              },
            });
          }
          addPermission(operation, {
            archive_tag: archive ?? undefined,
            ...permission,
            [parameter]: Boolean(event.target.value),
          });
        });
      }
    },
    [operations, findPermission, archive, addPermission, parameter, deletePermission]
  );

  const allTrue = useMemo(
    () =>
      operations.reduce(
        (allTrue, operation) =>
          allTrue && (findPermission(operation, archive)?.[parameter] ?? false),
        true
      ),
    [operations, findPermission, parameter, archive]
  );

  return (
    // MenuItems can only have strings or numbers as values,
    // so we use 0 as false and 1 as true. They are converted above.
    <Select value={Number(allTrue)} onChange={onSelectChange} variant='standard'>
      <MenuItem value={0}>{falseTitle}</MenuItem>
      <MenuItem value={1}>{trueTitle}</MenuItem>
    </Select>
  );
};
