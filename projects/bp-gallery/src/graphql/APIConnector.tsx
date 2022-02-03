import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;

export type InputMaybe<T> = Maybe<T>;

export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  contains?: InputMaybe<Scalars['Boolean']>;
  containsi?: InputMaybe<Scalars['Boolean']>;
  endsWith?: InputMaybe<Scalars['Boolean']>;
  eq?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Boolean']>;
  gte?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  lt?: InputMaybe<Scalars['Boolean']>;
  lte?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
  not?: InputMaybe<BooleanFilterInput>;
  notContains?: InputMaybe<Scalars['Boolean']>;
  notContainsi?: InputMaybe<Scalars['Boolean']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  startsWith?: InputMaybe<Scalars['Boolean']>;
};

export type CategoryTag = {
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  pictures?: Maybe<PictureRelationResponseCollection>;
  priority: Scalars['Int'];
  publishedAt?: Maybe<Scalars['DateTime']>;
  related_tags?: Maybe<CategoryTagRelationResponseCollection>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type CategoryTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CategoryTagRelated_TagsArgs = {
  filters?: InputMaybe<CategoryTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CategoryTagEntity = {
  attributes?: Maybe<CategoryTag>;
  id?: Maybe<Scalars['ID']>;
};

export type CategoryTagEntityResponse = {
  data?: Maybe<CategoryTagEntity>;
};

export type CategoryTagEntityResponseCollection = {
  data: Array<CategoryTagEntity>;
  meta: ResponseCollectionMeta;
};

export type CategoryTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CategoryTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CategoryTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CategoryTagFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  priority?: InputMaybe<IntFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  related_tags?: InputMaybe<CategoryTagFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CategoryTagInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  priority?: InputMaybe<Scalars['Int']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  related_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type CategoryTagRelationResponseCollection = {
  data: Array<CategoryTagEntity>;
};

export type Comment = {
  author?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  date?: Maybe<Scalars['DateTime']>;
  picture?: Maybe<PictureEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  text?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type CommentEntity = {
  attributes?: Maybe<Comment>;
  id?: Maybe<Scalars['ID']>;
};

export type CommentEntityResponse = {
  data?: Maybe<CommentEntity>;
};

export type CommentEntityResponseCollection = {
  data: Array<CommentEntity>;
  meta: ResponseCollectionMeta;
};

export type CommentFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CommentFiltersInput>>>;
  author?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  date?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<CommentFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CommentFiltersInput>>>;
  picture?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  text?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CommentInput = {
  author?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['DateTime']>;
  picture?: InputMaybe<Scalars['ID']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
};

export type CommentRelationResponseCollection = {
  data: Array<CommentEntity>;
};

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  contains?: InputMaybe<Scalars['DateTime']>;
  containsi?: InputMaybe<Scalars['DateTime']>;
  endsWith?: InputMaybe<Scalars['DateTime']>;
  eq?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  ne?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars['DateTime']>;
  notContainsi?: InputMaybe<Scalars['DateTime']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  startsWith?: InputMaybe<Scalars['DateTime']>;
};

export type Description = {
  createdAt?: Maybe<Scalars['DateTime']>;
  pictures?: Maybe<PictureRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  text: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type DescriptionPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DescriptionEntity = {
  attributes?: Maybe<Description>;
  id?: Maybe<Scalars['ID']>;
};

export type DescriptionEntityResponse = {
  data?: Maybe<DescriptionEntity>;
};

export type DescriptionEntityResponseCollection = {
  data: Array<DescriptionEntity>;
  meta: ResponseCollectionMeta;
};

export type DescriptionFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<DescriptionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<DescriptionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<DescriptionFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  text?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type DescriptionInput = {
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
};

export type DescriptionRelationResponseCollection = {
  data: Array<DescriptionEntity>;
};

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars['String']>;
  caption?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  contains?: InputMaybe<Scalars['Float']>;
  containsi?: InputMaybe<Scalars['Float']>;
  endsWith?: InputMaybe<Scalars['Float']>;
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars['Float']>;
  notContainsi?: InputMaybe<Scalars['Float']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  startsWith?: InputMaybe<Scalars['Float']>;
};

export type GenericMorph =
  | CategoryTag
  | Comment
  | Description
  | KeywordTag
  | Picture
  | TimeRangeTag
  | Title
  | UploadFile
  | UsersPermissionsPermission
  | UsersPermissionsRole
  | UsersPermissionsUser;

export type IdFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  containsi?: InputMaybe<Scalars['ID']>;
  endsWith?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  gte?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  lt?: InputMaybe<Scalars['ID']>;
  lte?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  not?: InputMaybe<IdFilterInput>;
  notContains?: InputMaybe<Scalars['ID']>;
  notContainsi?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  startsWith?: InputMaybe<Scalars['ID']>;
};

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  contains?: InputMaybe<Scalars['Int']>;
  containsi?: InputMaybe<Scalars['Int']>;
  endsWith?: InputMaybe<Scalars['Int']>;
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<IntFilterInput>;
  notContains?: InputMaybe<Scalars['Int']>;
  notContainsi?: InputMaybe<Scalars['Int']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  startsWith?: InputMaybe<Scalars['Int']>;
};

