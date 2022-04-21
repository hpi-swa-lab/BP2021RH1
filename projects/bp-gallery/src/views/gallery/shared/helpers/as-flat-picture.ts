import { FlatPicture } from '../../../../types/additionalFlatTypes';

export const asFlatPicture = (file: File): FlatPicture => {
  return {
    id: file.name,
    media: {
      formats: {
        small: {
          url: URL.createObjectURL(file),
        },
      },
    } as any,
  };
};
