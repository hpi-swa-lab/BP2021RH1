import {
  Collection,
  Comment,
  Description,
  KeywordTag,
  LocationTag,
  PersonTag,
  Picture,
  Scalars,
  TimeRangeTag,
  UploadFile,
} from '../graphql/APIConnector';

type ID = { id: Scalars['ID'] };

type FlatCollectionWithoutRelations = ID &
  Omit<Collection, 'pictures' | 'child_collections' | 'parent_collections'>;

type FlatCommentWithoutRelations = ID & Omit<Comment, 'picture'>;

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
  >;

export type FlatLocationTagWithoutRelations = ID &
  Omit<LocationTag, 'pictures' | 'verified_pictures'>;

export type FlatPersonTagWithoutRelations = ID & Omit<PersonTag, 'pictures' | 'verified_pictures'>;

export type FlatTimeRangeTagWithoutRelations = ID &
  Omit<TimeRangeTag, 'pictures' | 'verified_pictures'>;

export type FlatComment = FlatCommentWithoutRelations & {
  picture?: FlatPictureWithoutRelations;
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

export type FlatPicture = FlatPictureWithoutRelations & {
  collections?: FlatCollectionWithoutRelations[];
  comments?: FlatCommentWithoutRelations[];
  descriptions?: FlatDescriptionWithoutRelations[];
  keyword_tags?: FlatKeywordTagWithoutRelations[];
  person_tags?: FlatPersonTagWithoutRelations[];
  location_tags?: FlatLocationTagWithoutRelations[];
  media?: FlatUploadFile;
  time_range_tag?: FlatTimeRangeTagWithoutRelations;
};

type Thumbnail = {
  media?: FlatUploadFile;
};

export type FlatKeywordTagSuggestion = FlatKeywordTagWithoutRelations & {
  thumbnail: Thumbnail[];
};

export type FlatDecadeThumbnails = {
  [decadeKey: string]: Thumbnail[];
};
