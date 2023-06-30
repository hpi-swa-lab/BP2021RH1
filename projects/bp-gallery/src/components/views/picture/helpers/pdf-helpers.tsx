import { FlatPicture } from '../../../../types/additionalFlatTypes';

export const isPdf = (picture: FlatPicture | undefined) => picture?.media?.ext === '.pdf';
