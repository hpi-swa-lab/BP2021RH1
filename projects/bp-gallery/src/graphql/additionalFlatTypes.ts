import {
  CategoryTag,
  Comment,
  Description,
  KeywordTag,
  Picture,
  Scalars,
  TimeRangeTag,
  Title,
  UploadFile,
} from './APIConnector';

type ID = { id: Scalars['ID'] };

type FlatCategoryTagWithoutRelations = ID & Omit<CategoryTag, 'pictures' | 'related_tags'>;

type FlatCommentWithoutRelations = ID & Omit<Comment, 'picture'>;

type FlatDescriptionWithoutRelations = ID & Omit<Description, 'pictures'>;

type FlatKeywordTagWithoutRelations = ID & Omit<KeywordTag, 'pictures'>;

type FlatPictureWithoutRelations = ID &
  Omit<
    Picture,
    | 'category_tags'
    | 'comments'
    | 'descriptions'
    | 'keyword_tags'
    | 'media'
    | 'time_range_tag'
    | 'title'
  >;

type FlatTimeRangeTagWithoutRelations = ID & Omit<TimeRangeTag, 'pictures'>;

type FlatTitleWithoutRelations = ID & Omit<Title, 'pictures'>;

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

export type FlatTitle = FlatTitleWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
};

export type FlatCategoryTag = FlatCategoryTagWithoutRelations & {
  pictures?: FlatPictureWithoutRelations[];
  related_tags?: FlatCategoryTagWithoutRelations[];
};

export type FlatPicture = FlatPictureWithoutRelations & {
  category_tags?: FlatCategoryTagWithoutRelations[];
  comments?: FlatCommentWithoutRelations[];
  descriptions?: FlatDescriptionWithoutRelations[];
  keyword_tags?: FlatKeywordTagWithoutRelations[];
  media?: UploadFile;
  time_range_tag?: FlatTimeRangeTagWithoutRelations;
  title?: FlatTitleWithoutRelations;
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
