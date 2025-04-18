export type Maybe<T> = T | null;

export type ID = {
  id: number;
};

export type ArchiveTag = ID;

export type UsersPermissionsUser = ID & {
  blocked?: Maybe<boolean>;
  isSuperUser?: Maybe<boolean>;
};

export type ParameterizedPermission = ID & {
  archive_tag: Maybe<ArchiveTag>;
  on_other_users: Maybe<boolean>;
  operation_name: Maybe<string>;
  users_permissions_user: Maybe<UsersPermissionsUser>;
};

export type Picture = ID & {
  archive_tag: Maybe<ArchiveTag>;
};

export type Comment = ID & {
  picture: Maybe<Picture>;
};

export type FaceTag = ID & {
  picture: Maybe<Picture>;
};

export type OrientationTag = ID & {
  picture: Maybe<Picture>;
};

export type Link = ID & {
  archive_tag: Maybe<ArchiveTag>;
};

export type Exhibition = ID & {
  archive_tag: Maybe<ArchiveTag>;
};

export type ExhibitionSection = ID & {
  exhibition: Maybe<Exhibition>;
};

export type ExhibitionPicture = ID & {
  exhibition_section: Maybe<ExhibitionSection>;
};