export type JsonFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  contains?: InputMaybe<Scalars['JSON']>;
  containsi?: InputMaybe<Scalars['JSON']>;
  endsWith?: InputMaybe<Scalars['JSON']>;
  eq?: InputMaybe<Scalars['JSON']>;
  gt?: InputMaybe<Scalars['JSON']>;
  gte?: InputMaybe<Scalars['JSON']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  lt?: InputMaybe<Scalars['JSON']>;
  lte?: InputMaybe<Scalars['JSON']>;
  ne?: InputMaybe<Scalars['JSON']>;
  not?: InputMaybe<JsonFilterInput>;
  notContains?: InputMaybe<Scalars['JSON']>;
  notContainsi?: InputMaybe<Scalars['JSON']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  startsWith?: InputMaybe<Scalars['JSON']>;
};

export type KeywordTag = {
  createdAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  pictures?: Maybe<PictureRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type KeywordTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type KeywordTagEntity = {
  attributes?: Maybe<KeywordTag>;
  id?: Maybe<Scalars['ID']>;
};

export type KeywordTagEntityResponse = {
  data?: Maybe<KeywordTagEntity>;
};

export type KeywordTagEntityResponseCollection = {
  data: Array<KeywordTagEntity>;
  meta: ResponseCollectionMeta;
};

export type KeywordTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<KeywordTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<KeywordTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<KeywordTagFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type KeywordTagInput = {
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
};

export type KeywordTagRelationResponseCollection = {
  data: Array<KeywordTagEntity>;
};

export type Mutation = {
  createCategoryTag?: Maybe<CategoryTagEntityResponse>;
  createComment?: Maybe<CommentEntityResponse>;
  createDescription?: Maybe<DescriptionEntityResponse>;
  createKeywordTag?: Maybe<KeywordTagEntityResponse>;
  createPicture?: Maybe<PictureEntityResponse>;
  createTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  createTitle?: Maybe<TitleEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteCategoryTag?: Maybe<CategoryTagEntityResponse>;
  deleteComment?: Maybe<CommentEntityResponse>;
  deleteDescription?: Maybe<DescriptionEntityResponse>;
  deleteKeywordTag?: Maybe<KeywordTagEntityResponse>;
  deletePicture?: Maybe<PictureEntityResponse>;
  deleteTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  deleteTitle?: Maybe<TitleEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Update an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  removeFile?: Maybe<UploadFileEntityResponse>;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateCategoryTag?: Maybe<CategoryTagEntityResponse>;
  updateComment?: Maybe<CommentEntityResponse>;
  updateDescription?: Maybe<DescriptionEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateKeywordTag?: Maybe<KeywordTagEntityResponse>;
  updatePicture?: Maybe<PictureEntityResponse>;
  updateTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  updateTitle?: Maybe<TitleEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  upload: UploadFileEntityResponse;
};

export type MutationCreateCategoryTagArgs = {
  data: CategoryTagInput;
};

export type MutationCreateCommentArgs = {
  data: CommentInput;
};

export type MutationCreateDescriptionArgs = {
  data: DescriptionInput;
};

export type MutationCreateKeywordTagArgs = {
  data: KeywordTagInput;
};

export type MutationCreatePictureArgs = {
  data: PictureInput;
};

export type MutationCreateTimeRangeTagArgs = {
  data: TimeRangeTagInput;
};

export type MutationCreateTitleArgs = {
  data: TitleInput;
};

export type MutationCreateUploadFileArgs = {
  data: UploadFileInput;
};

export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};

export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};

export type MutationDeleteCategoryTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteCommentArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteDescriptionArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteKeywordTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePictureArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTimeRangeTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTitleArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars['ID'];
};

export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String'];
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};

export type MutationMultipleUploadArgs = {
  field?: InputMaybe<Scalars['String']>;
  files: Array<InputMaybe<Scalars['Upload']>>;
  ref?: InputMaybe<Scalars['String']>;
  refId?: InputMaybe<Scalars['ID']>;
};

export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};

export type MutationRemoveFileArgs = {
  id: Scalars['ID'];
};

export type MutationResetPasswordArgs = {
  code: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type MutationUpdateCategoryTagArgs = {
  data: CategoryTagInput;
  id: Scalars['ID'];
};

export type MutationUpdateCommentArgs = {
  data: CommentInput;
  id: Scalars['ID'];
};

export type MutationUpdateDescriptionArgs = {
  data: DescriptionInput;
  id: Scalars['ID'];
};

export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID'];
  info?: InputMaybe<FileInfoInput>;
};

