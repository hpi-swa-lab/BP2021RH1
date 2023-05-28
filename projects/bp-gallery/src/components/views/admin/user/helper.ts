import { FlatParameterizedPermission } from '../../../../types/additionalFlatTypes';

export const archiveId = (permission: FlatParameterizedPermission) => permission.archive_tag?.id;

export const equalOrBothNullish = <T>(a: T | undefined | null, b: T | undefined | null) =>
  (a ?? null) === (b ?? null);

export const parseUserId = (userId: string) => {
  const isPublic = userId === 'public';
  const parsedUserId = isPublic ? null : userId;
  return { isPublic, parsedUserId };
};
