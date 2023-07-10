import {
  ArchiveTag,
  Collection,
  Comment,
  ComponentCommonSynonyms,
  ComponentLocationCoordinates,
  Description,
  Exhibition,
  ExhibitionPicture,
  ExhibitionSection,
  FaceTag,
  KeywordTag,
  Link,
  LocationTag,
  ParameterizedPermission,
  PersonTag,
  Picture,
  PictureGeoInfo,
  PictureSequence,
  Scalars,
  TimeRangeTag,
  UploadFile,
  UsersPermissionsPermission,
  UsersPermissionsRole,
  UsersPermissionsUser,
} from '../graphql/APIConnector';

type ID = { id: Scalars['ID'] };

export type FlatCollectionWithoutRelations = ID &
  Omit<Collection, 'pictures' | 'child_collections' | 'parent_collections'>;

type FlatCommentWithoutRelations = ID &
  Omit<Comment, 'picture' | 'parentComment' | 'childComments'>;

type FlatDescriptionWithoutRelations = ID & Omit<Description, 'pictures'>;

type FlatKeywordTagWithoutRelations = ID & Omit<KeywordTag, 'pictures' | 'verified_pictures'>;

export type FlatUploadFile = ID & UploadFile;

type FlatExhibitionPictureWithoutRelations = ID &
  Omit<ExhibitionPicture, 'picture' | 'exhibition_section' | 'exhibition_idealot'>;

type FlatExhibitionWithoutRelations = ID &
  Omit<Exhibition, 'title_picture' | 'exhibition_sections' | 'idealot_pictures'>;

type FlatExhibitionSectionWithoutRelations = ID &
  Omit<ExhibitionSection, 'exhibition' | 'exhibition_pictures'>;

type FlatPictureWithoutRelations = ID &
  Omit<
    Picture,
    | 'collections'
    | 'comments'
    | 'descriptions'
    | 'keyword_tags'
    | 'media'
    | 'time_range_tag'
    | 'verified_keyword_tags'
    | 'verified_time_range_tag'
    | 'verified_location_tags'
    | 'verified_person_tags'
    | 'location_tags'
    | 'person_tags'
    | 'linked_pictures'
    | 'linked_texts'
    | 'archive_tag'
    | 'picture_sequence'
  >;

export type FlatPictureSequenceWithoutRelations = ID & Omit<PictureSequence, 'pictures'>;

export type FlatPictureGeoInfo = ID &
  Omit<PictureGeoInfo, 'notAPlaceCount' | 'radius' | 'createdAt' | 'updatedAt'>;

export type FlatLocationTagWithoutRelations = ID &
  Omit<LocationTag, 'pictures' | 'verified_pictures'>;

export type FlatPersonTagWithoutRelations = ID & Omit<PersonTag, 'pictures' | 'verified_pictures'>;

export type FlatTimeRangeTagWithoutRelations = ID &
  Omit<TimeRangeTag, 'pictures' | 'verified_pictures'>;

export type FlatArchiveTagWithoutRelations = ID &
  Omit<ArchiveTag, 'pictures' | 'links' | 'showcasePicture' | 'logo'>;

export type FlatLinkWithoutRelations = ID & Omit<Link, 'archive_tag'>;

export type FlatFaceTagWithoutRelations = ID & Omit<FaceTag, 'person_tag' | 'picture'>;

export type FlatUsersPermissionsPermissionWithoutRelations = ID &
  Omit<UsersPermissionsPermission, 'role'>;

export type FlatUsersPermissionsRoleWithoutRelations = ID &
  Omit<UsersPermissionsRole, 'users' | 'permissions'>;

export type FlatUsersPermissionsUserWithoutRelations = ID & Omit<UsersPermissionsUser, 'role'>;

export type FlatParameterizedPermissionWithoutRelations = ID &
  Omit<ParameterizedPermission, 'users_permissions_user' | 'archive_tag'>;

export type FlatExhibitionSection = FlatExhibitionSectionWithoutRelations & {
  exhibition_pictures?: FlatExhibitionPicture[];
  exhibition?: FlatExhibition;
};

