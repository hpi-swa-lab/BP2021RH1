import {
  Collection,
  Comment,
  Description,
  KeywordTag,
  Picture,
  Scalars,
  TimeRangeTag,
  UploadFile,
} from './APIConnector';

type ID = { id: Scalars['ID'] };

type FlatCollectionWithoutRelations = ID & Omit<Collection, 'pictures' | 'child_collections'>;

type FlatCommentWithoutRelations = ID & Omit<Comment, 'picture'>;

type FlatDescriptionWithoutRelations = ID & Omit<Description, 'pictures'>;

type FlatKeywordTagWithoutRelations = ID & Omit<KeywordTag, 'pictures'>;

type FlatPictureWithoutRelations = ID &
  Omit<
    Picture,
    'collections' | 'comments' | 'descriptions' | 'keyword_tags' | 'media' | 'time_range_tag'
  >;

type FlatTimeRangeTagWithoutRelations = ID & Omit<TimeRangeTag, 'pictures'>;

export type FlatComment = FlatCommentWithoutRelations & {
  picture?: FlatPictureWithoutRelations;
};

export type FlatDescription = FlatDescriptionWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatKeywordTag = FlatKeywordTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatTimeRangeTag = FlatTimeRangeTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatCollection = FlatCollectionWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
  child_collections?: FlatCollectionWithoutRelations[];
};

export type FlatPicture = FlatPictureWithoutRelations & {
  collections?: FlatCollectionWithoutRelations[];
  comments?: FlatCommentWithoutRelations[];
  descriptions?: FlatDescriptionWithoutRelations[];
  keyword_tags?: FlatKeywordTagWithoutRelations[];
  media?: UploadFile;
  time_range_tag?: FlatTimeRangeTagWithoutRelations;
};

type Thumbnail = {
  media?: UploadFile;
};

export type FlatKeywordTagSuggestion = FlatKeywordTagWithoutRelations & {
  thumbnail: Thumbnail[];
};

export type FlatDecadeThumbnails = {
  [decadeKey: string]: Thumbnail[];
};