export type MutationUpdateKeywordTagArgs = {
  data: KeywordTagInput;
  id: Scalars['ID'];
};

export type MutationUpdatePictureArgs = {
  data: PictureInput;
  id: Scalars['ID'];
};

export type MutationUpdateTimeRangeTagArgs = {
  data: TimeRangeTagInput;
  id: Scalars['ID'];
};

export type MutationUpdateTitleArgs = {
  data: TitleInput;
  id: Scalars['ID'];
};

export type MutationUpdateUploadFileArgs = {
  data: UploadFileInput;
  id: Scalars['ID'];
};

export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars['ID'];
};

export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars['ID'];
};

export type MutationUploadArgs = {
  field?: InputMaybe<Scalars['String']>;
  file: Scalars['Upload'];
  info?: InputMaybe<FileInfoInput>;
  ref?: InputMaybe<Scalars['String']>;
  refId?: InputMaybe<Scalars['ID']>;
};

export type Pagination = {
  page: Scalars['Int'];
  pageCount: Scalars['Int'];
  pageSize: Scalars['Int'];
  total: Scalars['Int'];
};

export type PaginationArg = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  start?: InputMaybe<Scalars['Int']>;
};

export type Picture = {
  category_tags?: Maybe<CategoryTagRelationResponseCollection>;
  comments?: Maybe<CommentRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  descriptions?: Maybe<DescriptionRelationResponseCollection>;
  keyword_tags?: Maybe<KeywordTagRelationResponseCollection>;
  media?: Maybe<UploadFileEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  time_range_tag?: Maybe<TimeRangeTagEntityResponse>;
  title?: Maybe<TitleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  wordpress_id?: Maybe<Scalars['Int']>;
};

