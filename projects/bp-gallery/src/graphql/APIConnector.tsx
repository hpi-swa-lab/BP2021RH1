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
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `Long` scalar type represents 52-bit integers */
  Long: any;
  /** A time string with format: HH:mm:ss.SSS */
  Time: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AdminUser = {
  firstname: Scalars['String'];
  id: Scalars['ID'];
  lastname: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};

export type CategoryTag = {
  created_at: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  pictures?: Maybe<Array<Maybe<Picture>>>;
  priority: Scalars['Int'];
  published_at?: Maybe<Scalars['DateTime']>;
  related_tags?: Maybe<Array<Maybe<CategoryTag>>>;
  updated_at: Scalars['DateTime'];
};

export type CategoryTagPicturesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type CategoryTagRelated_TagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type CategoryTagAggregator = {
  avg?: Maybe<CategoryTagAggregatorAvg>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<CategoryTagAggregatorMax>;
  min?: Maybe<CategoryTagAggregatorMin>;
  sum?: Maybe<CategoryTagAggregatorSum>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type CategoryTagAggregatorAvg = {
  priority?: Maybe<Scalars['Float']>;
};

export type CategoryTagAggregatorMax = {
  priority?: Maybe<Scalars['Float']>;
};

export type CategoryTagAggregatorMin = {
  priority?: Maybe<Scalars['Float']>;
};

export type CategoryTagAggregatorSum = {
  priority?: Maybe<Scalars['Float']>;
};

export type CategoryTagConnection = {
  aggregate?: Maybe<CategoryTagAggregator>;
  groupBy?: Maybe<CategoryTagGroupBy>;
  values?: Maybe<Array<Maybe<CategoryTag>>>;
};

export type CategoryTagConnectionCreated_At = {
  connection?: Maybe<CategoryTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type CategoryTagConnectionDescription = {
  connection?: Maybe<CategoryTagConnection>;
  key?: Maybe<Scalars['String']>;
};

export type CategoryTagConnectionId = {
  connection?: Maybe<CategoryTagConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type CategoryTagConnectionName = {
  connection?: Maybe<CategoryTagConnection>;
  key?: Maybe<Scalars['String']>;
};

export type CategoryTagConnectionPriority = {
  connection?: Maybe<CategoryTagConnection>;
  key?: Maybe<Scalars['Int']>;
};

export type CategoryTagConnectionPublished_At = {
  connection?: Maybe<CategoryTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type CategoryTagConnectionUpdated_At = {
  connection?: Maybe<CategoryTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type CategoryTagGroupBy = {
  created_at?: Maybe<Array<Maybe<CategoryTagConnectionCreated_At>>>;
  description?: Maybe<Array<Maybe<CategoryTagConnectionDescription>>>;
  id?: Maybe<Array<Maybe<CategoryTagConnectionId>>>;
  name?: Maybe<Array<Maybe<CategoryTagConnectionName>>>;
  priority?: Maybe<Array<Maybe<CategoryTagConnectionPriority>>>;
  published_at?: Maybe<Array<Maybe<CategoryTagConnectionPublished_At>>>;
  updated_at?: Maybe<Array<Maybe<CategoryTagConnectionUpdated_At>>>;
};

export type CategoryTagInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  priority?: InputMaybe<Scalars['Int']>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  related_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type Comment = {
  author?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  picture?: Maybe<Picture>;
  published_at?: Maybe<Scalars['DateTime']>;
  text?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
};

export type CommentAggregator = {
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type CommentConnection = {
  aggregate?: Maybe<CommentAggregator>;
  groupBy?: Maybe<CommentGroupBy>;
  values?: Maybe<Array<Maybe<Comment>>>;
};

export type CommentConnectionAuthor = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['String']>;
};

export type CommentConnectionCreated_At = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type CommentConnectionDate = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type CommentConnectionId = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type CommentConnectionPicture = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type CommentConnectionPublished_At = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type CommentConnectionText = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['String']>;
};

export type CommentConnectionUpdated_At = {
  connection?: Maybe<CommentConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type CommentGroupBy = {
  author?: Maybe<Array<Maybe<CommentConnectionAuthor>>>;
  created_at?: Maybe<Array<Maybe<CommentConnectionCreated_At>>>;
  date?: Maybe<Array<Maybe<CommentConnectionDate>>>;
  id?: Maybe<Array<Maybe<CommentConnectionId>>>;
  picture?: Maybe<Array<Maybe<CommentConnectionPicture>>>;
  published_at?: Maybe<Array<Maybe<CommentConnectionPublished_At>>>;
  text?: Maybe<Array<Maybe<CommentConnectionText>>>;
  updated_at?: Maybe<Array<Maybe<CommentConnectionUpdated_At>>>;
};

export type CommentInput = {
  author?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['ID']>;
  date?: InputMaybe<Scalars['DateTime']>;
  picture?: InputMaybe<Scalars['ID']>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type ComponentContentComment = {
  author: Scalars['String'];
  date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
};

export type ComponentContentCommentInput = {
  author: Scalars['String'];
  date?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
};

export type Description = {
  created_at: Scalars['DateTime'];
  id: Scalars['ID'];
  pictures?: Maybe<Array<Maybe<Picture>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  text?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
};

export type DescriptionPicturesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type DescriptionAggregator = {
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DescriptionConnection = {
  aggregate?: Maybe<DescriptionAggregator>;
  groupBy?: Maybe<DescriptionGroupBy>;
  values?: Maybe<Array<Maybe<Description>>>;
};

export type DescriptionConnectionCreated_At = {
  connection?: Maybe<DescriptionConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type DescriptionConnectionId = {
  connection?: Maybe<DescriptionConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type DescriptionConnectionPublished_At = {
  connection?: Maybe<DescriptionConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type DescriptionConnectionText = {
  connection?: Maybe<DescriptionConnection>;
  key?: Maybe<Scalars['String']>;
};

export type DescriptionConnectionUpdated_At = {
  connection?: Maybe<DescriptionConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type DescriptionGroupBy = {
  created_at?: Maybe<Array<Maybe<DescriptionConnectionCreated_At>>>;
  id?: Maybe<Array<Maybe<DescriptionConnectionId>>>;
  published_at?: Maybe<Array<Maybe<DescriptionConnectionPublished_At>>>;
  text?: Maybe<Array<Maybe<DescriptionConnectionText>>>;
  updated_at?: Maybe<Array<Maybe<DescriptionConnectionUpdated_At>>>;
};

export type DescriptionInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars['String']>;
  caption?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FileInput = {
  alternativeText?: InputMaybe<Scalars['String']>;
  caption?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['ID']>;
  ext?: InputMaybe<Scalars['String']>;
  formats?: InputMaybe<Scalars['JSON']>;
  hash: Scalars['String'];
  height?: InputMaybe<Scalars['Int']>;
  mime: Scalars['String'];
  name: Scalars['String'];
  previewUrl?: InputMaybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: InputMaybe<Scalars['JSON']>;
  related?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  size: Scalars['Float'];
  updated_by?: InputMaybe<Scalars['ID']>;
  url: Scalars['String'];
  width?: InputMaybe<Scalars['Int']>;
};

export type I18NLocale = {
  code?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
};

export type InputId = {
  id: Scalars['ID'];
};

export type KeywordTag = {
  created_at: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  pictures?: Maybe<Array<Maybe<Picture>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  updated_at: Scalars['DateTime'];
};

export type KeywordTagPicturesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type KeywordTagAggregator = {
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type KeywordTagConnection = {
  aggregate?: Maybe<KeywordTagAggregator>;
  groupBy?: Maybe<KeywordTagGroupBy>;
  values?: Maybe<Array<Maybe<KeywordTag>>>;
};

export type KeywordTagConnectionCreated_At = {
  connection?: Maybe<KeywordTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type KeywordTagConnectionId = {
  connection?: Maybe<KeywordTagConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type KeywordTagConnectionName = {
  connection?: Maybe<KeywordTagConnection>;
  key?: Maybe<Scalars['String']>;
};

export type KeywordTagConnectionPublished_At = {
  connection?: Maybe<KeywordTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type KeywordTagConnectionUpdated_At = {
  connection?: Maybe<KeywordTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type KeywordTagGroupBy = {
  created_at?: Maybe<Array<Maybe<KeywordTagConnectionCreated_At>>>;
  id?: Maybe<Array<Maybe<KeywordTagConnectionId>>>;
  name?: Maybe<Array<Maybe<KeywordTagConnectionName>>>;
  published_at?: Maybe<Array<Maybe<KeywordTagConnectionPublished_At>>>;
  updated_at?: Maybe<Array<Maybe<KeywordTagConnectionUpdated_At>>>;
};

export type KeywordTagInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type LocaleInput = {
  code?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type Morph =
  | CategoryTag
  | CategoryTagAggregator
  | CategoryTagAggregatorAvg
  | CategoryTagAggregatorMax
  | CategoryTagAggregatorMin
  | CategoryTagAggregatorSum
  | CategoryTagConnection
  | CategoryTagConnectionCreated_At
  | CategoryTagConnectionDescription
  | CategoryTagConnectionId
  | CategoryTagConnectionName
  | CategoryTagConnectionPriority
  | CategoryTagConnectionPublished_At
  | CategoryTagConnectionUpdated_At
  | CategoryTagGroupBy
  | Comment
  | CommentAggregator
  | CommentConnection
  | CommentConnectionAuthor
  | CommentConnectionCreated_At
  | CommentConnectionDate
  | CommentConnectionId
  | CommentConnectionPicture
  | CommentConnectionPublished_At
  | CommentConnectionText
  | CommentConnectionUpdated_At
  | CommentGroupBy
  | ComponentContentComment
  | Description
  | DescriptionAggregator
  | DescriptionConnection
  | DescriptionConnectionCreated_At
  | DescriptionConnectionId
  | DescriptionConnectionPublished_At
  | DescriptionConnectionText
  | DescriptionConnectionUpdated_At
  | DescriptionGroupBy
  | I18NLocale
  | KeywordTag
  | KeywordTagAggregator
  | KeywordTagConnection
  | KeywordTagConnectionCreated_At
  | KeywordTagConnectionId
  | KeywordTagConnectionName
  | KeywordTagConnectionPublished_At
  | KeywordTagConnectionUpdated_At
  | KeywordTagGroupBy
  | Picture
  | PictureAggregator
  | PictureAggregatorAvg
  | PictureAggregatorMax
  | PictureAggregatorMin
  | PictureAggregatorSum
  | PictureConnection
  | PictureConnectionCreated_At
  | PictureConnectionId
  | PictureConnectionMedia
  | PictureConnectionPublished_At
  | PictureConnectionTaken
  | PictureConnectionTime_Range_Tag
  | PictureConnectionTitle
  | PictureConnectionUpdated_At
  | PictureConnectionWordpress_Id
  | PictureGroupBy
  | TimeRangeTag
  | TimeRangeTagAggregator
  | TimeRangeTagConnection
  | TimeRangeTagConnectionCreated_At
  | TimeRangeTagConnectionEnd
  | TimeRangeTagConnectionId
  | TimeRangeTagConnectionPublished_At
  | TimeRangeTagConnectionStart
  | TimeRangeTagConnectionUpdated_At
  | TimeRangeTagGroupBy
  | Title
  | TitleAggregator
  | TitleConnection
  | TitleConnectionCreated_At
  | TitleConnectionId
  | TitleConnectionPublished_At
  | TitleConnectionText
  | TitleConnectionUpdated_At
  | TitleGroupBy
  | UploadFile
  | UploadFileAggregator
  | UploadFileAggregatorAvg
  | UploadFileAggregatorMax
  | UploadFileAggregatorMin
  | UploadFileAggregatorSum
  | UploadFileConnection
  | UploadFileConnectionAlternativeText
  | UploadFileConnectionCaption
  | UploadFileConnectionCreated_At
  | UploadFileConnectionExt
  | UploadFileConnectionFormats
  | UploadFileConnectionHash
  | UploadFileConnectionHeight
  | UploadFileConnectionId
  | UploadFileConnectionMime
  | UploadFileConnectionName
  | UploadFileConnectionPreviewUrl
  | UploadFileConnectionProvider
  | UploadFileConnectionProvider_Metadata
  | UploadFileConnectionSize
  | UploadFileConnectionUpdated_At
  | UploadFileConnectionUrl
  | UploadFileConnectionWidth
  | UploadFileGroupBy
  | UserPermissionsPasswordPayload
  | UsersPermissionsLoginPayload
  | UsersPermissionsMe
  | UsersPermissionsMeRole
  | UsersPermissionsPermission
  | UsersPermissionsRole
  | UsersPermissionsRoleAggregator
  | UsersPermissionsRoleConnection
  | UsersPermissionsRoleConnectionDescription
  | UsersPermissionsRoleConnectionId
  | UsersPermissionsRoleConnectionName
  | UsersPermissionsRoleConnectionType
  | UsersPermissionsRoleGroupBy
  | UsersPermissionsUser
  | UsersPermissionsUserAggregator
  | UsersPermissionsUserConnection
  | UsersPermissionsUserConnectionBlocked
  | UsersPermissionsUserConnectionConfirmed
  | UsersPermissionsUserConnectionCreated_At
  | UsersPermissionsUserConnectionEmail
  | UsersPermissionsUserConnectionId
  | UsersPermissionsUserConnectionProvider
  | UsersPermissionsUserConnectionRole
  | UsersPermissionsUserConnectionUpdated_At
  | UsersPermissionsUserConnectionUsername
  | UsersPermissionsUserGroupBy
  | CreateCategoryTagPayload
  | CreateCommentPayload
  | CreateDescriptionPayload
  | CreateKeywordTagPayload
  | CreatePicturePayload
  | CreateRolePayload
  | CreateTimeRangeTagPayload
  | CreateTitlePayload
  | CreateUserPayload
  | DeleteCategoryTagPayload
  | DeleteCommentPayload
  | DeleteDescriptionPayload
  | DeleteFilePayload
  | DeleteKeywordTagPayload
  | DeletePicturePayload
  | DeleteRolePayload
  | DeleteTimeRangeTagPayload
  | DeleteTitlePayload
  | DeleteUserPayload
  | UpdateCategoryTagPayload
  | UpdateCommentPayload
  | UpdateDescriptionPayload
  | UpdateKeywordTagPayload
  | UpdatePicturePayload
  | UpdateRolePayload
  | UpdateTimeRangeTagPayload
  | UpdateTitlePayload
  | UpdateUserPayload;

export type Mutation = {
  createCategoryTag?: Maybe<CreateCategoryTagPayload>;
  createComment?: Maybe<CreateCommentPayload>;
  createDescription?: Maybe<CreateDescriptionPayload>;
  createKeywordTag?: Maybe<CreateKeywordTagPayload>;
  createPicture?: Maybe<CreatePicturePayload>;
  /** Create a new role */
  createRole?: Maybe<CreateRolePayload>;
  createTimeRangeTag?: Maybe<CreateTimeRangeTagPayload>;
  createTitle?: Maybe<CreateTitlePayload>;
  /** Create a new user */
  createUser?: Maybe<CreateUserPayload>;
  deleteCategoryTag?: Maybe<DeleteCategoryTagPayload>;
  deleteComment?: Maybe<DeleteCommentPayload>;
  deleteDescription?: Maybe<DeleteDescriptionPayload>;
  /** Delete one file */
  deleteFile?: Maybe<DeleteFilePayload>;
  deleteKeywordTag?: Maybe<DeleteKeywordTagPayload>;
  deletePicture?: Maybe<DeletePicturePayload>;
  /** Delete an existing role */
  deleteRole?: Maybe<DeleteRolePayload>;
  deleteTimeRangeTag?: Maybe<DeleteTimeRangeTagPayload>;
  deleteTitle?: Maybe<DeleteTitlePayload>;
  /** Delete an existing user */
  deleteUser?: Maybe<DeleteUserPayload>;
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  forgotPassword?: Maybe<UserPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  multipleUpload: Array<Maybe<UploadFile>>;
  register: UsersPermissionsLoginPayload;
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateCategoryTag?: Maybe<UpdateCategoryTagPayload>;
  updateComment?: Maybe<UpdateCommentPayload>;
  updateDescription?: Maybe<UpdateDescriptionPayload>;
  updateFileInfo: UploadFile;
  updateKeywordTag?: Maybe<UpdateKeywordTagPayload>;
  updatePicture?: Maybe<UpdatePicturePayload>;
  /** Update an existing role */
  updateRole?: Maybe<UpdateRolePayload>;
  updateTimeRangeTag?: Maybe<UpdateTimeRangeTagPayload>;
  updateTitle?: Maybe<UpdateTitlePayload>;
  /** Update an existing user */
  updateUser?: Maybe<UpdateUserPayload>;
  upload: UploadFile;
};

export type MutationCreateCategoryTagArgs = {
  input?: InputMaybe<CreateCategoryTagInput>;
};

export type MutationCreateCommentArgs = {
  input?: InputMaybe<CreateCommentInput>;
};

export type MutationCreateDescriptionArgs = {
  input?: InputMaybe<CreateDescriptionInput>;
};

export type MutationCreateKeywordTagArgs = {
  input?: InputMaybe<CreateKeywordTagInput>;
};

export type MutationCreatePictureArgs = {
  input?: InputMaybe<CreatePictureInput>;
};

export type MutationCreateRoleArgs = {
  input?: InputMaybe<CreateRoleInput>;
};

export type MutationCreateTimeRangeTagArgs = {
  input?: InputMaybe<CreateTimeRangeTagInput>;
};

export type MutationCreateTitleArgs = {
  input?: InputMaybe<CreateTitleInput>;
};

export type MutationCreateUserArgs = {
  input?: InputMaybe<CreateUserInput>;
};

export type MutationDeleteCategoryTagArgs = {
  input?: InputMaybe<DeleteCategoryTagInput>;
};

export type MutationDeleteCommentArgs = {
  input?: InputMaybe<DeleteCommentInput>;
};

export type MutationDeleteDescriptionArgs = {
  input?: InputMaybe<DeleteDescriptionInput>;
};

export type MutationDeleteFileArgs = {
  input?: InputMaybe<DeleteFileInput>;
};

export type MutationDeleteKeywordTagArgs = {
  input?: InputMaybe<DeleteKeywordTagInput>;
};

export type MutationDeletePictureArgs = {
  input?: InputMaybe<DeletePictureInput>;
};

export type MutationDeleteRoleArgs = {
  input?: InputMaybe<DeleteRoleInput>;
};

export type MutationDeleteTimeRangeTagArgs = {
  input?: InputMaybe<DeleteTimeRangeTagInput>;
};

export type MutationDeleteTitleArgs = {
  input?: InputMaybe<DeleteTitleInput>;
};

export type MutationDeleteUserArgs = {
  input?: InputMaybe<DeleteUserInput>;
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
  source?: InputMaybe<Scalars['String']>;
};

export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};

export type MutationResetPasswordArgs = {
  code: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type MutationUpdateCategoryTagArgs = {
  input?: InputMaybe<UpdateCategoryTagInput>;
};

export type MutationUpdateCommentArgs = {
  input?: InputMaybe<UpdateCommentInput>;
};

export type MutationUpdateDescriptionArgs = {
  input?: InputMaybe<UpdateDescriptionInput>;
};

export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID'];
  info: FileInfoInput;
};

export type MutationUpdateKeywordTagArgs = {
  input?: InputMaybe<UpdateKeywordTagInput>;
};

export type MutationUpdatePictureArgs = {
  input?: InputMaybe<UpdatePictureInput>;
};

export type MutationUpdateRoleArgs = {
  input?: InputMaybe<UpdateRoleInput>;
};

export type MutationUpdateTimeRangeTagArgs = {
  input?: InputMaybe<UpdateTimeRangeTagInput>;
};

export type MutationUpdateTitleArgs = {
  input?: InputMaybe<UpdateTitleInput>;
};

export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUserInput>;
};

export type MutationUploadArgs = {
  field?: InputMaybe<Scalars['String']>;
  file: Scalars['Upload'];
  info?: InputMaybe<FileInfoInput>;
  ref?: InputMaybe<Scalars['String']>;
  refId?: InputMaybe<Scalars['ID']>;
  source?: InputMaybe<Scalars['String']>;
};

export type Picture = {
  Comment?: Maybe<Array<Maybe<ComponentContentComment>>>;
  category_tags?: Maybe<Array<Maybe<CategoryTag>>>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  created_at: Scalars['DateTime'];
  descriptions?: Maybe<Array<Maybe<Description>>>;
  id: Scalars['ID'];
  keyword_tags?: Maybe<Array<Maybe<KeywordTag>>>;
  media?: Maybe<UploadFile>;
  published_at?: Maybe<Scalars['DateTime']>;
  taken?: Maybe<Scalars['Date']>;
  time_range_tag?: Maybe<TimeRangeTag>;
  title?: Maybe<Title>;
  updated_at: Scalars['DateTime'];
  wordpress_id?: Maybe<Scalars['Int']>;
};

export type PictureCategory_TagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type PictureCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type PictureDescriptionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type PictureKeyword_TagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type PictureAggregator = {
  avg?: Maybe<PictureAggregatorAvg>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<PictureAggregatorMax>;
  min?: Maybe<PictureAggregatorMin>;
  sum?: Maybe<PictureAggregatorSum>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type PictureAggregatorAvg = {
  wordpress_id?: Maybe<Scalars['Float']>;
};

export type PictureAggregatorMax = {
  wordpress_id?: Maybe<Scalars['Float']>;
};

export type PictureAggregatorMin = {
  wordpress_id?: Maybe<Scalars['Float']>;
};

export type PictureAggregatorSum = {
  wordpress_id?: Maybe<Scalars['Float']>;
};

export type PictureConnection = {
  aggregate?: Maybe<PictureAggregator>;
  groupBy?: Maybe<PictureGroupBy>;
  values?: Maybe<Array<Maybe<Picture>>>;
};

export type PictureConnectionCreated_At = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type PictureConnectionId = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type PictureConnectionMedia = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type PictureConnectionPublished_At = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type PictureConnectionTaken = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type PictureConnectionTime_Range_Tag = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type PictureConnectionTitle = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type PictureConnectionUpdated_At = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type PictureConnectionWordpress_Id = {
  connection?: Maybe<PictureConnection>;
  key?: Maybe<Scalars['Int']>;
};

export type PictureGroupBy = {
  created_at?: Maybe<Array<Maybe<PictureConnectionCreated_At>>>;
  id?: Maybe<Array<Maybe<PictureConnectionId>>>;
  media?: Maybe<Array<Maybe<PictureConnectionMedia>>>;
  published_at?: Maybe<Array<Maybe<PictureConnectionPublished_At>>>;
  taken?: Maybe<Array<Maybe<PictureConnectionTaken>>>;
  time_range_tag?: Maybe<Array<Maybe<PictureConnectionTime_Range_Tag>>>;
  title?: Maybe<Array<Maybe<PictureConnectionTitle>>>;
  updated_at?: Maybe<Array<Maybe<PictureConnectionUpdated_At>>>;
  wordpress_id?: Maybe<Array<Maybe<PictureConnectionWordpress_Id>>>;
};

export type PictureInput = {
  Comment?: InputMaybe<Array<InputMaybe<ComponentContentCommentInput>>>;
  category_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  comments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  created_by?: InputMaybe<Scalars['ID']>;
  descriptions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  keyword_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  media?: InputMaybe<Scalars['ID']>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  taken?: InputMaybe<Scalars['Date']>;
  time_range_tag?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['ID']>;
  updated_by?: InputMaybe<Scalars['ID']>;
  wordpress_id?: InputMaybe<Scalars['Int']>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW',
}

export type Query = {
  categoryTag?: Maybe<CategoryTag>;
  categoryTags?: Maybe<Array<Maybe<CategoryTag>>>;
  categoryTagsConnection?: Maybe<CategoryTagConnection>;
  comment?: Maybe<Comment>;
  comments?: Maybe<Array<Maybe<Comment>>>;
  commentsConnection?: Maybe<CommentConnection>;
  description?: Maybe<Description>;
  descriptions?: Maybe<Array<Maybe<Description>>>;
  descriptionsConnection?: Maybe<DescriptionConnection>;
  files?: Maybe<Array<Maybe<UploadFile>>>;
  filesConnection?: Maybe<UploadFileConnection>;
  keywordTag?: Maybe<KeywordTag>;
  keywordTags?: Maybe<Array<Maybe<KeywordTag>>>;
  keywordTagsConnection?: Maybe<KeywordTagConnection>;
  me?: Maybe<UsersPermissionsMe>;
  picture?: Maybe<Picture>;
  pictures?: Maybe<Array<Maybe<Picture>>>;
  picturesConnection?: Maybe<PictureConnection>;
  role?: Maybe<UsersPermissionsRole>;
  /** Retrieve all the existing roles. You can't apply filters on this query. */
  roles?: Maybe<Array<Maybe<UsersPermissionsRole>>>;
  rolesConnection?: Maybe<UsersPermissionsRoleConnection>;
  timeRangeTag?: Maybe<TimeRangeTag>;
  timeRangeTags?: Maybe<Array<Maybe<TimeRangeTag>>>;
  timeRangeTagsConnection?: Maybe<TimeRangeTagConnection>;
  title?: Maybe<Title>;
  titles?: Maybe<Array<Maybe<Title>>>;
  titlesConnection?: Maybe<TitleConnection>;
  user?: Maybe<UsersPermissionsUser>;
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
  usersConnection?: Maybe<UsersPermissionsUserConnection>;
};

export type QueryCategoryTagArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryCategoryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryCategoryTagsConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryCommentArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryCommentsConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryDescriptionArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryDescriptionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryDescriptionsConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryFilesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryFilesConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryKeywordTagArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryKeywordTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryKeywordTagsConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryPictureArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryPicturesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryPicturesConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryRoleArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryRolesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryRolesConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryTimeRangeTagArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryTimeRangeTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryTimeRangeTagsConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryTitleArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryTitlesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryTitlesConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryUserArgs = {
  id: Scalars['ID'];
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type QueryUsersConnectionArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type RoleInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  type?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type TimeRangeTag = {
  created_at: Scalars['DateTime'];
  end?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  pictures?: Maybe<Array<Maybe<Picture>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  start?: Maybe<Scalars['DateTime']>;
  updated_at: Scalars['DateTime'];
};

export type TimeRangeTagPicturesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type TimeRangeTagAggregator = {
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type TimeRangeTagConnection = {
  aggregate?: Maybe<TimeRangeTagAggregator>;
  groupBy?: Maybe<TimeRangeTagGroupBy>;
  values?: Maybe<Array<Maybe<TimeRangeTag>>>;
};

export type TimeRangeTagConnectionCreated_At = {
  connection?: Maybe<TimeRangeTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TimeRangeTagConnectionEnd = {
  connection?: Maybe<TimeRangeTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TimeRangeTagConnectionId = {
  connection?: Maybe<TimeRangeTagConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type TimeRangeTagConnectionPublished_At = {
  connection?: Maybe<TimeRangeTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TimeRangeTagConnectionStart = {
  connection?: Maybe<TimeRangeTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TimeRangeTagConnectionUpdated_At = {
  connection?: Maybe<TimeRangeTagConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TimeRangeTagGroupBy = {
  created_at?: Maybe<Array<Maybe<TimeRangeTagConnectionCreated_At>>>;
  end?: Maybe<Array<Maybe<TimeRangeTagConnectionEnd>>>;
  id?: Maybe<Array<Maybe<TimeRangeTagConnectionId>>>;
  published_at?: Maybe<Array<Maybe<TimeRangeTagConnectionPublished_At>>>;
  start?: Maybe<Array<Maybe<TimeRangeTagConnectionStart>>>;
  updated_at?: Maybe<Array<Maybe<TimeRangeTagConnectionUpdated_At>>>;
};

export type TimeRangeTagInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  end?: InputMaybe<Scalars['DateTime']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type Title = {
  created_at: Scalars['DateTime'];
  id: Scalars['ID'];
  pictures?: Maybe<Array<Maybe<Picture>>>;
  published_at?: Maybe<Scalars['DateTime']>;
  text?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
};

export type TitlePicturesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type TitleAggregator = {
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type TitleConnection = {
  aggregate?: Maybe<TitleAggregator>;
  groupBy?: Maybe<TitleGroupBy>;
  values?: Maybe<Array<Maybe<Title>>>;
};

export type TitleConnectionCreated_At = {
  connection?: Maybe<TitleConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TitleConnectionId = {
  connection?: Maybe<TitleConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type TitleConnectionPublished_At = {
  connection?: Maybe<TitleConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TitleConnectionText = {
  connection?: Maybe<TitleConnection>;
  key?: Maybe<Scalars['String']>;
};

export type TitleConnectionUpdated_At = {
  connection?: Maybe<TitleConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type TitleGroupBy = {
  created_at?: Maybe<Array<Maybe<TitleConnectionCreated_At>>>;
  id?: Maybe<Array<Maybe<TitleConnectionId>>>;
  published_at?: Maybe<Array<Maybe<TitleConnectionPublished_At>>>;
  text?: Maybe<Array<Maybe<TitleConnectionText>>>;
  updated_at?: Maybe<Array<Maybe<TitleConnectionUpdated_At>>>;
};

export type TitleInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type UploadFile = {
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  ext?: Maybe<Scalars['String']>;
  formats?: Maybe<Scalars['JSON']>;
  hash: Scalars['String'];
  height?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  mime: Scalars['String'];
  name: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<Morph>>>;
  size: Scalars['Float'];
  updated_at: Scalars['DateTime'];
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};

export type UploadFileRelatedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type UploadFileAggregator = {
  avg?: Maybe<UploadFileAggregatorAvg>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<UploadFileAggregatorMax>;
  min?: Maybe<UploadFileAggregatorMin>;
  sum?: Maybe<UploadFileAggregatorSum>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UploadFileAggregatorAvg = {
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorMax = {
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorMin = {
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorSum = {
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type UploadFileConnection = {
  aggregate?: Maybe<UploadFileAggregator>;
  groupBy?: Maybe<UploadFileGroupBy>;
  values?: Maybe<Array<Maybe<UploadFile>>>;
};

export type UploadFileConnectionAlternativeText = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionCaption = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionCreated_At = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type UploadFileConnectionExt = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionFormats = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['JSON']>;
};

export type UploadFileConnectionHash = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionHeight = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['Int']>;
};

export type UploadFileConnectionId = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type UploadFileConnectionMime = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionName = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionPreviewUrl = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionProvider = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionProvider_Metadata = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['JSON']>;
};

export type UploadFileConnectionSize = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['Float']>;
};

export type UploadFileConnectionUpdated_At = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type UploadFileConnectionUrl = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UploadFileConnectionWidth = {
  connection?: Maybe<UploadFileConnection>;
  key?: Maybe<Scalars['Int']>;
};

export type UploadFileGroupBy = {
  alternativeText?: Maybe<Array<Maybe<UploadFileConnectionAlternativeText>>>;
  caption?: Maybe<Array<Maybe<UploadFileConnectionCaption>>>;
  created_at?: Maybe<Array<Maybe<UploadFileConnectionCreated_At>>>;
  ext?: Maybe<Array<Maybe<UploadFileConnectionExt>>>;
  formats?: Maybe<Array<Maybe<UploadFileConnectionFormats>>>;
  hash?: Maybe<Array<Maybe<UploadFileConnectionHash>>>;
  height?: Maybe<Array<Maybe<UploadFileConnectionHeight>>>;
  id?: Maybe<Array<Maybe<UploadFileConnectionId>>>;
  mime?: Maybe<Array<Maybe<UploadFileConnectionMime>>>;
  name?: Maybe<Array<Maybe<UploadFileConnectionName>>>;
  previewUrl?: Maybe<Array<Maybe<UploadFileConnectionPreviewUrl>>>;
  provider?: Maybe<Array<Maybe<UploadFileConnectionProvider>>>;
  provider_metadata?: Maybe<Array<Maybe<UploadFileConnectionProvider_Metadata>>>;
  size?: Maybe<Array<Maybe<UploadFileConnectionSize>>>;
  updated_at?: Maybe<Array<Maybe<UploadFileConnectionUpdated_At>>>;
  url?: Maybe<Array<Maybe<UploadFileConnectionUrl>>>;
  width?: Maybe<Array<Maybe<UploadFileConnectionWidth>>>;
};

export type UserInput = {
  blocked?: InputMaybe<Scalars['Boolean']>;
  confirmationToken?: InputMaybe<Scalars['String']>;
  confirmed?: InputMaybe<Scalars['Boolean']>;
  created_by?: InputMaybe<Scalars['ID']>;
  email: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  resetPasswordToken?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['ID']>;
  updated_by?: InputMaybe<Scalars['ID']>;
  username: Scalars['String'];
};

export type UserPermissionsPasswordPayload = {
  ok: Scalars['Boolean'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String'];
  password: Scalars['String'];
  provider?: InputMaybe<Scalars['String']>;
};

export type UsersPermissionsLoginPayload = {
  jwt?: Maybe<Scalars['String']>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  blocked?: Maybe<Scalars['Boolean']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  email: Scalars['String'];
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

export type UsersPermissionsPermission = {
  action: Scalars['String'];
  controller: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  policy?: Maybe<Scalars['String']>;
  role?: Maybe<UsersPermissionsRole>;
  type: Scalars['String'];
};

export type UsersPermissionsRegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UsersPermissionsRole = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  permissions?: Maybe<Array<Maybe<UsersPermissionsPermission>>>;
  type?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
};

export type UsersPermissionsRolePermissionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type UsersPermissionsRoleUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type UsersPermissionsRoleAggregator = {
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UsersPermissionsRoleConnection = {
  aggregate?: Maybe<UsersPermissionsRoleAggregator>;
  groupBy?: Maybe<UsersPermissionsRoleGroupBy>;
  values?: Maybe<Array<Maybe<UsersPermissionsRole>>>;
};

export type UsersPermissionsRoleConnectionDescription = {
  connection?: Maybe<UsersPermissionsRoleConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UsersPermissionsRoleConnectionId = {
  connection?: Maybe<UsersPermissionsRoleConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsRoleConnectionName = {
  connection?: Maybe<UsersPermissionsRoleConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UsersPermissionsRoleConnectionType = {
  connection?: Maybe<UsersPermissionsRoleConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UsersPermissionsRoleGroupBy = {
  description?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionDescription>>>;
  id?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionId>>>;
  name?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionName>>>;
  type?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionType>>>;
};

export type UsersPermissionsUser = {
  blocked?: Maybe<Scalars['Boolean']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  created_at: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  provider?: Maybe<Scalars['String']>;
  role?: Maybe<UsersPermissionsRole>;
  updated_at: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UsersPermissionsUserAggregator = {
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UsersPermissionsUserConnection = {
  aggregate?: Maybe<UsersPermissionsUserAggregator>;
  groupBy?: Maybe<UsersPermissionsUserGroupBy>;
  values?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
};

export type UsersPermissionsUserConnectionBlocked = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['Boolean']>;
};

export type UsersPermissionsUserConnectionConfirmed = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['Boolean']>;
};

export type UsersPermissionsUserConnectionCreated_At = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type UsersPermissionsUserConnectionEmail = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UsersPermissionsUserConnectionId = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsUserConnectionProvider = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UsersPermissionsUserConnectionRole = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['ID']>;
};

export type UsersPermissionsUserConnectionUpdated_At = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['DateTime']>;
};

export type UsersPermissionsUserConnectionUsername = {
  connection?: Maybe<UsersPermissionsUserConnection>;
  key?: Maybe<Scalars['String']>;
};

export type UsersPermissionsUserGroupBy = {
  blocked?: Maybe<Array<Maybe<UsersPermissionsUserConnectionBlocked>>>;
  confirmed?: Maybe<Array<Maybe<UsersPermissionsUserConnectionConfirmed>>>;
  created_at?: Maybe<Array<Maybe<UsersPermissionsUserConnectionCreated_At>>>;
  email?: Maybe<Array<Maybe<UsersPermissionsUserConnectionEmail>>>;
  id?: Maybe<Array<Maybe<UsersPermissionsUserConnectionId>>>;
  provider?: Maybe<Array<Maybe<UsersPermissionsUserConnectionProvider>>>;
  role?: Maybe<Array<Maybe<UsersPermissionsUserConnectionRole>>>;
  updated_at?: Maybe<Array<Maybe<UsersPermissionsUserConnectionUpdated_At>>>;
  username?: Maybe<Array<Maybe<UsersPermissionsUserConnectionUsername>>>;
};

export type CreateCategoryTagInput = {
  data?: InputMaybe<CategoryTagInput>;
};

export type CreateCategoryTagPayload = {
  categoryTag?: Maybe<CategoryTag>;
};

export type CreateCommentInput = {
  data?: InputMaybe<CommentInput>;
};

export type CreateCommentPayload = {
  comment?: Maybe<Comment>;
};

export type CreateDescriptionInput = {
  data?: InputMaybe<DescriptionInput>;
};

export type CreateDescriptionPayload = {
  description?: Maybe<Description>;
};

export type CreateKeywordTagInput = {
  data?: InputMaybe<KeywordTagInput>;
};

export type CreateKeywordTagPayload = {
  keywordTag?: Maybe<KeywordTag>;
};

export type CreatePictureInput = {
  data?: InputMaybe<PictureInput>;
};

export type CreatePicturePayload = {
  picture?: Maybe<Picture>;
};

export type CreateRoleInput = {
  data?: InputMaybe<RoleInput>;
};

export type CreateRolePayload = {
  role?: Maybe<UsersPermissionsRole>;
};

export type CreateTimeRangeTagInput = {
  data?: InputMaybe<TimeRangeTagInput>;
};

export type CreateTimeRangeTagPayload = {
  timeRangeTag?: Maybe<TimeRangeTag>;
};

export type CreateTitleInput = {
  data?: InputMaybe<TitleInput>;
};

export type CreateTitlePayload = {
  title?: Maybe<Title>;
};

export type CreateUserInput = {
  data?: InputMaybe<UserInput>;
};

export type CreateUserPayload = {
  user?: Maybe<UsersPermissionsUser>;
};

export type DeleteCategoryTagInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteCategoryTagPayload = {
  categoryTag?: Maybe<CategoryTag>;
};

export type DeleteCommentInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteCommentPayload = {
  comment?: Maybe<Comment>;
};

export type DeleteDescriptionInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteDescriptionPayload = {
  description?: Maybe<Description>;
};

export type DeleteFileInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteFilePayload = {
  file?: Maybe<UploadFile>;
};

export type DeleteKeywordTagInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteKeywordTagPayload = {
  keywordTag?: Maybe<KeywordTag>;
};

export type DeletePictureInput = {
  where?: InputMaybe<InputId>;
};

export type DeletePicturePayload = {
  picture?: Maybe<Picture>;
};

export type DeleteRoleInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteRolePayload = {
  role?: Maybe<UsersPermissionsRole>;
};

export type DeleteTimeRangeTagInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteTimeRangeTagPayload = {
  timeRangeTag?: Maybe<TimeRangeTag>;
};

export type DeleteTitleInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteTitlePayload = {
  title?: Maybe<Title>;
};

export type DeleteUserInput = {
  where?: InputMaybe<InputId>;
};

export type DeleteUserPayload = {
  user?: Maybe<UsersPermissionsUser>;
};

export type EditCategoryTagInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  priority?: InputMaybe<Scalars['Int']>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  related_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type EditCommentInput = {
  author?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['ID']>;
  date?: InputMaybe<Scalars['DateTime']>;
  picture?: InputMaybe<Scalars['ID']>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type EditComponentContentCommentInput = {
  author?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  text?: InputMaybe<Scalars['String']>;
};

export type EditDescriptionInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type EditFileInput = {
  alternativeText?: InputMaybe<Scalars['String']>;
  caption?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['ID']>;
  ext?: InputMaybe<Scalars['String']>;
  formats?: InputMaybe<Scalars['JSON']>;
  hash?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Int']>;
  mime?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  previewUrl?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  provider_metadata?: InputMaybe<Scalars['JSON']>;
  related?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  size?: InputMaybe<Scalars['Float']>;
  updated_by?: InputMaybe<Scalars['ID']>;
  url?: InputMaybe<Scalars['String']>;
  width?: InputMaybe<Scalars['Int']>;
};

export type EditKeywordTagInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type EditLocaleInput = {
  code?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type EditPictureInput = {
  Comment?: InputMaybe<Array<InputMaybe<EditComponentContentCommentInput>>>;
  category_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  comments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  created_by?: InputMaybe<Scalars['ID']>;
  descriptions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  keyword_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  media?: InputMaybe<Scalars['ID']>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  taken?: InputMaybe<Scalars['Date']>;
  time_range_tag?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['ID']>;
  updated_by?: InputMaybe<Scalars['ID']>;
  wordpress_id?: InputMaybe<Scalars['Int']>;
};

export type EditRoleInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  type?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type EditTimeRangeTagInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  end?: InputMaybe<Scalars['DateTime']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type EditTitleInput = {
  created_by?: InputMaybe<Scalars['ID']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  published_at?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
  updated_by?: InputMaybe<Scalars['ID']>;
};

export type EditUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']>;
  confirmationToken?: InputMaybe<Scalars['String']>;
  confirmed?: InputMaybe<Scalars['Boolean']>;
  created_by?: InputMaybe<Scalars['ID']>;
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  resetPasswordToken?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['ID']>;
  updated_by?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryTagInput = {
  data?: InputMaybe<EditCategoryTagInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateCategoryTagPayload = {
  categoryTag?: Maybe<CategoryTag>;
};

export type UpdateCommentInput = {
  data?: InputMaybe<EditCommentInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateCommentPayload = {
  comment?: Maybe<Comment>;
};

export type UpdateDescriptionInput = {
  data?: InputMaybe<EditDescriptionInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateDescriptionPayload = {
  description?: Maybe<Description>;
};

export type UpdateKeywordTagInput = {
  data?: InputMaybe<EditKeywordTagInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateKeywordTagPayload = {
  keywordTag?: Maybe<KeywordTag>;
};

export type UpdatePictureInput = {
  data?: InputMaybe<EditPictureInput>;
  where?: InputMaybe<InputId>;
};

export type UpdatePicturePayload = {
  picture?: Maybe<Picture>;
};

export type UpdateRoleInput = {
  data?: InputMaybe<EditRoleInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateRolePayload = {
  role?: Maybe<UsersPermissionsRole>;
};

export type UpdateTimeRangeTagInput = {
  data?: InputMaybe<EditTimeRangeTagInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateTimeRangeTagPayload = {
  timeRangeTag?: Maybe<TimeRangeTag>;
};

export type UpdateTitleInput = {
  data?: InputMaybe<EditTitleInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateTitlePayload = {
  title?: Maybe<Title>;
};

export type UpdateUserInput = {
  data?: InputMaybe<EditUserInput>;
  where?: InputMaybe<InputId>;
};

export type UpdateUserPayload = {
  user?: Maybe<UsersPermissionsUser>;
};

export type GetPictureInfoQueryVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type GetPictureInfoQuery = {
  picture?:
    | {
        title?: { text?: string | null | undefined; id: string } | null | undefined;
        descriptions?:
          | Array<{ text?: string | null | undefined; id: string } | null | undefined>
          | null
          | undefined;
        media?: { url: string } | null | undefined;
        comments?:
          | Array<
              | {
                  text?: string | null | undefined;
                  author?: string | null | undefined;
                  id: string;
                  date?: any | null | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetPicturesQueryVariables = Exact<{
  where: Scalars['JSON'];
  limit: Scalars['Int'];
  start: Scalars['Int'];
}>;

export type GetPicturesQuery = {
  pictures?:
    | Array<
        | {
            id: string;
            media?:
              | {
                  width?: number | null | undefined;
                  height?: number | null | undefined;
                  formats?: any | null | undefined;
                }
              | null
              | undefined;
          }
        | null
        | undefined
      >
    | null
    | undefined;
};

export type GetCategoryInfoQueryVariables = Exact<{
  categoryName?: InputMaybe<Scalars['String']>;
  categoryPriority?: InputMaybe<Scalars['Int']>;
}>;

export type GetCategoryInfoQuery = {
  categoryTags?:
    | Array<
        | {
            id: string;
            name: string;
            description?: string | null | undefined;
            related_tags?:
              | Array<
                  | {
                      name: string;
                      thumbnail?:
                        | Array<
                            | { media?: { formats?: any | null | undefined } | null | undefined }
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    }
                  | null
                  | undefined
                >
              | null
              | undefined;
          }
        | null
        | undefined
      >
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
    | { comment?: { text?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export const GetPictureInfoDocument = gql`
  query getPictureInfo($pictureId: ID!) {
    picture(id: $pictureId) {
      title {
        text
        id
      }
      descriptions {
        text
        id
      }
      media {
        url
      }
      comments {
        text
        author
        id
        date
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
  query getPictures($where: JSON!, $limit: Int!, $start: Int!) {
    pictures(where: $where, limit: $limit, start: $start) {
      id
      media {
        width
        height
        formats
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
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      start: // value for 'start'
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

export const GetCategoryInfoDocument = gql`
  query getCategoryInfo($categoryName: String, $categoryPriority: Int) {
    categoryTags(where: { name: $categoryName, priority: $categoryPriority }) {
      id
      name
      description
      related_tags {
        name
        thumbnail: pictures(limit: 1) {
          media {
            formats
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
      input: {
        data: { author: $author, text: $text, picture: $id, date: $date, published_at: null }
      }
    ) {
      comment {
        text
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
