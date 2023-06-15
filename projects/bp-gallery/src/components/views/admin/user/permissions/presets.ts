import { PermissionName } from 'bp-graphql/build';
import { Parameters } from '../PermissionsView';

export type PresetType = 'system' | 'archive';

export type ParametersWithoutArchive = Omit<Parameters, 'archive_tag'>;

export type Preset = {
  type: PresetType;
  name: string;
  permissions: readonly (
    | PermissionName
    | { name: PermissionName; parameters: ParametersWithoutArchive }
  )[];
};

export const presets: Preset[] = [
  {
    type: 'system',
    name: 'public',
    permissions: ['login'],
  },
];
