import { PermissionName } from 'bp-graphql/build';
import { Parameters } from '../PermissionsView';

type PresetType = 'system' | 'archive';

export type ParametersWithoutArchive = Omit<Parameters, 'archive'>;

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
    permissions: [
      'getPictures',
      'getArchivePictureCounts',
      {
        name: 'viewCollection',
        parameters: {
          see_unpublished_collections: false,
        },
      },
      'getTagThumbnails',
      'getAllArchiveTags',
      'contact',
      'geo',
      'canRunOperation',
      'login',
    ],
  },
  {
    type: 'archive',
    name: 'public',
    permissions: ['viewPicture', 'getDailyPictureInfo', 'like', 'postComment', 'getArchive'],
  },
];