export type FlatExhibitionPicture = FlatExhibitionPictureWithoutRelations & {
  picture?: FlatPicture;
  exhibition_section?: FlatExhibitionSection;
  exhibition_idealot?: FlatExhibition;
};

export type FlatExhibition = FlatExhibitionWithoutRelations & {
  title_picture?: FlatExhibitionPicture;
  exhibition_sections?: FlatExhibitionSection[];
  idealot_pictures?: FlatExhibitionPicture[];
};

export type FlatComment = FlatCommentWithoutRelations & {
  picture?: FlatPictureWithoutRelations;
  parentComment?: FlatComment | null;
  childComments?: FlatComment[];
};

export type FlatDescription = FlatDescriptionWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatKeywordTag = FlatKeywordTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatLocationTag = FlatLocationTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatPersonTag = FlatPersonTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatTimeRangeTag = FlatTimeRangeTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatCollection = FlatCollectionWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
  child_collections?: FlatCollectionWithoutRelations[];
  parent_collections?: FlatCollectionWithoutRelations[];
};

export type FlatLink = FlatLinkWithoutRelations & {
  archive_tag?: FlatArchiveTagWithoutRelations;
};

export type FlatArchiveTag = FlatArchiveTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
  links?: FlatLinkWithoutRelations[];
  showcasePicture?: FlatPictureWithoutRelations;
  logo?: FlatUploadFile;
};

export type FlatPicture = FlatPictureWithoutRelations & {
  collections?: FlatCollectionWithoutRelations[];
  comments?: FlatCommentWithoutRelations[];
  descriptions?: FlatDescriptionWithoutRelations[];
  keyword_tags?: FlatKeywordTagWithoutRelations[];
  person_tags?: FlatPersonTagWithoutRelations[];
  location_tags?: FlatLocationTagWithoutRelations[];
  media?: FlatUploadFile;
  time_range_tag?: FlatTimeRangeTagWithoutRelations;
  linked_pictures?: FlatPictureWithoutRelations[];
  linked_texts?: FlatPictureWithoutRelations[];
  archive_tag?: FlatArchiveTagWithoutRelations;
  picture_sequence?: FlatPictureSequence;
};

export type FlatPictureSequence = FlatPictureSequenceWithoutRelations & {
  pictures?: FlatPicture[];
};

export type FlatUsersPermissionsPermission = FlatUsersPermissionsPermissionWithoutRelations & {
  role?: FlatUsersPermissionsRole;
};

export type FlatUsersPermissionsRole = FlatUsersPermissionsRoleWithoutRelations & {
  users?: FlatUsersPermissionsUser[];
  permissions?: FlatUsersPermissionsPermission[];
};

export type FlatUsersPermissionsUser = FlatUsersPermissionsUserWithoutRelations & {
  role?: FlatUsersPermissionsRole;
};

export type FlatParameterizedPermission = FlatParameterizedPermissionWithoutRelations & {
  users_permissions_user?: FlatUsersPermissionsUser;
  archive_tag?: FlatArchiveTag;
};

export type Thumbnail = {
  media?: FlatUploadFile;
};

export type FlatDecadeThumbnails = {
  [decadeKey: string]: Thumbnail[];
};

export type FlatFaceTag = FlatFaceTagWithoutRelations & {
  person_tag?: FlatPersonTagWithoutRelations;
  picture?: FlatPictureWithoutRelations;
};

export interface FlatTag {
  id: string;
  name: string;
  coordinates?: ComponentLocationCoordinates;
  synonyms?: (ComponentCommonSynonyms | undefined)[];
  visible?: boolean;
  parent_tags?: FlatTag[];
  child_tags?: FlatTag[];
  accepted?: boolean;
  root?: boolean;
  unacceptedSubtags?: number;
  markedTemporary?: boolean;
  markedPermanent?: boolean;
  isNew?: boolean;
}

export enum TagType {
  KEYWORD = 'keyword',
  PERSON = 'person',
  LOCATION = 'location',
  COLLECTION = 'collection',
  TIME_RANGE = 'date',
  ARCHIVE = 'archive',
}

export enum PictureOverviewType {
  MOST_LIKED = 'most-liked',
  CUSTOM = 'custom',
}