export type PictureCategory_TagsArgs = {
  filters?: InputMaybe<CategoryTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureCommentsArgs = {
  filters?: InputMaybe<CommentFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureDescriptionsArgs = {
  filters?: InputMaybe<DescriptionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureKeyword_TagsArgs = {
  filters?: InputMaybe<KeywordTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureEntity = {
  attributes?: Maybe<Picture>;
  id?: Maybe<Scalars['ID']>;
};

export type PictureEntityResponse = {
  data?: Maybe<PictureEntity>;
};

export type PictureEntityResponseCollection = {
  data: Array<PictureEntity>;
  meta: ResponseCollectionMeta;
};

export type PictureFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PictureFiltersInput>>>;
  category_tags?: InputMaybe<CategoryTagFiltersInput>;
  comments?: InputMaybe<CommentFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  descriptions?: InputMaybe<DescriptionFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  keyword_tags?: InputMaybe<KeywordTagFiltersInput>;
  not?: InputMaybe<PictureFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PictureFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  time_range_tag?: InputMaybe<TimeRangeTagFiltersInput>;
  title?: InputMaybe<TitleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  wordpress_id?: InputMaybe<IntFilterInput>;
};

export type PictureInput = {
  category_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  comments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  descriptions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  keyword_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  media?: InputMaybe<Scalars['ID']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  time_range_tag?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['ID']>;
  wordpress_id?: InputMaybe<Scalars['Int']>;
};

export type PictureRelationResponseCollection = {
  data: Array<PictureEntity>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW',
}

export type Query = {
  categoryTag?: Maybe<CategoryTagEntityResponse>;
  categoryTags?: Maybe<CategoryTagEntityResponseCollection>;
  comment?: Maybe<CommentEntityResponse>;
  comments?: Maybe<CommentEntityResponseCollection>;
  description?: Maybe<DescriptionEntityResponse>;
  descriptions?: Maybe<DescriptionEntityResponseCollection>;
  keywordTag?: Maybe<KeywordTagEntityResponse>;
  keywordTags?: Maybe<KeywordTagEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  picture?: Maybe<PictureEntityResponse>;
  pictures?: Maybe<PictureEntityResponseCollection>;
  timeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  timeRangeTags?: Maybe<TimeRangeTagEntityResponseCollection>;
  title?: Maybe<TitleEntityResponse>;
  titles?: Maybe<TitleEntityResponseCollection>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};

export type QueryCategoryTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryCategoryTagsArgs = {
  filters?: InputMaybe<CategoryTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryCommentArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryCommentsArgs = {
  filters?: InputMaybe<CommentFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDescriptionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryDescriptionsArgs = {
  filters?: InputMaybe<DescriptionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryKeywordTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryKeywordTagsArgs = {
  filters?: InputMaybe<KeywordTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryPictureArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTimeRangeTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryTimeRangeTagsArgs = {
  filters?: InputMaybe<TimeRangeTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTitleArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryTitlesArgs = {
  filters?: InputMaybe<TitleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryUploadFileArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryUsersPermissionsRoleArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryUsersPermissionsUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ResponseCollectionMeta = {
  pagination: Pagination;
};

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  containsi?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  not?: InputMaybe<StringFilterInput>;
  notContains?: InputMaybe<Scalars['String']>;
  notContainsi?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  notNull?: InputMaybe<Scalars['Boolean']>;
  null?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type TimeRangeTag = {
  createdAt?: Maybe<Scalars['DateTime']>;
  end?: Maybe<Scalars['DateTime']>;
  pictures?: Maybe<PictureRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  start?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type TimeRangeTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TimeRangeTagEntity = {
  attributes?: Maybe<TimeRangeTag>;
  id?: Maybe<Scalars['ID']>;
};

export type TimeRangeTagEntityResponse = {
  data?: Maybe<TimeRangeTagEntity>;
};

export type TimeRangeTagEntityResponseCollection = {
  data: Array<TimeRangeTagEntity>;
  meta: ResponseCollectionMeta;
};

export type TimeRangeTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<TimeRangeTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  end?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<TimeRangeTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TimeRangeTagFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  start?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type TimeRangeTagInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
};

export type Title = {
  createdAt?: Maybe<Scalars['DateTime']>;
  pictures?: Maybe<PictureRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  text?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type TitlePicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TitleEntity = {
  attributes?: Maybe<Title>;
  id?: Maybe<Scalars['ID']>;
};

export type TitleEntityResponse = {
  data?: Maybe<TitleEntity>;
};

export type TitleEntityResponseCollection = {
  data: Array<TitleEntity>;
  meta: ResponseCollectionMeta;
};

export type TitleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<TitleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<TitleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TitleFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  text?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type TitleInput = {
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
};

export type UploadFile = {
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  ext?: Maybe<Scalars['String']>;
  formats?: Maybe<Scalars['JSON']>;
  hash: Scalars['String'];
  height?: Maybe<Scalars['Int']>;
  mime: Scalars['String'];
  name: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars['Float'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};

export type UploadFileEntity = {
  attributes?: Maybe<UploadFile>;
  id?: Maybe<Scalars['ID']>;
};

export type UploadFileEntityResponse = {
  data?: Maybe<UploadFileEntity>;
};

export type UploadFileEntityResponseCollection = {
  data: Array<UploadFileEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UploadFileInput = {
  alternativeText?: InputMaybe<Scalars['String']>;
  caption?: InputMaybe<Scalars['String']>;
  ext?: InputMaybe<Scalars['String']>;
  formats?: InputMaybe<Scalars['JSON']>;
  hash?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Int']>;
  mime?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  previewUrl?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  provider_metadata?: InputMaybe<Scalars['JSON']>;
  size?: InputMaybe<Scalars['Float']>;
  url?: InputMaybe<Scalars['String']>;
  width?: InputMaybe<Scalars['Int']>;
};

export type UsersPermissionsCreateRolePayload = {
  ok: Scalars['Boolean'];
};

export type UsersPermissionsDeleteRolePayload = {
  ok: Scalars['Boolean'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String'];
  password: Scalars['String'];
  provider?: Scalars['String'];
};

export type UsersPermissionsLoginPayload = {
  jwt?: Maybe<Scalars['String']>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  blocked?: Maybe<Scalars['Boolean']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  role?: Maybe<UsersPermissionsMeRole>;
  username: Scalars['String'];
};

export type UsersPermissionsMeRole = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type UsersPermissionsPasswordPayload = {
  ok: Scalars['Boolean'];
};

export type UsersPermissionsPermission = {
  action: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UsersPermissionsPermissionEntity = {
  attributes?: Maybe<UsersPermissionsPermission>;
  id?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  data: Array<UsersPermissionsPermissionEntity>;
};

export type UsersPermissionsRegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UsersPermissionsRole = {
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  users?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};

export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UsersPermissionsRoleEntity = {
  attributes?: Maybe<UsersPermissionsRole>;
  id?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsRoleEntityResponse = {
  data?: Maybe<UsersPermissionsRoleEntity>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  data: Array<UsersPermissionsRoleEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  type?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type UsersPermissionsUpdateRolePayload = {
  ok: Scalars['Boolean'];
};

export type UsersPermissionsUser = {
  blocked?: Maybe<Scalars['Boolean']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
  role?: Maybe<UsersPermissionsRoleEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username: Scalars['String'];
};

export type UsersPermissionsUserEntity = {
  attributes?: Maybe<UsersPermissionsUser>;
  id?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsUserEntityResponse = {
  data?: Maybe<UsersPermissionsUserEntity>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  data: Array<UsersPermissionsUserEntity>;
  meta: ResponseCollectionMeta;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmationToken?: InputMaybe<StringFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  password?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  resetPasswordToken?: InputMaybe<StringFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']>;
  confirmationToken?: InputMaybe<Scalars['String']>;
  confirmed?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  resetPasswordToken?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  data: Array<UsersPermissionsUserEntity>;
};

export type GetPictureInfoQueryVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type GetPictureInfoQuery = {
  picture?:
    | {
        data?:
          | {
              id?: string | null | undefined;
              attributes?:
                | {
                    title?:
                      | {
                          data?:
                            | {
                                id?: string | null | undefined;
                                attributes?:
                                  | { text?: string | null | undefined }
                                  | null
                                  | undefined;
                              }
                            | null
                            | undefined;
                        }
                      | null
                      | undefined;
                    descriptions?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?: { text: string } | null | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    time_range_tag?:
                      | {
                          data?:
                            | {
                                id?: string | null | undefined;
                                attributes?:
                                  | { start?: any | null | undefined; end?: any | null | undefined }
                                  | null
                                  | undefined;
                              }
                            | null
                            | undefined;
                        }
                      | null
                      | undefined;
                    media?:
                      | {
                          data?:
                            | { attributes?: { url: string } | null | undefined }
                            | null
                            | undefined;
                        }
                      | null
                      | undefined;
                    comments?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | {
                                  text?: string | null | undefined;
                                  author?: string | null | undefined;
                                  date?: any | null | undefined;
                                }
                              | null
                              | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetPicturesQueryVariables = Exact<{
  filters: PictureFiltersInput;
  pagination: PaginationArg;
}>;

export type GetPicturesQuery = {
  pictures?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                media?:
                  | {
                      data?:
                        | {
                            attributes?:
                              | {
                                  width?: number | null | undefined;
                                  height?: number | null | undefined;
                                  formats?: any | null | undefined;
                                }
                              | null
                              | undefined;
                          }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type GetCategoryTagsWithPicturesPublishedAfterQueryVariables = Exact<{
  date: Scalars['DateTime'];
}>;

export type GetCategoryTagsWithPicturesPublishedAfterQuery = {
  categoryTags?: { data: Array<{ id?: string | null | undefined }> } | null | undefined;
};

export type GetCategoryInfoQueryVariables = Exact<{
  categoryName?: InputMaybe<Scalars['String']>;
  categoryPriority?: InputMaybe<Scalars['Int']>;
}>;

export type GetCategoryInfoQuery = {
  categoryTags?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                name: string;
                description?: string | null | undefined;
                related_tags?:
                  | {
                      data: Array<{
                        id?: string | null | undefined;
                        attributes?:
                          | {
                              name: string;
                              thumbnail?:
                                | {
                                    data: Array<{
                                      attributes?:
                                        | {
                                            media?:
                                              | {
                                                  data?:
                                                    | {
                                                        attributes?:
                                                          | { formats?: any | null | undefined }
                                                          | null
                                                          | undefined;
                                                      }
                                                    | null
                                                    | undefined;
                                                }
                                              | null
                                              | undefined;
                                          }
                                        | null
                                        | undefined;
                                    }>;
                                  }
                                | null
                                | undefined;
                            }
                          | null
                          | undefined;
                      }>;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type PostCommentMutationVariables = Exact<{
  id: Scalars['ID'];
  author: Scalars['String'];
  text: Scalars['String'];
  date: Scalars['DateTime'];
}>;

export type PostCommentMutation = {
  createComment?:
    | {
        data?:
          | { attributes?: { text?: string | null | undefined } | null | undefined }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdatePictureTitleMutationVariables = Exact<{
  picture: Scalars['ID'];
  title: Scalars['ID'];
}>;

export type UpdatePictureTitleMutation = {
  updatePicture?:
    | {
        data?:
          | {
              id?: string | null | undefined;
              attributes?:
                | {
                    title?:
                      | { data?: { id?: string | null | undefined } | null | undefined }
                      | null
                      | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetKeywordTagSuggestionsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
}>;

export type GetKeywordTagSuggestionsQuery = {
  keywordTags?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                name: string;
                thumbnail?:
                  | {
                      data: Array<{
                        attributes?:
                          | {
                              media?:
                                | {
                                    data?:
                                      | {
                                          attributes?:
                                            | { formats?: any | null | undefined }
                                            | null
                                            | undefined;
                                        }
                                      | null
                                      | undefined;
                                  }
                                | null
                                | undefined;
                            }
                          | null
                          | undefined;
                      }>;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type GetDecadePreviewThumbnailsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDecadePreviewThumbnailsQuery = {
  s40?:
    | {
        data: Array<{
          attributes?:
            | {
                media?:
                  | {
                      data?:
                        | { attributes?: { formats?: any | null | undefined } | null | undefined }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
  s50?:
    | {
        data: Array<{
          attributes?:
            | {
                media?:
                  | {
                      data?:
                        | { attributes?: { formats?: any | null | undefined } | null | undefined }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
  s60?:
    | {
        data: Array<{
          attributes?:
            | {
                media?:
                  | {
                      data?:
                        | { attributes?: { formats?: any | null | undefined } | null | undefined }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
  s70?:
    | {
        data: Array<{
          attributes?:
            | {
                media?:
                  | {
                      data?:
                        | { attributes?: { formats?: any | null | undefined } | null | undefined }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
  s80?:
    | {
        data: Array<{
          attributes?:
            | {
                media?:
                  | {
                      data?:
                        | { attributes?: { formats?: any | null | undefined } | null | undefined }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
  s90?:
    | {
        data: Array<{
          attributes?:
            | {
                media?:
                  | {
                      data?:
                        | { attributes?: { formats?: any | null | undefined } | null | undefined }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = { login: { jwt?: string | null | undefined } };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  me?:
    | {
        username: string;
        email?: string | null | undefined;
        role?: { name: string } | null | undefined;
      }
    | null
    | undefined;
};

export const GetPictureInfoDocument = gql`
  query getPictureInfo($pictureId: ID!) {
    picture(id: $pictureId) {
      data {
        id
        attributes {
          title {
            data {
              id
              attributes {
                text
              }
            }
          }
          descriptions {
            data {
              id
              attributes {
                text
              }
            }
          }
          time_range_tag {
            data {
              id
              attributes {
                start
                end
              }
            }
          }
          media {
            data {
              attributes {
                url
              }
            }
          }
          comments {
            data {
              id
              attributes {
                text
                author
                date
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetPictureInfoQuery__
 *
 * To run a query within a React component, call `useGetPictureInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPictureInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPictureInfoQuery({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *   },
 * });
 */
export function useGetPictureInfoQuery(
  baseOptions: Apollo.QueryHookOptions<GetPictureInfoQuery, GetPictureInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPictureInfoQuery, GetPictureInfoQueryVariables>(
    GetPictureInfoDocument,
    options
  );
}

export function useGetPictureInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPictureInfoQuery, GetPictureInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPictureInfoQuery, GetPictureInfoQueryVariables>(
    GetPictureInfoDocument,
    options
  );
}

export type GetPictureInfoQueryHookResult = ReturnType<typeof useGetPictureInfoQuery>;

export type GetPictureInfoLazyQueryHookResult = ReturnType<typeof useGetPictureInfoLazyQuery>;

export type GetPictureInfoQueryResult = Apollo.QueryResult<
  GetPictureInfoQuery,
  GetPictureInfoQueryVariables
>;

export const GetPicturesDocument = gql`
  query getPictures($filters: PictureFiltersInput!, $pagination: PaginationArg!) {
    pictures(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          media {
            data {
              attributes {
                width
                height
                formats
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetPicturesQuery__
 *
 * To run a query within a React component, call `useGetPicturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPicturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPicturesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetPicturesQuery(
  baseOptions: Apollo.QueryHookOptions<GetPicturesQuery, GetPicturesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPicturesQuery, GetPicturesQueryVariables>(GetPicturesDocument, options);
}

export function useGetPicturesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPicturesQuery, GetPicturesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPicturesQuery, GetPicturesQueryVariables>(
    GetPicturesDocument,
    options
  );
}

export type GetPicturesQueryHookResult = ReturnType<typeof useGetPicturesQuery>;

export type GetPicturesLazyQueryHookResult = ReturnType<typeof useGetPicturesLazyQuery>;

export type GetPicturesQueryResult = Apollo.QueryResult<
  GetPicturesQuery,
  GetPicturesQueryVariables
>;

export const GetCategoryTagsWithPicturesPublishedAfterDocument = gql`
  query getCategoryTagsWithPicturesPublishedAfter($date: DateTime!) {
    categoryTags(filters: { pictures: { publishedAt: { gt: $date } } }) {
      data {
        id
      }
    }
  }
`;

/**
 * __useGetCategoryTagsWithPicturesPublishedAfterQuery__
 *
 * To run a query within a React component, call `useGetCategoryTagsWithPicturesPublishedAfterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryTagsWithPicturesPublishedAfterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryTagsWithPicturesPublishedAfterQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useGetCategoryTagsWithPicturesPublishedAfterQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCategoryTagsWithPicturesPublishedAfterQuery,
    GetCategoryTagsWithPicturesPublishedAfterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCategoryTagsWithPicturesPublishedAfterQuery,
    GetCategoryTagsWithPicturesPublishedAfterQueryVariables
  >(GetCategoryTagsWithPicturesPublishedAfterDocument, options);
}

export function useGetCategoryTagsWithPicturesPublishedAfterLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCategoryTagsWithPicturesPublishedAfterQuery,
    GetCategoryTagsWithPicturesPublishedAfterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCategoryTagsWithPicturesPublishedAfterQuery,
    GetCategoryTagsWithPicturesPublishedAfterQueryVariables
  >(GetCategoryTagsWithPicturesPublishedAfterDocument, options);
}

export type GetCategoryTagsWithPicturesPublishedAfterQueryHookResult = ReturnType<
  typeof useGetCategoryTagsWithPicturesPublishedAfterQuery
>;

export type GetCategoryTagsWithPicturesPublishedAfterLazyQueryHookResult = ReturnType<
  typeof useGetCategoryTagsWithPicturesPublishedAfterLazyQuery
>;

export type GetCategoryTagsWithPicturesPublishedAfterQueryResult = Apollo.QueryResult<
  GetCategoryTagsWithPicturesPublishedAfterQuery,
  GetCategoryTagsWithPicturesPublishedAfterQueryVariables
>;

export const GetCategoryInfoDocument = gql`
  query getCategoryInfo($categoryName: String, $categoryPriority: Int) {
    categoryTags(filters: { name: { eq: $categoryName }, priority: { eq: $categoryPriority } }) {
      data {
        id
        attributes {
          name
          description
          related_tags {
            data {
              id
              attributes {
                name
                thumbnail: pictures(pagination: { limit: 1 }) {
                  data {
                    attributes {
                      media {
                        data {
                          attributes {
                            formats
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetCategoryInfoQuery__
 *
 * To run a query within a React component, call `useGetCategoryInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryInfoQuery({
 *   variables: {
 *      categoryName: // value for 'categoryName'
 *      categoryPriority: // value for 'categoryPriority'
 *   },
 * });
 */
export function useGetCategoryInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCategoryInfoQuery, GetCategoryInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCategoryInfoQuery, GetCategoryInfoQueryVariables>(
    GetCategoryInfoDocument,
    options
  );
}

export function useGetCategoryInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryInfoQuery, GetCategoryInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCategoryInfoQuery, GetCategoryInfoQueryVariables>(
    GetCategoryInfoDocument,
    options
  );
}

export type GetCategoryInfoQueryHookResult = ReturnType<typeof useGetCategoryInfoQuery>;

export type GetCategoryInfoLazyQueryHookResult = ReturnType<typeof useGetCategoryInfoLazyQuery>;

export type GetCategoryInfoQueryResult = Apollo.QueryResult<
  GetCategoryInfoQuery,
  GetCategoryInfoQueryVariables
>;

export const PostCommentDocument = gql`
  mutation postComment($id: ID!, $author: String!, $text: String!, $date: DateTime!) {
    createComment(
      data: { author: $author, text: $text, date: $date, picture: $id, publishedAt: null }
    ) {
      data {
        attributes {
          text
        }
      }
    }
  }
`;

export type PostCommentMutationFn = Apollo.MutationFunction<
  PostCommentMutation,
  PostCommentMutationVariables
>;

/**
 * __usePostCommentMutation__
 *
 * To run a mutation, you first call `usePostCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postCommentMutation, { data, loading, error }] = usePostCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      author: // value for 'author'
 *      text: // value for 'text'
 *      date: // value for 'date'
 *   },
 * });
 */
export function usePostCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<PostCommentMutation, PostCommentMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PostCommentMutation, PostCommentMutationVariables>(
    PostCommentDocument,
    options
  );
}

export type PostCommentMutationHookResult = ReturnType<typeof usePostCommentMutation>;

export type PostCommentMutationResult = Apollo.MutationResult<PostCommentMutation>;

export type PostCommentMutationOptions = Apollo.BaseMutationOptions<
  PostCommentMutation,
  PostCommentMutationVariables
>;

export const UpdatePictureTitleDocument = gql`
  mutation updatePictureTitle($picture: ID!, $title: ID!) {
    updatePicture(id: $picture, data: { title: $title }) {
      data {
        id
        attributes {
          title {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export type UpdatePictureTitleMutationFn = Apollo.MutationFunction<
  UpdatePictureTitleMutation,
  UpdatePictureTitleMutationVariables
>;

/**
 * __useUpdatePictureTitleMutation__
 *
 * To run a mutation, you first call `useUpdatePictureTitleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePictureTitleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePictureTitleMutation, { data, loading, error }] = useUpdatePictureTitleMutation({
 *   variables: {
 *      picture: // value for 'picture'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdatePictureTitleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePictureTitleMutation,
    UpdatePictureTitleMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdatePictureTitleMutation, UpdatePictureTitleMutationVariables>(
    UpdatePictureTitleDocument,
    options
  );
}

export type UpdatePictureTitleMutationHookResult = ReturnType<typeof useUpdatePictureTitleMutation>;

export type UpdatePictureTitleMutationResult = Apollo.MutationResult<UpdatePictureTitleMutation>;

export type UpdatePictureTitleMutationOptions = Apollo.BaseMutationOptions<
  UpdatePictureTitleMutation,
  UpdatePictureTitleMutationVariables
>;

export const GetKeywordTagSuggestionsDocument = gql`
  query getKeywordTagSuggestions($name: String) {
    keywordTags(filters: { name: { containsi: $name } }) {
      data {
        id
        attributes {
          name
          thumbnail: pictures(pagination: { limit: 1 }) {
            data {
              attributes {
                media {
                  data {
                    attributes {
                      formats
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetKeywordTagSuggestionsQuery__
 *
 * To run a query within a React component, call `useGetKeywordTagSuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetKeywordTagSuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetKeywordTagSuggestionsQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetKeywordTagSuggestionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetKeywordTagSuggestionsQuery,
    GetKeywordTagSuggestionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetKeywordTagSuggestionsQuery, GetKeywordTagSuggestionsQueryVariables>(
    GetKeywordTagSuggestionsDocument,
    options
  );
}

export function useGetKeywordTagSuggestionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetKeywordTagSuggestionsQuery,
    GetKeywordTagSuggestionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetKeywordTagSuggestionsQuery, GetKeywordTagSuggestionsQueryVariables>(
    GetKeywordTagSuggestionsDocument,
    options
  );
}

export type GetKeywordTagSuggestionsQueryHookResult = ReturnType<
  typeof useGetKeywordTagSuggestionsQuery
>;

export type GetKeywordTagSuggestionsLazyQueryHookResult = ReturnType<
  typeof useGetKeywordTagSuggestionsLazyQuery
>;

export type GetKeywordTagSuggestionsQueryResult = Apollo.QueryResult<
  GetKeywordTagSuggestionsQuery,
  GetKeywordTagSuggestionsQueryVariables
>;

export const GetDecadePreviewThumbnailsDocument = gql`
  query getDecadePreviewThumbnails {
    s40: pictures(
      filters: {
        time_range_tag: {
          start: { gte: "1900-01-01T00:00:00Z" }
          end: { lte: "1949-12-31T23:59:59Z" }
        }
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
    s50: pictures(
      filters: {
        time_range_tag: {
          start: { gte: "1950-01-01T00:00:00Z" }
          end: { lte: "1959-12-31T23:59:59Z" }
        }
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
    s60: pictures(
      filters: {
        time_range_tag: {
          start: { gte: "1960-01-01T00:00:00Z" }
          end: { lte: "1969-12-31T23:59:59Z" }
        }
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
    s70: pictures(
      filters: {
        time_range_tag: {
          start: { gte: "1970-01-01T00:00:00Z" }
          end: { lte: "1979-12-31T23:59:59Z" }
        }
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
    s80: pictures(
      filters: {
        time_range_tag: {
          start: { gte: "1980-01-01T00:00:00Z" }
          end: { lte: "1989-12-31T23:59:59Z" }
        }
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
    s90: pictures(
      filters: {
        time_range_tag: {
          start: { gte: "1990-01-01T00:00:00Z" }
          end: { lte: "1999-12-31T23:59:59Z" }
        }
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetDecadePreviewThumbnailsQuery__
 *
 * To run a query within a React component, call `useGetDecadePreviewThumbnailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDecadePreviewThumbnailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDecadePreviewThumbnailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDecadePreviewThumbnailsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDecadePreviewThumbnailsQuery,
    GetDecadePreviewThumbnailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDecadePreviewThumbnailsQuery, GetDecadePreviewThumbnailsQueryVariables>(
    GetDecadePreviewThumbnailsDocument,
    options
  );
}

export function useGetDecadePreviewThumbnailsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDecadePreviewThumbnailsQuery,
    GetDecadePreviewThumbnailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetDecadePreviewThumbnailsQuery,
    GetDecadePreviewThumbnailsQueryVariables
  >(GetDecadePreviewThumbnailsDocument, options);
}

export type GetDecadePreviewThumbnailsQueryHookResult = ReturnType<
  typeof useGetDecadePreviewThumbnailsQuery
>;

export type GetDecadePreviewThumbnailsLazyQueryHookResult = ReturnType<
  typeof useGetDecadePreviewThumbnailsLazyQuery
>;

export type GetDecadePreviewThumbnailsQueryResult = Apollo.QueryResult<
  GetDecadePreviewThumbnailsQuery,
  GetDecadePreviewThumbnailsQueryVariables
>;

export const LoginDocument = gql`
  mutation login($username: String!, $password: String!) {
    login(input: { identifier: $username, password: $password }) {
      jwt
    }
  }
`;

export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}

export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;

export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;

export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;

export const MeDocument = gql`
  query me {
    me {
      role {
        name
      }
      username
      email
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}

export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}

export type MeQueryHookResult = ReturnType<typeof useMeQuery>;

export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;

export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
