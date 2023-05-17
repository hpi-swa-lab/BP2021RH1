import { PermissionName } from 'bp-graphql/build';

type PresetType = 'system' | 'archive';

type Preset = {
  type: PresetType;
  name: string;
  permissions: readonly PermissionName[];
};

export const presets: Preset[] = [
  {
    type: 'system',
    name: 'public',
    permissions: [
      'getPictures',
      'getAllPicturesByArchive',
      'viewCollection',
      'getTagThumbnails',
      'getAllArchiveTags',
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
