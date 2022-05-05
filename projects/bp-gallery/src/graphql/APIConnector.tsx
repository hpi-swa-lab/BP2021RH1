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

export type BrowseRootCollection = {
  createdAt?: Maybe<Scalars['DateTime']>;
  current?: Maybe<CollectionEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type BrowseRootCollectionEntity = {
  attributes?: Maybe<BrowseRootCollection>;
  id?: Maybe<Scalars['ID']>;
};

export type BrowseRootCollectionEntityResponse = {
  data?: Maybe<BrowseRootCollectionEntity>;
};

export type BrowseRootCollectionInput = {
  current?: InputMaybe<Scalars['ID']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
};

export type Collection = {
  child_collections?: Maybe<CollectionRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  parent_collections?: Maybe<CollectionRelationResponseCollection>;
  pictures?: Maybe<PictureRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type CollectionChild_CollectionsArgs = {
  filters?: InputMaybe<CollectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CollectionParent_CollectionsArgs = {
  filters?: InputMaybe<CollectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CollectionPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CollectionEntity = {
  attributes?: Maybe<Collection>;
  id?: Maybe<Scalars['ID']>;
};

export type CollectionEntityResponse = {
  data?: Maybe<CollectionEntity>;
};

export type CollectionEntityResponseCollection = {
  data: Array<CollectionEntity>;
  meta: ResponseCollectionMeta;
};

export type CollectionFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<CollectionFiltersInput>>>;
  child_collections?: InputMaybe<CollectionFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CollectionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CollectionFiltersInput>>>;
  parent_collections?: InputMaybe<CollectionFiltersInput>;
  pictures?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  thumbnail?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CollectionInput = {
  child_collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  parent_collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  thumbnail?: InputMaybe<Scalars['String']>;
};

export type CollectionRelationResponseCollection = {
  data: Array<CollectionEntity>;
};

export type Comment = {
  author?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  date: Scalars['DateTime'];
  picture?: Maybe<PictureEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  text: Scalars['String'];
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

export type ComponentCommonSynonyms = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ComponentCommonSynonymsFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentCommonSynonymsFiltersInput>>>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ComponentCommonSynonymsFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentCommonSynonymsFiltersInput>>>;
};

export type ComponentCommonSynonymsInput = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ComponentLocationCoordinates = {
  id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type ComponentLocationCoordinatesInput = {
  id?: InputMaybe<Scalars['ID']>;
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
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
  | BrowseRootCollection
  | Collection
  | Comment
  | ComponentCommonSynonyms
  | ComponentLocationCoordinates
  | Description
  | KeywordTag
  | LocationTag
  | PersonTag
  | Picture
  | TimeRangeTag
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
  synonyms?: Maybe<Array<Maybe<ComponentCommonSynonyms>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified_pictures?: Maybe<PictureRelationResponseCollection>;
};

export type KeywordTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type KeywordTagSynonymsArgs = {
  filters?: InputMaybe<ComponentCommonSynonymsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type KeywordTagVerified_PicturesArgs = {
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
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_pictures?: InputMaybe<PictureFiltersInput>;
};

export type KeywordTagInput = {
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  synonyms?: InputMaybe<Array<InputMaybe<ComponentCommonSynonymsInput>>>;
  verified_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type KeywordTagRelationResponseCollection = {
  data: Array<KeywordTagEntity>;
};

export type LocationTag = {
  coordinates?: Maybe<ComponentLocationCoordinates>;
  createdAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  pictures?: Maybe<PictureRelationResponseCollection>;
  synonyms?: Maybe<Array<Maybe<ComponentCommonSynonyms>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified_pictures?: Maybe<PictureRelationResponseCollection>;
};

export type LocationTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LocationTagSynonymsArgs = {
  filters?: InputMaybe<ComponentCommonSynonymsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LocationTagVerified_PicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LocationTagEntity = {
  attributes?: Maybe<LocationTag>;
  id?: Maybe<Scalars['ID']>;
};

export type LocationTagEntityResponse = {
  data?: Maybe<LocationTagEntity>;
};

export type LocationTagEntityResponseCollection = {
  data: Array<LocationTagEntity>;
  meta: ResponseCollectionMeta;
};

export type LocationTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<LocationTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<LocationTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<LocationTagFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_pictures?: InputMaybe<PictureFiltersInput>;
};

export type LocationTagInput = {
  coordinates?: InputMaybe<ComponentLocationCoordinatesInput>;
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  synonyms?: InputMaybe<Array<InputMaybe<ComponentCommonSynonymsInput>>>;
  verified_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type LocationTagRelationResponseCollection = {
  data: Array<LocationTagEntity>;
};

export type Mutation = {
  createCollection?: Maybe<CollectionEntityResponse>;
  createComment?: Maybe<CommentEntityResponse>;
  createDescription?: Maybe<DescriptionEntityResponse>;
  createKeywordTag?: Maybe<KeywordTagEntityResponse>;
  createLocationTag?: Maybe<LocationTagEntityResponse>;
  createPersonTag?: Maybe<PersonTagEntityResponse>;
  createPicture?: Maybe<PictureEntityResponse>;
  createTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteBrowseRootCollection?: Maybe<BrowseRootCollectionEntityResponse>;
  deleteCollection?: Maybe<CollectionEntityResponse>;
  deleteComment?: Maybe<CommentEntityResponse>;
  deleteDescription?: Maybe<DescriptionEntityResponse>;
  deleteKeywordTag?: Maybe<KeywordTagEntityResponse>;
  deleteLocationTag?: Maybe<LocationTagEntityResponse>;
  deletePersonTag?: Maybe<PersonTagEntityResponse>;
  deletePicture?: Maybe<PictureEntityResponse>;
  deleteTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
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
  updateBrowseRootCollection?: Maybe<BrowseRootCollectionEntityResponse>;
  updateCollection?: Maybe<CollectionEntityResponse>;
  updateComment?: Maybe<CommentEntityResponse>;
  updateDescription?: Maybe<DescriptionEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateKeywordTag?: Maybe<KeywordTagEntityResponse>;
  updateLocationTag?: Maybe<LocationTagEntityResponse>;
  updatePersonTag?: Maybe<PersonTagEntityResponse>;
  updatePicture?: Maybe<PictureEntityResponse>;
  updateTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  upload: UploadFileEntityResponse;
};

export type MutationCreateCollectionArgs = {
  data: CollectionInput;
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

export type MutationCreateLocationTagArgs = {
  data: LocationTagInput;
};

export type MutationCreatePersonTagArgs = {
  data: PersonTagInput;
};

export type MutationCreatePictureArgs = {
  data: PictureInput;
};

export type MutationCreateTimeRangeTagArgs = {
  data: TimeRangeTagInput;
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

export type MutationDeleteCollectionArgs = {
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

export type MutationDeleteLocationTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePersonTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePictureArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTimeRangeTagArgs = {
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

export type MutationUpdateBrowseRootCollectionArgs = {
  data: BrowseRootCollectionInput;
};

export type MutationUpdateCollectionArgs = {
  data: CollectionInput;
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

export type MutationUpdateLocationTagArgs = {
  data: LocationTagInput;
  id: Scalars['ID'];
};

export type MutationUpdatePersonTagArgs = {
  data: PersonTagInput;
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

export type PersonTag = {
  createdAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  pictures?: Maybe<PictureRelationResponseCollection>;
  synonyms?: Maybe<Array<Maybe<ComponentCommonSynonyms>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified_pictures?: Maybe<PictureRelationResponseCollection>;
};

export type PersonTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PersonTagSynonymsArgs = {
  filters?: InputMaybe<ComponentCommonSynonymsFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PersonTagVerified_PicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PersonTagEntity = {
  attributes?: Maybe<PersonTag>;
  id?: Maybe<Scalars['ID']>;
};

export type PersonTagEntityResponse = {
  data?: Maybe<PersonTagEntity>;
};

export type PersonTagEntityResponseCollection = {
  data: Array<PersonTagEntity>;
  meta: ResponseCollectionMeta;
};

export type PersonTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PersonTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<PersonTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PersonTagFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_pictures?: InputMaybe<PictureFiltersInput>;
};

export type PersonTagInput = {
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  synonyms?: InputMaybe<Array<InputMaybe<ComponentCommonSynonymsInput>>>;
  verified_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type PersonTagRelationResponseCollection = {
  data: Array<PersonTagEntity>;
};

export type Picture = {
  archive_identifier?: Maybe<Scalars['String']>;
  collections?: Maybe<CollectionRelationResponseCollection>;
  comments?: Maybe<CommentRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  descriptions?: Maybe<DescriptionRelationResponseCollection>;
  keyword_tags?: Maybe<KeywordTagRelationResponseCollection>;
  location_tags?: Maybe<LocationTagRelationResponseCollection>;
  media: UploadFileEntityResponse;
  person_tags?: Maybe<PersonTagRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  time_range_tag?: Maybe<TimeRangeTagEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified_keyword_tags?: Maybe<KeywordTagRelationResponseCollection>;
  verified_location_tags?: Maybe<LocationTagRelationResponseCollection>;
  verified_person_tags?: Maybe<PersonTagRelationResponseCollection>;
  verified_time_range_tag?: Maybe<TimeRangeTagEntityResponse>;
  wordpress_id?: Maybe<Scalars['Int']>;
};

export type PictureCollectionsArgs = {
  filters?: InputMaybe<CollectionFiltersInput>;
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
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureLocation_TagsArgs = {
  filters?: InputMaybe<LocationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PicturePerson_TagsArgs = {
  filters?: InputMaybe<PersonTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureVerified_Keyword_TagsArgs = {
  filters?: InputMaybe<KeywordTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureVerified_Location_TagsArgs = {
  filters?: InputMaybe<LocationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureVerified_Person_TagsArgs = {
  filters?: InputMaybe<PersonTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
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
  archive_identifier?: InputMaybe<StringFilterInput>;
  collections?: InputMaybe<CollectionFiltersInput>;
  comments?: InputMaybe<CommentFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  descriptions?: InputMaybe<DescriptionFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  keyword_tags?: InputMaybe<KeywordTagFiltersInput>;
  location_tags?: InputMaybe<LocationTagFiltersInput>;
  not?: InputMaybe<PictureFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PictureFiltersInput>>>;
  person_tags?: InputMaybe<PersonTagFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  time_range_tag?: InputMaybe<TimeRangeTagFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_keyword_tags?: InputMaybe<KeywordTagFiltersInput>;
  verified_location_tags?: InputMaybe<LocationTagFiltersInput>;
  verified_person_tags?: InputMaybe<PersonTagFiltersInput>;
  verified_time_range_tag?: InputMaybe<TimeRangeTagFiltersInput>;
  wordpress_id?: InputMaybe<IntFilterInput>;
};

export type PictureInput = {
  archive_identifier?: InputMaybe<Scalars['String']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  comments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  descriptions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  keyword_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  location_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  media?: InputMaybe<Scalars['ID']>;
  person_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  time_range_tag?: InputMaybe<Scalars['ID']>;
  verified_keyword_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  verified_location_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  verified_person_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  verified_time_range_tag?: InputMaybe<Scalars['ID']>;
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
  browseRootCollection?: Maybe<BrowseRootCollectionEntityResponse>;
  collection?: Maybe<CollectionEntityResponse>;
  collections?: Maybe<CollectionEntityResponseCollection>;
  comment?: Maybe<CommentEntityResponse>;
  comments?: Maybe<CommentEntityResponseCollection>;
  description?: Maybe<DescriptionEntityResponse>;
  descriptions?: Maybe<DescriptionEntityResponseCollection>;
  keywordTag?: Maybe<KeywordTagEntityResponse>;
  keywordTags?: Maybe<KeywordTagEntityResponseCollection>;
  locationTag?: Maybe<LocationTagEntityResponse>;
  locationTags?: Maybe<LocationTagEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  personTag?: Maybe<PersonTagEntityResponse>;
  personTags?: Maybe<PersonTagEntityResponseCollection>;
  picture?: Maybe<PictureEntityResponse>;
  pictures?: Maybe<PictureEntityResponseCollection>;
  timeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  timeRangeTags?: Maybe<TimeRangeTagEntityResponseCollection>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};

export type QueryBrowseRootCollectionArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryCollectionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryCollectionsArgs = {
  filters?: InputMaybe<CollectionFiltersInput>;
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
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLocationTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryLocationTagsArgs = {
  filters?: InputMaybe<LocationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryPersonTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryPersonTagsArgs = {
  filters?: InputMaybe<PersonTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
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
  end: Scalars['DateTime'];
  pictures?: Maybe<PictureRelationResponseCollection>;
  start: Scalars['DateTime'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified_pictures?: Maybe<PictureRelationResponseCollection>;
};

export type TimeRangeTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TimeRangeTagVerified_PicturesArgs = {
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
  start?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_pictures?: InputMaybe<PictureFiltersInput>;
};

export type TimeRangeTagInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  start?: InputMaybe<Scalars['DateTime']>;
  verified_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
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
                                attributes?: { start: any; end: any } | null | undefined;
                              }
                            | null
                            | undefined;
                        }
                      | null
                      | undefined;
                    verified_time_range_tag?:
                      | {
                          data?:
                            | {
                                id?: string | null | undefined;
                                attributes?: { start: any; end: any } | null | undefined;
                              }
                            | null
                            | undefined;
                        }
                      | null
                      | undefined;
                    keyword_tags?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | { name: string; updatedAt?: any | null | undefined }
                              | null
                              | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    verified_keyword_tags?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | { name: string; updatedAt?: any | null | undefined }
                              | null
                              | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    location_tags?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | { name: string; updatedAt?: any | null | undefined }
                              | null
                              | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    verified_location_tags?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | { name: string; updatedAt?: any | null | undefined }
                              | null
                              | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    person_tags?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | { name: string; updatedAt?: any | null | undefined }
                              | null
                              | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    verified_person_tags?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | { name: string; updatedAt?: any | null | undefined }
                              | null
                              | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    collections?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?: { name: string } | null | undefined;
                          }>;
                        }
                      | null
                      | undefined;
                    media: {
                      data?:
                        | {
                            id?: string | null | undefined;
                            attributes?:
                              | { url: string; updatedAt?: any | null | undefined }
                              | null
                              | undefined;
                          }
                        | null
                        | undefined;
                    };
                    comments?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | {
                                  text: string;
                                  author?: string | null | undefined;
                                  date: any;
                                  publishedAt?: any | null | undefined;
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
                media: {
                  data?:
                    | {
                        id?: string | null | undefined;
                        attributes?:
                          | {
                              width?: number | null | undefined;
                              height?: number | null | undefined;
                              formats?: any | null | undefined;
                              updatedAt?: any | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined;
                };
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type GetCollectionWithPicturesPublishedAfterQueryVariables = Exact<{
  date: Scalars['DateTime'];
}>;

export type GetCollectionWithPicturesPublishedAfterQuery = {
  collections?: { data: Array<{ id?: string | null | undefined }> } | null | undefined;
};

export type GetCollectionInfoByNameQueryVariables = Exact<{
  collectionName?: InputMaybe<Scalars['String']>;
}>;

export type GetCollectionInfoByNameQuery = {
  collections?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                name: string;
                description?: string | null | undefined;
                child_collections?:
                  | {
                      data: Array<{
                        id?: string | null | undefined;
                        attributes?:
                          | { name: string; thumbnail?: string | null | undefined }
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

export type GetCollectionInfoByIdQueryVariables = Exact<{
  collectionId: Scalars['ID'];
}>;

export type GetCollectionInfoByIdQuery = {
  collection?:
    | {
        data?:
          | {
              id?: string | null | undefined;
              attributes?:
                | {
                    name: string;
                    description?: string | null | undefined;
                    child_collections?:
                      | {
                          data: Array<{
                            id?: string | null | undefined;
                            attributes?:
                              | {
                                  name: string;
                                  pictures?:
                                    | { data: Array<{ id?: string | null | undefined }> }
                                    | null
                                    | undefined;
                                  child_collections?:
                                    | { data: Array<{ id?: string | null | undefined }> }
                                    | null
                                    | undefined;
                                  parent_collections?:
                                    | {
                                        data: Array<{
                                          id?: string | null | undefined;
                                          attributes?: { name: string } | null | undefined;
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
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetRootCollectionQueryVariables = Exact<{ [key: string]: never }>;

export type GetRootCollectionQuery = {
  browseRootCollection?:
    | {
        data?:
          | {
              attributes?:
                | {
                    current?:
                      | {
                          data?:
                            | {
                                id?: string | null | undefined;
                                attributes?: { name: string } | null | undefined;
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
    | { data?: { attributes?: { text: string } | null | undefined } | null | undefined }
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
                              media: {
                                data?:
                                  | {
                                      attributes?:
                                        | { formats?: any | null | undefined }
                                        | null
                                        | undefined;
                                    }
                                  | null
                                  | undefined;
                              };
                            }
                          | null
                          | undefined;
                      }>;
                    }
                  | null
                  | undefined;
                verified_thumbnail?:
                  | {
                      data: Array<{
                        attributes?:
                          | {
                              media: {
                                data?:
                                  | {
                                      attributes?:
                                        | { formats?: any | null | undefined }
                                        | null
                                        | undefined;
                                    }
                                  | null
                                  | undefined;
                              };
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

export type GetAllKeywordTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllKeywordTagsQuery = {
  keywordTags?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                name: string;
                synonyms?: Array<{ name: string } | null | undefined> | null | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type UpdateKeywordNameMutationVariables = Exact<{
  tagId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type UpdateKeywordNameMutation = {
  updateKeywordTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type UpdateKeywordSynonymsMutationVariables = Exact<{
  tagId: Scalars['ID'];
  synonyms:
    | Array<InputMaybe<ComponentCommonSynonymsInput>>
    | InputMaybe<ComponentCommonSynonymsInput>;
}>;

export type UpdateKeywordSynonymsMutation = {
  updateKeywordTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type GetAllLocationTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllLocationTagsQuery = {
  locationTags?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                name: string;
                synonyms?: Array<{ name: string } | null | undefined> | null | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type UpdateLocationNameMutationVariables = Exact<{
  tagId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type UpdateLocationNameMutation = {
  updateLocationTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type UpdateLocationSynonymsMutationVariables = Exact<{
  tagId: Scalars['ID'];
  synonyms:
    | Array<InputMaybe<ComponentCommonSynonymsInput>>
    | InputMaybe<ComponentCommonSynonymsInput>;
}>;

export type UpdateLocationSynonymsMutation = {
  updateLocationTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type GetAllPersonTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllPersonTagsQuery = {
  personTags?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                name: string;
                synonyms?: Array<{ name: string } | null | undefined> | null | undefined;
              }
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type UpdatePersonNameMutationVariables = Exact<{
  tagId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type UpdatePersonNameMutation = {
  updatePersonTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type UpdatePersonSynonymsMutationVariables = Exact<{
  tagId: Scalars['ID'];
  synonyms:
    | Array<InputMaybe<ComponentCommonSynonymsInput>>
    | InputMaybe<ComponentCommonSynonymsInput>;
}>;

export type UpdatePersonSynonymsMutation = {
  updatePersonTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type GetAllCollectionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllCollectionsQuery = {
  collections?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                name: string;
                parent_collections?:
                  | { data: Array<{ id?: string | null | undefined }> }
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
                media: {
                  data?:
                    | { attributes?: { formats?: any | null | undefined } | null | undefined }
                    | null
                    | undefined;
                };
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
                media: {
                  data?:
                    | { attributes?: { formats?: any | null | undefined } | null | undefined }
                    | null
                    | undefined;
                };
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
                media: {
                  data?:
                    | { attributes?: { formats?: any | null | undefined } | null | undefined }
                    | null
                    | undefined;
                };
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
                media: {
                  data?:
                    | { attributes?: { formats?: any | null | undefined } | null | undefined }
                    | null
                    | undefined;
                };
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
                media: {
                  data?:
                    | { attributes?: { formats?: any | null | undefined } | null | undefined }
                    | null
                    | undefined;
                };
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
                media: {
                  data?:
                    | { attributes?: { formats?: any | null | undefined } | null | undefined }
                    | null
                    | undefined;
                };
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

export type CreatePersonTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreatePersonTagMutation = {
  createPersonTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type CreateKeywordTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateKeywordTagMutation = {
  createKeywordTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type CreateLocationTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateLocationTagMutation = {
  createLocationTag?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type CreateSubCollectionMutationVariables = Exact<{
  name: Scalars['String'];
  parentId: Scalars['ID'];
  publishedAt: Scalars['DateTime'];
}>;

export type CreateSubCollectionMutation = {
  createCollection?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type UpdatePictureMutationVariables = Exact<{
  pictureId: Scalars['ID'];
  data: PictureInput;
}>;

export type UpdatePictureMutation = {
  updatePicture?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type CreatePictureMutationVariables = Exact<{
  data: PictureInput;
}>;

export type CreatePictureMutation = {
  createPicture?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type UnpublishPictureMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type UnpublishPictureMutation = {
  updatePicture?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type GetPicturesForCollectionQueryVariables = Exact<{
  collectionId: Scalars['ID'];
}>;

export type GetPicturesForCollectionQuery = {
  collection?:
    | {
        data?:
          | {
              id?: string | null | undefined;
              attributes?:
                | {
                    pictures?:
                      | { data: Array<{ id?: string | null | undefined }> }
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

export type SetPicturesForCollectionMutationVariables = Exact<{
  pictureIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
  collectionId: Scalars['ID'];
}>;

export type SetPicturesForCollectionMutation = {
  updateCollection?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type UpdateCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  data: CollectionInput;
}>;

export type UpdateCollectionMutation = {
  updateCollection?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type GetUnverifiedCommentsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUnverifiedCommentsQuery = {
  comments?:
    | {
        data: Array<{
          id?: string | null | undefined;
          attributes?:
            | {
                text: string;
                author?: string | null | undefined;
                picture?:
                  | {
                      data?:
                        | {
                            id?: string | null | undefined;
                            attributes?:
                              | {
                                  media: {
                                    data?:
                                      | {
                                          id?: string | null | undefined;
                                          attributes?:
                                            | {
                                                width?: number | null | undefined;
                                                height?: number | null | undefined;
                                                formats?: any | null | undefined;
                                                updatedAt?: any | null | undefined;
                                              }
                                            | null
                                            | undefined;
                                        }
                                      | null
                                      | undefined;
                                  };
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

export type AcceptCommentMutationVariables = Exact<{
  commentId: Scalars['ID'];
  currentTime: Scalars['DateTime'];
}>;

export type AcceptCommentMutation = {
  updateComment?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type DeclineCommentMutationVariables = Exact<{
  commentId: Scalars['ID'];
}>;

export type DeclineCommentMutation = {
  deleteComment?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

export type DeleteCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID'];
}>;

export type DeleteCollectionMutation = {
  deleteCollection?:
    | { data?: { id?: string | null | undefined } | null | undefined }
    | null
    | undefined;
};

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
          descriptions(sort: "createdAt:desc") {
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
          verified_time_range_tag {
            data {
              id
              attributes {
                start
                end
              }
            }
          }
          keyword_tags(sort: "updatedAt:asc") {
            data {
              id
              attributes {
                name
                updatedAt
              }
            }
          }
          verified_keyword_tags(sort: "updatedAt:asc") {
            data {
              id
              attributes {
                name
                updatedAt
              }
            }
          }
          location_tags(sort: "updatedAt:asc") {
            data {
              id
              attributes {
                name
                updatedAt
              }
            }
          }
          verified_location_tags(sort: "updatedAt:asc") {
            data {
              id
              attributes {
                name
                updatedAt
              }
            }
          }
          person_tags(sort: "updatedAt:asc") {
            data {
              id
              attributes {
                name
                updatedAt
              }
            }
          }
          verified_person_tags(sort: "updatedAt:asc") {
            data {
              id
              attributes {
                name
                updatedAt
              }
            }
          }
          collections {
            data {
              id
              attributes {
                name
              }
            }
          }
          media {
            data {
              id
              attributes {
                url
                updatedAt
              }
            }
          }
          comments(publicationState: PREVIEW, sort: "date:asc") {
            data {
              id
              attributes {
                text
                author
                date
                publishedAt
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
    pictures(filters: $filters, pagination: $pagination, sort: "publishedAt:asc") {
      data {
        id
        attributes {
          media {
            data {
              id
              attributes {
                width
                height
                formats
                updatedAt
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

export const GetCollectionWithPicturesPublishedAfterDocument = gql`
  query getCollectionWithPicturesPublishedAfter($date: DateTime!) {
    collections(filters: { pictures: { publishedAt: { gt: $date } } }) {
      data {
        id
      }
    }
  }
`;

/**
 * __useGetCollectionWithPicturesPublishedAfterQuery__
 *
 * To run a query within a React component, call `useGetCollectionWithPicturesPublishedAfterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionWithPicturesPublishedAfterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionWithPicturesPublishedAfterQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useGetCollectionWithPicturesPublishedAfterQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionWithPicturesPublishedAfterQuery,
    GetCollectionWithPicturesPublishedAfterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollectionWithPicturesPublishedAfterQuery,
    GetCollectionWithPicturesPublishedAfterQueryVariables
  >(GetCollectionWithPicturesPublishedAfterDocument, options);
}

export function useGetCollectionWithPicturesPublishedAfterLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionWithPicturesPublishedAfterQuery,
    GetCollectionWithPicturesPublishedAfterQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollectionWithPicturesPublishedAfterQuery,
    GetCollectionWithPicturesPublishedAfterQueryVariables
  >(GetCollectionWithPicturesPublishedAfterDocument, options);
}

export type GetCollectionWithPicturesPublishedAfterQueryHookResult = ReturnType<
  typeof useGetCollectionWithPicturesPublishedAfterQuery
>;

export type GetCollectionWithPicturesPublishedAfterLazyQueryHookResult = ReturnType<
  typeof useGetCollectionWithPicturesPublishedAfterLazyQuery
>;

export type GetCollectionWithPicturesPublishedAfterQueryResult = Apollo.QueryResult<
  GetCollectionWithPicturesPublishedAfterQuery,
  GetCollectionWithPicturesPublishedAfterQueryVariables
>;

export const GetCollectionInfoByNameDocument = gql`
  query getCollectionInfoByName($collectionName: String) {
    collections(filters: { name: { eq: $collectionName } }) {
      data {
        id
        attributes {
          name
          description
          child_collections(sort: "name:asc") {
            data {
              id
              attributes {
                name
                thumbnail
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetCollectionInfoByNameQuery__
 *
 * To run a query within a React component, call `useGetCollectionInfoByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionInfoByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionInfoByNameQuery({
 *   variables: {
 *      collectionName: // value for 'collectionName'
 *   },
 * });
 */
export function useGetCollectionInfoByNameQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCollectionInfoByNameQuery,
    GetCollectionInfoByNameQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectionInfoByNameQuery, GetCollectionInfoByNameQueryVariables>(
    GetCollectionInfoByNameDocument,
    options
  );
}

export function useGetCollectionInfoByNameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionInfoByNameQuery,
    GetCollectionInfoByNameQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectionInfoByNameQuery, GetCollectionInfoByNameQueryVariables>(
    GetCollectionInfoByNameDocument,
    options
  );
}

export type GetCollectionInfoByNameQueryHookResult = ReturnType<
  typeof useGetCollectionInfoByNameQuery
>;

export type GetCollectionInfoByNameLazyQueryHookResult = ReturnType<
  typeof useGetCollectionInfoByNameLazyQuery
>;

export type GetCollectionInfoByNameQueryResult = Apollo.QueryResult<
  GetCollectionInfoByNameQuery,
  GetCollectionInfoByNameQueryVariables
>;

export const GetCollectionInfoByIdDocument = gql`
  query getCollectionInfoById($collectionId: ID!) {
    collection(id: $collectionId) {
      data {
        id
        attributes {
          name
          description
          child_collections(sort: "name:asc") {
            data {
              id
              attributes {
                name
                pictures(pagination: { limit: 1 }) {
                  data {
                    id
                  }
                }
                child_collections(pagination: { limit: 1 }) {
                  data {
                    id
                  }
                }
                parent_collections {
                  data {
                    id
                    attributes {
                      name
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
 * __useGetCollectionInfoByIdQuery__
 *
 * To run a query within a React component, call `useGetCollectionInfoByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionInfoByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionInfoByIdQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useGetCollectionInfoByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionInfoByIdQuery,
    GetCollectionInfoByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectionInfoByIdQuery, GetCollectionInfoByIdQueryVariables>(
    GetCollectionInfoByIdDocument,
    options
  );
}

export function useGetCollectionInfoByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionInfoByIdQuery,
    GetCollectionInfoByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectionInfoByIdQuery, GetCollectionInfoByIdQueryVariables>(
    GetCollectionInfoByIdDocument,
    options
  );
}

export type GetCollectionInfoByIdQueryHookResult = ReturnType<typeof useGetCollectionInfoByIdQuery>;

export type GetCollectionInfoByIdLazyQueryHookResult = ReturnType<
  typeof useGetCollectionInfoByIdLazyQuery
>;

export type GetCollectionInfoByIdQueryResult = Apollo.QueryResult<
  GetCollectionInfoByIdQuery,
  GetCollectionInfoByIdQueryVariables
>;

export const GetRootCollectionDocument = gql`
  query getRootCollection {
    browseRootCollection {
      data {
        attributes {
          current {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetRootCollectionQuery__
 *
 * To run a query within a React component, call `useGetRootCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRootCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRootCollectionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRootCollectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetRootCollectionQuery, GetRootCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRootCollectionQuery, GetRootCollectionQueryVariables>(
    GetRootCollectionDocument,
    options
  );
}

export function useGetRootCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetRootCollectionQuery, GetRootCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRootCollectionQuery, GetRootCollectionQueryVariables>(
    GetRootCollectionDocument,
    options
  );
}

export type GetRootCollectionQueryHookResult = ReturnType<typeof useGetRootCollectionQuery>;

export type GetRootCollectionLazyQueryHookResult = ReturnType<typeof useGetRootCollectionLazyQuery>;

export type GetRootCollectionQueryResult = Apollo.QueryResult<
  GetRootCollectionQuery,
  GetRootCollectionQueryVariables
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
          verified_thumbnail: verified_pictures(pagination: { limit: 1 }) {
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

export const GetAllKeywordTagsDocument = gql`
  query getAllKeywordTags {
    keywordTags {
      data {
        id
        attributes {
          name
          synonyms {
            name
          }
        }
      }
    }
  }
`;

/**
 * __useGetAllKeywordTagsQuery__
 *
 * To run a query within a React component, call `useGetAllKeywordTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllKeywordTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllKeywordTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllKeywordTagsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllKeywordTagsQuery, GetAllKeywordTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllKeywordTagsQuery, GetAllKeywordTagsQueryVariables>(
    GetAllKeywordTagsDocument,
    options
  );
}

export function useGetAllKeywordTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAllKeywordTagsQuery, GetAllKeywordTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllKeywordTagsQuery, GetAllKeywordTagsQueryVariables>(
    GetAllKeywordTagsDocument,
    options
  );
}

export type GetAllKeywordTagsQueryHookResult = ReturnType<typeof useGetAllKeywordTagsQuery>;

export type GetAllKeywordTagsLazyQueryHookResult = ReturnType<typeof useGetAllKeywordTagsLazyQuery>;

export type GetAllKeywordTagsQueryResult = Apollo.QueryResult<
  GetAllKeywordTagsQuery,
  GetAllKeywordTagsQueryVariables
>;

export const UpdateKeywordNameDocument = gql`
  mutation updateKeywordName($tagId: ID!, $name: String!) {
    updateKeywordTag(id: $tagId, data: { name: $name }) {
      data {
        id
      }
    }
  }
`;

export type UpdateKeywordNameMutationFn = Apollo.MutationFunction<
  UpdateKeywordNameMutation,
  UpdateKeywordNameMutationVariables
>;

/**
 * __useUpdateKeywordNameMutation__
 *
 * To run a mutation, you first call `useUpdateKeywordNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateKeywordNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateKeywordNameMutation, { data, loading, error }] = useUpdateKeywordNameMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateKeywordNameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateKeywordNameMutation,
    UpdateKeywordNameMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateKeywordNameMutation, UpdateKeywordNameMutationVariables>(
    UpdateKeywordNameDocument,
    options
  );
}

export type UpdateKeywordNameMutationHookResult = ReturnType<typeof useUpdateKeywordNameMutation>;

export type UpdateKeywordNameMutationResult = Apollo.MutationResult<UpdateKeywordNameMutation>;

export type UpdateKeywordNameMutationOptions = Apollo.BaseMutationOptions<
  UpdateKeywordNameMutation,
  UpdateKeywordNameMutationVariables
>;

export const UpdateKeywordSynonymsDocument = gql`
  mutation updateKeywordSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
    updateKeywordTag(id: $tagId, data: { synonyms: $synonyms }) {
      data {
        id
      }
    }
  }
`;

export type UpdateKeywordSynonymsMutationFn = Apollo.MutationFunction<
  UpdateKeywordSynonymsMutation,
  UpdateKeywordSynonymsMutationVariables
>;

/**
 * __useUpdateKeywordSynonymsMutation__
 *
 * To run a mutation, you first call `useUpdateKeywordSynonymsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateKeywordSynonymsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateKeywordSynonymsMutation, { data, loading, error }] = useUpdateKeywordSynonymsMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      synonyms: // value for 'synonyms'
 *   },
 * });
 */
export function useUpdateKeywordSynonymsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateKeywordSynonymsMutation,
    UpdateKeywordSynonymsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateKeywordSynonymsMutation, UpdateKeywordSynonymsMutationVariables>(
    UpdateKeywordSynonymsDocument,
    options
  );
}

export type UpdateKeywordSynonymsMutationHookResult = ReturnType<
  typeof useUpdateKeywordSynonymsMutation
>;

export type UpdateKeywordSynonymsMutationResult =
  Apollo.MutationResult<UpdateKeywordSynonymsMutation>;

export type UpdateKeywordSynonymsMutationOptions = Apollo.BaseMutationOptions<
  UpdateKeywordSynonymsMutation,
  UpdateKeywordSynonymsMutationVariables
>;

export const GetAllLocationTagsDocument = gql`
  query getAllLocationTags {
    locationTags {
      data {
        id
        attributes {
          name
          synonyms {
            name
          }
        }
      }
    }
  }
`;

/**
 * __useGetAllLocationTagsQuery__
 *
 * To run a query within a React component, call `useGetAllLocationTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllLocationTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllLocationTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllLocationTagsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllLocationTagsQuery, GetAllLocationTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllLocationTagsQuery, GetAllLocationTagsQueryVariables>(
    GetAllLocationTagsDocument,
    options
  );
}

export function useGetAllLocationTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllLocationTagsQuery,
    GetAllLocationTagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllLocationTagsQuery, GetAllLocationTagsQueryVariables>(
    GetAllLocationTagsDocument,
    options
  );
}

export type GetAllLocationTagsQueryHookResult = ReturnType<typeof useGetAllLocationTagsQuery>;

export type GetAllLocationTagsLazyQueryHookResult = ReturnType<
  typeof useGetAllLocationTagsLazyQuery
>;

export type GetAllLocationTagsQueryResult = Apollo.QueryResult<
  GetAllLocationTagsQuery,
  GetAllLocationTagsQueryVariables
>;

export const UpdateLocationNameDocument = gql`
  mutation updateLocationName($tagId: ID!, $name: String!) {
    updateLocationTag(id: $tagId, data: { name: $name }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationNameMutationFn = Apollo.MutationFunction<
  UpdateLocationNameMutation,
  UpdateLocationNameMutationVariables
>;

/**
 * __useUpdateLocationNameMutation__
 *
 * To run a mutation, you first call `useUpdateLocationNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationNameMutation, { data, loading, error }] = useUpdateLocationNameMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateLocationNameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationNameMutation,
    UpdateLocationNameMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateLocationNameMutation, UpdateLocationNameMutationVariables>(
    UpdateLocationNameDocument,
    options
  );
}

export type UpdateLocationNameMutationHookResult = ReturnType<typeof useUpdateLocationNameMutation>;

export type UpdateLocationNameMutationResult = Apollo.MutationResult<UpdateLocationNameMutation>;

export type UpdateLocationNameMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationNameMutation,
  UpdateLocationNameMutationVariables
>;

export const UpdateLocationSynonymsDocument = gql`
  mutation updateLocationSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
    updateLocationTag(id: $tagId, data: { synonyms: $synonyms }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationSynonymsMutationFn = Apollo.MutationFunction<
  UpdateLocationSynonymsMutation,
  UpdateLocationSynonymsMutationVariables
>;

/**
 * __useUpdateLocationSynonymsMutation__
 *
 * To run a mutation, you first call `useUpdateLocationSynonymsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationSynonymsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationSynonymsMutation, { data, loading, error }] = useUpdateLocationSynonymsMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      synonyms: // value for 'synonyms'
 *   },
 * });
 */
export function useUpdateLocationSynonymsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationSynonymsMutation,
    UpdateLocationSynonymsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateLocationSynonymsMutation,
    UpdateLocationSynonymsMutationVariables
  >(UpdateLocationSynonymsDocument, options);
}

export type UpdateLocationSynonymsMutationHookResult = ReturnType<
  typeof useUpdateLocationSynonymsMutation
>;

export type UpdateLocationSynonymsMutationResult =
  Apollo.MutationResult<UpdateLocationSynonymsMutation>;

export type UpdateLocationSynonymsMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationSynonymsMutation,
  UpdateLocationSynonymsMutationVariables
>;

export const GetAllPersonTagsDocument = gql`
  query getAllPersonTags {
    personTags {
      data {
        id
        attributes {
          name
          synonyms {
            name
          }
        }
      }
    }
  }
`;

/**
 * __useGetAllPersonTagsQuery__
 *
 * To run a query within a React component, call `useGetAllPersonTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPersonTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPersonTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPersonTagsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllPersonTagsQuery, GetAllPersonTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllPersonTagsQuery, GetAllPersonTagsQueryVariables>(
    GetAllPersonTagsDocument,
    options
  );
}

export function useGetAllPersonTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAllPersonTagsQuery, GetAllPersonTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllPersonTagsQuery, GetAllPersonTagsQueryVariables>(
    GetAllPersonTagsDocument,
    options
  );
}

export type GetAllPersonTagsQueryHookResult = ReturnType<typeof useGetAllPersonTagsQuery>;

export type GetAllPersonTagsLazyQueryHookResult = ReturnType<typeof useGetAllPersonTagsLazyQuery>;

export type GetAllPersonTagsQueryResult = Apollo.QueryResult<
  GetAllPersonTagsQuery,
  GetAllPersonTagsQueryVariables
>;

export const UpdatePersonNameDocument = gql`
  mutation updatePersonName($tagId: ID!, $name: String!) {
    updatePersonTag(id: $tagId, data: { name: $name }) {
      data {
        id
      }
    }
  }
`;

export type UpdatePersonNameMutationFn = Apollo.MutationFunction<
  UpdatePersonNameMutation,
  UpdatePersonNameMutationVariables
>;

/**
 * __useUpdatePersonNameMutation__
 *
 * To run a mutation, you first call `useUpdatePersonNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonNameMutation, { data, loading, error }] = useUpdatePersonNameMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdatePersonNameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePersonNameMutation,
    UpdatePersonNameMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdatePersonNameMutation, UpdatePersonNameMutationVariables>(
    UpdatePersonNameDocument,
    options
  );
}

export type UpdatePersonNameMutationHookResult = ReturnType<typeof useUpdatePersonNameMutation>;

export type UpdatePersonNameMutationResult = Apollo.MutationResult<UpdatePersonNameMutation>;

export type UpdatePersonNameMutationOptions = Apollo.BaseMutationOptions<
  UpdatePersonNameMutation,
  UpdatePersonNameMutationVariables
>;

export const UpdatePersonSynonymsDocument = gql`
  mutation updatePersonSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
    updatePersonTag(id: $tagId, data: { synonyms: $synonyms }) {
      data {
        id
      }
    }
  }
`;

export type UpdatePersonSynonymsMutationFn = Apollo.MutationFunction<
  UpdatePersonSynonymsMutation,
  UpdatePersonSynonymsMutationVariables
>;

/**
 * __useUpdatePersonSynonymsMutation__
 *
 * To run a mutation, you first call `useUpdatePersonSynonymsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonSynonymsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonSynonymsMutation, { data, loading, error }] = useUpdatePersonSynonymsMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      synonyms: // value for 'synonyms'
 *   },
 * });
 */
export function useUpdatePersonSynonymsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePersonSynonymsMutation,
    UpdatePersonSynonymsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdatePersonSynonymsMutation, UpdatePersonSynonymsMutationVariables>(
    UpdatePersonSynonymsDocument,
    options
  );
}

export type UpdatePersonSynonymsMutationHookResult = ReturnType<
  typeof useUpdatePersonSynonymsMutation
>;

export type UpdatePersonSynonymsMutationResult =
  Apollo.MutationResult<UpdatePersonSynonymsMutation>;

export type UpdatePersonSynonymsMutationOptions = Apollo.BaseMutationOptions<
  UpdatePersonSynonymsMutation,
  UpdatePersonSynonymsMutationVariables
>;

export const GetAllCollectionsDocument = gql`
  query getAllCollections {
    collections {
      data {
        id
        attributes {
          name
          parent_collections {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetAllCollectionsQuery__
 *
 * To run a query within a React component, call `useGetAllCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCollectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCollectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>(
    GetAllCollectionsDocument,
    options
  );
}

export function useGetAllCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllCollectionsQuery, GetAllCollectionsQueryVariables>(
    GetAllCollectionsDocument,
    options
  );
}

export type GetAllCollectionsQueryHookResult = ReturnType<typeof useGetAllCollectionsQuery>;

export type GetAllCollectionsLazyQueryHookResult = ReturnType<typeof useGetAllCollectionsLazyQuery>;

export type GetAllCollectionsQueryResult = Apollo.QueryResult<
  GetAllCollectionsQuery,
  GetAllCollectionsQueryVariables
>;

export const GetDecadePreviewThumbnailsDocument = gql`
  query getDecadePreviewThumbnails {
    s40: pictures(
      filters: {
        or: [
          {
            time_range_tag: {
              start: { gte: "1900-01-01T00:00:00Z" }
              end: { lte: "1949-12-31T23:59:59Z" }
            }
          }
          {
            verified_time_range_tag: {
              start: { gte: "1900-01-01T00:00:00Z" }
              end: { lte: "1949-12-31T23:59:59Z" }
            }
          }
        ]
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
        or: [
          {
            time_range_tag: {
              start: { gte: "1950-01-01T00:00:00Z" }
              end: { lte: "1959-12-31T23:59:59Z" }
            }
          }
          {
            verified_time_range_tag: {
              start: { gte: "1950-01-01T00:00:00Z" }
              end: { lte: "1959-12-31T23:59:59Z" }
            }
          }
        ]
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
        or: [
          {
            time_range_tag: {
              start: { gte: "1960-01-01T00:00:00Z" }
              end: { lte: "1969-12-31T23:59:59Z" }
            }
          }
          {
            verified_time_range_tag: {
              start: { gte: "1960-01-01T00:00:00Z" }
              end: { lte: "1969-12-31T23:59:59Z" }
            }
          }
        ]
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
        or: [
          {
            time_range_tag: {
              start: { gte: "1970-01-01T00:00:00Z" }
              end: { lte: "1979-12-31T23:59:59Z" }
            }
          }
          {
            verified_time_range_tag: {
              start: { gte: "1970-01-01T00:00:00Z" }
              end: { lte: "1979-12-31T23:59:59Z" }
            }
          }
        ]
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
        or: [
          {
            time_range_tag: {
              start: { gte: "1980-01-01T00:00:00Z" }
              end: { lte: "1989-12-31T23:59:59Z" }
            }
          }
          {
            verified_time_range_tag: {
              start: { gte: "1980-01-01T00:00:00Z" }
              end: { lte: "1989-12-31T23:59:59Z" }
            }
          }
        ]
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
        or: [
          {
            time_range_tag: {
              start: { gte: "1990-01-01T00:00:00Z" }
              end: { lte: "1999-12-31T23:59:59Z" }
            }
          }
          {
            verified_time_range_tag: {
              start: { gte: "1990-01-01T00:00:00Z" }
              end: { lte: "1999-12-31T23:59:59Z" }
            }
          }
        ]
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

export const CreatePersonTagDocument = gql`
  mutation createPersonTag($name: String!) {
    createPersonTag(data: { name: $name }) {
      data {
        id
      }
    }
  }
`;

export type CreatePersonTagMutationFn = Apollo.MutationFunction<
  CreatePersonTagMutation,
  CreatePersonTagMutationVariables
>;

/**
 * __useCreatePersonTagMutation__
 *
 * To run a mutation, you first call `useCreatePersonTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePersonTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPersonTagMutation, { data, loading, error }] = useCreatePersonTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreatePersonTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePersonTagMutation,
    CreatePersonTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreatePersonTagMutation, CreatePersonTagMutationVariables>(
    CreatePersonTagDocument,
    options
  );
}

export type CreatePersonTagMutationHookResult = ReturnType<typeof useCreatePersonTagMutation>;

export type CreatePersonTagMutationResult = Apollo.MutationResult<CreatePersonTagMutation>;

export type CreatePersonTagMutationOptions = Apollo.BaseMutationOptions<
  CreatePersonTagMutation,
  CreatePersonTagMutationVariables
>;

export const CreateKeywordTagDocument = gql`
  mutation createKeywordTag($name: String!) {
    createKeywordTag(data: { name: $name }) {
      data {
        id
      }
    }
  }
`;

export type CreateKeywordTagMutationFn = Apollo.MutationFunction<
  CreateKeywordTagMutation,
  CreateKeywordTagMutationVariables
>;

/**
 * __useCreateKeywordTagMutation__
 *
 * To run a mutation, you first call `useCreateKeywordTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateKeywordTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createKeywordTagMutation, { data, loading, error }] = useCreateKeywordTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateKeywordTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateKeywordTagMutation,
    CreateKeywordTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateKeywordTagMutation, CreateKeywordTagMutationVariables>(
    CreateKeywordTagDocument,
    options
  );
}

export type CreateKeywordTagMutationHookResult = ReturnType<typeof useCreateKeywordTagMutation>;

export type CreateKeywordTagMutationResult = Apollo.MutationResult<CreateKeywordTagMutation>;

export type CreateKeywordTagMutationOptions = Apollo.BaseMutationOptions<
  CreateKeywordTagMutation,
  CreateKeywordTagMutationVariables
>;

export const CreateLocationTagDocument = gql`
  mutation createLocationTag($name: String!) {
    createLocationTag(data: { name: $name }) {
      data {
        id
      }
    }
  }
`;

export type CreateLocationTagMutationFn = Apollo.MutationFunction<
  CreateLocationTagMutation,
  CreateLocationTagMutationVariables
>;

/**
 * __useCreateLocationTagMutation__
 *
 * To run a mutation, you first call `useCreateLocationTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLocationTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLocationTagMutation, { data, loading, error }] = useCreateLocationTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateLocationTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateLocationTagMutation,
    CreateLocationTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateLocationTagMutation, CreateLocationTagMutationVariables>(
    CreateLocationTagDocument,
    options
  );
}

export type CreateLocationTagMutationHookResult = ReturnType<typeof useCreateLocationTagMutation>;

export type CreateLocationTagMutationResult = Apollo.MutationResult<CreateLocationTagMutation>;

export type CreateLocationTagMutationOptions = Apollo.BaseMutationOptions<
  CreateLocationTagMutation,
  CreateLocationTagMutationVariables
>;

export const CreateSubCollectionDocument = gql`
  mutation createSubCollection($name: String!, $parentId: ID!, $publishedAt: DateTime!) {
    createCollection(
      data: { name: $name, parent_collections: [$parentId], publishedAt: $publishedAt }
    ) {
      data {
        id
      }
    }
  }
`;

export type CreateSubCollectionMutationFn = Apollo.MutationFunction<
  CreateSubCollectionMutation,
  CreateSubCollectionMutationVariables
>;

/**
 * __useCreateSubCollectionMutation__
 *
 * To run a mutation, you first call `useCreateSubCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubCollectionMutation, { data, loading, error }] = useCreateSubCollectionMutation({
 *   variables: {
 *      name: // value for 'name'
 *      parentId: // value for 'parentId'
 *      publishedAt: // value for 'publishedAt'
 *   },
 * });
 */
export function useCreateSubCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSubCollectionMutation,
    CreateSubCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateSubCollectionMutation, CreateSubCollectionMutationVariables>(
    CreateSubCollectionDocument,
    options
  );
}

export type CreateSubCollectionMutationHookResult = ReturnType<
  typeof useCreateSubCollectionMutation
>;

export type CreateSubCollectionMutationResult = Apollo.MutationResult<CreateSubCollectionMutation>;

export type CreateSubCollectionMutationOptions = Apollo.BaseMutationOptions<
  CreateSubCollectionMutation,
  CreateSubCollectionMutationVariables
>;

export const UpdatePictureDocument = gql`
  mutation updatePicture($pictureId: ID!, $data: PictureInput!) {
    updatePicture(id: $pictureId, data: $data) {
      data {
        id
      }
    }
  }
`;

export type UpdatePictureMutationFn = Apollo.MutationFunction<
  UpdatePictureMutation,
  UpdatePictureMutationVariables
>;

/**
 * __useUpdatePictureMutation__
 *
 * To run a mutation, you first call `useUpdatePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePictureMutation, { data, loading, error }] = useUpdatePictureMutation({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdatePictureMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdatePictureMutation, UpdatePictureMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdatePictureMutation, UpdatePictureMutationVariables>(
    UpdatePictureDocument,
    options
  );
}

export type UpdatePictureMutationHookResult = ReturnType<typeof useUpdatePictureMutation>;

export type UpdatePictureMutationResult = Apollo.MutationResult<UpdatePictureMutation>;

export type UpdatePictureMutationOptions = Apollo.BaseMutationOptions<
  UpdatePictureMutation,
  UpdatePictureMutationVariables
>;

export const CreatePictureDocument = gql`
  mutation createPicture($data: PictureInput!) {
    createPicture(data: $data) {
      data {
        id
      }
    }
  }
`;

export type CreatePictureMutationFn = Apollo.MutationFunction<
  CreatePictureMutation,
  CreatePictureMutationVariables
>;

/**
 * __useCreatePictureMutation__
 *
 * To run a mutation, you first call `useCreatePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPictureMutation, { data, loading, error }] = useCreatePictureMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePictureMutation(
  baseOptions?: Apollo.MutationHookOptions<CreatePictureMutation, CreatePictureMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreatePictureMutation, CreatePictureMutationVariables>(
    CreatePictureDocument,
    options
  );
}

export type CreatePictureMutationHookResult = ReturnType<typeof useCreatePictureMutation>;

export type CreatePictureMutationResult = Apollo.MutationResult<CreatePictureMutation>;

export type CreatePictureMutationOptions = Apollo.BaseMutationOptions<
  CreatePictureMutation,
  CreatePictureMutationVariables
>;

export const UnpublishPictureDocument = gql`
  mutation unpublishPicture($id: ID!) {
    updatePicture(id: $id, data: { publishedAt: null }) {
      data {
        id
      }
    }
  }
`;

export type UnpublishPictureMutationFn = Apollo.MutationFunction<
  UnpublishPictureMutation,
  UnpublishPictureMutationVariables
>;

/**
 * __useUnpublishPictureMutation__
 *
 * To run a mutation, you first call `useUnpublishPictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishPictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishPictureMutation, { data, loading, error }] = useUnpublishPictureMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnpublishPictureMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnpublishPictureMutation,
    UnpublishPictureMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnpublishPictureMutation, UnpublishPictureMutationVariables>(
    UnpublishPictureDocument,
    options
  );
}

export type UnpublishPictureMutationHookResult = ReturnType<typeof useUnpublishPictureMutation>;

export type UnpublishPictureMutationResult = Apollo.MutationResult<UnpublishPictureMutation>;

export type UnpublishPictureMutationOptions = Apollo.BaseMutationOptions<
  UnpublishPictureMutation,
  UnpublishPictureMutationVariables
>;

export const GetPicturesForCollectionDocument = gql`
  query getPicturesForCollection($collectionId: ID!) {
    collection(id: $collectionId) {
      data {
        id
        attributes {
          pictures {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetPicturesForCollectionQuery__
 *
 * To run a query within a React component, call `useGetPicturesForCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPicturesForCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPicturesForCollectionQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useGetPicturesForCollectionQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetPicturesForCollectionQuery,
    GetPicturesForCollectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPicturesForCollectionQuery, GetPicturesForCollectionQueryVariables>(
    GetPicturesForCollectionDocument,
    options
  );
}

export function useGetPicturesForCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPicturesForCollectionQuery,
    GetPicturesForCollectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPicturesForCollectionQuery, GetPicturesForCollectionQueryVariables>(
    GetPicturesForCollectionDocument,
    options
  );
}

export type GetPicturesForCollectionQueryHookResult = ReturnType<
  typeof useGetPicturesForCollectionQuery
>;

export type GetPicturesForCollectionLazyQueryHookResult = ReturnType<
  typeof useGetPicturesForCollectionLazyQuery
>;

export type GetPicturesForCollectionQueryResult = Apollo.QueryResult<
  GetPicturesForCollectionQuery,
  GetPicturesForCollectionQueryVariables
>;

export const SetPicturesForCollectionDocument = gql`
  mutation setPicturesForCollection($pictureIds: [ID]!, $collectionId: ID!) {
    updateCollection(id: $collectionId, data: { pictures: $pictureIds }) {
      data {
        id
      }
    }
  }
`;

export type SetPicturesForCollectionMutationFn = Apollo.MutationFunction<
  SetPicturesForCollectionMutation,
  SetPicturesForCollectionMutationVariables
>;

/**
 * __useSetPicturesForCollectionMutation__
 *
 * To run a mutation, you first call `useSetPicturesForCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPicturesForCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPicturesForCollectionMutation, { data, loading, error }] = useSetPicturesForCollectionMutation({
 *   variables: {
 *      pictureIds: // value for 'pictureIds'
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useSetPicturesForCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetPicturesForCollectionMutation,
    SetPicturesForCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SetPicturesForCollectionMutation,
    SetPicturesForCollectionMutationVariables
  >(SetPicturesForCollectionDocument, options);
}

export type SetPicturesForCollectionMutationHookResult = ReturnType<
  typeof useSetPicturesForCollectionMutation
>;

export type SetPicturesForCollectionMutationResult =
  Apollo.MutationResult<SetPicturesForCollectionMutation>;

export type SetPicturesForCollectionMutationOptions = Apollo.BaseMutationOptions<
  SetPicturesForCollectionMutation,
  SetPicturesForCollectionMutationVariables
>;

export const UpdateCollectionDocument = gql`
  mutation updateCollection($collectionId: ID!, $data: CollectionInput!) {
    updateCollection(id: $collectionId, data: $data) {
      data {
        id
      }
    }
  }
`;

export type UpdateCollectionMutationFn = Apollo.MutationFunction<
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables
>;

/**
 * __useUpdateCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionMutation, { data, loading, error }] = useUpdateCollectionMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionMutation,
    UpdateCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateCollectionMutation, UpdateCollectionMutationVariables>(
    UpdateCollectionDocument,
    options
  );
}

export type UpdateCollectionMutationHookResult = ReturnType<typeof useUpdateCollectionMutation>;

export type UpdateCollectionMutationResult = Apollo.MutationResult<UpdateCollectionMutation>;

export type UpdateCollectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables
>;

export const GetUnverifiedCommentsDocument = gql`
  query getUnverifiedComments {
    comments(filters: { publishedAt: { null: true } }, publicationState: PREVIEW) {
      data {
        id
        attributes {
          picture {
            data {
              id
              attributes {
                media {
                  data {
                    id
                    attributes {
                      width
                      height
                      formats
                      updatedAt
                    }
                  }
                }
              }
            }
          }
          text
          author
        }
      }
    }
  }
`;

/**
 * __useGetUnverifiedCommentsQuery__
 *
 * To run a query within a React component, call `useGetUnverifiedCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUnverifiedCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnverifiedCommentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUnverifiedCommentsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUnverifiedCommentsQuery,
    GetUnverifiedCommentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUnverifiedCommentsQuery, GetUnverifiedCommentsQueryVariables>(
    GetUnverifiedCommentsDocument,
    options
  );
}

export function useGetUnverifiedCommentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUnverifiedCommentsQuery,
    GetUnverifiedCommentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUnverifiedCommentsQuery, GetUnverifiedCommentsQueryVariables>(
    GetUnverifiedCommentsDocument,
    options
  );
}

export type GetUnverifiedCommentsQueryHookResult = ReturnType<typeof useGetUnverifiedCommentsQuery>;

export type GetUnverifiedCommentsLazyQueryHookResult = ReturnType<
  typeof useGetUnverifiedCommentsLazyQuery
>;

export type GetUnverifiedCommentsQueryResult = Apollo.QueryResult<
  GetUnverifiedCommentsQuery,
  GetUnverifiedCommentsQueryVariables
>;

export const AcceptCommentDocument = gql`
  mutation acceptComment($commentId: ID!, $currentTime: DateTime!) {
    updateComment(id: $commentId, data: { publishedAt: $currentTime }) {
      data {
        id
      }
    }
  }
`;

export type AcceptCommentMutationFn = Apollo.MutationFunction<
  AcceptCommentMutation,
  AcceptCommentMutationVariables
>;

/**
 * __useAcceptCommentMutation__
 *
 * To run a mutation, you first call `useAcceptCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptCommentMutation, { data, loading, error }] = useAcceptCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *      currentTime: // value for 'currentTime'
 *   },
 * });
 */
export function useAcceptCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<AcceptCommentMutation, AcceptCommentMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AcceptCommentMutation, AcceptCommentMutationVariables>(
    AcceptCommentDocument,
    options
  );
}

export type AcceptCommentMutationHookResult = ReturnType<typeof useAcceptCommentMutation>;

export type AcceptCommentMutationResult = Apollo.MutationResult<AcceptCommentMutation>;

export type AcceptCommentMutationOptions = Apollo.BaseMutationOptions<
  AcceptCommentMutation,
  AcceptCommentMutationVariables
>;

export const DeclineCommentDocument = gql`
  mutation declineComment($commentId: ID!) {
    deleteComment(id: $commentId) {
      data {
        id
      }
    }
  }
`;

export type DeclineCommentMutationFn = Apollo.MutationFunction<
  DeclineCommentMutation,
  DeclineCommentMutationVariables
>;

/**
 * __useDeclineCommentMutation__
 *
 * To run a mutation, you first call `useDeclineCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeclineCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [declineCommentMutation, { data, loading, error }] = useDeclineCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useDeclineCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<DeclineCommentMutation, DeclineCommentMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeclineCommentMutation, DeclineCommentMutationVariables>(
    DeclineCommentDocument,
    options
  );
}

export type DeclineCommentMutationHookResult = ReturnType<typeof useDeclineCommentMutation>;

export type DeclineCommentMutationResult = Apollo.MutationResult<DeclineCommentMutation>;

export type DeclineCommentMutationOptions = Apollo.BaseMutationOptions<
  DeclineCommentMutation,
  DeclineCommentMutationVariables
>;

export const DeleteCollectionDocument = gql`
  mutation deleteCollection($collectionId: ID!) {
    deleteCollection(id: $collectionId) {
      data {
        id
      }
    }
  }
`;

export type DeleteCollectionMutationFn = Apollo.MutationFunction<
  DeleteCollectionMutation,
  DeleteCollectionMutationVariables
>;

/**
 * __useDeleteCollectionMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionMutation, { data, loading, error }] = useDeleteCollectionMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useDeleteCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCollectionMutation,
    DeleteCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(
    DeleteCollectionDocument,
    options
  );
}

export type DeleteCollectionMutationHookResult = ReturnType<typeof useDeleteCollectionMutation>;

export type DeleteCollectionMutationResult = Apollo.MutationResult<DeleteCollectionMutation>;

export type DeleteCollectionMutationOptions = Apollo.BaseMutationOptions<
  DeleteCollectionMutation,
  DeleteCollectionMutationVariables
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
