import { PermissionName } from 'bp-graphql/build';
import { PermissionParameters } from '../PermissionsView';

export type PresetType = 'system' | 'archive';

export type PermissionParametersWithoutArchive = Omit<PermissionParameters, 'archive_tag'>;

export type Preset = {
  type: PresetType;
  name: string;
  permissions: readonly (
    | PermissionName
    | { name: PermissionName; parameters: PermissionParametersWithoutArchive }
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
