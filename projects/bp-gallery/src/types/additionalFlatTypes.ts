import {
  ArchiveTag,
  Collection,
  Comment,
  ComponentCommonSynonyms,
  Description,
  KeywordTag,
  Link,
  LocationTag,
  PersonTag,
  Picture,
  Scalars,
  TimeRangeTag,
  UploadFile,
} from '../graphql/APIConnector';

type ID = { id: Scalars['ID'] };

export type FlatCollectionWithoutRelations = ID &
  Omit<Collection, 'pictures' | 'child_collections' | 'parent_collections'>;

type FlatCommentWithoutRelations = ID &
  Omit<Comment, 'picture' | 'parentComment' | 'childComments'>;

type FlatDescriptionWithoutRelations = ID & Omit<Description, 'pictures'>;

type FlatKeywordTagWithoutRelations = ID & Omit<KeywordTag, 'pictures' | 'verified_pictures'>;

type FlatUploadFile = ID & UploadFile;

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
    | 'archive_tag'
  >;

export type FlatLocationTagWithoutRelations = ID &
  Omit<LocationTag, 'pictures' | 'verified_pictures'>;

export type FlatPersonTagWithoutRelations = ID & Omit<PersonTag, 'pictures' | 'verified_pictures'>;

export type FlatTimeRangeTagWithoutRelations = ID &
  Omit<TimeRangeTag, 'pictures' | 'verified_pictures'>;

export type FlatArchiveTagWithoutRelations = ID &
  Omit<ArchiveTag, 'pictures' | 'links' | 'showcasePicture' | 'logo'>;

export type FlatLinkWithoutRelations = ID & Omit<Link, 'archive_tag'>;

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
  logo?: UploadFile;
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
  archive_tag?: FlatArchiveTagWithoutRelations;
};

export type Thumbnail = {
  media?: FlatUploadFile;
};

export type FlatDecadeThumbnails = {
  [decadeKey: string]: Thumbnail[];
};

export interface FlatTag {
  id: string;
  name: string;
  synonyms?: (ComponentCommonSynonyms | undefined)[];
  visible?: boolean;
}

export enum TagType {
  KEYWORD = 'keyword',
  PERSON = 'person',
  LOCATION = 'location',
  COLLECTION = 'collection',
  TIME_RANGE = 'date',
  ARCHIVE = 'archive',
}
