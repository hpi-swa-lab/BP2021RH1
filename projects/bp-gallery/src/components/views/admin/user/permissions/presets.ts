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
    name: 'basic',
    permissions: [
      'setPicturesForCollection',
      'getAllCollections',
      'getAllTags',
      'createTag',
      'updateLocationCoordinates',
      'getUnverifiedComments',
      'getUser',
      'getUsers',
      {
        name: 'removeUser',
        parameters: {
          on_other_users: false,
        },
      },
      {
        name: 'getParameterizedPermissions',
        parameters: {
          on_other_users: false,
        },
      },
      'login',
    ],
  },
];
