import { useAuthChangeEffect } from '../hooks/auth-change-effect.hook';
import { ErrorPolicy, gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;

export type InputMaybe<T> = Maybe<T>;

export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

const defaultOptions = { errorPolicy: 'all' as ErrorPolicy } as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
  Upload: any;
};

export type ArchivePictureCount = {
  count?: Maybe<Scalars['Int']>;
};

export type ArchivePictureCountEntity = {
  attributes?: Maybe<ArchivePictureCount>;
  id?: Maybe<Scalars['ID']>;
};

export type ArchivePictureCountEntityResponseCollection = {
  data?: Maybe<Array<Maybe<ArchivePictureCountEntity>>>;
};

export type ArchiveTag = {
  createdAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  exhibitions?: Maybe<ExhibitionRelationResponseCollection>;
  hidden?: Maybe<Scalars['Boolean']>;
  links?: Maybe<LinkRelationResponseCollection>;
  logo?: Maybe<UploadFileEntityResponse>;
  longDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  paypalClient?: Maybe<Scalars['String']>;
  paypalDonationText?: Maybe<Scalars['String']>;
  paypalPurpose?: Maybe<Scalars['String']>;
  pictures?: Maybe<PictureRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  restrictImageDownloading?: Maybe<Scalars['Boolean']>;
  shortDescription?: Maybe<Scalars['String']>;
  showcasePicture?: Maybe<PictureEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ArchiveTagExhibitionsArgs = {
  filters?: InputMaybe<ExhibitionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ArchiveTagLinksArgs = {
  filters?: InputMaybe<LinkFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ArchiveTagPicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ArchiveTagEntity = {
  attributes?: Maybe<ArchiveTag>;
  id?: Maybe<Scalars['ID']>;
};

export type ArchiveTagEntityResponse = {
  data?: Maybe<ArchiveTagEntity>;
};

export type ArchiveTagEntityResponseCollection = {
  data: Array<ArchiveTagEntity>;
  meta: ResponseCollectionMeta;
};

export type ArchiveTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ArchiveTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  exhibitions?: InputMaybe<ExhibitionFiltersInput>;
  hidden?: InputMaybe<BooleanFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  links?: InputMaybe<LinkFiltersInput>;
  longDescription?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ArchiveTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ArchiveTagFiltersInput>>>;
  paypalClient?: InputMaybe<StringFilterInput>;
  paypalDonationText?: InputMaybe<StringFilterInput>;
  paypalPurpose?: InputMaybe<StringFilterInput>;
  pictures?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  restrictImageDownloading?: InputMaybe<BooleanFilterInput>;
  shortDescription?: InputMaybe<StringFilterInput>;
  showcasePicture?: InputMaybe<PictureFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ArchiveTagInput = {
  email?: InputMaybe<Scalars['String']>;
  exhibitions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  links?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  logo?: InputMaybe<Scalars['ID']>;
  longDescription?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  paypalClient?: InputMaybe<Scalars['String']>;
  paypalDonationText?: InputMaybe<Scalars['String']>;
  paypalPurpose?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  restrictImageDownloading?: InputMaybe<Scalars['Boolean']>;
  shortDescription?: InputMaybe<Scalars['String']>;
  showcasePicture?: InputMaybe<Scalars['ID']>;
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  contains?: InputMaybe<Scalars['Boolean']>;
  containsi?: InputMaybe<Scalars['Boolean']>;
  endsWith?: InputMaybe<Scalars['Boolean']>;
  eq?: InputMaybe<Scalars['Boolean']>;
  eqi?: InputMaybe<Scalars['Boolean']>;
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
  childComments?: Maybe<CommentRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  date: Scalars['DateTime'];
  parentComment?: Maybe<CommentEntityResponse>;
  picture?: Maybe<PictureEntityResponse>;
  pinned?: Maybe<Scalars['Boolean']>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  text: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type CommentChildCommentsArgs = {
  filters?: InputMaybe<CommentFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  childComments?: InputMaybe<CommentFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  date?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<CommentFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<CommentFiltersInput>>>;
  parentComment?: InputMaybe<CommentFiltersInput>;
  picture?: InputMaybe<PictureFiltersInput>;
  pinned?: InputMaybe<BooleanFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  text?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type CommentInput = {
  author?: InputMaybe<Scalars['String']>;
  childComments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  date?: InputMaybe<Scalars['DateTime']>;
  parentComment?: InputMaybe<Scalars['ID']>;
  picture?: InputMaybe<Scalars['ID']>;
  pinned?: InputMaybe<Scalars['Boolean']>;
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

export type ComponentLocationCoordinatesFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ComponentLocationCoordinatesFiltersInput>>>;
  latitude?: InputMaybe<FloatFilterInput>;
  longitude?: InputMaybe<FloatFilterInput>;
  not?: InputMaybe<ComponentLocationCoordinatesFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ComponentLocationCoordinatesFiltersInput>>>;
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
  eqi?: InputMaybe<Scalars['DateTime']>;
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

export type Exhibition = {
  archive_tag?: Maybe<ArchiveTagEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']>;
  exhibition_sections?: Maybe<ExhibitionSectionRelationResponseCollection>;
  idealot_pictures?: Maybe<ExhibitionPictureRelationResponseCollection>;
  introduction?: Maybe<Scalars['String']>;
  is_published?: Maybe<Scalars['Boolean']>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
  title_picture?: Maybe<ExhibitionPictureEntityResponse>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ExhibitionExhibition_SectionsArgs = {
  filters?: InputMaybe<ExhibitionSectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ExhibitionIdealot_PicturesArgs = {
  filters?: InputMaybe<ExhibitionPictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ExhibitionEntity = {
  attributes?: Maybe<Exhibition>;
  id?: Maybe<Scalars['ID']>;
};

export type ExhibitionEntityResponse = {
  data?: Maybe<ExhibitionEntity>;
};

export type ExhibitionEntityResponseCollection = {
  data: Array<ExhibitionEntity>;
  meta: ResponseCollectionMeta;
};

export type ExhibitionFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ExhibitionFiltersInput>>>;
  archive_tag?: InputMaybe<ArchiveTagFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  exhibition_sections?: InputMaybe<ExhibitionSectionFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  idealot_pictures?: InputMaybe<ExhibitionPictureFiltersInput>;
  introduction?: InputMaybe<StringFilterInput>;
  is_published?: InputMaybe<BooleanFilterInput>;
  not?: InputMaybe<ExhibitionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ExhibitionFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  title_picture?: InputMaybe<ExhibitionPictureFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ExhibitionInput = {
  archive_tag?: InputMaybe<Scalars['ID']>;
  exhibition_sections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  idealot_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  introduction?: InputMaybe<Scalars['String']>;
  is_published?: InputMaybe<Scalars['Boolean']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
  title_picture?: InputMaybe<Scalars['ID']>;
};

export type ExhibitionPicture = {
  createdAt?: Maybe<Scalars['DateTime']>;
  exhibition_idealot?: Maybe<ExhibitionEntityResponse>;
  exhibition_section?: Maybe<ExhibitionSectionEntityResponse>;
  order?: Maybe<Scalars['Int']>;
  picture?: Maybe<PictureEntityResponse>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  subtitle?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ExhibitionPictureEntity = {
  attributes?: Maybe<ExhibitionPicture>;
  id?: Maybe<Scalars['ID']>;
};

export type ExhibitionPictureEntityResponse = {
  data?: Maybe<ExhibitionPictureEntity>;
};

export type ExhibitionPictureEntityResponseCollection = {
  data: Array<ExhibitionPictureEntity>;
  meta: ResponseCollectionMeta;
};

export type ExhibitionPictureFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ExhibitionPictureFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  exhibition_idealot?: InputMaybe<ExhibitionFiltersInput>;
  exhibition_section?: InputMaybe<ExhibitionSectionFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ExhibitionPictureFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ExhibitionPictureFiltersInput>>>;
  order?: InputMaybe<IntFilterInput>;
  picture?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  subtitle?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ExhibitionPictureInput = {
  exhibition_idealot?: InputMaybe<Scalars['ID']>;
  exhibition_section?: InputMaybe<Scalars['ID']>;
  order?: InputMaybe<Scalars['Int']>;
  picture?: InputMaybe<Scalars['ID']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  subtitle?: InputMaybe<Scalars['String']>;
};

export type ExhibitionPictureRelationResponseCollection = {
  data: Array<ExhibitionPictureEntity>;
};

export type ExhibitionRelationResponseCollection = {
  data: Array<ExhibitionEntity>;
};

export type ExhibitionSection = {
  createdAt?: Maybe<Scalars['DateTime']>;
  exhibition?: Maybe<ExhibitionEntityResponse>;
  exhibition_pictures?: Maybe<ExhibitionPictureRelationResponseCollection>;
  order?: Maybe<Scalars['Int']>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  text?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ExhibitionSectionExhibition_PicturesArgs = {
  filters?: InputMaybe<ExhibitionPictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ExhibitionSectionEntity = {
  attributes?: Maybe<ExhibitionSection>;
  id?: Maybe<Scalars['ID']>;
};

export type ExhibitionSectionEntityResponse = {
  data?: Maybe<ExhibitionSectionEntity>;
};

export type ExhibitionSectionEntityResponseCollection = {
  data: Array<ExhibitionSectionEntity>;
  meta: ResponseCollectionMeta;
};

export type ExhibitionSectionFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ExhibitionSectionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  exhibition?: InputMaybe<ExhibitionFiltersInput>;
  exhibition_pictures?: InputMaybe<ExhibitionPictureFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ExhibitionSectionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ExhibitionSectionFiltersInput>>>;
  order?: InputMaybe<IntFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  text?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ExhibitionSectionInput = {
  exhibition?: InputMaybe<Scalars['ID']>;
  exhibition_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  order?: InputMaybe<Scalars['Int']>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type ExhibitionSectionRelationResponseCollection = {
  data: Array<ExhibitionSectionEntity>;
};

export type FaceTag = {
  createdAt?: Maybe<Scalars['DateTime']>;
  person_tag?: Maybe<PersonTagEntityResponse>;
  picture?: Maybe<PictureEntityResponse>;
  tag_direction?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  x?: Maybe<Scalars['Float']>;
  y?: Maybe<Scalars['Float']>;
};

export type FaceTagEntity = {
  attributes?: Maybe<FaceTag>;
  id?: Maybe<Scalars['ID']>;
};

export type FaceTagEntityResponse = {
  data?: Maybe<FaceTagEntity>;
};

export type FaceTagEntityResponseCollection = {
  data: Array<FaceTagEntity>;
  meta: ResponseCollectionMeta;
};

export type FaceTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<FaceTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<FaceTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FaceTagFiltersInput>>>;
  person_tag?: InputMaybe<PersonTagFiltersInput>;
  picture?: InputMaybe<PictureFiltersInput>;
  tag_direction?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  x?: InputMaybe<FloatFilterInput>;
  y?: InputMaybe<FloatFilterInput>;
};

export type FaceTagInput = {
  person_tag?: InputMaybe<Scalars['ID']>;
  picture?: InputMaybe<Scalars['ID']>;
  tag_direction?: InputMaybe<Scalars['Int']>;
  x?: InputMaybe<Scalars['Float']>;
  y?: InputMaybe<Scalars['Float']>;
};

export type FaceTagRelationResponseCollection = {
  data: Array<FaceTagEntity>;
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
  eqi?: InputMaybe<Scalars['Float']>;
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
  | ArchiveTag
  | BrowseRootCollection
  | Collection
  | Comment
  | ComponentCommonSynonyms
  | ComponentLocationCoordinates
  | Description
  | Exhibition
  | ExhibitionPicture
  | ExhibitionSection
  | FaceTag
  | KeywordTag
  | Link
  | LocationTag
  | OrientationTag
  | ParameterizedPermission
  | PersonTag
  | Picture
  | PictureGeoInfo
  | PictureSequence
  | TimeRangeTag
  | UploadFile
  | UploadFolder
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
  eqi?: InputMaybe<Scalars['ID']>;
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
  eqi?: InputMaybe<Scalars['Int']>;
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
  eqi?: InputMaybe<Scalars['JSON']>;
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
  visible?: Maybe<Scalars['Boolean']>;
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
  synonyms?: InputMaybe<ComponentCommonSynonymsFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_pictures?: InputMaybe<PictureFiltersInput>;
  visible?: InputMaybe<BooleanFilterInput>;
};

export type KeywordTagInput = {
  name?: InputMaybe<Scalars['String']>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  synonyms?: InputMaybe<Array<InputMaybe<ComponentCommonSynonymsInput>>>;
  verified_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  visible?: InputMaybe<Scalars['Boolean']>;
};

export type KeywordTagRelationResponseCollection = {
  data: Array<KeywordTagEntity>;
};

export type Link = {
  archive_tag?: Maybe<ArchiveTagEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  url: Scalars['String'];
};

export type LinkEntity = {
  attributes?: Maybe<Link>;
  id?: Maybe<Scalars['ID']>;
};

export type LinkEntityResponse = {
  data?: Maybe<LinkEntity>;
};

export type LinkEntityResponseCollection = {
  data: Array<LinkEntity>;
  meta: ResponseCollectionMeta;
};

export type LinkFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<LinkFiltersInput>>>;
  archive_tag?: InputMaybe<ArchiveTagFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<LinkFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<LinkFiltersInput>>>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
};

export type LinkInput = {
  archive_tag?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type LinkRelationResponseCollection = {
  data: Array<LinkEntity>;
};

export type LocationTag = {
  accepted?: Maybe<Scalars['Boolean']>;
  child_tags?: Maybe<LocationTagRelationResponseCollection>;
  coordinates?: Maybe<ComponentLocationCoordinates>;
  createdAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  parent_tags?: Maybe<LocationTagRelationResponseCollection>;
  pictures?: Maybe<PictureRelationResponseCollection>;
  root?: Maybe<Scalars['Boolean']>;
  synonyms?: Maybe<Array<Maybe<ComponentCommonSynonyms>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified_pictures?: Maybe<PictureRelationResponseCollection>;
  visible?: Maybe<Scalars['Boolean']>;
};

export type LocationTagChild_TagsArgs = {
  filters?: InputMaybe<LocationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LocationTagParent_TagsArgs = {
  filters?: InputMaybe<LocationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  accepted?: InputMaybe<BooleanFilterInput>;
  and?: InputMaybe<Array<InputMaybe<LocationTagFiltersInput>>>;
  child_tags?: InputMaybe<LocationTagFiltersInput>;
  coordinates?: InputMaybe<ComponentLocationCoordinatesFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<LocationTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<LocationTagFiltersInput>>>;
  parent_tags?: InputMaybe<LocationTagFiltersInput>;
  pictures?: InputMaybe<PictureFiltersInput>;
  root?: InputMaybe<BooleanFilterInput>;
  synonyms?: InputMaybe<ComponentCommonSynonymsFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_pictures?: InputMaybe<PictureFiltersInput>;
  visible?: InputMaybe<BooleanFilterInput>;
};

export type LocationTagInput = {
  accepted?: InputMaybe<Scalars['Boolean']>;
  child_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  coordinates?: InputMaybe<ComponentLocationCoordinatesInput>;
  name?: InputMaybe<Scalars['String']>;
  parent_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  root?: InputMaybe<Scalars['Boolean']>;
  synonyms?: InputMaybe<Array<InputMaybe<ComponentCommonSynonymsInput>>>;
  verified_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  visible?: InputMaybe<Scalars['Boolean']>;
};

export type LocationTagRelationResponseCollection = {
  data: Array<LocationTagEntity>;
};

export type Mutation = {
  addArchiveTag?: Maybe<Scalars['Int']>;
  addPermission?: Maybe<Scalars['Int']>;
  addUser?: Maybe<Scalars['Int']>;
  /** Change user password. Confirm with the current password. */
  changePassword?: Maybe<UsersPermissionsLoginPayload>;
  contact?: Maybe<Scalars['Int']>;
  createArchiveTag?: Maybe<ArchiveTagEntityResponse>;
  createCollection?: Maybe<CollectionEntityResponse>;
  createComment?: Maybe<CommentEntityResponse>;
  createDescription?: Maybe<DescriptionEntityResponse>;
  createExhibition?: Maybe<ExhibitionEntityResponse>;
  createExhibitionPicture?: Maybe<ExhibitionPictureEntityResponse>;
  createExhibitionSection?: Maybe<ExhibitionSectionEntityResponse>;
  createFaceTag?: Maybe<FaceTagEntityResponse>;
  createKeywordTag?: Maybe<KeywordTagEntityResponse>;
  createLink?: Maybe<LinkEntityResponse>;
  createLocationTag?: Maybe<LocationTagEntityResponse>;
  createOrientationTag?: Maybe<OrientationTagEntityResponse>;
  createParameterizedPermission?: Maybe<ParameterizedPermissionEntityResponse>;
  createPersonTag?: Maybe<PersonTagEntityResponse>;
  createPicture?: Maybe<PictureEntityResponse>;
  createPictureGeoInfo?: Maybe<PictureGeoInfoEntityResponse>;
  createPictureSequence?: Maybe<PictureSequenceEntityResponse>;
  createTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  createUploadFile?: Maybe<UploadFileEntityResponse>;
  createUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteArchiveTag?: Maybe<ArchiveTagEntityResponse>;
  deleteBrowseRootCollection?: Maybe<BrowseRootCollectionEntityResponse>;
  deleteCollection?: Maybe<CollectionEntityResponse>;
  deleteComment?: Maybe<CommentEntityResponse>;
  deleteDescription?: Maybe<DescriptionEntityResponse>;
  deleteExhibition?: Maybe<ExhibitionEntityResponse>;
  deleteExhibitionPicture?: Maybe<ExhibitionPictureEntityResponse>;
  deleteExhibitionSection?: Maybe<ExhibitionSectionEntityResponse>;
  deleteFaceTag?: Maybe<FaceTagEntityResponse>;
  deleteKeywordTag?: Maybe<KeywordTagEntityResponse>;
  deleteLink?: Maybe<LinkEntityResponse>;
  deleteLocationTag?: Maybe<LocationTagEntityResponse>;
  deleteOrientationTag?: Maybe<OrientationTagEntityResponse>;
  deleteParameterizedPermission?: Maybe<ParameterizedPermissionEntityResponse>;
  deletePersonTag?: Maybe<PersonTagEntityResponse>;
  deletePicture?: Maybe<PictureEntityResponse>;
  deletePictureGeoInfo?: Maybe<PictureGeoInfoEntityResponse>;
  deletePictureSequence?: Maybe<PictureSequenceEntityResponse>;
  deleteTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  deleteUploadFile?: Maybe<UploadFileEntityResponse>;
  deleteUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  doBulkEdit?: Maybe<Scalars['Int']>;
  doLike?: Maybe<Scalars['Int']>;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  increaseNotAPlaceCount?: Maybe<Scalars['Int']>;
  login: UsersPermissionsLoginPayload;
  mergeCollections?: Maybe<Scalars['ID']>;
  mergeKeywordTags?: Maybe<Scalars['ID']>;
  mergeLocationTags?: Maybe<Scalars['ID']>;
  mergePersonTags?: Maybe<Scalars['ID']>;
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  removeArchiveTag?: Maybe<Scalars['Int']>;
  removeFile?: Maybe<UploadFileEntityResponse>;
  removeUser?: Maybe<Scalars['Int']>;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateArchiveTag?: Maybe<ArchiveTagEntityResponse>;
  updateBrowseRootCollection?: Maybe<BrowseRootCollectionEntityResponse>;
  updateCollection?: Maybe<CollectionEntityResponse>;
  updateComment?: Maybe<CommentEntityResponse>;
  updateDescription?: Maybe<DescriptionEntityResponse>;
  updateExhibition?: Maybe<ExhibitionEntityResponse>;
  updateExhibitionPicture?: Maybe<ExhibitionPictureEntityResponse>;
  updateExhibitionSection?: Maybe<ExhibitionSectionEntityResponse>;
  updateFaceTag?: Maybe<FaceTagEntityResponse>;
  updateFileInfo: UploadFileEntityResponse;
  updateKeywordTag?: Maybe<KeywordTagEntityResponse>;
  updateLink?: Maybe<LinkEntityResponse>;
  updateLocationTag?: Maybe<LocationTagEntityResponse>;
  updateMe?: Maybe<Scalars['Int']>;
  updateOrientationTag?: Maybe<OrientationTagEntityResponse>;
  updateParameterizedPermission?: Maybe<ParameterizedPermissionEntityResponse>;
  updatePersonTag?: Maybe<PersonTagEntityResponse>;
  updatePicture?: Maybe<PictureEntityResponse>;
  updatePictureGeoInfo?: Maybe<PictureGeoInfoEntityResponse>;
  updatePictureSequence?: Maybe<PictureSequenceEntityResponse>;
  updatePictureWithTagCleanup?: Maybe<Scalars['ID']>;
  updateTimeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  updateUploadFile?: Maybe<UploadFileEntityResponse>;
  updateUploadFolder?: Maybe<UploadFolderEntityResponse>;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  upload: UploadFileEntityResponse;
};

export type MutationAddArchiveTagArgs = {
  name?: InputMaybe<Scalars['String']>;
};

export type MutationAddPermissionArgs = {
  archive_tag?: InputMaybe<Scalars['ID']>;
  on_other_users?: InputMaybe<Scalars['Boolean']>;
  operation_name?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['ID']>;
};

export type MutationAddUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type MutationContactArgs = {
  message?: InputMaybe<Scalars['String']>;
  recipient?: InputMaybe<Scalars['String']>;
  reply_email?: InputMaybe<Scalars['String']>;
  sender_name?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
};

export type MutationCreateArchiveTagArgs = {
  data: ArchiveTagInput;
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

export type MutationCreateExhibitionArgs = {
  data: ExhibitionInput;
};

export type MutationCreateExhibitionPictureArgs = {
  data: ExhibitionPictureInput;
};

export type MutationCreateExhibitionSectionArgs = {
  data: ExhibitionSectionInput;
};

export type MutationCreateFaceTagArgs = {
  data: FaceTagInput;
};

export type MutationCreateKeywordTagArgs = {
  data: KeywordTagInput;
};

export type MutationCreateLinkArgs = {
  data: LinkInput;
};

export type MutationCreateLocationTagArgs = {
  data: LocationTagInput;
};

export type MutationCreateOrientationTagArgs = {
  data: OrientationTagInput;
};

export type MutationCreateParameterizedPermissionArgs = {
  data: ParameterizedPermissionInput;
};

export type MutationCreatePersonTagArgs = {
  data: PersonTagInput;
};

export type MutationCreatePictureArgs = {
  data: PictureInput;
};

export type MutationCreatePictureGeoInfoArgs = {
  data: PictureGeoInfoInput;
};

export type MutationCreatePictureSequenceArgs = {
  data: PictureSequenceInput;
};

export type MutationCreateTimeRangeTagArgs = {
  data: TimeRangeTagInput;
};

export type MutationCreateUploadFileArgs = {
  data: UploadFileInput;
};

export type MutationCreateUploadFolderArgs = {
  data: UploadFolderInput;
};

export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};

export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};

export type MutationDeleteArchiveTagArgs = {
  id: Scalars['ID'];
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

export type MutationDeleteExhibitionArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteExhibitionPictureArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteExhibitionSectionArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteFaceTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteKeywordTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteLinkArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteLocationTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteOrientationTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteParameterizedPermissionArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePersonTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePictureArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePictureGeoInfoArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePictureSequenceArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTimeRangeTagArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUploadFolderArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars['ID'];
};

export type MutationDoBulkEditArgs = {
  data?: InputMaybe<Scalars['JSON']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type MutationDoLikeArgs = {
  dislike?: InputMaybe<Scalars['Boolean']>;
  pictureId?: InputMaybe<Scalars['ID']>;
};

export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String'];
};

export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};

export type MutationIncreaseNotAPlaceCountArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};

export type MutationMergeCollectionsArgs = {
  sourceId?: InputMaybe<Scalars['ID']>;
  targetId?: InputMaybe<Scalars['ID']>;
};

export type MutationMergeKeywordTagsArgs = {
  sourceId?: InputMaybe<Scalars['ID']>;
  targetId?: InputMaybe<Scalars['ID']>;
};

export type MutationMergeLocationTagsArgs = {
  sourceId?: InputMaybe<Scalars['ID']>;
  targetId?: InputMaybe<Scalars['ID']>;
};

export type MutationMergePersonTagsArgs = {
  sourceId?: InputMaybe<Scalars['ID']>;
  targetId?: InputMaybe<Scalars['ID']>;
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

export type MutationRemoveArchiveTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type MutationRemoveFileArgs = {
  id: Scalars['ID'];
};

export type MutationRemoveUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type MutationResetPasswordArgs = {
  code: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type MutationUpdateArchiveTagArgs = {
  data: ArchiveTagInput;
  id: Scalars['ID'];
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

export type MutationUpdateExhibitionArgs = {
  data: ExhibitionInput;
  id: Scalars['ID'];
};

export type MutationUpdateExhibitionPictureArgs = {
  data: ExhibitionPictureInput;
  id: Scalars['ID'];
};

export type MutationUpdateExhibitionSectionArgs = {
  data: ExhibitionSectionInput;
  id: Scalars['ID'];
};

export type MutationUpdateFaceTagArgs = {
  data: FaceTagInput;
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

export type MutationUpdateLinkArgs = {
  data: LinkInput;
  id: Scalars['ID'];
};

export type MutationUpdateLocationTagArgs = {
  data: LocationTagInput;
  id: Scalars['ID'];
};

export type MutationUpdateMeArgs = {
  email?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateOrientationTagArgs = {
  data: OrientationTagInput;
  id: Scalars['ID'];
};

export type MutationUpdateParameterizedPermissionArgs = {
  data: ParameterizedPermissionInput;
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

export type MutationUpdatePictureGeoInfoArgs = {
  data: PictureGeoInfoInput;
  id: Scalars['ID'];
};

export type MutationUpdatePictureSequenceArgs = {
  data: PictureSequenceInput;
  id: Scalars['ID'];
};

export type MutationUpdatePictureWithTagCleanupArgs = {
  data?: InputMaybe<Scalars['JSON']>;
  id?: InputMaybe<Scalars['ID']>;
};

export type MutationUpdateTimeRangeTagArgs = {
  data: TimeRangeTagInput;
  id: Scalars['ID'];
};

export type MutationUpdateUploadFileArgs = {
  data: UploadFileInput;
  id: Scalars['ID'];
};

export type MutationUpdateUploadFolderArgs = {
  data: UploadFolderInput;
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

export type OrientationTag = {
  createdAt?: Maybe<Scalars['DateTime']>;
  location_tag?: Maybe<LocationTagEntityResponse>;
  picture?: Maybe<PictureEntityResponse>;
  tag_direction?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  x?: Maybe<Scalars['Float']>;
  y?: Maybe<Scalars['Float']>;
};

export type OrientationTagEntity = {
  attributes?: Maybe<OrientationTag>;
  id?: Maybe<Scalars['ID']>;
};

export type OrientationTagEntityResponse = {
  data?: Maybe<OrientationTagEntity>;
};

export type OrientationTagEntityResponseCollection = {
  data: Array<OrientationTagEntity>;
  meta: ResponseCollectionMeta;
};

export type OrientationTagFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<OrientationTagFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  location_tag?: InputMaybe<LocationTagFiltersInput>;
  not?: InputMaybe<OrientationTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<OrientationTagFiltersInput>>>;
  picture?: InputMaybe<PictureFiltersInput>;
  tag_direction?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  x?: InputMaybe<FloatFilterInput>;
  y?: InputMaybe<FloatFilterInput>;
};

export type OrientationTagInput = {
  location_tag?: InputMaybe<Scalars['ID']>;
  picture?: InputMaybe<Scalars['ID']>;
  tag_direction?: InputMaybe<Scalars['Int']>;
  x?: InputMaybe<Scalars['Float']>;
  y?: InputMaybe<Scalars['Float']>;
};

export type OrientationTagRelationResponseCollection = {
  data: Array<OrientationTagEntity>;
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

export type ParameterizedPermission = {
  archive_tag?: Maybe<ArchiveTagEntityResponse>;
  createdAt?: Maybe<Scalars['DateTime']>;
  on_other_users?: Maybe<Scalars['Boolean']>;
  operation_name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  users_permissions_user?: Maybe<UsersPermissionsUserEntityResponse>;
};

export type ParameterizedPermissionEntity = {
  attributes?: Maybe<ParameterizedPermission>;
  id?: Maybe<Scalars['ID']>;
};

export type ParameterizedPermissionEntityResponse = {
  data?: Maybe<ParameterizedPermissionEntity>;
};

export type ParameterizedPermissionEntityResponseCollection = {
  data: Array<ParameterizedPermissionEntity>;
  meta: ResponseCollectionMeta;
};

export type ParameterizedPermissionFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ParameterizedPermissionFiltersInput>>>;
  archive_tag?: InputMaybe<ArchiveTagFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<ParameterizedPermissionFiltersInput>;
  on_other_users?: InputMaybe<BooleanFilterInput>;
  operation_name?: InputMaybe<StringFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ParameterizedPermissionFiltersInput>>>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users_permissions_user?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type ParameterizedPermissionInput = {
  archive_tag?: InputMaybe<Scalars['ID']>;
  on_other_users?: InputMaybe<Scalars['Boolean']>;
  operation_name?: InputMaybe<Scalars['String']>;
  users_permissions_user?: InputMaybe<Scalars['ID']>;
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
  synonyms?: InputMaybe<ComponentCommonSynonymsFiltersInput>;
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
  archive_tag?: Maybe<ArchiveTagEntityResponse>;
  collections?: Maybe<CollectionRelationResponseCollection>;
  comments?: Maybe<CommentRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  descriptions?: Maybe<DescriptionRelationResponseCollection>;
  exhibition_pictures?: Maybe<ExhibitionPictureRelationResponseCollection>;
  face_tags?: Maybe<FaceTagRelationResponseCollection>;
  is_not_a_place_count?: Maybe<Scalars['Int']>;
  is_text?: Maybe<Scalars['Boolean']>;
  keyword_tags?: Maybe<KeywordTagRelationResponseCollection>;
  likes?: Maybe<Scalars['Int']>;
  linked_pictures?: Maybe<PictureRelationResponseCollection>;
  linked_texts?: Maybe<PictureRelationResponseCollection>;
  location_tags?: Maybe<LocationTagRelationResponseCollection>;
  media: UploadFileEntityResponse;
  orientation_tags?: Maybe<OrientationTagRelationResponseCollection>;
  person_tags?: Maybe<PersonTagRelationResponseCollection>;
  picture_geo_infos?: Maybe<PictureGeoInfoRelationResponseCollection>;
  picture_sequence?: Maybe<PictureSequenceEntityResponse>;
  picture_sequence_order?: Maybe<Scalars['Int']>;
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

export type PictureExhibition_PicturesArgs = {
  filters?: InputMaybe<ExhibitionPictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureFace_TagsArgs = {
  filters?: InputMaybe<FaceTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureKeyword_TagsArgs = {
  filters?: InputMaybe<KeywordTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureLinked_PicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureLinked_TextsArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureLocation_TagsArgs = {
  filters?: InputMaybe<LocationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureOrientation_TagsArgs = {
  filters?: InputMaybe<OrientationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PicturePerson_TagsArgs = {
  filters?: InputMaybe<PersonTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PicturePicture_Geo_InfosArgs = {
  filters?: InputMaybe<PictureGeoInfoFiltersInput>;
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
  archive_tag?: InputMaybe<ArchiveTagFiltersInput>;
  collections?: InputMaybe<CollectionFiltersInput>;
  comments?: InputMaybe<CommentFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  descriptions?: InputMaybe<DescriptionFiltersInput>;
  exhibition_pictures?: InputMaybe<ExhibitionPictureFiltersInput>;
  face_tags?: InputMaybe<FaceTagFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  is_not_a_place_count?: InputMaybe<IntFilterInput>;
  is_text?: InputMaybe<BooleanFilterInput>;
  keyword_tags?: InputMaybe<KeywordTagFiltersInput>;
  likes?: InputMaybe<IntFilterInput>;
  linked_pictures?: InputMaybe<PictureFiltersInput>;
  linked_texts?: InputMaybe<PictureFiltersInput>;
  location_tags?: InputMaybe<LocationTagFiltersInput>;
  not?: InputMaybe<PictureFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PictureFiltersInput>>>;
  orientation_tags?: InputMaybe<OrientationTagFiltersInput>;
  person_tags?: InputMaybe<PersonTagFiltersInput>;
  picture_geo_infos?: InputMaybe<PictureGeoInfoFiltersInput>;
  picture_sequence?: InputMaybe<PictureSequenceFiltersInput>;
  picture_sequence_order?: InputMaybe<IntFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  time_range_tag?: InputMaybe<TimeRangeTagFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_keyword_tags?: InputMaybe<KeywordTagFiltersInput>;
  verified_location_tags?: InputMaybe<LocationTagFiltersInput>;
  verified_person_tags?: InputMaybe<PersonTagFiltersInput>;
  verified_time_range_tag?: InputMaybe<TimeRangeTagFiltersInput>;
  wordpress_id?: InputMaybe<IntFilterInput>;
};

export type PictureGeoInfo = {
  createdAt?: Maybe<Scalars['DateTime']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  picture?: Maybe<PictureEntityResponse>;
  radius?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type PictureGeoInfoEntity = {
  attributes?: Maybe<PictureGeoInfo>;
  id?: Maybe<Scalars['ID']>;
};

export type PictureGeoInfoEntityResponse = {
  data?: Maybe<PictureGeoInfoEntity>;
};

export type PictureGeoInfoEntityResponseCollection = {
  data: Array<PictureGeoInfoEntity>;
  meta: ResponseCollectionMeta;
};

export type PictureGeoInfoFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PictureGeoInfoFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  latitude?: InputMaybe<FloatFilterInput>;
  longitude?: InputMaybe<FloatFilterInput>;
  not?: InputMaybe<PictureGeoInfoFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PictureGeoInfoFiltersInput>>>;
  picture?: InputMaybe<PictureFiltersInput>;
  radius?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PictureGeoInfoInput = {
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
  picture?: InputMaybe<Scalars['ID']>;
  radius?: InputMaybe<Scalars['Float']>;
};

export type PictureGeoInfoRelationResponseCollection = {
  data: Array<PictureGeoInfoEntity>;
};

export type PictureInput = {
  archive_identifier?: InputMaybe<Scalars['String']>;
  archive_tag?: InputMaybe<Scalars['ID']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  comments?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  descriptions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  exhibition_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  face_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  is_not_a_place_count?: InputMaybe<Scalars['Int']>;
  is_text?: InputMaybe<Scalars['Boolean']>;
  keyword_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  likes?: InputMaybe<Scalars['Int']>;
  linked_pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  linked_texts?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  location_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  media?: InputMaybe<Scalars['ID']>;
  orientation_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  person_tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  picture_geo_infos?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  picture_sequence?: InputMaybe<Scalars['ID']>;
  picture_sequence_order?: InputMaybe<Scalars['Int']>;
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

export type PictureSequence = {
  createdAt?: Maybe<Scalars['DateTime']>;
  pictures?: Maybe<PictureRelationResponseCollection>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type PictureSequencePicturesArgs = {
  filters?: InputMaybe<PictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PictureSequenceEntity = {
  attributes?: Maybe<PictureSequence>;
  id?: Maybe<Scalars['ID']>;
};

export type PictureSequenceEntityResponse = {
  data?: Maybe<PictureSequenceEntity>;
};

export type PictureSequenceEntityResponseCollection = {
  data: Array<PictureSequenceEntity>;
  meta: ResponseCollectionMeta;
};

export type PictureSequenceFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<PictureSequenceFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<PictureSequenceFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<PictureSequenceFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type PictureSequenceInput = {
  pictures?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  publishedAt?: InputMaybe<Scalars['DateTime']>;
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW',
}

export type Query = {
  archivePictureCounts?: Maybe<ArchivePictureCountEntityResponseCollection>;
  archiveTag?: Maybe<ArchiveTagEntityResponse>;
  archiveTags?: Maybe<ArchiveTagEntityResponseCollection>;
  browseRootCollection?: Maybe<BrowseRootCollectionEntityResponse>;
  canRunOperation?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  collection?: Maybe<CollectionEntityResponse>;
  collections?: Maybe<CollectionEntityResponseCollection>;
  comment?: Maybe<CommentEntityResponse>;
  comments?: Maybe<CommentEntityResponseCollection>;
  description?: Maybe<DescriptionEntityResponse>;
  descriptions?: Maybe<DescriptionEntityResponseCollection>;
  exhibition?: Maybe<ExhibitionEntityResponse>;
  exhibitionPicture?: Maybe<ExhibitionPictureEntityResponse>;
  exhibitionPictures?: Maybe<ExhibitionPictureEntityResponseCollection>;
  exhibitionSection?: Maybe<ExhibitionSectionEntityResponse>;
  exhibitionSections?: Maybe<ExhibitionSectionEntityResponseCollection>;
  exhibitions?: Maybe<ExhibitionEntityResponseCollection>;
  faceTag?: Maybe<FaceTagEntityResponse>;
  faceTags?: Maybe<FaceTagEntityResponseCollection>;
  findPicturesByAllSearch?: Maybe<Array<Maybe<PictureEntity>>>;
  getAllLocationTags?: Maybe<Scalars['JSON']>;
  getLocationTagsWithThumbnail?: Maybe<Scalars['JSON']>;
  keywordTag?: Maybe<KeywordTagEntityResponse>;
  keywordTags?: Maybe<KeywordTagEntityResponseCollection>;
  link?: Maybe<LinkEntityResponse>;
  links?: Maybe<LinkEntityResponseCollection>;
  locationTag?: Maybe<LocationTagEntityResponse>;
  locationTags?: Maybe<LocationTagEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  orientationTag?: Maybe<OrientationTagEntityResponse>;
  orientationTags?: Maybe<OrientationTagEntityResponseCollection>;
  parameterizedPermission?: Maybe<ParameterizedPermissionEntityResponse>;
  parameterizedPermissions?: Maybe<ParameterizedPermissionEntityResponseCollection>;
  personTag?: Maybe<PersonTagEntityResponse>;
  personTags?: Maybe<PersonTagEntityResponseCollection>;
  picture?: Maybe<PictureEntityResponse>;
  pictureGeoInfo?: Maybe<PictureGeoInfoEntityResponse>;
  pictureGeoInfos?: Maybe<PictureGeoInfoEntityResponseCollection>;
  pictureSequence?: Maybe<PictureSequenceEntityResponse>;
  pictureSequences?: Maybe<PictureSequenceEntityResponseCollection>;
  pictures?: Maybe<PictureEntityResponseCollection>;
  timeRangeTag?: Maybe<TimeRangeTagEntityResponse>;
  timeRangeTags?: Maybe<TimeRangeTagEntityResponseCollection>;
  uploadFile?: Maybe<UploadFileEntityResponse>;
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>;
  uploadFolder?: Maybe<UploadFolderEntityResponse>;
  uploadFolders?: Maybe<UploadFolderEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>;
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>;
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};

export type QueryArchiveTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryArchiveTagsArgs = {
  filters?: InputMaybe<ArchiveTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryBrowseRootCollectionArgs = {
  publicationState?: InputMaybe<PublicationState>;
};

export type QueryCanRunOperationArgs = {
  operation?: InputMaybe<Scalars['String']>;
  variableSets?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  withSomeVariables?: InputMaybe<Scalars['Boolean']>;
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

export type QueryExhibitionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryExhibitionPictureArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryExhibitionPicturesArgs = {
  filters?: InputMaybe<ExhibitionPictureFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryExhibitionSectionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryExhibitionSectionsArgs = {
  filters?: InputMaybe<ExhibitionSectionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryExhibitionsArgs = {
  filters?: InputMaybe<ExhibitionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryFaceTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryFaceTagsArgs = {
  filters?: InputMaybe<FaceTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryFindPicturesByAllSearchArgs = {
  pagination?: InputMaybe<PaginationArg>;
  searchTerms?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  searchTimes?: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  textFilter?: InputMaybe<Scalars['String']>;
};

export type QueryGetLocationTagsWithThumbnailArgs = {
  filters?: InputMaybe<LocationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  thumbnailFilters?: InputMaybe<PictureFiltersInput>;
};

export type QueryKeywordTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryKeywordTagsArgs = {
  filters?: InputMaybe<KeywordTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLinkArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryLinksArgs = {
  filters?: InputMaybe<LinkFiltersInput>;
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

export type QueryOrientationTagArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryOrientationTagsArgs = {
  filters?: InputMaybe<OrientationTagFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryParameterizedPermissionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryParameterizedPermissionsArgs = {
  filters?: InputMaybe<ParameterizedPermissionFiltersInput>;
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

export type QueryPictureGeoInfoArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryPictureGeoInfosArgs = {
  filters?: InputMaybe<PictureGeoInfoFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryPictureSequenceArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryPictureSequencesArgs = {
  filters?: InputMaybe<PictureSequenceFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  publicationState?: InputMaybe<PublicationState>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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

export type QueryUploadFolderArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryUploadFoldersArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
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
  eqi?: InputMaybe<Scalars['String']>;
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
  isEstimate?: Maybe<Scalars['Boolean']>;
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
  isEstimate?: InputMaybe<BooleanFilterInput>;
  not?: InputMaybe<TimeRangeTagFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TimeRangeTagFiltersInput>>>;
  pictures?: InputMaybe<PictureFiltersInput>;
  start?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  verified_pictures?: InputMaybe<PictureFiltersInput>;
};

export type TimeRangeTagInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  isEstimate?: InputMaybe<Scalars['Boolean']>;
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
  folder?: InputMaybe<UploadFolderFiltersInput>;
  folderPath?: InputMaybe<StringFilterInput>;
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
  folder?: InputMaybe<Scalars['ID']>;
  folderPath?: InputMaybe<Scalars['String']>;
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

export type UploadFileRelationResponseCollection = {
  data: Array<UploadFileEntity>;
};

export type UploadFolder = {
  children?: Maybe<UploadFolderRelationResponseCollection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  files?: Maybe<UploadFileRelationResponseCollection>;
  name: Scalars['String'];
  parent?: Maybe<UploadFolderEntityResponse>;
  path: Scalars['String'];
  pathId: Scalars['Int'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UploadFolderChildrenArgs = {
  filters?: InputMaybe<UploadFolderFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UploadFolderFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UploadFolderEntity = {
  attributes?: Maybe<UploadFolder>;
  id?: Maybe<Scalars['ID']>;
};

export type UploadFolderEntityResponse = {
  data?: Maybe<UploadFolderEntity>;
};

export type UploadFolderEntityResponseCollection = {
  data: Array<UploadFolderEntity>;
  meta: ResponseCollectionMeta;
};

export type UploadFolderFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  children?: InputMaybe<UploadFolderFiltersInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  files?: InputMaybe<UploadFileFiltersInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFolderFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFolderFiltersInput>>>;
  parent?: InputMaybe<UploadFolderFiltersInput>;
  path?: InputMaybe<StringFilterInput>;
  pathId?: InputMaybe<IntFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UploadFolderInput = {
  children?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  path?: InputMaybe<Scalars['String']>;
  pathId?: InputMaybe<Scalars['Int']>;
};

export type UploadFolderRelationResponseCollection = {
  data: Array<UploadFolderEntity>;
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
  isSuperUser?: Maybe<Scalars['Boolean']>;
  provider?: Maybe<Scalars['String']>;
  resetPasswordTokenCreatedAt?: Maybe<Scalars['DateTime']>;
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
  isSuperUser?: InputMaybe<BooleanFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  password?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  resetPasswordToken?: InputMaybe<StringFilterInput>;
  resetPasswordTokenCreatedAt?: InputMaybe<DateTimeFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars['Boolean']>;
  confirmationToken?: InputMaybe<Scalars['String']>;
  confirmed?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  isSuperUser?: InputMaybe<Scalars['Boolean']>;
  password?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  resetPasswordToken?: InputMaybe<Scalars['String']>;
  resetPasswordTokenCreatedAt?: InputMaybe<Scalars['DateTime']>;
  role?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  data: Array<UsersPermissionsUserEntity>;
};

export type CanRunOperationQueryVariables = Exact<{
  operation: Scalars['String'];
  variableSets?: InputMaybe<Array<Scalars['JSON']> | Scalars['JSON']>;
  withSomeVariables?: InputMaybe<Scalars['Boolean']>;
}>;

export type CanRunOperationQuery = { canRunOperation?: Array<boolean | null> | null };

export type GetAllArchiveTagsQueryVariables = Exact<{
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;

export type GetAllArchiveTagsQuery = {
  archiveTags?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        name: string;
        shortDescription?: string | null;
        hidden?: boolean | null;
        showcasePicture?: {
          data?: {
            id?: string | null;
            attributes?: {
              media: {
                data?: {
                  attributes?: { url: string; updatedAt?: any | null; provider: string } | null;
                } | null;
              };
            } | null;
          } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetAllCollectionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllCollectionsQuery = {
  collections?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        name: string;
        parent_collections?: {
          data: Array<{ id?: string | null; attributes?: { name: string } | null }>;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetAllKeywordTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllKeywordTagsQuery = {
  keywordTags?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        name: string;
        visible?: boolean | null;
        synonyms?: Array<{ name: string } | null> | null;
      } | null;
    }>;
  } | null;
};

export type GetAllLocationTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllLocationTagsQuery = { getAllLocationTags?: any | null };

export type GetAllPersonTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllPersonTagsQuery = {
  personTags?: {
    data: Array<{
      id?: string | null;
      attributes?: { name: string; synonyms?: Array<{ name: string } | null> | null } | null;
    }>;
  } | null;
};

export type GetAllPictureIdsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllPictureIdsQuery = { pictures?: { data: Array<{ id?: string | null }> } | null };

export type GetArchiveQueryVariables = Exact<{
  archiveId: Scalars['ID'];
}>;

export type GetArchiveQuery = {
  archiveTag?: {
    data?: {
      id?: string | null;
      attributes?: {
        name: string;
        shortDescription?: string | null;
        longDescription?: string | null;
        email?: string | null;
        paypalClient?: string | null;
        paypalDonationText?: string | null;
        paypalPurpose?: string | null;
        hidden?: boolean | null;
        restrictImageDownloading?: boolean | null;
        logo?: {
          data?: {
            id?: string | null;
            attributes?: {
              width?: number | null;
              height?: number | null;
              formats?: any | null;
              updatedAt?: any | null;
              provider: string;
            } | null;
          } | null;
        } | null;
        showcasePicture?: {
          data?: {
            id?: string | null;
            attributes?: {
              media: {
                data?: {
                  id?: string | null;
                  attributes?: {
                    width?: number | null;
                    height?: number | null;
                    formats?: any | null;
                    url: string;
                    updatedAt?: any | null;
                    provider: string;
                  } | null;
                } | null;
              };
            } | null;
          } | null;
        } | null;
        links?: {
          data: Array<{
            id?: string | null;
            attributes?: { title?: string | null; url: string } | null;
          }>;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type GetArchiveNamesQueryVariables = Exact<{
  filters?: InputMaybe<ArchiveTagFiltersInput>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;

export type GetArchiveNamesQuery = {
  archiveTags?: {
    data: Array<{ id?: string | null; attributes?: { name: string } | null }>;
  } | null;
};

export type GetArchivePictureCountsQueryVariables = Exact<{ [key: string]: never }>;

export type GetArchivePictureCountsQuery = {
  archivePictureCounts?: {
    data?: Array<{
      id?: string | null;
      attributes?: { count?: number | null } | null;
    } | null> | null;
  } | null;
};

export type GetCollectionInfoByIdQueryVariables = Exact<{
  collectionId: Scalars['ID'];
}>;

export type GetCollectionInfoByIdQuery = {
  collection?: {
    data?: {
      id?: string | null;
      attributes?: {
        name: string;
        description?: string | null;
        child_collections?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              name: string;
              publishedAt?: any | null;
              pictures?: { data: Array<{ id?: string | null }> } | null;
              child_collections?: { data: Array<{ id?: string | null }> } | null;
              parent_collections?: {
                data: Array<{ id?: string | null; attributes?: { name: string } | null }>;
              } | null;
            } | null;
          }>;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type GetCollectionInfoByNameQueryVariables = Exact<{
  collectionName?: InputMaybe<Scalars['String']>;
}>;

export type GetCollectionInfoByNameQuery = {
  collections?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        name: string;
        description?: string | null;
        child_collections?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              name: string;
              thumbnail?: string | null;
              publishedAt?: any | null;
            } | null;
          }>;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetDailyPictureInfoQueryVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type GetDailyPictureInfoQuery = {
  picture?: {
    data?: {
      id?: string | null;
      attributes?: {
        likes?: number | null;
        descriptions?: {
          data: Array<{ id?: string | null; attributes?: { text: string } | null }>;
        } | null;
        time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        verified_time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        comments?: { data: Array<{ id?: string | null }> } | null;
        media: {
          data?: {
            id?: string | null;
            attributes?: { url: string; updatedAt?: any | null; provider: string } | null;
          } | null;
        };
        archive_tag?: {
          data?: {
            id?: string | null;
            attributes?: { name: string; restrictImageDownloading?: boolean | null } | null;
          } | null;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type GetDecadePreviewThumbnailsQueryVariables = Exact<{
  filter40s: PictureFiltersInput;
  filter50s: PictureFiltersInput;
  filter60s: PictureFiltersInput;
  filter70s: PictureFiltersInput;
  filter80s: PictureFiltersInput;
  filter90s: PictureFiltersInput;
}>;

export type GetDecadePreviewThumbnailsQuery = {
  decade40s?: {
    data: Array<{
      attributes?: {
        media: { data?: { attributes?: { formats?: any | null; provider: string } | null } | null };
      } | null;
    }>;
  } | null;
  decade50s?: {
    data: Array<{
      attributes?: {
        media: { data?: { attributes?: { formats?: any | null; provider: string } | null } | null };
      } | null;
    }>;
  } | null;
  decade60s?: {
    data: Array<{
      attributes?: {
        media: { data?: { attributes?: { formats?: any | null; provider: string } | null } | null };
      } | null;
    }>;
  } | null;
  decade70s?: {
    data: Array<{
      attributes?: {
        media: { data?: { attributes?: { formats?: any | null; provider: string } | null } | null };
      } | null;
    }>;
  } | null;
  decade80s?: {
    data: Array<{
      attributes?: {
        media: { data?: { attributes?: { formats?: any | null; provider: string } | null } | null };
      } | null;
    }>;
  } | null;
  decade90s?: {
    data: Array<{
      attributes?: {
        media: { data?: { attributes?: { formats?: any | null; provider: string } | null } | null };
      } | null;
    }>;
  } | null;
};

export type GetExhibitionQueryVariables = Exact<{
  exhibitionId: Scalars['ID'];
}>;

export type GetExhibitionQuery = {
  exhibition?: {
    data?: {
      id?: string | null;
      attributes?: {
        title?: string | null;
        introduction?: string | null;
        is_published?: boolean | null;
        title_picture?: {
          data?: {
            id?: string | null;
            attributes?: {
              subtitle?: string | null;
              picture?: {
                data?: {
                  id?: string | null;
                  attributes?: {
                    media: {
                      data?: {
                        id?: string | null;
                        attributes?: {
                          width?: number | null;
                          height?: number | null;
                          formats?: any | null;
                          url: string;
                          updatedAt?: any | null;
                          provider: string;
                        } | null;
                      } | null;
                    };
                  } | null;
                } | null;
              } | null;
            } | null;
          } | null;
        } | null;
        idealot_pictures?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              subtitle?: string | null;
              picture?: {
                data?: {
                  id?: string | null;
                  attributes?: {
                    media: {
                      data?: {
                        id?: string | null;
                        attributes?: {
                          width?: number | null;
                          height?: number | null;
                          formats?: any | null;
                          url: string;
                          updatedAt?: any | null;
                          provider: string;
                        } | null;
                      } | null;
                    };
                  } | null;
                } | null;
              } | null;
            } | null;
          }>;
        } | null;
        exhibition_sections?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              title?: string | null;
              text?: string | null;
              order?: number | null;
              exhibition_pictures?: {
                data: Array<{
                  id?: string | null;
                  attributes?: {
                    order?: number | null;
                    subtitle?: string | null;
                    picture?: {
                      data?: {
                        id?: string | null;
                        attributes?: {
                          media: {
                            data?: {
                              id?: string | null;
                              attributes?: {
                                width?: number | null;
                                height?: number | null;
                                formats?: any | null;
                                url: string;
                                updatedAt?: any | null;
                                provider: string;
                              } | null;
                            } | null;
                          };
                        } | null;
                      } | null;
                    } | null;
                  } | null;
                }>;
              } | null;
            } | null;
          }>;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type GetExhibitionsQueryVariables = Exact<{
  archiveId?: InputMaybe<Scalars['ID']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;

export type GetExhibitionsQuery = {
  exhibitions?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        title?: string | null;
        introduction?: string | null;
        is_published?: boolean | null;
        archive_tag?: { data?: { id?: string | null } | null } | null;
        title_picture?: {
          data?: {
            id?: string | null;
            attributes?: {
              picture?: {
                data?: {
                  id?: string | null;
                  attributes?: {
                    media: {
                      data?: {
                        id?: string | null;
                        attributes?: {
                          width?: number | null;
                          height?: number | null;
                          formats?: any | null;
                          url: string;
                          updatedAt?: any | null;
                          provider: string;
                        } | null;
                      } | null;
                    };
                  } | null;
                } | null;
              } | null;
            } | null;
          } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetFaceTagsQueryVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type GetFaceTagsQuery = {
  faceTags?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        x?: number | null;
        y?: number | null;
        tag_direction?: number | null;
        person_tag?: {
          data?: { id?: string | null; attributes?: { name: string } | null } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetIdeaLotContentQueryVariables = Exact<{
  exhibitionId: Scalars['ID'];
}>;

export type GetIdeaLotContentQuery = {
  exhibition?: {
    data?: {
      id?: string | null;
      attributes?: {
        idealot_pictures?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              subtitle?: string | null;
              picture?: {
                data?: {
                  id?: string | null;
                  attributes?: {
                    media: {
                      data?: {
                        id?: string | null;
                        attributes?: {
                          width?: number | null;
                          height?: number | null;
                          formats?: any | null;
                          url: string;
                          updatedAt?: any | null;
                          provider: string;
                        } | null;
                      } | null;
                    };
                  } | null;
                } | null;
              } | null;
            } | null;
          }>;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type GetKeywordTagsWithThumbnailQueryVariables = Exact<{
  filters?: InputMaybe<KeywordTagFiltersInput>;
  thumbnailFilters?: InputMaybe<PictureFiltersInput>;
  pagination: PaginationArg;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;

export type GetKeywordTagsWithThumbnailQuery = {
  keywordTags?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        name: string;
        thumbnail?: {
          data: Array<{
            attributes?: {
              media: {
                data?: { attributes?: { formats?: any | null; provider: string } | null } | null;
              };
            } | null;
          }>;
        } | null;
        verified_thumbnail?: {
          data: Array<{
            attributes?: {
              media: {
                data?: { attributes?: { formats?: any | null; provider: string } | null } | null;
              };
            } | null;
          }>;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetLocationTagQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetLocationTagQuery = {
  locationTag?: { data?: { attributes?: { name: string } | null } | null } | null;
};

export type GetLocationTagsWithThumbnailQueryVariables = Exact<{
  filters?: InputMaybe<LocationTagFiltersInput>;
  thumbnailFilters?: InputMaybe<PictureFiltersInput>;
  pagination: PaginationArg;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;

export type GetLocationTagsWithThumbnailQuery = { getLocationTagsWithThumbnail?: any | null };

export type GetMostLikedPicturesQueryVariables = Exact<{
  filters: PictureFiltersInput;
  pagination: PaginationArg;
}>;

export type GetMostLikedPicturesQuery = {
  pictures?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        is_text?: boolean | null;
        likes?: number | null;
        comments?: { data: Array<{ id?: string | null }> } | null;
        media: {
          data?: {
            id?: string | null;
            attributes?: {
              width?: number | null;
              height?: number | null;
              formats?: any | null;
              url: string;
              updatedAt?: any | null;
              provider: string;
            } | null;
          } | null;
        };
        picture_sequence?: {
          data?: {
            id?: string | null;
            attributes?: { pictures?: { data: Array<{ id?: string | null }> } | null } | null;
          } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetMultiplePictureInfoQueryVariables = Exact<{
  pictureIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;

export type GetMultiplePictureInfoQuery = {
  pictures?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        is_text?: boolean | null;
        descriptions?: {
          data: Array<{ id?: string | null; attributes?: { text: string } | null }>;
        } | null;
        time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        verified_time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        keyword_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        verified_keyword_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        location_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        verified_location_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        person_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        verified_person_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        collections?: {
          data: Array<{ id?: string | null; attributes?: { name: string } | null }>;
        } | null;
        media: {
          data?: {
            id?: string | null;
            attributes?: { url: string; updatedAt?: any | null; provider: string } | null;
          } | null;
        };
        comments?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              text: string;
              author?: string | null;
              date: any;
              publishedAt?: any | null;
              pinned?: boolean | null;
            } | null;
          }>;
        } | null;
        linked_pictures?: { data: Array<{ id?: string | null }> } | null;
        linked_texts?: { data: Array<{ id?: string | null }> } | null;
        archive_tag?: {
          data?: { id?: string | null; attributes?: { name: string } | null } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetOrientationTagsQueryVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type GetOrientationTagsQuery = {
  orientationTags?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        x?: number | null;
        y?: number | null;
        tag_direction?: number | null;
        location_tag?: {
          data?: { id?: string | null; attributes?: { name: string } | null } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetParameterizedPermissionsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['ID']>;
}>;

export type GetParameterizedPermissionsQuery = {
  parameterizedPermissions?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        operation_name?: string | null;
        on_other_users?: boolean | null;
        archive_tag?: { data?: { id?: string | null } | null } | null;
      } | null;
    }>;
  } | null;
};

export type GetPersonTagQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetPersonTagQuery = {
  personTag?: { data?: { attributes?: { name: string } | null } | null } | null;
};

export type GetPersonTagsWithThumbnailQueryVariables = Exact<{
  filters?: InputMaybe<PersonTagFiltersInput>;
  thumbnailFilters?: InputMaybe<PictureFiltersInput>;
  pagination: PaginationArg;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;

export type GetPersonTagsWithThumbnailQuery = {
  personTags?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        name: string;
        thumbnail?: {
          data: Array<{
            attributes?: {
              media: {
                data?: {
                  attributes?: { formats?: any | null; url: string; provider: string } | null;
                } | null;
              };
            } | null;
          }>;
        } | null;
        verified_thumbnail?: {
          data: Array<{
            attributes?: {
              media: {
                data?: {
                  attributes?: { formats?: any | null; url: string; provider: string } | null;
                } | null;
              };
            } | null;
          }>;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetPictureGeoInfoQueryVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type GetPictureGeoInfoQuery = {
  pictureGeoInfos?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        latitude?: number | null;
        longitude?: number | null;
        radius?: number | null;
      } | null;
    }>;
  } | null;
};

export type GetPictureInfoQueryVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type GetPictureInfoQuery = {
  picture?: {
    data?: {
      id?: string | null;
      attributes?: {
        is_text?: boolean | null;
        likes?: number | null;
        descriptions?: {
          data: Array<{ id?: string | null; attributes?: { text: string } | null }>;
        } | null;
        time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        verified_time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        keyword_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        verified_keyword_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        location_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        verified_location_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        person_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        verified_person_tags?: {
          data: Array<{
            id?: string | null;
            attributes?: { name: string; updatedAt?: any | null } | null;
          }>;
        } | null;
        collections?: {
          data: Array<{ id?: string | null; attributes?: { name: string } | null }>;
        } | null;
        comments?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              text: string;
              author?: string | null;
              date: any;
              publishedAt?: any | null;
              pinned?: boolean | null;
              picture?: { data?: { id?: string | null } | null } | null;
              parentComment?: { data?: { id?: string | null } | null } | null;
              childComments?: { data: Array<{ id?: string | null }> } | null;
            } | null;
          }>;
        } | null;
        media: {
          data?: {
            id?: string | null;
            attributes?: {
              width?: number | null;
              height?: number | null;
              formats?: any | null;
              url: string;
              updatedAt?: any | null;
              provider: string;
            } | null;
          } | null;
        };
        linked_pictures?: { data: Array<{ id?: string | null }> } | null;
        linked_texts?: { data: Array<{ id?: string | null }> } | null;
        picture_sequence?: {
          data?: {
            id?: string | null;
            attributes?: { pictures?: { data: Array<{ id?: string | null }> } | null } | null;
          } | null;
        } | null;
        archive_tag?: {
          data?: {
            id?: string | null;
            attributes?: { name: string; restrictImageDownloading?: boolean | null } | null;
          } | null;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type GetPicturesQueryVariables = Exact<{
  filters: PictureFiltersInput;
  pagination: PaginationArg;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;

export type GetPicturesQuery = {
  pictures?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        is_text?: boolean | null;
        likes?: number | null;
        comments?: { data: Array<{ id?: string | null }> } | null;
        verified_time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        time_range_tag?: {
          data?: {
            id?: string | null;
            attributes?: { start: any; end: any; isEstimate?: boolean | null } | null;
          } | null;
        } | null;
        media: {
          data?: {
            id?: string | null;
            attributes?: {
              width?: number | null;
              height?: number | null;
              formats?: any | null;
              url: string;
              updatedAt?: any | null;
              provider: string;
            } | null;
          } | null;
        };
        picture_sequence?: {
          data?: {
            id?: string | null;
            attributes?: { pictures?: { data: Array<{ id?: string | null }> } | null } | null;
          } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetPicturesByAllSearchQueryVariables = Exact<{
  pagination: PaginationArg;
  searchTerms: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
  searchTimes:
    | Array<InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>>
    | InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  textFilter: Scalars['String'];
}>;

export type GetPicturesByAllSearchQuery = {
  findPicturesByAllSearch?: Array<{
    id?: string | null;
    attributes?: {
      is_text?: boolean | null;
      likes?: number | null;
      comments?: { data: Array<{ id?: string | null }> } | null;
      media: {
        data?: {
          id?: string | null;
          attributes?: {
            width?: number | null;
            height?: number | null;
            formats?: any | null;
            url: string;
            updatedAt?: any | null;
            provider: string;
          } | null;
        } | null;
      };
      picture_sequence?: {
        data?: {
          id?: string | null;
          attributes?: { pictures?: { data: Array<{ id?: string | null }> } | null } | null;
        } | null;
      } | null;
    } | null;
  } | null> | null;
};

export type GetPicturesForCollectionQueryVariables = Exact<{
  collectionId: Scalars['ID'];
}>;

export type GetPicturesForCollectionQuery = {
  collection?: {
    data?: {
      id?: string | null;
      attributes?: { pictures?: { data: Array<{ id?: string | null }> } | null } | null;
    } | null;
  } | null;
};

export type GetPicturesForLocationQueryVariables = Exact<{
  tagIDs?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;

export type GetPicturesForLocationQuery = {
  locationTags?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        pictures?: { data: Array<{ id?: string | null }> } | null;
        verified_pictures?: { data: Array<{ id?: string | null }> } | null;
      } | null;
    }>;
  } | null;
};

export type GetPublishedCollectionInfoByNameQueryVariables = Exact<{
  collectionName?: InputMaybe<Scalars['String']>;
}>;

export type GetPublishedCollectionInfoByNameQuery = {
  collections?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        name: string;
        description?: string | null;
        child_collections?: {
          data: Array<{
            id?: string | null;
            attributes?: {
              name: string;
              thumbnail?: string | null;
              publishedAt?: any | null;
            } | null;
          }>;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetRootCollectionQueryVariables = Exact<{ [key: string]: never }>;

export type GetRootCollectionQuery = {
  browseRootCollection?: {
    data?: {
      attributes?: {
        current?: {
          data?: { id?: string | null; attributes?: { name: string } | null } | null;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type GetUnverifiedCommentsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUnverifiedCommentsQuery = {
  comments?: {
    data: Array<{
      id?: string | null;
      attributes?: {
        text: string;
        author?: string | null;
        picture?: {
          data?: {
            id?: string | null;
            attributes?: {
              media: {
                data?: {
                  id?: string | null;
                  attributes?: {
                    width?: number | null;
                    height?: number | null;
                    formats?: any | null;
                    updatedAt?: any | null;
                    provider: string;
                  } | null;
                } | null;
              };
            } | null;
          } | null;
        } | null;
      } | null;
    }>;
  } | null;
};

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetUserQuery = {
  usersPermissionsUser?: {
    data?: { id?: string | null; attributes?: { username: string; email: string } | null } | null;
  } | null;
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetUsersQuery = {
  usersPermissionsUsers?: {
    data: Array<{ id?: string | null; attributes?: { username: string } | null }>;
  } | null;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { me?: { id: string; username: string; email?: string | null } | null };

export type AcceptCommentMutationVariables = Exact<{
  commentId: Scalars['ID'];
  currentTime: Scalars['DateTime'];
}>;

export type AcceptCommentMutation = {
  updateComment?: { data?: { id?: string | null } | null } | null;
};

export type AddArchiveTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type AddArchiveTagMutation = { addArchiveTag?: number | null };

export type AddPermissionMutationVariables = Exact<{
  user_id?: InputMaybe<Scalars['ID']>;
  operation_name?: InputMaybe<Scalars['String']>;
  archive_tag?: InputMaybe<Scalars['ID']>;
  on_other_users?: InputMaybe<Scalars['Boolean']>;
}>;

export type AddPermissionMutation = { addPermission?: number | null };

export type AddUserMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
}>;

export type AddUserMutation = { addUser?: number | null };

export type BulkEditMutationVariables = Exact<{
  pictureIds: Array<Scalars['ID']> | Scalars['ID'];
  data: Scalars['JSON'];
}>;

export type BulkEditMutation = { doBulkEdit?: number | null };

export type ChangePasswordMutationVariables = Exact<{
  currentPassword: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
}>;

export type ChangePasswordMutation = { changePassword?: { user: { id: string } } | null };

export type ContactMutationVariables = Exact<{
  recipient: Scalars['String'];
  sender_name: Scalars['String'];
  reply_email: Scalars['String'];
  subject: Scalars['String'];
  message: Scalars['String'];
}>;

export type ContactMutation = { contact?: number | null };

export type CreateExhibitionMutationVariables = Exact<{
  archiveId: Scalars['ID'];
  publishedAt: Scalars['DateTime'];
}>;

export type CreateExhibitionMutation = {
  createExhibition?: { data?: { id?: string | null } | null } | null;
};

export type CreateExhibitionPictureMutationVariables = Exact<{
  exhibitionIdealotId: Scalars['ID'];
  pictureId: Scalars['ID'];
  publishedAt: Scalars['DateTime'];
}>;

export type CreateExhibitionPictureMutation = {
  createExhibitionPicture?: { data?: { id?: string | null } | null } | null;
};

export type CreateExhibitionSectionMutationVariables = Exact<{
  exhibitionId: Scalars['ID'];
  order?: InputMaybe<Scalars['Int']>;
  publishedAt: Scalars['DateTime'];
}>;

export type CreateExhibitionSectionMutation = {
  createExhibitionSection?: { data?: { id?: string | null } | null } | null;
};

export type CreateFaceTagMutationVariables = Exact<{
  pictureId: Scalars['ID'];
  personTagId: Scalars['ID'];
  x?: InputMaybe<Scalars['Float']>;
  y?: InputMaybe<Scalars['Float']>;
  tag_direction?: InputMaybe<Scalars['Int']>;
}>;

export type CreateFaceTagMutation = {
  createFaceTag?: { data?: { id?: string | null } | null } | null;
};

export type CreateKeywordTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateKeywordTagMutation = {
  createKeywordTag?: { data?: { id?: string | null } | null } | null;
};

export type CreateLinkMutationVariables = Exact<{
  title: Scalars['String'];
  url: Scalars['String'];
  archive_tag: Scalars['ID'];
}>;

export type CreateLinkMutation = { createLink?: { data?: { id?: string | null } | null } | null };

export type CreateLocationTagMutationVariables = Exact<{
  name: Scalars['String'];
  parentIDs?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  childIDs?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  accepted?: InputMaybe<Scalars['Boolean']>;
  root?: InputMaybe<Scalars['Boolean']>;
}>;

export type CreateLocationTagMutation = {
  createLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type CreateOrientationTagMutationVariables = Exact<{
  pictureId: Scalars['ID'];
  locationTagId: Scalars['ID'];
  x?: InputMaybe<Scalars['Float']>;
  y?: InputMaybe<Scalars['Float']>;
  tag_direction?: InputMaybe<Scalars['Int']>;
}>;

export type CreateOrientationTagMutation = {
  createOrientationTag?: { data?: { id?: string | null } | null } | null;
};

export type CreatePersonTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreatePersonTagMutation = {
  createPersonTag?: { data?: { id?: string | null } | null } | null;
};

export type CreatePictureMutationVariables = Exact<{
  data: PictureInput;
}>;

export type CreatePictureMutation = {
  createPicture?: { data?: { id?: string | null } | null } | null;
};

export type CreatePictureGeoInfoMutationVariables = Exact<{
  data: PictureGeoInfoInput;
}>;

export type CreatePictureGeoInfoMutation = {
  createPictureGeoInfo?: { data?: { id?: string | null } | null } | null;
};

export type CreatePictureSequenceMutationVariables = Exact<{
  pictures: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type CreatePictureSequenceMutation = {
  createPictureSequence?: { data?: { id?: string | null } | null } | null;
};

export type CreateSubCollectionMutationVariables = Exact<{
  name: Scalars['String'];
  parentId: Scalars['ID'];
  publishedAt: Scalars['DateTime'];
}>;

export type CreateSubCollectionMutation = {
  createCollection?: { data?: { id?: string | null } | null } | null;
};

export type DeclineCommentMutationVariables = Exact<{
  commentId: Scalars['ID'];
}>;

export type DeclineCommentMutation = {
  deleteComment?: { data?: { id?: string | null } | null } | null;
};

export type DeleteCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID'];
}>;

export type DeleteCollectionMutation = {
  deleteCollection?: { data?: { id?: string | null } | null } | null;
};

export type DeleteExhibitionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteExhibitionMutation = {
  deleteExhibition?: { data?: { id?: string | null } | null } | null;
};

export type DeleteExhibitionPictureMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteExhibitionPictureMutation = {
  deleteExhibitionPicture?: { data?: { id?: string | null } | null } | null;
};

export type DeleteExhibitionSectionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteExhibitionSectionMutation = {
  deleteExhibitionSection?: { data?: { id?: string | null } | null } | null;
};

export type DeleteFaceTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteFaceTagMutation = {
  deleteFaceTag?: { data?: { id?: string | null } | null } | null;
};

export type DeleteKeywordTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteKeywordTagMutation = {
  deleteKeywordTag?: { data?: { id?: string | null } | null } | null;
};

export type DeleteLinkMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteLinkMutation = { deleteLink?: { data?: { id?: string | null } | null } | null };

export type DeleteLocationTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteLocationTagMutation = {
  deleteLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type DeleteOrientationTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteOrientationTagMutation = {
  deleteOrientationTag?: { data?: { id?: string | null } | null } | null;
};

export type DeleteParameterizedPermissionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteParameterizedPermissionMutation = {
  deleteParameterizedPermission?: { data?: { id?: string | null } | null } | null;
};

export type DeletePersonTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeletePersonTagMutation = {
  deletePersonTag?: { data?: { id?: string | null } | null } | null;
};

export type FixCommentTextMutationVariables = Exact<{
  commentId: Scalars['ID'];
  text: Scalars['String'];
}>;

export type FixCommentTextMutation = {
  updateComment?: { data?: { id?: string | null } | null } | null;
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type ForgotPasswordMutation = { forgotPassword?: { ok: boolean } | null };

export type IncreaseNotAPlaceCountMutationVariables = Exact<{
  pictureId: Scalars['ID'];
}>;

export type IncreaseNotAPlaceCountMutation = { increaseNotAPlaceCount?: number | null };

export type LikeMutationVariables = Exact<{
  pictureId: Scalars['ID'];
  dislike?: InputMaybe<Scalars['Boolean']>;
}>;

export type LikeMutation = { doLike?: number | null };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = { login: { jwt?: string | null } };

export type MergeCollectionsMutationVariables = Exact<{
  targetId: Scalars['ID'];
  sourceId: Scalars['ID'];
}>;

export type MergeCollectionsMutation = { mergeCollections?: string | null };

export type MergeKeywordTagsMutationVariables = Exact<{
  targetId: Scalars['ID'];
  sourceId: Scalars['ID'];
}>;

export type MergeKeywordTagsMutation = { mergeKeywordTags?: string | null };

export type MergeLocationTagsMutationVariables = Exact<{
  targetId: Scalars['ID'];
  sourceId: Scalars['ID'];
}>;

export type MergeLocationTagsMutation = { mergeLocationTags?: string | null };

export type MergePersonTagsMutationVariables = Exact<{
  targetId: Scalars['ID'];
  sourceId: Scalars['ID'];
}>;

export type MergePersonTagsMutation = { mergePersonTags?: string | null };

export type MultipleUploadMutationVariables = Exact<{
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;

export type MultipleUploadMutation = {
  multipleUpload: Array<{ data?: { id?: string | null } | null } | null>;
};

export type PinCommentMutationVariables = Exact<{
  commentId: Scalars['ID'];
}>;

export type PinCommentMutation = {
  updateComment?: { data?: { id?: string | null } | null } | null;
};

export type PostCommentMutationVariables = Exact<{
  id: Scalars['ID'];
  author: Scalars['String'];
  text: Scalars['String'];
  date: Scalars['DateTime'];
  parentCommentId?: InputMaybe<Scalars['ID']>;
}>;

export type PostCommentMutation = {
  createComment?: { data?: { attributes?: { text: string } | null } | null } | null;
};

export type RemoveArchiveTagMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type RemoveArchiveTagMutation = { removeArchiveTag?: number | null };

export type RemoveUploadMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type RemoveUploadMutation = { removeFile?: { data?: { id?: string | null } | null } | null };

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type RemoveUserMutation = { removeUser?: number | null };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
}>;

export type ResetPasswordMutation = { resetPassword?: { user: { id: string } } | null };

export type SetPicturesForCollectionMutationVariables = Exact<{
  pictureIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
  collectionId: Scalars['ID'];
}>;

export type SetPicturesForCollectionMutation = {
  updateCollection?: { data?: { id?: string | null } | null } | null;
};

export type UnpinCommentMutationVariables = Exact<{
  commentId: Scalars['ID'];
}>;

export type UnpinCommentMutation = {
  updateComment?: { data?: { id?: string | null } | null } | null;
};

export type UnpublishPictureMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type UnpublishPictureMutation = {
  updatePicture?: { data?: { id?: string | null } | null } | null;
};

export type UpdateArchiveMutationVariables = Exact<{
  archiveId: Scalars['ID'];
  data: ArchiveTagInput;
}>;

export type UpdateArchiveMutation = {
  updateArchiveTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  data: CollectionInput;
}>;

export type UpdateCollectionMutation = {
  updateCollection?: { data?: { id?: string | null } | null } | null;
};

export type UpdateCollectionParentsMutationVariables = Exact<{
  collectionId: Scalars['ID'];
  parentCollectionIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;

export type UpdateCollectionParentsMutation = {
  updateCollection?: { data?: { id?: string | null } | null } | null;
};

export type UpdateExhibitionMutationVariables = Exact<{
  id: Scalars['ID'];
  data: ExhibitionInput;
}>;

export type UpdateExhibitionMutation = {
  updateExhibition?: { data?: { id?: string | null } | null } | null;
};

export type UpdateExhibitionPictureMutationVariables = Exact<{
  id: Scalars['ID'];
  data: ExhibitionPictureInput;
}>;

export type UpdateExhibitionPictureMutation = {
  updateExhibitionPicture?: { data?: { id?: string | null } | null } | null;
};

export type UpdateExhibitionSectionMutationVariables = Exact<{
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  exhibitionPictureIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
}>;

export type UpdateExhibitionSectionMutation = {
  updateExhibitionSection?: { data?: { id?: string | null } | null } | null;
};

export type UpdateFaceTagDirectionMutationVariables = Exact<{
  id: Scalars['ID'];
  tag_direction?: InputMaybe<Scalars['Int']>;
}>;

export type UpdateFaceTagDirectionMutation = {
  updateFaceTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateKeywordNameMutationVariables = Exact<{
  tagId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type UpdateKeywordNameMutation = {
  updateKeywordTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateKeywordSynonymsMutationVariables = Exact<{
  tagId: Scalars['ID'];
  synonyms:
    | Array<InputMaybe<ComponentCommonSynonymsInput>>
    | InputMaybe<ComponentCommonSynonymsInput>;
}>;

export type UpdateKeywordSynonymsMutation = {
  updateKeywordTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateKeywordVisibilityMutationVariables = Exact<{
  tagId: Scalars['ID'];
  visible: Scalars['Boolean'];
}>;

export type UpdateKeywordVisibilityMutation = {
  updateKeywordTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLinkMutationVariables = Exact<{
  id: Scalars['ID'];
  data: LinkInput;
}>;

export type UpdateLinkMutation = { updateLink?: { data?: { id?: string | null } | null } | null };

export type UpdateLocationAcceptanceMutationVariables = Exact<{
  tagId: Scalars['ID'];
  accepted?: InputMaybe<Scalars['Boolean']>;
}>;

export type UpdateLocationAcceptanceMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLocationChildMutationVariables = Exact<{
  tagID: Scalars['ID'];
  childIDs?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;

export type UpdateLocationChildMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLocationCoordinatesMutationVariables = Exact<{
  tagId: Scalars['ID'];
  coordinate?: InputMaybe<ComponentLocationCoordinatesInput>;
}>;

export type UpdateLocationCoordinatesMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLocationNameMutationVariables = Exact<{
  tagId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type UpdateLocationNameMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLocationParentMutationVariables = Exact<{
  tagID: Scalars['ID'];
  parentIDs?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;

export type UpdateLocationParentMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLocationRootMutationVariables = Exact<{
  tagId: Scalars['ID'];
  root: Scalars['Boolean'];
}>;

export type UpdateLocationRootMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLocationSynonymsMutationVariables = Exact<{
  tagId: Scalars['ID'];
  synonyms:
    | Array<InputMaybe<ComponentCommonSynonymsInput>>
    | InputMaybe<ComponentCommonSynonymsInput>;
}>;

export type UpdateLocationSynonymsMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateLocationVisibilityMutationVariables = Exact<{
  tagId: Scalars['ID'];
  visible: Scalars['Boolean'];
}>;

export type UpdateLocationVisibilityMutation = {
  updateLocationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdateMeMutationVariables = Exact<{
  username?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
}>;

export type UpdateMeMutation = { updateMe?: number | null };

export type UpdateOrientationTagDirectionMutationVariables = Exact<{
  id: Scalars['ID'];
  tag_direction?: InputMaybe<Scalars['Int']>;
}>;

export type UpdateOrientationTagDirectionMutation = {
  updateOrientationTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdatePersonNameMutationVariables = Exact<{
  tagId: Scalars['ID'];
  name: Scalars['String'];
}>;

export type UpdatePersonNameMutation = {
  updatePersonTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdatePersonSynonymsMutationVariables = Exact<{
  tagId: Scalars['ID'];
  synonyms:
    | Array<InputMaybe<ComponentCommonSynonymsInput>>
    | InputMaybe<ComponentCommonSynonymsInput>;
}>;

export type UpdatePersonSynonymsMutation = {
  updatePersonTag?: { data?: { id?: string | null } | null } | null;
};

export type UpdatePictureMutationVariables = Exact<{
  pictureId: Scalars['ID'];
  data: Scalars['JSON'];
}>;

export type UpdatePictureMutation = { updatePictureWithTagCleanup?: string | null };

export type UpdatePictureSequenceDataMutationVariables = Exact<{
  pictureId: Scalars['ID'];
  pictureSequence?: InputMaybe<Scalars['ID']>;
  pictureSequenceOrder?: InputMaybe<Scalars['Int']>;
}>;

export type UpdatePictureSequenceDataMutation = { updatePictureWithTagCleanup?: string | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID'];
  username?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
}>;

export type UpdateUserMutation = {
  updateUsersPermissionsUser: { data?: { id?: string | null } | null };
};

export const CanRunOperationDocument = gql`
  query canRunOperation($operation: String!, $variableSets: [JSON!], $withSomeVariables: Boolean) {
    canRunOperation(
      operation: $operation
      variableSets: $variableSets
      withSomeVariables: $withSomeVariables
    )
  }
`;

/**
 * __useCanRunOperationQuery__
 *
 * To run a query within a React component, call `useCanRunOperationQuery` and pass it any options that fit your needs.
 * When your component renders, `useCanRunOperationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCanRunOperationQuery({
 *   variables: {
 *      operation: // value for 'operation'
 *      variableSets: // value for 'variableSets'
 *      withSomeVariables: // value for 'withSomeVariables'
 *   },
 * });
 */
export function useCanRunOperationQuery(
  baseOptions: Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CanRunOperationQuery, CanRunOperationQueryVariables>(
    CanRunOperationDocument,
    options
  );
}

export function useCanRunOperationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CanRunOperationQuery, CanRunOperationQueryVariables>(
    CanRunOperationDocument,
    options
  );
}

export type CanRunOperationQueryHookResult = ReturnType<typeof useCanRunOperationQuery>;

export type CanRunOperationLazyQueryHookResult = ReturnType<typeof useCanRunOperationLazyQuery>;

export type CanRunOperationQueryResult = Apollo.QueryResult<
  CanRunOperationQuery,
  CanRunOperationQueryVariables
>;

export const GetAllArchiveTagsDocument = gql`
  query getAllArchiveTags($sortBy: [String] = ["createdAt:asc"]) {
    archiveTags(sort: $sortBy) {
      data {
        id
        attributes {
          name
          shortDescription
          hidden
          showcasePicture {
            data {
              id
              attributes {
                media {
                  data {
                    attributes {
                      url
                      updatedAt
                      provider
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
 * __useGetAllArchiveTagsQuery__
 *
 * To run a query within a React component, call `useGetAllArchiveTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllArchiveTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllArchiveTagsQuery({
 *   variables: {
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useGetAllArchiveTagsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllArchiveTagsQuery, GetAllArchiveTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllArchiveTagsQuery, GetAllArchiveTagsQueryVariables>(
    GetAllArchiveTagsDocument,
    options
  );
}

export function useGetAllArchiveTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAllArchiveTagsQuery, GetAllArchiveTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllArchiveTagsQuery, GetAllArchiveTagsQueryVariables>(
    GetAllArchiveTagsDocument,
    options
  );
}

export type GetAllArchiveTagsQueryHookResult = ReturnType<typeof useGetAllArchiveTagsQuery>;

export type GetAllArchiveTagsLazyQueryHookResult = ReturnType<typeof useGetAllArchiveTagsLazyQuery>;

export type GetAllArchiveTagsQueryResult = Apollo.QueryResult<
  GetAllArchiveTagsQuery,
  GetAllArchiveTagsQueryVariables
>;

export const GetAllCollectionsDocument = gql`
  query getAllCollections {
    collections(publicationState: PREVIEW) {
      data {
        id
        attributes {
          name
          parent_collections(publicationState: PREVIEW) {
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

export const GetAllKeywordTagsDocument = gql`
  query getAllKeywordTags {
    keywordTags {
      data {
        id
        attributes {
          name
          visible
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

export const GetAllLocationTagsDocument = gql`
  query getAllLocationTags {
    getAllLocationTags
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

export const GetAllPictureIdsDocument = gql`
  query getAllPictureIds {
    pictures {
      data {
        id
      }
    }
  }
`;

/**
 * __useGetAllPictureIdsQuery__
 *
 * To run a query within a React component, call `useGetAllPictureIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPictureIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPictureIdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPictureIdsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllPictureIdsQuery, GetAllPictureIdsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllPictureIdsQuery, GetAllPictureIdsQueryVariables>(
    GetAllPictureIdsDocument,
    options
  );
}

export function useGetAllPictureIdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAllPictureIdsQuery, GetAllPictureIdsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllPictureIdsQuery, GetAllPictureIdsQueryVariables>(
    GetAllPictureIdsDocument,
    options
  );
}

export type GetAllPictureIdsQueryHookResult = ReturnType<typeof useGetAllPictureIdsQuery>;

export type GetAllPictureIdsLazyQueryHookResult = ReturnType<typeof useGetAllPictureIdsLazyQuery>;

export type GetAllPictureIdsQueryResult = Apollo.QueryResult<
  GetAllPictureIdsQuery,
  GetAllPictureIdsQueryVariables
>;

export const GetArchiveDocument = gql`
  query getArchive($archiveId: ID!) {
    archiveTag(id: $archiveId) {
      data {
        id
        attributes {
          name
          shortDescription
          longDescription
          email
          paypalClient
          paypalDonationText
          paypalPurpose
          hidden
          restrictImageDownloading
          logo {
            data {
              id
              attributes {
                width
                height
                formats
                updatedAt
                provider
              }
            }
          }
          showcasePicture {
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
                      url
                      updatedAt
                      provider
                    }
                  }
                }
              }
            }
          }
          links {
            data {
              id
              attributes {
                title
                url
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetArchiveQuery__
 *
 * To run a query within a React component, call `useGetArchiveQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArchiveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetArchiveQuery({
 *   variables: {
 *      archiveId: // value for 'archiveId'
 *   },
 * });
 */
export function useGetArchiveQuery(
  baseOptions: Apollo.QueryHookOptions<GetArchiveQuery, GetArchiveQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetArchiveQuery, GetArchiveQueryVariables>(GetArchiveDocument, options);
}

export function useGetArchiveLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetArchiveQuery, GetArchiveQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetArchiveQuery, GetArchiveQueryVariables>(
    GetArchiveDocument,
    options
  );
}

export type GetArchiveQueryHookResult = ReturnType<typeof useGetArchiveQuery>;

export type GetArchiveLazyQueryHookResult = ReturnType<typeof useGetArchiveLazyQuery>;

export type GetArchiveQueryResult = Apollo.QueryResult<GetArchiveQuery, GetArchiveQueryVariables>;

export const GetArchiveNamesDocument = gql`
  query getArchiveNames(
    $filters: ArchiveTagFiltersInput = {}
    $sortBy: [String] = ["createdAt:asc"]
  ) {
    archiveTags(filters: $filters, sort: $sortBy) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

/**
 * __useGetArchiveNamesQuery__
 *
 * To run a query within a React component, call `useGetArchiveNamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArchiveNamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetArchiveNamesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useGetArchiveNamesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetArchiveNamesQuery, GetArchiveNamesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetArchiveNamesQuery, GetArchiveNamesQueryVariables>(
    GetArchiveNamesDocument,
    options
  );
}

export function useGetArchiveNamesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetArchiveNamesQuery, GetArchiveNamesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetArchiveNamesQuery, GetArchiveNamesQueryVariables>(
    GetArchiveNamesDocument,
    options
  );
}

export type GetArchiveNamesQueryHookResult = ReturnType<typeof useGetArchiveNamesQuery>;

export type GetArchiveNamesLazyQueryHookResult = ReturnType<typeof useGetArchiveNamesLazyQuery>;

export type GetArchiveNamesQueryResult = Apollo.QueryResult<
  GetArchiveNamesQuery,
  GetArchiveNamesQueryVariables
>;

export const GetArchivePictureCountsDocument = gql`
  query getArchivePictureCounts {
    archivePictureCounts {
      data {
        id
        attributes {
          count
        }
      }
    }
  }
`;

/**
 * __useGetArchivePictureCountsQuery__
 *
 * To run a query within a React component, call `useGetArchivePictureCountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArchivePictureCountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetArchivePictureCountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetArchivePictureCountsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetArchivePictureCountsQuery,
    GetArchivePictureCountsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetArchivePictureCountsQuery, GetArchivePictureCountsQueryVariables>(
    GetArchivePictureCountsDocument,
    options
  );
}

export function useGetArchivePictureCountsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetArchivePictureCountsQuery,
    GetArchivePictureCountsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetArchivePictureCountsQuery, GetArchivePictureCountsQueryVariables>(
    GetArchivePictureCountsDocument,
    options
  );
}

export type GetArchivePictureCountsQueryHookResult = ReturnType<
  typeof useGetArchivePictureCountsQuery
>;

export type GetArchivePictureCountsLazyQueryHookResult = ReturnType<
  typeof useGetArchivePictureCountsLazyQuery
>;

export type GetArchivePictureCountsQueryResult = Apollo.QueryResult<
  GetArchivePictureCountsQuery,
  GetArchivePictureCountsQueryVariables
>;

export const GetCollectionInfoByIdDocument = gql`
  query getCollectionInfoById($collectionId: ID!) {
    collection(id: $collectionId) {
      data {
        id
        attributes {
          name
          description
          child_collections(sort: "name:asc", publicationState: PREVIEW) {
            data {
              id
              attributes {
                name
                publishedAt
                pictures(pagination: { limit: 1 }) {
                  data {
                    id
                  }
                }
                child_collections(pagination: { limit: 1 }, publicationState: PREVIEW) {
                  data {
                    id
                  }
                }
                parent_collections(publicationState: PREVIEW) {
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

export const GetCollectionInfoByNameDocument = gql`
  query getCollectionInfoByName($collectionName: String) {
    collections(filters: { name: { eq: $collectionName } }, publicationState: PREVIEW) {
      data {
        id
        attributes {
          name
          description
          child_collections(sort: "name:asc", publicationState: PREVIEW) {
            data {
              id
              attributes {
                name
                thumbnail
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

export const GetDailyPictureInfoDocument = gql`
  query getDailyPictureInfo($pictureId: ID!) {
    picture(id: $pictureId) {
      data {
        id
        attributes {
          descriptions(sort: "createdAt:asc") {
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
                isEstimate
              }
            }
          }
          verified_time_range_tag {
            data {
              id
              attributes {
                start
                end
                isEstimate
              }
            }
          }
          comments {
            data {
              id
            }
          }
          likes
          media {
            data {
              id
              attributes {
                url
                updatedAt
                provider
              }
            }
          }
          archive_tag {
            data {
              id
              attributes {
                name
                restrictImageDownloading
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetDailyPictureInfoQuery__
 *
 * To run a query within a React component, call `useGetDailyPictureInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDailyPictureInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDailyPictureInfoQuery({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *   },
 * });
 */
export function useGetDailyPictureInfoQuery(
  baseOptions: Apollo.QueryHookOptions<GetDailyPictureInfoQuery, GetDailyPictureInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDailyPictureInfoQuery, GetDailyPictureInfoQueryVariables>(
    GetDailyPictureInfoDocument,
    options
  );
}

export function useGetDailyPictureInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDailyPictureInfoQuery,
    GetDailyPictureInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDailyPictureInfoQuery, GetDailyPictureInfoQueryVariables>(
    GetDailyPictureInfoDocument,
    options
  );
}

export type GetDailyPictureInfoQueryHookResult = ReturnType<typeof useGetDailyPictureInfoQuery>;

export type GetDailyPictureInfoLazyQueryHookResult = ReturnType<
  typeof useGetDailyPictureInfoLazyQuery
>;

export type GetDailyPictureInfoQueryResult = Apollo.QueryResult<
  GetDailyPictureInfoQuery,
  GetDailyPictureInfoQueryVariables
>;

export const GetDecadePreviewThumbnailsDocument = gql`
  query getDecadePreviewThumbnails(
    $filter40s: PictureFiltersInput!
    $filter50s: PictureFiltersInput!
    $filter60s: PictureFiltersInput!
    $filter70s: PictureFiltersInput!
    $filter80s: PictureFiltersInput!
    $filter90s: PictureFiltersInput!
  ) {
    decade40s: pictures(
      filters: {
        and: [$filter40s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
                provider
              }
            }
          }
        }
      }
    }
    decade50s: pictures(
      filters: {
        and: [$filter50s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
                provider
              }
            }
          }
        }
      }
    }
    decade60s: pictures(
      filters: {
        and: [$filter60s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
                provider
              }
            }
          }
        }
      }
    }
    decade70s: pictures(
      filters: {
        and: [$filter70s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
                provider
              }
            }
          }
        }
      }
    }
    decade80s: pictures(
      filters: {
        and: [$filter80s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
                provider
              }
            }
          }
        }
      }
    }
    decade90s: pictures(
      filters: {
        and: [$filter90s, { or: [{ is_text: { eq: false } }, { is_text: { null: true } }] }]
      }
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          media {
            data {
              attributes {
                formats
                provider
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
 *      filter40s: // value for 'filter40s'
 *      filter50s: // value for 'filter50s'
 *      filter60s: // value for 'filter60s'
 *      filter70s: // value for 'filter70s'
 *      filter80s: // value for 'filter80s'
 *      filter90s: // value for 'filter90s'
 *   },
 * });
 */
export function useGetDecadePreviewThumbnailsQuery(
  baseOptions: Apollo.QueryHookOptions<
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

export const GetExhibitionDocument = gql`
  query getExhibition($exhibitionId: ID!) {
    exhibition(id: $exhibitionId) {
      data {
        id
        attributes {
          title
          introduction
          is_published
          title_picture {
            data {
              id
              attributes {
                subtitle
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
                            url
                            updatedAt
                            provider
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          idealot_pictures {
            data {
              id
              attributes {
                subtitle
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
                            url
                            updatedAt
                            provider
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          exhibition_sections(sort: "order:asc") {
            data {
              id
              attributes {
                title
                text
                order
                exhibition_pictures(sort: "order:asc") {
                  data {
                    id
                    attributes {
                      order
                      subtitle
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
                                  url
                                  updatedAt
                                  provider
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
      }
    }
  }
`;

/**
 * __useGetExhibitionQuery__
 *
 * To run a query within a React component, call `useGetExhibitionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExhibitionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExhibitionQuery({
 *   variables: {
 *      exhibitionId: // value for 'exhibitionId'
 *   },
 * });
 */
export function useGetExhibitionQuery(
  baseOptions: Apollo.QueryHookOptions<GetExhibitionQuery, GetExhibitionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetExhibitionQuery, GetExhibitionQueryVariables>(
    GetExhibitionDocument,
    options
  );
}

export function useGetExhibitionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExhibitionQuery, GetExhibitionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetExhibitionQuery, GetExhibitionQueryVariables>(
    GetExhibitionDocument,
    options
  );
}

export type GetExhibitionQueryHookResult = ReturnType<typeof useGetExhibitionQuery>;

export type GetExhibitionLazyQueryHookResult = ReturnType<typeof useGetExhibitionLazyQuery>;

export type GetExhibitionQueryResult = Apollo.QueryResult<
  GetExhibitionQuery,
  GetExhibitionQueryVariables
>;

export const GetExhibitionsDocument = gql`
  query getExhibitions($archiveId: ID, $sortBy: [String] = ["updatedAt:desc"]) {
    exhibitions(filters: { archive_tag: { id: { eq: $archiveId } } }, sort: $sortBy) {
      data {
        id
        attributes {
          title
          introduction
          is_published
          archive_tag {
            data {
              id
            }
          }
          title_picture {
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
                            url
                            updatedAt
                            provider
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
 * __useGetExhibitionsQuery__
 *
 * To run a query within a React component, call `useGetExhibitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExhibitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExhibitionsQuery({
 *   variables: {
 *      archiveId: // value for 'archiveId'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useGetExhibitionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetExhibitionsQuery, GetExhibitionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetExhibitionsQuery, GetExhibitionsQueryVariables>(
    GetExhibitionsDocument,
    options
  );
}

export function useGetExhibitionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExhibitionsQuery, GetExhibitionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetExhibitionsQuery, GetExhibitionsQueryVariables>(
    GetExhibitionsDocument,
    options
  );
}

export type GetExhibitionsQueryHookResult = ReturnType<typeof useGetExhibitionsQuery>;

export type GetExhibitionsLazyQueryHookResult = ReturnType<typeof useGetExhibitionsLazyQuery>;

export type GetExhibitionsQueryResult = Apollo.QueryResult<
  GetExhibitionsQuery,
  GetExhibitionsQueryVariables
>;

export const GetFaceTagsDocument = gql`
  query getFaceTags($pictureId: ID!) {
    faceTags(filters: { picture: { id: { eq: $pictureId } } }) {
      data {
        id
        attributes {
          x
          y
          tag_direction
          person_tag {
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
 * __useGetFaceTagsQuery__
 *
 * To run a query within a React component, call `useGetFaceTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFaceTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFaceTagsQuery({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *   },
 * });
 */
export function useGetFaceTagsQuery(
  baseOptions: Apollo.QueryHookOptions<GetFaceTagsQuery, GetFaceTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFaceTagsQuery, GetFaceTagsQueryVariables>(GetFaceTagsDocument, options);
}

export function useGetFaceTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFaceTagsQuery, GetFaceTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFaceTagsQuery, GetFaceTagsQueryVariables>(
    GetFaceTagsDocument,
    options
  );
}

export type GetFaceTagsQueryHookResult = ReturnType<typeof useGetFaceTagsQuery>;

export type GetFaceTagsLazyQueryHookResult = ReturnType<typeof useGetFaceTagsLazyQuery>;

export type GetFaceTagsQueryResult = Apollo.QueryResult<
  GetFaceTagsQuery,
  GetFaceTagsQueryVariables
>;

export const GetIdeaLotContentDocument = gql`
  query getIdeaLotContent($exhibitionId: ID!) {
    exhibition(id: $exhibitionId) {
      data {
        id
        attributes {
          idealot_pictures {
            data {
              id
              attributes {
                subtitle
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
                            url
                            updatedAt
                            provider
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
 * __useGetIdeaLotContentQuery__
 *
 * To run a query within a React component, call `useGetIdeaLotContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIdeaLotContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIdeaLotContentQuery({
 *   variables: {
 *      exhibitionId: // value for 'exhibitionId'
 *   },
 * });
 */
export function useGetIdeaLotContentQuery(
  baseOptions: Apollo.QueryHookOptions<GetIdeaLotContentQuery, GetIdeaLotContentQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetIdeaLotContentQuery, GetIdeaLotContentQueryVariables>(
    GetIdeaLotContentDocument,
    options
  );
}

export function useGetIdeaLotContentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetIdeaLotContentQuery, GetIdeaLotContentQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetIdeaLotContentQuery, GetIdeaLotContentQueryVariables>(
    GetIdeaLotContentDocument,
    options
  );
}

export type GetIdeaLotContentQueryHookResult = ReturnType<typeof useGetIdeaLotContentQuery>;

export type GetIdeaLotContentLazyQueryHookResult = ReturnType<typeof useGetIdeaLotContentLazyQuery>;

export type GetIdeaLotContentQueryResult = Apollo.QueryResult<
  GetIdeaLotContentQuery,
  GetIdeaLotContentQueryVariables
>;

export const GetKeywordTagsWithThumbnailDocument = gql`
  query getKeywordTagsWithThumbnail(
    $filters: KeywordTagFiltersInput = {}
    $thumbnailFilters: PictureFiltersInput = {}
    $pagination: PaginationArg!
    $sortBy: [String]
  ) {
    keywordTags(filters: $filters, pagination: $pagination, sort: $sortBy) {
      data {
        id
        attributes {
          name
          thumbnail: pictures(filters: $thumbnailFilters, pagination: { limit: 1 }) {
            data {
              attributes {
                media {
                  data {
                    attributes {
                      formats
                      provider
                    }
                  }
                }
              }
            }
          }
          verified_thumbnail: verified_pictures(
            filters: $thumbnailFilters
            pagination: { limit: 1 }
          ) {
            data {
              attributes {
                media {
                  data {
                    attributes {
                      formats
                      provider
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
 * __useGetKeywordTagsWithThumbnailQuery__
 *
 * To run a query within a React component, call `useGetKeywordTagsWithThumbnailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetKeywordTagsWithThumbnailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetKeywordTagsWithThumbnailQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      thumbnailFilters: // value for 'thumbnailFilters'
 *      pagination: // value for 'pagination'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useGetKeywordTagsWithThumbnailQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetKeywordTagsWithThumbnailQuery,
    GetKeywordTagsWithThumbnailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetKeywordTagsWithThumbnailQuery,
    GetKeywordTagsWithThumbnailQueryVariables
  >(GetKeywordTagsWithThumbnailDocument, options);
}

export function useGetKeywordTagsWithThumbnailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetKeywordTagsWithThumbnailQuery,
    GetKeywordTagsWithThumbnailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetKeywordTagsWithThumbnailQuery,
    GetKeywordTagsWithThumbnailQueryVariables
  >(GetKeywordTagsWithThumbnailDocument, options);
}

export type GetKeywordTagsWithThumbnailQueryHookResult = ReturnType<
  typeof useGetKeywordTagsWithThumbnailQuery
>;

export type GetKeywordTagsWithThumbnailLazyQueryHookResult = ReturnType<
  typeof useGetKeywordTagsWithThumbnailLazyQuery
>;

export type GetKeywordTagsWithThumbnailQueryResult = Apollo.QueryResult<
  GetKeywordTagsWithThumbnailQuery,
  GetKeywordTagsWithThumbnailQueryVariables
>;

export const GetLocationTagDocument = gql`
  query getLocationTag($id: ID!) {
    locationTag(id: $id) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

/**
 * __useGetLocationTagQuery__
 *
 * To run a query within a React component, call `useGetLocationTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationTagQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLocationTagQuery(
  baseOptions: Apollo.QueryHookOptions<GetLocationTagQuery, GetLocationTagQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLocationTagQuery, GetLocationTagQueryVariables>(
    GetLocationTagDocument,
    options
  );
}

export function useGetLocationTagLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetLocationTagQuery, GetLocationTagQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLocationTagQuery, GetLocationTagQueryVariables>(
    GetLocationTagDocument,
    options
  );
}

export type GetLocationTagQueryHookResult = ReturnType<typeof useGetLocationTagQuery>;

export type GetLocationTagLazyQueryHookResult = ReturnType<typeof useGetLocationTagLazyQuery>;

export type GetLocationTagQueryResult = Apollo.QueryResult<
  GetLocationTagQuery,
  GetLocationTagQueryVariables
>;

export const GetLocationTagsWithThumbnailDocument = gql`
  query getLocationTagsWithThumbnail(
    $filters: LocationTagFiltersInput = {}
    $thumbnailFilters: PictureFiltersInput = {}
    $pagination: PaginationArg!
    $sortBy: [String]
  ) {
    getLocationTagsWithThumbnail(
      filters: $filters
      thumbnailFilters: $thumbnailFilters
      pagination: $pagination
      sortBy: $sortBy
    )
  }
`;

/**
 * __useGetLocationTagsWithThumbnailQuery__
 *
 * To run a query within a React component, call `useGetLocationTagsWithThumbnailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationTagsWithThumbnailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationTagsWithThumbnailQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      thumbnailFilters: // value for 'thumbnailFilters'
 *      pagination: // value for 'pagination'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useGetLocationTagsWithThumbnailQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLocationTagsWithThumbnailQuery,
    GetLocationTagsWithThumbnailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLocationTagsWithThumbnailQuery,
    GetLocationTagsWithThumbnailQueryVariables
  >(GetLocationTagsWithThumbnailDocument, options);
}

export function useGetLocationTagsWithThumbnailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLocationTagsWithThumbnailQuery,
    GetLocationTagsWithThumbnailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLocationTagsWithThumbnailQuery,
    GetLocationTagsWithThumbnailQueryVariables
  >(GetLocationTagsWithThumbnailDocument, options);
}

export type GetLocationTagsWithThumbnailQueryHookResult = ReturnType<
  typeof useGetLocationTagsWithThumbnailQuery
>;

export type GetLocationTagsWithThumbnailLazyQueryHookResult = ReturnType<
  typeof useGetLocationTagsWithThumbnailLazyQuery
>;

export type GetLocationTagsWithThumbnailQueryResult = Apollo.QueryResult<
  GetLocationTagsWithThumbnailQuery,
  GetLocationTagsWithThumbnailQueryVariables
>;

export const GetMostLikedPicturesDocument = gql`
  query getMostLikedPictures($filters: PictureFiltersInput!, $pagination: PaginationArg!) {
    pictures(
      filters: { and: [{ likes: { gt: 0 } }, $filters] }
      pagination: $pagination
      sort: ["likes:desc"]
    ) {
      data {
        id
        attributes {
          is_text
          comments {
            data {
              id
            }
          }
          likes
          media {
            data {
              id
              attributes {
                width
                height
                formats
                url
                updatedAt
                provider
              }
            }
          }
          picture_sequence {
            data {
              id
              attributes {
                pictures(sort: "picture_sequence_order:asc") {
                  data {
                    id
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
 * __useGetMostLikedPicturesQuery__
 *
 * To run a query within a React component, call `useGetMostLikedPicturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostLikedPicturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostLikedPicturesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetMostLikedPicturesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMostLikedPicturesQuery,
    GetMostLikedPicturesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMostLikedPicturesQuery, GetMostLikedPicturesQueryVariables>(
    GetMostLikedPicturesDocument,
    options
  );
}

export function useGetMostLikedPicturesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostLikedPicturesQuery,
    GetMostLikedPicturesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMostLikedPicturesQuery, GetMostLikedPicturesQueryVariables>(
    GetMostLikedPicturesDocument,
    options
  );
}

export type GetMostLikedPicturesQueryHookResult = ReturnType<typeof useGetMostLikedPicturesQuery>;

export type GetMostLikedPicturesLazyQueryHookResult = ReturnType<
  typeof useGetMostLikedPicturesLazyQuery
>;

export type GetMostLikedPicturesQueryResult = Apollo.QueryResult<
  GetMostLikedPicturesQuery,
  GetMostLikedPicturesQueryVariables
>;

export const GetMultiplePictureInfoDocument = gql`
  query getMultiplePictureInfo($pictureIds: [ID!]) {
    pictures(filters: { id: { in: $pictureIds } }) {
      data {
        id
        attributes {
          descriptions(sort: "createdAt:asc") {
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
                isEstimate
              }
            }
          }
          verified_time_range_tag {
            data {
              id
              attributes {
                start
                end
                isEstimate
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
          collections(publicationState: PREVIEW) {
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
                provider
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
                pinned
              }
            }
          }
          is_text
          linked_pictures {
            data {
              id
            }
          }
          linked_texts {
            data {
              id
            }
          }
          archive_tag {
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
 * __useGetMultiplePictureInfoQuery__
 *
 * To run a query within a React component, call `useGetMultiplePictureInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMultiplePictureInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMultiplePictureInfoQuery({
 *   variables: {
 *      pictureIds: // value for 'pictureIds'
 *   },
 * });
 */
export function useGetMultiplePictureInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMultiplePictureInfoQuery,
    GetMultiplePictureInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMultiplePictureInfoQuery, GetMultiplePictureInfoQueryVariables>(
    GetMultiplePictureInfoDocument,
    options
  );
}

export function useGetMultiplePictureInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMultiplePictureInfoQuery,
    GetMultiplePictureInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMultiplePictureInfoQuery, GetMultiplePictureInfoQueryVariables>(
    GetMultiplePictureInfoDocument,
    options
  );
}

export type GetMultiplePictureInfoQueryHookResult = ReturnType<
  typeof useGetMultiplePictureInfoQuery
>;

export type GetMultiplePictureInfoLazyQueryHookResult = ReturnType<
  typeof useGetMultiplePictureInfoLazyQuery
>;

export type GetMultiplePictureInfoQueryResult = Apollo.QueryResult<
  GetMultiplePictureInfoQuery,
  GetMultiplePictureInfoQueryVariables
>;

export const GetOrientationTagsDocument = gql`
  query getOrientationTags($pictureId: ID!) {
    orientationTags(filters: { picture: { id: { eq: $pictureId } } }) {
      data {
        id
        attributes {
          x
          y
          tag_direction
          location_tag {
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
 * __useGetOrientationTagsQuery__
 *
 * To run a query within a React component, call `useGetOrientationTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrientationTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrientationTagsQuery({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *   },
 * });
 */
export function useGetOrientationTagsQuery(
  baseOptions: Apollo.QueryHookOptions<GetOrientationTagsQuery, GetOrientationTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetOrientationTagsQuery, GetOrientationTagsQueryVariables>(
    GetOrientationTagsDocument,
    options
  );
}

export function useGetOrientationTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetOrientationTagsQuery,
    GetOrientationTagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetOrientationTagsQuery, GetOrientationTagsQueryVariables>(
    GetOrientationTagsDocument,
    options
  );
}

export type GetOrientationTagsQueryHookResult = ReturnType<typeof useGetOrientationTagsQuery>;

export type GetOrientationTagsLazyQueryHookResult = ReturnType<
  typeof useGetOrientationTagsLazyQuery
>;

export type GetOrientationTagsQueryResult = Apollo.QueryResult<
  GetOrientationTagsQuery,
  GetOrientationTagsQueryVariables
>;

export const GetParameterizedPermissionsDocument = gql`
  query getParameterizedPermissions($userId: ID) {
    parameterizedPermissions(filters: { users_permissions_user: { id: { eq: $userId } } }) {
      data {
        id
        attributes {
          operation_name
          archive_tag {
            data {
              id
            }
          }
          on_other_users
        }
      }
    }
  }
`;

/**
 * __useGetParameterizedPermissionsQuery__
 *
 * To run a query within a React component, call `useGetParameterizedPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParameterizedPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParameterizedPermissionsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetParameterizedPermissionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetParameterizedPermissionsQuery,
    GetParameterizedPermissionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetParameterizedPermissionsQuery,
    GetParameterizedPermissionsQueryVariables
  >(GetParameterizedPermissionsDocument, options);
}

export function useGetParameterizedPermissionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetParameterizedPermissionsQuery,
    GetParameterizedPermissionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetParameterizedPermissionsQuery,
    GetParameterizedPermissionsQueryVariables
  >(GetParameterizedPermissionsDocument, options);
}

export type GetParameterizedPermissionsQueryHookResult = ReturnType<
  typeof useGetParameterizedPermissionsQuery
>;

export type GetParameterizedPermissionsLazyQueryHookResult = ReturnType<
  typeof useGetParameterizedPermissionsLazyQuery
>;

export type GetParameterizedPermissionsQueryResult = Apollo.QueryResult<
  GetParameterizedPermissionsQuery,
  GetParameterizedPermissionsQueryVariables
>;

export const GetPersonTagDocument = gql`
  query getPersonTag($id: ID!) {
    personTag(id: $id) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

/**
 * __useGetPersonTagQuery__
 *
 * To run a query within a React component, call `useGetPersonTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonTagQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPersonTagQuery(
  baseOptions: Apollo.QueryHookOptions<GetPersonTagQuery, GetPersonTagQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPersonTagQuery, GetPersonTagQueryVariables>(
    GetPersonTagDocument,
    options
  );
}

export function useGetPersonTagLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPersonTagQuery, GetPersonTagQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPersonTagQuery, GetPersonTagQueryVariables>(
    GetPersonTagDocument,
    options
  );
}

export type GetPersonTagQueryHookResult = ReturnType<typeof useGetPersonTagQuery>;

export type GetPersonTagLazyQueryHookResult = ReturnType<typeof useGetPersonTagLazyQuery>;

export type GetPersonTagQueryResult = Apollo.QueryResult<
  GetPersonTagQuery,
  GetPersonTagQueryVariables
>;

export const GetPersonTagsWithThumbnailDocument = gql`
  query getPersonTagsWithThumbnail(
    $filters: PersonTagFiltersInput = {}
    $thumbnailFilters: PictureFiltersInput = {}
    $pagination: PaginationArg!
    $sortBy: [String]
  ) {
    personTags(filters: $filters, pagination: $pagination, sort: $sortBy) {
      data {
        id
        attributes {
          name
          thumbnail: pictures(filters: $thumbnailFilters, pagination: { limit: 1 }) {
            data {
              attributes {
                media {
                  data {
                    attributes {
                      formats
                      url
                      provider
                    }
                  }
                }
              }
            }
          }
          verified_thumbnail: verified_pictures(
            filters: $thumbnailFilters
            pagination: { limit: 1 }
          ) {
            data {
              attributes {
                media {
                  data {
                    attributes {
                      formats
                      url
                      provider
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
 * __useGetPersonTagsWithThumbnailQuery__
 *
 * To run a query within a React component, call `useGetPersonTagsWithThumbnailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonTagsWithThumbnailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonTagsWithThumbnailQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      thumbnailFilters: // value for 'thumbnailFilters'
 *      pagination: // value for 'pagination'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useGetPersonTagsWithThumbnailQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetPersonTagsWithThumbnailQuery,
    GetPersonTagsWithThumbnailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPersonTagsWithThumbnailQuery, GetPersonTagsWithThumbnailQueryVariables>(
    GetPersonTagsWithThumbnailDocument,
    options
  );
}

export function useGetPersonTagsWithThumbnailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPersonTagsWithThumbnailQuery,
    GetPersonTagsWithThumbnailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPersonTagsWithThumbnailQuery,
    GetPersonTagsWithThumbnailQueryVariables
  >(GetPersonTagsWithThumbnailDocument, options);
}

export type GetPersonTagsWithThumbnailQueryHookResult = ReturnType<
  typeof useGetPersonTagsWithThumbnailQuery
>;

export type GetPersonTagsWithThumbnailLazyQueryHookResult = ReturnType<
  typeof useGetPersonTagsWithThumbnailLazyQuery
>;

export type GetPersonTagsWithThumbnailQueryResult = Apollo.QueryResult<
  GetPersonTagsWithThumbnailQuery,
  GetPersonTagsWithThumbnailQueryVariables
>;

export const GetPictureGeoInfoDocument = gql`
  query getPictureGeoInfo($pictureId: ID!) {
    pictureGeoInfos(filters: { picture: { id: { eq: $pictureId } } }) {
      data {
        id
        attributes {
          latitude
          longitude
          radius
        }
      }
    }
  }
`;

/**
 * __useGetPictureGeoInfoQuery__
 *
 * To run a query within a React component, call `useGetPictureGeoInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPictureGeoInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPictureGeoInfoQuery({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *   },
 * });
 */
export function useGetPictureGeoInfoQuery(
  baseOptions: Apollo.QueryHookOptions<GetPictureGeoInfoQuery, GetPictureGeoInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPictureGeoInfoQuery, GetPictureGeoInfoQueryVariables>(
    GetPictureGeoInfoDocument,
    options
  );
}

export function useGetPictureGeoInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPictureGeoInfoQuery, GetPictureGeoInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPictureGeoInfoQuery, GetPictureGeoInfoQueryVariables>(
    GetPictureGeoInfoDocument,
    options
  );
}

export type GetPictureGeoInfoQueryHookResult = ReturnType<typeof useGetPictureGeoInfoQuery>;

export type GetPictureGeoInfoLazyQueryHookResult = ReturnType<typeof useGetPictureGeoInfoLazyQuery>;

export type GetPictureGeoInfoQueryResult = Apollo.QueryResult<
  GetPictureGeoInfoQuery,
  GetPictureGeoInfoQueryVariables
>;

export const GetPictureInfoDocument = gql`
  query getPictureInfo($pictureId: ID!) {
    picture(id: $pictureId) {
      data {
        id
        attributes {
          descriptions(sort: "createdAt:asc") {
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
                isEstimate
              }
            }
          }
          verified_time_range_tag {
            data {
              id
              attributes {
                start
                end
                isEstimate
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
          collections(publicationState: PREVIEW) {
            data {
              id
              attributes {
                name
              }
            }
          }
          comments(
            publicationState: PREVIEW
            sort: "date:desc"
            filters: { picture: { id: { eq: $pictureId } } }
          ) {
            data {
              id
              attributes {
                text
                author
                picture {
                  data {
                    id
                  }
                }
                date
                parentComment {
                  data {
                    id
                  }
                }
                childComments(publicationState: PREVIEW, sort: "date:asc") {
                  data {
                    id
                  }
                }
                publishedAt
                pinned
              }
            }
          }
          media {
            data {
              id
              attributes {
                width
                height
                formats
                url
                updatedAt
                provider
              }
            }
          }
          is_text
          linked_pictures {
            data {
              id
            }
          }
          linked_texts {
            data {
              id
            }
          }
          picture_sequence {
            data {
              id
              attributes {
                pictures(sort: "picture_sequence_order:asc") {
                  data {
                    id
                  }
                }
              }
            }
          }
          archive_tag {
            data {
              id
              attributes {
                name
                restrictImageDownloading
              }
            }
          }
          likes
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
  query getPictures(
    $filters: PictureFiltersInput!
    $pagination: PaginationArg!
    $sortBy: [String] = ["createdAt:desc"]
  ) {
    pictures(filters: $filters, pagination: $pagination, sort: $sortBy) {
      data {
        id
        attributes {
          is_text
          comments {
            data {
              id
            }
          }
          verified_time_range_tag {
            data {
              id
              attributes {
                start
                end
                isEstimate
              }
            }
          }
          time_range_tag {
            data {
              id
              attributes {
                start
                end
                isEstimate
              }
            }
          }
          likes
          media {
            data {
              id
              attributes {
                width
                height
                formats
                url
                updatedAt
                provider
              }
            }
          }
          picture_sequence {
            data {
              id
              attributes {
                pictures(sort: "picture_sequence_order:asc") {
                  data {
                    id
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
 *      sortBy: // value for 'sortBy'
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

export const GetPicturesByAllSearchDocument = gql`
  query getPicturesByAllSearch(
    $pagination: PaginationArg!
    $searchTerms: [String]!
    $searchTimes: [[String]]!
    $textFilter: String!
  ) {
    findPicturesByAllSearch(
      pagination: $pagination
      searchTerms: $searchTerms
      searchTimes: $searchTimes
      textFilter: $textFilter
    ) {
      id
      attributes {
        is_text
        comments {
          data {
            id
          }
        }
        likes
        media {
          data {
            id
            attributes {
              width
              height
              formats
              url
              updatedAt
              provider
            }
          }
        }
        picture_sequence {
          data {
            id
            attributes {
              pictures(sort: "picture_sequence_order:asc") {
                data {
                  id
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
 * __useGetPicturesByAllSearchQuery__
 *
 * To run a query within a React component, call `useGetPicturesByAllSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPicturesByAllSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPicturesByAllSearchQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      searchTerms: // value for 'searchTerms'
 *      searchTimes: // value for 'searchTimes'
 *      textFilter: // value for 'textFilter'
 *   },
 * });
 */
export function useGetPicturesByAllSearchQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetPicturesByAllSearchQuery,
    GetPicturesByAllSearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPicturesByAllSearchQuery, GetPicturesByAllSearchQueryVariables>(
    GetPicturesByAllSearchDocument,
    options
  );
}

export function useGetPicturesByAllSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPicturesByAllSearchQuery,
    GetPicturesByAllSearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPicturesByAllSearchQuery, GetPicturesByAllSearchQueryVariables>(
    GetPicturesByAllSearchDocument,
    options
  );
}

export type GetPicturesByAllSearchQueryHookResult = ReturnType<
  typeof useGetPicturesByAllSearchQuery
>;

export type GetPicturesByAllSearchLazyQueryHookResult = ReturnType<
  typeof useGetPicturesByAllSearchLazyQuery
>;

export type GetPicturesByAllSearchQueryResult = Apollo.QueryResult<
  GetPicturesByAllSearchQuery,
  GetPicturesByAllSearchQueryVariables
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

export const GetPicturesForLocationDocument = gql`
  query getPicturesForLocation($tagIDs: [ID!]) {
    locationTags(filters: { id: { in: $tagIDs } }) {
      data {
        id
        attributes {
          pictures {
            data {
              id
            }
          }
          verified_pictures {
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
 * __useGetPicturesForLocationQuery__
 *
 * To run a query within a React component, call `useGetPicturesForLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPicturesForLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPicturesForLocationQuery({
 *   variables: {
 *      tagIDs: // value for 'tagIDs'
 *   },
 * });
 */
export function useGetPicturesForLocationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPicturesForLocationQuery,
    GetPicturesForLocationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPicturesForLocationQuery, GetPicturesForLocationQueryVariables>(
    GetPicturesForLocationDocument,
    options
  );
}

export function useGetPicturesForLocationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPicturesForLocationQuery,
    GetPicturesForLocationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPicturesForLocationQuery, GetPicturesForLocationQueryVariables>(
    GetPicturesForLocationDocument,
    options
  );
}

export type GetPicturesForLocationQueryHookResult = ReturnType<
  typeof useGetPicturesForLocationQuery
>;

export type GetPicturesForLocationLazyQueryHookResult = ReturnType<
  typeof useGetPicturesForLocationLazyQuery
>;

export type GetPicturesForLocationQueryResult = Apollo.QueryResult<
  GetPicturesForLocationQuery,
  GetPicturesForLocationQueryVariables
>;

export const GetPublishedCollectionInfoByNameDocument = gql`
  query getPublishedCollectionInfoByName($collectionName: String) {
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
 * __useGetPublishedCollectionInfoByNameQuery__
 *
 * To run a query within a React component, call `useGetPublishedCollectionInfoByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublishedCollectionInfoByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublishedCollectionInfoByNameQuery({
 *   variables: {
 *      collectionName: // value for 'collectionName'
 *   },
 * });
 */
export function useGetPublishedCollectionInfoByNameQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPublishedCollectionInfoByNameQuery,
    GetPublishedCollectionInfoByNameQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetPublishedCollectionInfoByNameQuery,
    GetPublishedCollectionInfoByNameQueryVariables
  >(GetPublishedCollectionInfoByNameDocument, options);
}

export function useGetPublishedCollectionInfoByNameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPublishedCollectionInfoByNameQuery,
    GetPublishedCollectionInfoByNameQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPublishedCollectionInfoByNameQuery,
    GetPublishedCollectionInfoByNameQueryVariables
  >(GetPublishedCollectionInfoByNameDocument, options);
}

export type GetPublishedCollectionInfoByNameQueryHookResult = ReturnType<
  typeof useGetPublishedCollectionInfoByNameQuery
>;

export type GetPublishedCollectionInfoByNameLazyQueryHookResult = ReturnType<
  typeof useGetPublishedCollectionInfoByNameLazyQuery
>;

export type GetPublishedCollectionInfoByNameQueryResult = Apollo.QueryResult<
  GetPublishedCollectionInfoByNameQuery,
  GetPublishedCollectionInfoByNameQueryVariables
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
                      provider
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

export const GetUserDocument = gql`
  query getUser($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          username
          email
        }
      }
    }
  }
`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
}

export function useGetUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
}

export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;

export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;

export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;

export const GetUsersDocument = gql`
  query getUsers {
    usersPermissionsUsers {
      data {
        id
        attributes {
          username
        }
      }
    }
  }
`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
}

export function useGetUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
}

export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;

export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;

export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;

export const MeDocument = gql`
  query me {
    me {
      id
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

export const AddArchiveTagDocument = gql`
  mutation addArchiveTag($name: String!) {
    addArchiveTag(name: $name)
  }
`;

export type AddArchiveTagMutationFn = Apollo.MutationFunction<
  AddArchiveTagMutation,
  AddArchiveTagMutationVariables
>;

/**
 * __useAddArchiveTagMutation__
 *
 * To run a mutation, you first call `useAddArchiveTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddArchiveTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addArchiveTagMutation, { data, loading, error }] = useAddArchiveTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddArchiveTagMutation(
  baseOptions?: Apollo.MutationHookOptions<AddArchiveTagMutation, AddArchiveTagMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddArchiveTagMutation, AddArchiveTagMutationVariables>(
    AddArchiveTagDocument,
    options
  );
}

export type AddArchiveTagMutationHookResult = ReturnType<typeof useAddArchiveTagMutation>;

export type AddArchiveTagMutationResult = Apollo.MutationResult<AddArchiveTagMutation>;

export type AddArchiveTagMutationOptions = Apollo.BaseMutationOptions<
  AddArchiveTagMutation,
  AddArchiveTagMutationVariables
>;

export const AddPermissionDocument = gql`
  mutation addPermission(
    $user_id: ID
    $operation_name: String
    $archive_tag: ID
    $on_other_users: Boolean
  ) {
    addPermission(
      user_id: $user_id
      operation_name: $operation_name
      archive_tag: $archive_tag
      on_other_users: $on_other_users
    )
  }
`;

export type AddPermissionMutationFn = Apollo.MutationFunction<
  AddPermissionMutation,
  AddPermissionMutationVariables
>;

/**
 * __useAddPermissionMutation__
 *
 * To run a mutation, you first call `useAddPermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPermissionMutation, { data, loading, error }] = useAddPermissionMutation({
 *   variables: {
 *      user_id: // value for 'user_id'
 *      operation_name: // value for 'operation_name'
 *      archive_tag: // value for 'archive_tag'
 *      on_other_users: // value for 'on_other_users'
 *   },
 * });
 */
export function useAddPermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<AddPermissionMutation, AddPermissionMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddPermissionMutation, AddPermissionMutationVariables>(
    AddPermissionDocument,
    options
  );
}

export type AddPermissionMutationHookResult = ReturnType<typeof useAddPermissionMutation>;

export type AddPermissionMutationResult = Apollo.MutationResult<AddPermissionMutation>;

export type AddPermissionMutationOptions = Apollo.BaseMutationOptions<
  AddPermissionMutation,
  AddPermissionMutationVariables
>;

export const AddUserDocument = gql`
  mutation addUser($username: String!, $email: String!) {
    addUser(username: $username, email: $email)
  }
`;

export type AddUserMutationFn = Apollo.MutationFunction<AddUserMutation, AddUserMutationVariables>;

/**
 * __useAddUserMutation__
 *
 * To run a mutation, you first call `useAddUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserMutation, { data, loading, error }] = useAddUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddUserMutation(
  baseOptions?: Apollo.MutationHookOptions<AddUserMutation, AddUserMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument, options);
}

export type AddUserMutationHookResult = ReturnType<typeof useAddUserMutation>;

export type AddUserMutationResult = Apollo.MutationResult<AddUserMutation>;

export type AddUserMutationOptions = Apollo.BaseMutationOptions<
  AddUserMutation,
  AddUserMutationVariables
>;

export const BulkEditDocument = gql`
  mutation bulkEdit($pictureIds: [ID!]!, $data: JSON!) {
    doBulkEdit(ids: $pictureIds, data: $data)
  }
`;

export type BulkEditMutationFn = Apollo.MutationFunction<
  BulkEditMutation,
  BulkEditMutationVariables
>;

/**
 * __useBulkEditMutation__
 *
 * To run a mutation, you first call `useBulkEditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkEditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkEditMutation, { data, loading, error }] = useBulkEditMutation({
 *   variables: {
 *      pictureIds: // value for 'pictureIds'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useBulkEditMutation(
  baseOptions?: Apollo.MutationHookOptions<BulkEditMutation, BulkEditMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<BulkEditMutation, BulkEditMutationVariables>(BulkEditDocument, options);
}

export type BulkEditMutationHookResult = ReturnType<typeof useBulkEditMutation>;

export type BulkEditMutationResult = Apollo.MutationResult<BulkEditMutation>;

export type BulkEditMutationOptions = Apollo.BaseMutationOptions<
  BulkEditMutation,
  BulkEditMutationVariables
>;

export const ChangePasswordDocument = gql`
  mutation changePassword(
    $currentPassword: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    changePassword(
      currentPassword: $currentPassword
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      user {
        id
      }
    }
  }
`;

export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      currentPassword: // value for 'currentPassword'
 *      password: // value for 'password'
 *      passwordConfirmation: // value for 'passwordConfirmation'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(
    ChangePasswordDocument,
    options
  );
}

export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;

export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;

export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;

export const ContactDocument = gql`
  mutation contact(
    $recipient: String!
    $sender_name: String!
    $reply_email: String!
    $subject: String!
    $message: String!
  ) {
    contact(
      recipient: $recipient
      sender_name: $sender_name
      reply_email: $reply_email
      subject: $subject
      message: $message
    )
  }
`;

export type ContactMutationFn = Apollo.MutationFunction<ContactMutation, ContactMutationVariables>;

/**
 * __useContactMutation__
 *
 * To run a mutation, you first call `useContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactMutation, { data, loading, error }] = useContactMutation({
 *   variables: {
 *      recipient: // value for 'recipient'
 *      sender_name: // value for 'sender_name'
 *      reply_email: // value for 'reply_email'
 *      subject: // value for 'subject'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useContactMutation(
  baseOptions?: Apollo.MutationHookOptions<ContactMutation, ContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ContactMutation, ContactMutationVariables>(ContactDocument, options);
}

export type ContactMutationHookResult = ReturnType<typeof useContactMutation>;

export type ContactMutationResult = Apollo.MutationResult<ContactMutation>;

export type ContactMutationOptions = Apollo.BaseMutationOptions<
  ContactMutation,
  ContactMutationVariables
>;

export const CreateExhibitionDocument = gql`
  mutation createExhibition($archiveId: ID!, $publishedAt: DateTime!) {
    createExhibition(data: { archive_tag: $archiveId, publishedAt: $publishedAt }) {
      data {
        id
      }
    }
  }
`;

export type CreateExhibitionMutationFn = Apollo.MutationFunction<
  CreateExhibitionMutation,
  CreateExhibitionMutationVariables
>;

/**
 * __useCreateExhibitionMutation__
 *
 * To run a mutation, you first call `useCreateExhibitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExhibitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExhibitionMutation, { data, loading, error }] = useCreateExhibitionMutation({
 *   variables: {
 *      archiveId: // value for 'archiveId'
 *      publishedAt: // value for 'publishedAt'
 *   },
 * });
 */
export function useCreateExhibitionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateExhibitionMutation,
    CreateExhibitionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateExhibitionMutation, CreateExhibitionMutationVariables>(
    CreateExhibitionDocument,
    options
  );
}

export type CreateExhibitionMutationHookResult = ReturnType<typeof useCreateExhibitionMutation>;

export type CreateExhibitionMutationResult = Apollo.MutationResult<CreateExhibitionMutation>;

export type CreateExhibitionMutationOptions = Apollo.BaseMutationOptions<
  CreateExhibitionMutation,
  CreateExhibitionMutationVariables
>;

export const CreateExhibitionPictureDocument = gql`
  mutation createExhibitionPicture(
    $exhibitionIdealotId: ID!
    $pictureId: ID!
    $publishedAt: DateTime!
  ) {
    createExhibitionPicture(
      data: {
        exhibition_idealot: $exhibitionIdealotId
        picture: $pictureId
        publishedAt: $publishedAt
      }
    ) {
      data {
        id
      }
    }
  }
`;

export type CreateExhibitionPictureMutationFn = Apollo.MutationFunction<
  CreateExhibitionPictureMutation,
  CreateExhibitionPictureMutationVariables
>;

/**
 * __useCreateExhibitionPictureMutation__
 *
 * To run a mutation, you first call `useCreateExhibitionPictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExhibitionPictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExhibitionPictureMutation, { data, loading, error }] = useCreateExhibitionPictureMutation({
 *   variables: {
 *      exhibitionIdealotId: // value for 'exhibitionIdealotId'
 *      pictureId: // value for 'pictureId'
 *      publishedAt: // value for 'publishedAt'
 *   },
 * });
 */
export function useCreateExhibitionPictureMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateExhibitionPictureMutation,
    CreateExhibitionPictureMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateExhibitionPictureMutation,
    CreateExhibitionPictureMutationVariables
  >(CreateExhibitionPictureDocument, options);
}

export type CreateExhibitionPictureMutationHookResult = ReturnType<
  typeof useCreateExhibitionPictureMutation
>;

export type CreateExhibitionPictureMutationResult =
  Apollo.MutationResult<CreateExhibitionPictureMutation>;

export type CreateExhibitionPictureMutationOptions = Apollo.BaseMutationOptions<
  CreateExhibitionPictureMutation,
  CreateExhibitionPictureMutationVariables
>;

export const CreateExhibitionSectionDocument = gql`
  mutation createExhibitionSection($exhibitionId: ID!, $order: Int, $publishedAt: DateTime!) {
    createExhibitionSection(
      data: { exhibition: $exhibitionId, order: $order, publishedAt: $publishedAt }
    ) {
      data {
        id
      }
    }
  }
`;

export type CreateExhibitionSectionMutationFn = Apollo.MutationFunction<
  CreateExhibitionSectionMutation,
  CreateExhibitionSectionMutationVariables
>;

/**
 * __useCreateExhibitionSectionMutation__
 *
 * To run a mutation, you first call `useCreateExhibitionSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExhibitionSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExhibitionSectionMutation, { data, loading, error }] = useCreateExhibitionSectionMutation({
 *   variables: {
 *      exhibitionId: // value for 'exhibitionId'
 *      order: // value for 'order'
 *      publishedAt: // value for 'publishedAt'
 *   },
 * });
 */
export function useCreateExhibitionSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateExhibitionSectionMutation,
    CreateExhibitionSectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateExhibitionSectionMutation,
    CreateExhibitionSectionMutationVariables
  >(CreateExhibitionSectionDocument, options);
}

export type CreateExhibitionSectionMutationHookResult = ReturnType<
  typeof useCreateExhibitionSectionMutation
>;

export type CreateExhibitionSectionMutationResult =
  Apollo.MutationResult<CreateExhibitionSectionMutation>;

export type CreateExhibitionSectionMutationOptions = Apollo.BaseMutationOptions<
  CreateExhibitionSectionMutation,
  CreateExhibitionSectionMutationVariables
>;

export const CreateFaceTagDocument = gql`
  mutation createFaceTag(
    $pictureId: ID!
    $personTagId: ID!
    $x: Float
    $y: Float
    $tag_direction: Int
  ) {
    createFaceTag(
      data: {
        picture: $pictureId
        person_tag: $personTagId
        x: $x
        y: $y
        tag_direction: $tag_direction
      }
    ) {
      data {
        id
      }
    }
  }
`;

export type CreateFaceTagMutationFn = Apollo.MutationFunction<
  CreateFaceTagMutation,
  CreateFaceTagMutationVariables
>;

/**
 * __useCreateFaceTagMutation__
 *
 * To run a mutation, you first call `useCreateFaceTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFaceTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFaceTagMutation, { data, loading, error }] = useCreateFaceTagMutation({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *      personTagId: // value for 'personTagId'
 *      x: // value for 'x'
 *      y: // value for 'y'
 *      tag_direction: // value for 'tag_direction'
 *   },
 * });
 */
export function useCreateFaceTagMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateFaceTagMutation, CreateFaceTagMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateFaceTagMutation, CreateFaceTagMutationVariables>(
    CreateFaceTagDocument,
    options
  );
}

export type CreateFaceTagMutationHookResult = ReturnType<typeof useCreateFaceTagMutation>;

export type CreateFaceTagMutationResult = Apollo.MutationResult<CreateFaceTagMutation>;

export type CreateFaceTagMutationOptions = Apollo.BaseMutationOptions<
  CreateFaceTagMutation,
  CreateFaceTagMutationVariables
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

export const CreateLinkDocument = gql`
  mutation createLink($title: String!, $url: String!, $archive_tag: ID!) {
    createLink(data: { title: $title, url: $url, archive_tag: $archive_tag }) {
      data {
        id
      }
    }
  }
`;

export type CreateLinkMutationFn = Apollo.MutationFunction<
  CreateLinkMutation,
  CreateLinkMutationVariables
>;

/**
 * __useCreateLinkMutation__
 *
 * To run a mutation, you first call `useCreateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLinkMutation, { data, loading, error }] = useCreateLinkMutation({
 *   variables: {
 *      title: // value for 'title'
 *      url: // value for 'url'
 *      archive_tag: // value for 'archive_tag'
 *   },
 * });
 */
export function useCreateLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateLinkMutation, CreateLinkMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateLinkMutation, CreateLinkMutationVariables>(
    CreateLinkDocument,
    options
  );
}

export type CreateLinkMutationHookResult = ReturnType<typeof useCreateLinkMutation>;

export type CreateLinkMutationResult = Apollo.MutationResult<CreateLinkMutation>;

export type CreateLinkMutationOptions = Apollo.BaseMutationOptions<
  CreateLinkMutation,
  CreateLinkMutationVariables
>;

export const CreateLocationTagDocument = gql`
  mutation createLocationTag(
    $name: String!
    $parentIDs: [ID!]
    $childIDs: [ID!]
    $accepted: Boolean
    $root: Boolean
  ) {
    createLocationTag(
      data: {
        name: $name
        parent_tags: $parentIDs
        child_tags: $childIDs
        accepted: $accepted
        root: $root
      }
    ) {
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
 *      parentIDs: // value for 'parentIDs'
 *      childIDs: // value for 'childIDs'
 *      accepted: // value for 'accepted'
 *      root: // value for 'root'
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

export const CreateOrientationTagDocument = gql`
  mutation createOrientationTag(
    $pictureId: ID!
    $locationTagId: ID!
    $x: Float
    $y: Float
    $tag_direction: Int
  ) {
    createOrientationTag(
      data: {
        picture: $pictureId
        location_tag: $locationTagId
        x: $x
        y: $y
        tag_direction: $tag_direction
      }
    ) {
      data {
        id
      }
    }
  }
`;

export type CreateOrientationTagMutationFn = Apollo.MutationFunction<
  CreateOrientationTagMutation,
  CreateOrientationTagMutationVariables
>;

/**
 * __useCreateOrientationTagMutation__
 *
 * To run a mutation, you first call `useCreateOrientationTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrientationTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrientationTagMutation, { data, loading, error }] = useCreateOrientationTagMutation({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *      locationTagId: // value for 'locationTagId'
 *      x: // value for 'x'
 *      y: // value for 'y'
 *      tag_direction: // value for 'tag_direction'
 *   },
 * });
 */
export function useCreateOrientationTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOrientationTagMutation,
    CreateOrientationTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateOrientationTagMutation, CreateOrientationTagMutationVariables>(
    CreateOrientationTagDocument,
    options
  );
}

export type CreateOrientationTagMutationHookResult = ReturnType<
  typeof useCreateOrientationTagMutation
>;

export type CreateOrientationTagMutationResult =
  Apollo.MutationResult<CreateOrientationTagMutation>;

export type CreateOrientationTagMutationOptions = Apollo.BaseMutationOptions<
  CreateOrientationTagMutation,
  CreateOrientationTagMutationVariables
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

export const CreatePictureGeoInfoDocument = gql`
  mutation createPictureGeoInfo($data: PictureGeoInfoInput!) {
    createPictureGeoInfo(data: $data) {
      data {
        id
      }
    }
  }
`;

export type CreatePictureGeoInfoMutationFn = Apollo.MutationFunction<
  CreatePictureGeoInfoMutation,
  CreatePictureGeoInfoMutationVariables
>;

/**
 * __useCreatePictureGeoInfoMutation__
 *
 * To run a mutation, you first call `useCreatePictureGeoInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePictureGeoInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPictureGeoInfoMutation, { data, loading, error }] = useCreatePictureGeoInfoMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePictureGeoInfoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePictureGeoInfoMutation,
    CreatePictureGeoInfoMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreatePictureGeoInfoMutation, CreatePictureGeoInfoMutationVariables>(
    CreatePictureGeoInfoDocument,
    options
  );
}

export type CreatePictureGeoInfoMutationHookResult = ReturnType<
  typeof useCreatePictureGeoInfoMutation
>;

export type CreatePictureGeoInfoMutationResult =
  Apollo.MutationResult<CreatePictureGeoInfoMutation>;

export type CreatePictureGeoInfoMutationOptions = Apollo.BaseMutationOptions<
  CreatePictureGeoInfoMutation,
  CreatePictureGeoInfoMutationVariables
>;

export const CreatePictureSequenceDocument = gql`
  mutation createPictureSequence($pictures: [ID!]!) {
    createPictureSequence(data: { pictures: $pictures }) {
      data {
        id
      }
    }
  }
`;

export type CreatePictureSequenceMutationFn = Apollo.MutationFunction<
  CreatePictureSequenceMutation,
  CreatePictureSequenceMutationVariables
>;

/**
 * __useCreatePictureSequenceMutation__
 *
 * To run a mutation, you first call `useCreatePictureSequenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePictureSequenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPictureSequenceMutation, { data, loading, error }] = useCreatePictureSequenceMutation({
 *   variables: {
 *      pictures: // value for 'pictures'
 *   },
 * });
 */
export function useCreatePictureSequenceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePictureSequenceMutation,
    CreatePictureSequenceMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreatePictureSequenceMutation, CreatePictureSequenceMutationVariables>(
    CreatePictureSequenceDocument,
    options
  );
}

export type CreatePictureSequenceMutationHookResult = ReturnType<
  typeof useCreatePictureSequenceMutation
>;

export type CreatePictureSequenceMutationResult =
  Apollo.MutationResult<CreatePictureSequenceMutation>;

export type CreatePictureSequenceMutationOptions = Apollo.BaseMutationOptions<
  CreatePictureSequenceMutation,
  CreatePictureSequenceMutationVariables
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

export const DeleteExhibitionDocument = gql`
  mutation deleteExhibition($id: ID!) {
    deleteExhibition(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteExhibitionMutationFn = Apollo.MutationFunction<
  DeleteExhibitionMutation,
  DeleteExhibitionMutationVariables
>;

/**
 * __useDeleteExhibitionMutation__
 *
 * To run a mutation, you first call `useDeleteExhibitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExhibitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExhibitionMutation, { data, loading, error }] = useDeleteExhibitionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExhibitionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteExhibitionMutation,
    DeleteExhibitionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteExhibitionMutation, DeleteExhibitionMutationVariables>(
    DeleteExhibitionDocument,
    options
  );
}

export type DeleteExhibitionMutationHookResult = ReturnType<typeof useDeleteExhibitionMutation>;

export type DeleteExhibitionMutationResult = Apollo.MutationResult<DeleteExhibitionMutation>;

export type DeleteExhibitionMutationOptions = Apollo.BaseMutationOptions<
  DeleteExhibitionMutation,
  DeleteExhibitionMutationVariables
>;

export const DeleteExhibitionPictureDocument = gql`
  mutation deleteExhibitionPicture($id: ID!) {
    deleteExhibitionPicture(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteExhibitionPictureMutationFn = Apollo.MutationFunction<
  DeleteExhibitionPictureMutation,
  DeleteExhibitionPictureMutationVariables
>;

/**
 * __useDeleteExhibitionPictureMutation__
 *
 * To run a mutation, you first call `useDeleteExhibitionPictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExhibitionPictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExhibitionPictureMutation, { data, loading, error }] = useDeleteExhibitionPictureMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExhibitionPictureMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteExhibitionPictureMutation,
    DeleteExhibitionPictureMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteExhibitionPictureMutation,
    DeleteExhibitionPictureMutationVariables
  >(DeleteExhibitionPictureDocument, options);
}

export type DeleteExhibitionPictureMutationHookResult = ReturnType<
  typeof useDeleteExhibitionPictureMutation
>;

export type DeleteExhibitionPictureMutationResult =
  Apollo.MutationResult<DeleteExhibitionPictureMutation>;

export type DeleteExhibitionPictureMutationOptions = Apollo.BaseMutationOptions<
  DeleteExhibitionPictureMutation,
  DeleteExhibitionPictureMutationVariables
>;

export const DeleteExhibitionSectionDocument = gql`
  mutation deleteExhibitionSection($id: ID!) {
    deleteExhibitionSection(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteExhibitionSectionMutationFn = Apollo.MutationFunction<
  DeleteExhibitionSectionMutation,
  DeleteExhibitionSectionMutationVariables
>;

/**
 * __useDeleteExhibitionSectionMutation__
 *
 * To run a mutation, you first call `useDeleteExhibitionSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExhibitionSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExhibitionSectionMutation, { data, loading, error }] = useDeleteExhibitionSectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExhibitionSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteExhibitionSectionMutation,
    DeleteExhibitionSectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteExhibitionSectionMutation,
    DeleteExhibitionSectionMutationVariables
  >(DeleteExhibitionSectionDocument, options);
}

export type DeleteExhibitionSectionMutationHookResult = ReturnType<
  typeof useDeleteExhibitionSectionMutation
>;

export type DeleteExhibitionSectionMutationResult =
  Apollo.MutationResult<DeleteExhibitionSectionMutation>;

export type DeleteExhibitionSectionMutationOptions = Apollo.BaseMutationOptions<
  DeleteExhibitionSectionMutation,
  DeleteExhibitionSectionMutationVariables
>;

export const DeleteFaceTagDocument = gql`
  mutation deleteFaceTag($id: ID!) {
    deleteFaceTag(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteFaceTagMutationFn = Apollo.MutationFunction<
  DeleteFaceTagMutation,
  DeleteFaceTagMutationVariables
>;

/**
 * __useDeleteFaceTagMutation__
 *
 * To run a mutation, you first call `useDeleteFaceTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFaceTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFaceTagMutation, { data, loading, error }] = useDeleteFaceTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFaceTagMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteFaceTagMutation, DeleteFaceTagMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteFaceTagMutation, DeleteFaceTagMutationVariables>(
    DeleteFaceTagDocument,
    options
  );
}

export type DeleteFaceTagMutationHookResult = ReturnType<typeof useDeleteFaceTagMutation>;

export type DeleteFaceTagMutationResult = Apollo.MutationResult<DeleteFaceTagMutation>;

export type DeleteFaceTagMutationOptions = Apollo.BaseMutationOptions<
  DeleteFaceTagMutation,
  DeleteFaceTagMutationVariables
>;

export const DeleteKeywordTagDocument = gql`
  mutation deleteKeywordTag($id: ID!) {
    deleteKeywordTag(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteKeywordTagMutationFn = Apollo.MutationFunction<
  DeleteKeywordTagMutation,
  DeleteKeywordTagMutationVariables
>;

/**
 * __useDeleteKeywordTagMutation__
 *
 * To run a mutation, you first call `useDeleteKeywordTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteKeywordTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteKeywordTagMutation, { data, loading, error }] = useDeleteKeywordTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteKeywordTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteKeywordTagMutation,
    DeleteKeywordTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteKeywordTagMutation, DeleteKeywordTagMutationVariables>(
    DeleteKeywordTagDocument,
    options
  );
}

export type DeleteKeywordTagMutationHookResult = ReturnType<typeof useDeleteKeywordTagMutation>;

export type DeleteKeywordTagMutationResult = Apollo.MutationResult<DeleteKeywordTagMutation>;

export type DeleteKeywordTagMutationOptions = Apollo.BaseMutationOptions<
  DeleteKeywordTagMutation,
  DeleteKeywordTagMutationVariables
>;

export const DeleteLinkDocument = gql`
  mutation deleteLink($id: ID!) {
    deleteLink(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteLinkMutationFn = Apollo.MutationFunction<
  DeleteLinkMutation,
  DeleteLinkMutationVariables
>;

/**
 * __useDeleteLinkMutation__
 *
 * To run a mutation, you first call `useDeleteLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLinkMutation, { data, loading, error }] = useDeleteLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteLinkMutation, DeleteLinkMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteLinkMutation, DeleteLinkMutationVariables>(
    DeleteLinkDocument,
    options
  );
}

export type DeleteLinkMutationHookResult = ReturnType<typeof useDeleteLinkMutation>;

export type DeleteLinkMutationResult = Apollo.MutationResult<DeleteLinkMutation>;

export type DeleteLinkMutationOptions = Apollo.BaseMutationOptions<
  DeleteLinkMutation,
  DeleteLinkMutationVariables
>;

export const DeleteLocationTagDocument = gql`
  mutation deleteLocationTag($id: ID!) {
    deleteLocationTag(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteLocationTagMutationFn = Apollo.MutationFunction<
  DeleteLocationTagMutation,
  DeleteLocationTagMutationVariables
>;

/**
 * __useDeleteLocationTagMutation__
 *
 * To run a mutation, you first call `useDeleteLocationTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLocationTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLocationTagMutation, { data, loading, error }] = useDeleteLocationTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLocationTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteLocationTagMutation,
    DeleteLocationTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteLocationTagMutation, DeleteLocationTagMutationVariables>(
    DeleteLocationTagDocument,
    options
  );
}

export type DeleteLocationTagMutationHookResult = ReturnType<typeof useDeleteLocationTagMutation>;

export type DeleteLocationTagMutationResult = Apollo.MutationResult<DeleteLocationTagMutation>;

export type DeleteLocationTagMutationOptions = Apollo.BaseMutationOptions<
  DeleteLocationTagMutation,
  DeleteLocationTagMutationVariables
>;

export const DeleteOrientationTagDocument = gql`
  mutation deleteOrientationTag($id: ID!) {
    deleteOrientationTag(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteOrientationTagMutationFn = Apollo.MutationFunction<
  DeleteOrientationTagMutation,
  DeleteOrientationTagMutationVariables
>;

/**
 * __useDeleteOrientationTagMutation__
 *
 * To run a mutation, you first call `useDeleteOrientationTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrientationTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrientationTagMutation, { data, loading, error }] = useDeleteOrientationTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOrientationTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteOrientationTagMutation,
    DeleteOrientationTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteOrientationTagMutation, DeleteOrientationTagMutationVariables>(
    DeleteOrientationTagDocument,
    options
  );
}

export type DeleteOrientationTagMutationHookResult = ReturnType<
  typeof useDeleteOrientationTagMutation
>;

export type DeleteOrientationTagMutationResult =
  Apollo.MutationResult<DeleteOrientationTagMutation>;

export type DeleteOrientationTagMutationOptions = Apollo.BaseMutationOptions<
  DeleteOrientationTagMutation,
  DeleteOrientationTagMutationVariables
>;

export const DeleteParameterizedPermissionDocument = gql`
  mutation deleteParameterizedPermission($id: ID!) {
    deleteParameterizedPermission(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeleteParameterizedPermissionMutationFn = Apollo.MutationFunction<
  DeleteParameterizedPermissionMutation,
  DeleteParameterizedPermissionMutationVariables
>;

/**
 * __useDeleteParameterizedPermissionMutation__
 *
 * To run a mutation, you first call `useDeleteParameterizedPermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteParameterizedPermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteParameterizedPermissionMutation, { data, loading, error }] = useDeleteParameterizedPermissionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteParameterizedPermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteParameterizedPermissionMutation,
    DeleteParameterizedPermissionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteParameterizedPermissionMutation,
    DeleteParameterizedPermissionMutationVariables
  >(DeleteParameterizedPermissionDocument, options);
}

export type DeleteParameterizedPermissionMutationHookResult = ReturnType<
  typeof useDeleteParameterizedPermissionMutation
>;

export type DeleteParameterizedPermissionMutationResult =
  Apollo.MutationResult<DeleteParameterizedPermissionMutation>;

export type DeleteParameterizedPermissionMutationOptions = Apollo.BaseMutationOptions<
  DeleteParameterizedPermissionMutation,
  DeleteParameterizedPermissionMutationVariables
>;

export const DeletePersonTagDocument = gql`
  mutation deletePersonTag($id: ID!) {
    deletePersonTag(id: $id) {
      data {
        id
      }
    }
  }
`;

export type DeletePersonTagMutationFn = Apollo.MutationFunction<
  DeletePersonTagMutation,
  DeletePersonTagMutationVariables
>;

/**
 * __useDeletePersonTagMutation__
 *
 * To run a mutation, you first call `useDeletePersonTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePersonTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePersonTagMutation, { data, loading, error }] = useDeletePersonTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePersonTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeletePersonTagMutation,
    DeletePersonTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeletePersonTagMutation, DeletePersonTagMutationVariables>(
    DeletePersonTagDocument,
    options
  );
}

export type DeletePersonTagMutationHookResult = ReturnType<typeof useDeletePersonTagMutation>;

export type DeletePersonTagMutationResult = Apollo.MutationResult<DeletePersonTagMutation>;

export type DeletePersonTagMutationOptions = Apollo.BaseMutationOptions<
  DeletePersonTagMutation,
  DeletePersonTagMutationVariables
>;

export const FixCommentTextDocument = gql`
  mutation fixCommentText($commentId: ID!, $text: String!) {
    updateComment(id: $commentId, data: { text: $text }) {
      data {
        id
      }
    }
  }
`;

export type FixCommentTextMutationFn = Apollo.MutationFunction<
  FixCommentTextMutation,
  FixCommentTextMutationVariables
>;

/**
 * __useFixCommentTextMutation__
 *
 * To run a mutation, you first call `useFixCommentTextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFixCommentTextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fixCommentTextMutation, { data, loading, error }] = useFixCommentTextMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useFixCommentTextMutation(
  baseOptions?: Apollo.MutationHookOptions<FixCommentTextMutation, FixCommentTextMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<FixCommentTextMutation, FixCommentTextMutationVariables>(
    FixCommentTextDocument,
    options
  );
}

export type FixCommentTextMutationHookResult = ReturnType<typeof useFixCommentTextMutation>;

export type FixCommentTextMutationResult = Apollo.MutationResult<FixCommentTextMutation>;

export type FixCommentTextMutationOptions = Apollo.BaseMutationOptions<
  FixCommentTextMutation,
  FixCommentTextMutationVariables
>;

export const ForgotPasswordDocument = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`;

export type ForgotPasswordMutationFn = Apollo.MutationFunction<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(
    ForgotPasswordDocument,
    options
  );
}

export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;

export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;

export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;

export const IncreaseNotAPlaceCountDocument = gql`
  mutation increaseNotAPlaceCount($pictureId: ID!) {
    increaseNotAPlaceCount(id: $pictureId)
  }
`;

export type IncreaseNotAPlaceCountMutationFn = Apollo.MutationFunction<
  IncreaseNotAPlaceCountMutation,
  IncreaseNotAPlaceCountMutationVariables
>;

/**
 * __useIncreaseNotAPlaceCountMutation__
 *
 * To run a mutation, you first call `useIncreaseNotAPlaceCountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIncreaseNotAPlaceCountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [increaseNotAPlaceCountMutation, { data, loading, error }] = useIncreaseNotAPlaceCountMutation({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *   },
 * });
 */
export function useIncreaseNotAPlaceCountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    IncreaseNotAPlaceCountMutation,
    IncreaseNotAPlaceCountMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    IncreaseNotAPlaceCountMutation,
    IncreaseNotAPlaceCountMutationVariables
  >(IncreaseNotAPlaceCountDocument, options);
}

export type IncreaseNotAPlaceCountMutationHookResult = ReturnType<
  typeof useIncreaseNotAPlaceCountMutation
>;

export type IncreaseNotAPlaceCountMutationResult =
  Apollo.MutationResult<IncreaseNotAPlaceCountMutation>;

export type IncreaseNotAPlaceCountMutationOptions = Apollo.BaseMutationOptions<
  IncreaseNotAPlaceCountMutation,
  IncreaseNotAPlaceCountMutationVariables
>;

export const LikeDocument = gql`
  mutation like($pictureId: ID!, $dislike: Boolean) {
    doLike(pictureId: $pictureId, dislike: $dislike)
  }
`;

export type LikeMutationFn = Apollo.MutationFunction<LikeMutation, LikeMutationVariables>;

/**
 * __useLikeMutation__
 *
 * To run a mutation, you first call `useLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeMutation, { data, loading, error }] = useLikeMutation({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *      dislike: // value for 'dislike'
 *   },
 * });
 */
export function useLikeMutation(
  baseOptions?: Apollo.MutationHookOptions<LikeMutation, LikeMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LikeMutation, LikeMutationVariables>(LikeDocument, options);
}

export type LikeMutationHookResult = ReturnType<typeof useLikeMutation>;

export type LikeMutationResult = Apollo.MutationResult<LikeMutation>;

export type LikeMutationOptions = Apollo.BaseMutationOptions<LikeMutation, LikeMutationVariables>;

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

export const MergeCollectionsDocument = gql`
  mutation mergeCollections($targetId: ID!, $sourceId: ID!) {
    mergeCollections(targetId: $targetId, sourceId: $sourceId)
  }
`;

export type MergeCollectionsMutationFn = Apollo.MutationFunction<
  MergeCollectionsMutation,
  MergeCollectionsMutationVariables
>;

/**
 * __useMergeCollectionsMutation__
 *
 * To run a mutation, you first call `useMergeCollectionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMergeCollectionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mergeCollectionsMutation, { data, loading, error }] = useMergeCollectionsMutation({
 *   variables: {
 *      targetId: // value for 'targetId'
 *      sourceId: // value for 'sourceId'
 *   },
 * });
 */
export function useMergeCollectionsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MergeCollectionsMutation,
    MergeCollectionsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MergeCollectionsMutation, MergeCollectionsMutationVariables>(
    MergeCollectionsDocument,
    options
  );
}

export type MergeCollectionsMutationHookResult = ReturnType<typeof useMergeCollectionsMutation>;

export type MergeCollectionsMutationResult = Apollo.MutationResult<MergeCollectionsMutation>;

export type MergeCollectionsMutationOptions = Apollo.BaseMutationOptions<
  MergeCollectionsMutation,
  MergeCollectionsMutationVariables
>;

export const MergeKeywordTagsDocument = gql`
  mutation mergeKeywordTags($targetId: ID!, $sourceId: ID!) {
    mergeKeywordTags(targetId: $targetId, sourceId: $sourceId)
  }
`;

export type MergeKeywordTagsMutationFn = Apollo.MutationFunction<
  MergeKeywordTagsMutation,
  MergeKeywordTagsMutationVariables
>;

/**
 * __useMergeKeywordTagsMutation__
 *
 * To run a mutation, you first call `useMergeKeywordTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMergeKeywordTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mergeKeywordTagsMutation, { data, loading, error }] = useMergeKeywordTagsMutation({
 *   variables: {
 *      targetId: // value for 'targetId'
 *      sourceId: // value for 'sourceId'
 *   },
 * });
 */
export function useMergeKeywordTagsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MergeKeywordTagsMutation,
    MergeKeywordTagsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MergeKeywordTagsMutation, MergeKeywordTagsMutationVariables>(
    MergeKeywordTagsDocument,
    options
  );
}

export type MergeKeywordTagsMutationHookResult = ReturnType<typeof useMergeKeywordTagsMutation>;

export type MergeKeywordTagsMutationResult = Apollo.MutationResult<MergeKeywordTagsMutation>;

export type MergeKeywordTagsMutationOptions = Apollo.BaseMutationOptions<
  MergeKeywordTagsMutation,
  MergeKeywordTagsMutationVariables
>;

export const MergeLocationTagsDocument = gql`
  mutation mergeLocationTags($targetId: ID!, $sourceId: ID!) {
    mergeLocationTags(targetId: $targetId, sourceId: $sourceId)
  }
`;

export type MergeLocationTagsMutationFn = Apollo.MutationFunction<
  MergeLocationTagsMutation,
  MergeLocationTagsMutationVariables
>;

/**
 * __useMergeLocationTagsMutation__
 *
 * To run a mutation, you first call `useMergeLocationTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMergeLocationTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mergeLocationTagsMutation, { data, loading, error }] = useMergeLocationTagsMutation({
 *   variables: {
 *      targetId: // value for 'targetId'
 *      sourceId: // value for 'sourceId'
 *   },
 * });
 */
export function useMergeLocationTagsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MergeLocationTagsMutation,
    MergeLocationTagsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MergeLocationTagsMutation, MergeLocationTagsMutationVariables>(
    MergeLocationTagsDocument,
    options
  );
}

export type MergeLocationTagsMutationHookResult = ReturnType<typeof useMergeLocationTagsMutation>;

export type MergeLocationTagsMutationResult = Apollo.MutationResult<MergeLocationTagsMutation>;

export type MergeLocationTagsMutationOptions = Apollo.BaseMutationOptions<
  MergeLocationTagsMutation,
  MergeLocationTagsMutationVariables
>;

export const MergePersonTagsDocument = gql`
  mutation mergePersonTags($targetId: ID!, $sourceId: ID!) {
    mergePersonTags(targetId: $targetId, sourceId: $sourceId)
  }
`;

export type MergePersonTagsMutationFn = Apollo.MutationFunction<
  MergePersonTagsMutation,
  MergePersonTagsMutationVariables
>;

/**
 * __useMergePersonTagsMutation__
 *
 * To run a mutation, you first call `useMergePersonTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMergePersonTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mergePersonTagsMutation, { data, loading, error }] = useMergePersonTagsMutation({
 *   variables: {
 *      targetId: // value for 'targetId'
 *      sourceId: // value for 'sourceId'
 *   },
 * });
 */
export function useMergePersonTagsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MergePersonTagsMutation,
    MergePersonTagsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MergePersonTagsMutation, MergePersonTagsMutationVariables>(
    MergePersonTagsDocument,
    options
  );
}

export type MergePersonTagsMutationHookResult = ReturnType<typeof useMergePersonTagsMutation>;

export type MergePersonTagsMutationResult = Apollo.MutationResult<MergePersonTagsMutation>;

export type MergePersonTagsMutationOptions = Apollo.BaseMutationOptions<
  MergePersonTagsMutation,
  MergePersonTagsMutationVariables
>;

export const MultipleUploadDocument = gql`
  mutation multipleUpload($files: [Upload!]!) {
    multipleUpload(files: $files) {
      data {
        id
      }
    }
  }
`;

export type MultipleUploadMutationFn = Apollo.MutationFunction<
  MultipleUploadMutation,
  MultipleUploadMutationVariables
>;

/**
 * __useMultipleUploadMutation__
 *
 * To run a mutation, you first call `useMultipleUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMultipleUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [multipleUploadMutation, { data, loading, error }] = useMultipleUploadMutation({
 *   variables: {
 *      files: // value for 'files'
 *   },
 * });
 */
export function useMultipleUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<MultipleUploadMutation, MultipleUploadMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MultipleUploadMutation, MultipleUploadMutationVariables>(
    MultipleUploadDocument,
    options
  );
}

export type MultipleUploadMutationHookResult = ReturnType<typeof useMultipleUploadMutation>;

export type MultipleUploadMutationResult = Apollo.MutationResult<MultipleUploadMutation>;

export type MultipleUploadMutationOptions = Apollo.BaseMutationOptions<
  MultipleUploadMutation,
  MultipleUploadMutationVariables
>;

export const PinCommentDocument = gql`
  mutation pinComment($commentId: ID!) {
    updateComment(id: $commentId, data: { pinned: true }) {
      data {
        id
      }
    }
  }
`;

export type PinCommentMutationFn = Apollo.MutationFunction<
  PinCommentMutation,
  PinCommentMutationVariables
>;

/**
 * __usePinCommentMutation__
 *
 * To run a mutation, you first call `usePinCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinCommentMutation, { data, loading, error }] = usePinCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function usePinCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<PinCommentMutation, PinCommentMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PinCommentMutation, PinCommentMutationVariables>(
    PinCommentDocument,
    options
  );
}

export type PinCommentMutationHookResult = ReturnType<typeof usePinCommentMutation>;

export type PinCommentMutationResult = Apollo.MutationResult<PinCommentMutation>;

export type PinCommentMutationOptions = Apollo.BaseMutationOptions<
  PinCommentMutation,
  PinCommentMutationVariables
>;

export const PostCommentDocument = gql`
  mutation postComment(
    $id: ID!
    $author: String!
    $text: String!
    $date: DateTime!
    $parentCommentId: ID
  ) {
    createComment(
      data: {
        author: $author
        text: $text
        date: $date
        picture: $id
        publishedAt: null
        parentComment: $parentCommentId
      }
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
 *      parentCommentId: // value for 'parentCommentId'
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

export const RemoveArchiveTagDocument = gql`
  mutation removeArchiveTag($id: ID!) {
    removeArchiveTag(id: $id)
  }
`;

export type RemoveArchiveTagMutationFn = Apollo.MutationFunction<
  RemoveArchiveTagMutation,
  RemoveArchiveTagMutationVariables
>;

/**
 * __useRemoveArchiveTagMutation__
 *
 * To run a mutation, you first call `useRemoveArchiveTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveArchiveTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeArchiveTagMutation, { data, loading, error }] = useRemoveArchiveTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveArchiveTagMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveArchiveTagMutation,
    RemoveArchiveTagMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RemoveArchiveTagMutation, RemoveArchiveTagMutationVariables>(
    RemoveArchiveTagDocument,
    options
  );
}

export type RemoveArchiveTagMutationHookResult = ReturnType<typeof useRemoveArchiveTagMutation>;

export type RemoveArchiveTagMutationResult = Apollo.MutationResult<RemoveArchiveTagMutation>;

export type RemoveArchiveTagMutationOptions = Apollo.BaseMutationOptions<
  RemoveArchiveTagMutation,
  RemoveArchiveTagMutationVariables
>;

export const RemoveUploadDocument = gql`
  mutation removeUpload($id: ID!) {
    removeFile(id: $id) {
      data {
        id
      }
    }
  }
`;

export type RemoveUploadMutationFn = Apollo.MutationFunction<
  RemoveUploadMutation,
  RemoveUploadMutationVariables
>;

/**
 * __useRemoveUploadMutation__
 *
 * To run a mutation, you first call `useRemoveUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUploadMutation, { data, loading, error }] = useRemoveUploadMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<RemoveUploadMutation, RemoveUploadMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RemoveUploadMutation, RemoveUploadMutationVariables>(
    RemoveUploadDocument,
    options
  );
}

export type RemoveUploadMutationHookResult = ReturnType<typeof useRemoveUploadMutation>;

export type RemoveUploadMutationResult = Apollo.MutationResult<RemoveUploadMutation>;

export type RemoveUploadMutationOptions = Apollo.BaseMutationOptions<
  RemoveUploadMutation,
  RemoveUploadMutationVariables
>;

export const RemoveUserDocument = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id)
  }
`;

export type RemoveUserMutationFn = Apollo.MutationFunction<
  RemoveUserMutation,
  RemoveUserMutationVariables
>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveUserMutation(
  baseOptions?: Apollo.MutationHookOptions<RemoveUserMutation, RemoveUserMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(
    RemoveUserDocument,
    options
  );
}

export type RemoveUserMutationHookResult = ReturnType<typeof useRemoveUserMutation>;

export type RemoveUserMutationResult = Apollo.MutationResult<RemoveUserMutation>;

export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<
  RemoveUserMutation,
  RemoveUserMutationVariables
>;

export const ResetPasswordDocument = gql`
  mutation resetPassword($token: String!, $password: String!, $passwordConfirmation: String!) {
    resetPassword(code: $token, password: $password, passwordConfirmation: $passwordConfirmation) {
      user {
        id
      }
    }
  }
`;

export type ResetPasswordMutationFn = Apollo.MutationFunction<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *      passwordConfirmation: // value for 'passwordConfirmation'
 *   },
 * });
 */
export function useResetPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(
    ResetPasswordDocument,
    options
  );
}

export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;

export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;

export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
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

export const UnpinCommentDocument = gql`
  mutation unpinComment($commentId: ID!) {
    updateComment(id: $commentId, data: { pinned: false }) {
      data {
        id
      }
    }
  }
`;

export type UnpinCommentMutationFn = Apollo.MutationFunction<
  UnpinCommentMutation,
  UnpinCommentMutationVariables
>;

/**
 * __useUnpinCommentMutation__
 *
 * To run a mutation, you first call `useUnpinCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpinCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpinCommentMutation, { data, loading, error }] = useUnpinCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useUnpinCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<UnpinCommentMutation, UnpinCommentMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnpinCommentMutation, UnpinCommentMutationVariables>(
    UnpinCommentDocument,
    options
  );
}

export type UnpinCommentMutationHookResult = ReturnType<typeof useUnpinCommentMutation>;

export type UnpinCommentMutationResult = Apollo.MutationResult<UnpinCommentMutation>;

export type UnpinCommentMutationOptions = Apollo.BaseMutationOptions<
  UnpinCommentMutation,
  UnpinCommentMutationVariables
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

export const UpdateArchiveDocument = gql`
  mutation updateArchive($archiveId: ID!, $data: ArchiveTagInput!) {
    updateArchiveTag(id: $archiveId, data: $data) {
      data {
        id
      }
    }
  }
`;

export type UpdateArchiveMutationFn = Apollo.MutationFunction<
  UpdateArchiveMutation,
  UpdateArchiveMutationVariables
>;

/**
 * __useUpdateArchiveMutation__
 *
 * To run a mutation, you first call `useUpdateArchiveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateArchiveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateArchiveMutation, { data, loading, error }] = useUpdateArchiveMutation({
 *   variables: {
 *      archiveId: // value for 'archiveId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateArchiveMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateArchiveMutation, UpdateArchiveMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateArchiveMutation, UpdateArchiveMutationVariables>(
    UpdateArchiveDocument,
    options
  );
}

export type UpdateArchiveMutationHookResult = ReturnType<typeof useUpdateArchiveMutation>;

export type UpdateArchiveMutationResult = Apollo.MutationResult<UpdateArchiveMutation>;

export type UpdateArchiveMutationOptions = Apollo.BaseMutationOptions<
  UpdateArchiveMutation,
  UpdateArchiveMutationVariables
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

export const UpdateCollectionParentsDocument = gql`
  mutation updateCollectionParents($collectionId: ID!, $parentCollectionIds: [ID]!) {
    updateCollection(id: $collectionId, data: { parent_collections: $parentCollectionIds }) {
      data {
        id
      }
    }
  }
`;

export type UpdateCollectionParentsMutationFn = Apollo.MutationFunction<
  UpdateCollectionParentsMutation,
  UpdateCollectionParentsMutationVariables
>;

/**
 * __useUpdateCollectionParentsMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionParentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionParentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionParentsMutation, { data, loading, error }] = useUpdateCollectionParentsMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      parentCollectionIds: // value for 'parentCollectionIds'
 *   },
 * });
 */
export function useUpdateCollectionParentsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionParentsMutation,
    UpdateCollectionParentsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionParentsMutation,
    UpdateCollectionParentsMutationVariables
  >(UpdateCollectionParentsDocument, options);
}

export type UpdateCollectionParentsMutationHookResult = ReturnType<
  typeof useUpdateCollectionParentsMutation
>;

export type UpdateCollectionParentsMutationResult =
  Apollo.MutationResult<UpdateCollectionParentsMutation>;

export type UpdateCollectionParentsMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionParentsMutation,
  UpdateCollectionParentsMutationVariables
>;

export const UpdateExhibitionDocument = gql`
  mutation updateExhibition($id: ID!, $data: ExhibitionInput!) {
    updateExhibition(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export type UpdateExhibitionMutationFn = Apollo.MutationFunction<
  UpdateExhibitionMutation,
  UpdateExhibitionMutationVariables
>;

/**
 * __useUpdateExhibitionMutation__
 *
 * To run a mutation, you first call `useUpdateExhibitionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExhibitionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExhibitionMutation, { data, loading, error }] = useUpdateExhibitionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateExhibitionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateExhibitionMutation,
    UpdateExhibitionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateExhibitionMutation, UpdateExhibitionMutationVariables>(
    UpdateExhibitionDocument,
    options
  );
}

export type UpdateExhibitionMutationHookResult = ReturnType<typeof useUpdateExhibitionMutation>;

export type UpdateExhibitionMutationResult = Apollo.MutationResult<UpdateExhibitionMutation>;

export type UpdateExhibitionMutationOptions = Apollo.BaseMutationOptions<
  UpdateExhibitionMutation,
  UpdateExhibitionMutationVariables
>;

export const UpdateExhibitionPictureDocument = gql`
  mutation updateExhibitionPicture($id: ID!, $data: ExhibitionPictureInput!) {
    updateExhibitionPicture(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export type UpdateExhibitionPictureMutationFn = Apollo.MutationFunction<
  UpdateExhibitionPictureMutation,
  UpdateExhibitionPictureMutationVariables
>;

/**
 * __useUpdateExhibitionPictureMutation__
 *
 * To run a mutation, you first call `useUpdateExhibitionPictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExhibitionPictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExhibitionPictureMutation, { data, loading, error }] = useUpdateExhibitionPictureMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateExhibitionPictureMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateExhibitionPictureMutation,
    UpdateExhibitionPictureMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateExhibitionPictureMutation,
    UpdateExhibitionPictureMutationVariables
  >(UpdateExhibitionPictureDocument, options);
}

export type UpdateExhibitionPictureMutationHookResult = ReturnType<
  typeof useUpdateExhibitionPictureMutation
>;

export type UpdateExhibitionPictureMutationResult =
  Apollo.MutationResult<UpdateExhibitionPictureMutation>;

export type UpdateExhibitionPictureMutationOptions = Apollo.BaseMutationOptions<
  UpdateExhibitionPictureMutation,
  UpdateExhibitionPictureMutationVariables
>;

export const UpdateExhibitionSectionDocument = gql`
  mutation updateExhibitionSection(
    $id: ID!
    $title: String
    $text: String
    $order: Int
    $exhibitionPictureIds: [ID]
  ) {
    updateExhibitionSection(
      id: $id
      data: {
        title: $title
        text: $text
        exhibition_pictures: $exhibitionPictureIds
        order: $order
      }
    ) {
      data {
        id
      }
    }
  }
`;

export type UpdateExhibitionSectionMutationFn = Apollo.MutationFunction<
  UpdateExhibitionSectionMutation,
  UpdateExhibitionSectionMutationVariables
>;

/**
 * __useUpdateExhibitionSectionMutation__
 *
 * To run a mutation, you first call `useUpdateExhibitionSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExhibitionSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExhibitionSectionMutation, { data, loading, error }] = useUpdateExhibitionSectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      text: // value for 'text'
 *      order: // value for 'order'
 *      exhibitionPictureIds: // value for 'exhibitionPictureIds'
 *   },
 * });
 */
export function useUpdateExhibitionSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateExhibitionSectionMutation,
    UpdateExhibitionSectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateExhibitionSectionMutation,
    UpdateExhibitionSectionMutationVariables
  >(UpdateExhibitionSectionDocument, options);
}

export type UpdateExhibitionSectionMutationHookResult = ReturnType<
  typeof useUpdateExhibitionSectionMutation
>;

export type UpdateExhibitionSectionMutationResult =
  Apollo.MutationResult<UpdateExhibitionSectionMutation>;

export type UpdateExhibitionSectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateExhibitionSectionMutation,
  UpdateExhibitionSectionMutationVariables
>;

export const UpdateFaceTagDirectionDocument = gql`
  mutation updateFaceTagDirection($id: ID!, $tag_direction: Int) {
    updateFaceTag(id: $id, data: { tag_direction: $tag_direction }) {
      data {
        id
      }
    }
  }
`;

export type UpdateFaceTagDirectionMutationFn = Apollo.MutationFunction<
  UpdateFaceTagDirectionMutation,
  UpdateFaceTagDirectionMutationVariables
>;

/**
 * __useUpdateFaceTagDirectionMutation__
 *
 * To run a mutation, you first call `useUpdateFaceTagDirectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFaceTagDirectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFaceTagDirectionMutation, { data, loading, error }] = useUpdateFaceTagDirectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      tag_direction: // value for 'tag_direction'
 *   },
 * });
 */
export function useUpdateFaceTagDirectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateFaceTagDirectionMutation,
    UpdateFaceTagDirectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateFaceTagDirectionMutation,
    UpdateFaceTagDirectionMutationVariables
  >(UpdateFaceTagDirectionDocument, options);
}

export type UpdateFaceTagDirectionMutationHookResult = ReturnType<
  typeof useUpdateFaceTagDirectionMutation
>;

export type UpdateFaceTagDirectionMutationResult =
  Apollo.MutationResult<UpdateFaceTagDirectionMutation>;

export type UpdateFaceTagDirectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateFaceTagDirectionMutation,
  UpdateFaceTagDirectionMutationVariables
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

export const UpdateKeywordVisibilityDocument = gql`
  mutation updateKeywordVisibility($tagId: ID!, $visible: Boolean!) {
    updateKeywordTag(id: $tagId, data: { visible: $visible }) {
      data {
        id
      }
    }
  }
`;

export type UpdateKeywordVisibilityMutationFn = Apollo.MutationFunction<
  UpdateKeywordVisibilityMutation,
  UpdateKeywordVisibilityMutationVariables
>;

/**
 * __useUpdateKeywordVisibilityMutation__
 *
 * To run a mutation, you first call `useUpdateKeywordVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateKeywordVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateKeywordVisibilityMutation, { data, loading, error }] = useUpdateKeywordVisibilityMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      visible: // value for 'visible'
 *   },
 * });
 */
export function useUpdateKeywordVisibilityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateKeywordVisibilityMutation,
    UpdateKeywordVisibilityMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateKeywordVisibilityMutation,
    UpdateKeywordVisibilityMutationVariables
  >(UpdateKeywordVisibilityDocument, options);
}

export type UpdateKeywordVisibilityMutationHookResult = ReturnType<
  typeof useUpdateKeywordVisibilityMutation
>;

export type UpdateKeywordVisibilityMutationResult =
  Apollo.MutationResult<UpdateKeywordVisibilityMutation>;

export type UpdateKeywordVisibilityMutationOptions = Apollo.BaseMutationOptions<
  UpdateKeywordVisibilityMutation,
  UpdateKeywordVisibilityMutationVariables
>;

export const UpdateLinkDocument = gql`
  mutation updateLink($id: ID!, $data: LinkInput!) {
    updateLink(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export type UpdateLinkMutationFn = Apollo.MutationFunction<
  UpdateLinkMutation,
  UpdateLinkMutationVariables
>;

/**
 * __useUpdateLinkMutation__
 *
 * To run a mutation, you first call `useUpdateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLinkMutation, { data, loading, error }] = useUpdateLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateLinkMutation, UpdateLinkMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateLinkMutation, UpdateLinkMutationVariables>(
    UpdateLinkDocument,
    options
  );
}

export type UpdateLinkMutationHookResult = ReturnType<typeof useUpdateLinkMutation>;

export type UpdateLinkMutationResult = Apollo.MutationResult<UpdateLinkMutation>;

export type UpdateLinkMutationOptions = Apollo.BaseMutationOptions<
  UpdateLinkMutation,
  UpdateLinkMutationVariables
>;

export const UpdateLocationAcceptanceDocument = gql`
  mutation updateLocationAcceptance($tagId: ID!, $accepted: Boolean) {
    updateLocationTag(id: $tagId, data: { accepted: $accepted }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationAcceptanceMutationFn = Apollo.MutationFunction<
  UpdateLocationAcceptanceMutation,
  UpdateLocationAcceptanceMutationVariables
>;

/**
 * __useUpdateLocationAcceptanceMutation__
 *
 * To run a mutation, you first call `useUpdateLocationAcceptanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationAcceptanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationAcceptanceMutation, { data, loading, error }] = useUpdateLocationAcceptanceMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      accepted: // value for 'accepted'
 *   },
 * });
 */
export function useUpdateLocationAcceptanceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationAcceptanceMutation,
    UpdateLocationAcceptanceMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateLocationAcceptanceMutation,
    UpdateLocationAcceptanceMutationVariables
  >(UpdateLocationAcceptanceDocument, options);
}

export type UpdateLocationAcceptanceMutationHookResult = ReturnType<
  typeof useUpdateLocationAcceptanceMutation
>;

export type UpdateLocationAcceptanceMutationResult =
  Apollo.MutationResult<UpdateLocationAcceptanceMutation>;

export type UpdateLocationAcceptanceMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationAcceptanceMutation,
  UpdateLocationAcceptanceMutationVariables
>;

export const UpdateLocationChildDocument = gql`
  mutation updateLocationChild($tagID: ID!, $childIDs: [ID!]) {
    updateLocationTag(id: $tagID, data: { child_tags: $childIDs }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationChildMutationFn = Apollo.MutationFunction<
  UpdateLocationChildMutation,
  UpdateLocationChildMutationVariables
>;

/**
 * __useUpdateLocationChildMutation__
 *
 * To run a mutation, you first call `useUpdateLocationChildMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationChildMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationChildMutation, { data, loading, error }] = useUpdateLocationChildMutation({
 *   variables: {
 *      tagID: // value for 'tagID'
 *      childIDs: // value for 'childIDs'
 *   },
 * });
 */
export function useUpdateLocationChildMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationChildMutation,
    UpdateLocationChildMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateLocationChildMutation, UpdateLocationChildMutationVariables>(
    UpdateLocationChildDocument,
    options
  );
}

export type UpdateLocationChildMutationHookResult = ReturnType<
  typeof useUpdateLocationChildMutation
>;

export type UpdateLocationChildMutationResult = Apollo.MutationResult<UpdateLocationChildMutation>;

export type UpdateLocationChildMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationChildMutation,
  UpdateLocationChildMutationVariables
>;

export const UpdateLocationCoordinatesDocument = gql`
  mutation updateLocationCoordinates($tagId: ID!, $coordinate: ComponentLocationCoordinatesInput) {
    updateLocationTag(id: $tagId, data: { coordinates: $coordinate }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationCoordinatesMutationFn = Apollo.MutationFunction<
  UpdateLocationCoordinatesMutation,
  UpdateLocationCoordinatesMutationVariables
>;

/**
 * __useUpdateLocationCoordinatesMutation__
 *
 * To run a mutation, you first call `useUpdateLocationCoordinatesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationCoordinatesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationCoordinatesMutation, { data, loading, error }] = useUpdateLocationCoordinatesMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      coordinate: // value for 'coordinate'
 *   },
 * });
 */
export function useUpdateLocationCoordinatesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationCoordinatesMutation,
    UpdateLocationCoordinatesMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateLocationCoordinatesMutation,
    UpdateLocationCoordinatesMutationVariables
  >(UpdateLocationCoordinatesDocument, options);
}

export type UpdateLocationCoordinatesMutationHookResult = ReturnType<
  typeof useUpdateLocationCoordinatesMutation
>;

export type UpdateLocationCoordinatesMutationResult =
  Apollo.MutationResult<UpdateLocationCoordinatesMutation>;

export type UpdateLocationCoordinatesMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationCoordinatesMutation,
  UpdateLocationCoordinatesMutationVariables
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

export const UpdateLocationParentDocument = gql`
  mutation updateLocationParent($tagID: ID!, $parentIDs: [ID!]) {
    updateLocationTag(id: $tagID, data: { parent_tags: $parentIDs }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationParentMutationFn = Apollo.MutationFunction<
  UpdateLocationParentMutation,
  UpdateLocationParentMutationVariables
>;

/**
 * __useUpdateLocationParentMutation__
 *
 * To run a mutation, you first call `useUpdateLocationParentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationParentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationParentMutation, { data, loading, error }] = useUpdateLocationParentMutation({
 *   variables: {
 *      tagID: // value for 'tagID'
 *      parentIDs: // value for 'parentIDs'
 *   },
 * });
 */
export function useUpdateLocationParentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationParentMutation,
    UpdateLocationParentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateLocationParentMutation, UpdateLocationParentMutationVariables>(
    UpdateLocationParentDocument,
    options
  );
}

export type UpdateLocationParentMutationHookResult = ReturnType<
  typeof useUpdateLocationParentMutation
>;

export type UpdateLocationParentMutationResult =
  Apollo.MutationResult<UpdateLocationParentMutation>;

export type UpdateLocationParentMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationParentMutation,
  UpdateLocationParentMutationVariables
>;

export const UpdateLocationRootDocument = gql`
  mutation updateLocationRoot($tagId: ID!, $root: Boolean!) {
    updateLocationTag(id: $tagId, data: { root: $root }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationRootMutationFn = Apollo.MutationFunction<
  UpdateLocationRootMutation,
  UpdateLocationRootMutationVariables
>;

/**
 * __useUpdateLocationRootMutation__
 *
 * To run a mutation, you first call `useUpdateLocationRootMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationRootMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationRootMutation, { data, loading, error }] = useUpdateLocationRootMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      root: // value for 'root'
 *   },
 * });
 */
export function useUpdateLocationRootMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationRootMutation,
    UpdateLocationRootMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateLocationRootMutation, UpdateLocationRootMutationVariables>(
    UpdateLocationRootDocument,
    options
  );
}

export type UpdateLocationRootMutationHookResult = ReturnType<typeof useUpdateLocationRootMutation>;

export type UpdateLocationRootMutationResult = Apollo.MutationResult<UpdateLocationRootMutation>;

export type UpdateLocationRootMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationRootMutation,
  UpdateLocationRootMutationVariables
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

export const UpdateLocationVisibilityDocument = gql`
  mutation updateLocationVisibility($tagId: ID!, $visible: Boolean!) {
    updateLocationTag(id: $tagId, data: { visible: $visible }) {
      data {
        id
      }
    }
  }
`;

export type UpdateLocationVisibilityMutationFn = Apollo.MutationFunction<
  UpdateLocationVisibilityMutation,
  UpdateLocationVisibilityMutationVariables
>;

/**
 * __useUpdateLocationVisibilityMutation__
 *
 * To run a mutation, you first call `useUpdateLocationVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationVisibilityMutation, { data, loading, error }] = useUpdateLocationVisibilityMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *      visible: // value for 'visible'
 *   },
 * });
 */
export function useUpdateLocationVisibilityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLocationVisibilityMutation,
    UpdateLocationVisibilityMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateLocationVisibilityMutation,
    UpdateLocationVisibilityMutationVariables
  >(UpdateLocationVisibilityDocument, options);
}

export type UpdateLocationVisibilityMutationHookResult = ReturnType<
  typeof useUpdateLocationVisibilityMutation
>;

export type UpdateLocationVisibilityMutationResult =
  Apollo.MutationResult<UpdateLocationVisibilityMutation>;

export type UpdateLocationVisibilityMutationOptions = Apollo.BaseMutationOptions<
  UpdateLocationVisibilityMutation,
  UpdateLocationVisibilityMutationVariables
>;

export const UpdateMeDocument = gql`
  mutation updateMe($username: String, $email: String) {
    updateMe(username: $username, email: $email)
  }
`;

export type UpdateMeMutationFn = Apollo.MutationFunction<
  UpdateMeMutation,
  UpdateMeMutationVariables
>;

/**
 * __useUpdateMeMutation__
 *
 * To run a mutation, you first call `useUpdateMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeMutation, { data, loading, error }] = useUpdateMeMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUpdateMeMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateMeMutation, UpdateMeMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument, options);
}

export type UpdateMeMutationHookResult = ReturnType<typeof useUpdateMeMutation>;

export type UpdateMeMutationResult = Apollo.MutationResult<UpdateMeMutation>;

export type UpdateMeMutationOptions = Apollo.BaseMutationOptions<
  UpdateMeMutation,
  UpdateMeMutationVariables
>;

export const UpdateOrientationTagDirectionDocument = gql`
  mutation updateOrientationTagDirection($id: ID!, $tag_direction: Int) {
    updateOrientationTag(id: $id, data: { tag_direction: $tag_direction }) {
      data {
        id
      }
    }
  }
`;

export type UpdateOrientationTagDirectionMutationFn = Apollo.MutationFunction<
  UpdateOrientationTagDirectionMutation,
  UpdateOrientationTagDirectionMutationVariables
>;

/**
 * __useUpdateOrientationTagDirectionMutation__
 *
 * To run a mutation, you first call `useUpdateOrientationTagDirectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrientationTagDirectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrientationTagDirectionMutation, { data, loading, error }] = useUpdateOrientationTagDirectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      tag_direction: // value for 'tag_direction'
 *   },
 * });
 */
export function useUpdateOrientationTagDirectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateOrientationTagDirectionMutation,
    UpdateOrientationTagDirectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateOrientationTagDirectionMutation,
    UpdateOrientationTagDirectionMutationVariables
  >(UpdateOrientationTagDirectionDocument, options);
}

export type UpdateOrientationTagDirectionMutationHookResult = ReturnType<
  typeof useUpdateOrientationTagDirectionMutation
>;

export type UpdateOrientationTagDirectionMutationResult =
  Apollo.MutationResult<UpdateOrientationTagDirectionMutation>;

export type UpdateOrientationTagDirectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateOrientationTagDirectionMutation,
  UpdateOrientationTagDirectionMutationVariables
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

export const UpdatePictureDocument = gql`
  mutation updatePicture($pictureId: ID!, $data: JSON!) {
    updatePictureWithTagCleanup(id: $pictureId, data: $data)
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

export const UpdatePictureSequenceDataDocument = gql`
  mutation updatePictureSequenceData(
    $pictureId: ID!
    $pictureSequence: ID
    $pictureSequenceOrder: Int
  ) {
    updatePictureWithTagCleanup(
      id: $pictureId
      data: { picture_sequence: $pictureSequence, picture_sequence_order: $pictureSequenceOrder }
    )
  }
`;

export type UpdatePictureSequenceDataMutationFn = Apollo.MutationFunction<
  UpdatePictureSequenceDataMutation,
  UpdatePictureSequenceDataMutationVariables
>;

/**
 * __useUpdatePictureSequenceDataMutation__
 *
 * To run a mutation, you first call `useUpdatePictureSequenceDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePictureSequenceDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePictureSequenceDataMutation, { data, loading, error }] = useUpdatePictureSequenceDataMutation({
 *   variables: {
 *      pictureId: // value for 'pictureId'
 *      pictureSequence: // value for 'pictureSequence'
 *      pictureSequenceOrder: // value for 'pictureSequenceOrder'
 *   },
 * });
 */
export function useUpdatePictureSequenceDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePictureSequenceDataMutation,
    UpdatePictureSequenceDataMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdatePictureSequenceDataMutation,
    UpdatePictureSequenceDataMutationVariables
  >(UpdatePictureSequenceDataDocument, options);
}

export type UpdatePictureSequenceDataMutationHookResult = ReturnType<
  typeof useUpdatePictureSequenceDataMutation
>;

export type UpdatePictureSequenceDataMutationResult =
  Apollo.MutationResult<UpdatePictureSequenceDataMutation>;

export type UpdatePictureSequenceDataMutationOptions = Apollo.BaseMutationOptions<
  UpdatePictureSequenceDataMutation,
  UpdatePictureSequenceDataMutationVariables
>;

export const UpdateUserDocument = gql`
  mutation updateUser($id: ID!, $username: String, $email: String) {
    updateUsersPermissionsUser(id: $id, data: { username: $username, email: $email }) {
      data {
        id
      }
    }
  }
`;

export type UpdateUserMutationFn = Apollo.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      username: // value for 'username'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options
  );
}

export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;

export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;

export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

export function useCanRunCanRunOperationQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CanRunOperationQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CanRunOperationDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCanRunOperationQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CanRunOperationQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CanRunOperationDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetAllArchiveTagsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetAllArchiveTagsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllArchiveTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetAllArchiveTagsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetAllArchiveTagsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllArchiveTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetAllCollectionsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetAllCollectionsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllCollectionsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetAllCollectionsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetAllCollectionsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllCollectionsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetAllKeywordTagsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetAllKeywordTagsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllKeywordTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetAllKeywordTagsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetAllKeywordTagsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllKeywordTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetAllLocationTagsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetAllLocationTagsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllLocationTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetAllLocationTagsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetAllLocationTagsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllLocationTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetAllPersonTagsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetAllPersonTagsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllPersonTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetAllPersonTagsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetAllPersonTagsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllPersonTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetAllPictureIdsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetAllPictureIdsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllPictureIdsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetAllPictureIdsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetAllPictureIdsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetAllPictureIdsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetArchiveQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetArchiveQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetArchiveDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetArchiveQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetArchiveQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetArchiveDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetArchiveNamesQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetArchiveNamesQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetArchiveNamesDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetArchiveNamesQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetArchiveNamesQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetArchiveNamesDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetArchivePictureCountsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetArchivePictureCountsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetArchivePictureCountsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetArchivePictureCountsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetArchivePictureCountsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetArchivePictureCountsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetCollectionInfoByIdQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetCollectionInfoByIdQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetCollectionInfoByIdDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetCollectionInfoByIdQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetCollectionInfoByIdQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetCollectionInfoByIdDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetCollectionInfoByNameQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetCollectionInfoByNameQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetCollectionInfoByNameDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetCollectionInfoByNameQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetCollectionInfoByNameQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetCollectionInfoByNameDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetDailyPictureInfoQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetDailyPictureInfoQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetDailyPictureInfoDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetDailyPictureInfoQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetDailyPictureInfoQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetDailyPictureInfoDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetDecadePreviewThumbnailsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetDecadePreviewThumbnailsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetDecadePreviewThumbnailsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetDecadePreviewThumbnailsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetDecadePreviewThumbnailsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetDecadePreviewThumbnailsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetExhibitionQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetExhibitionQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetExhibitionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetExhibitionQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetExhibitionQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetExhibitionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetExhibitionsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetExhibitionsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetExhibitionsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetExhibitionsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetExhibitionsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetExhibitionsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetFaceTagsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetFaceTagsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetFaceTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetFaceTagsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetFaceTagsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetFaceTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetIdeaLotContentQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetIdeaLotContentQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetIdeaLotContentDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetIdeaLotContentQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetIdeaLotContentQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetIdeaLotContentDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetKeywordTagsWithThumbnailQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetKeywordTagsWithThumbnailQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetKeywordTagsWithThumbnailDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetKeywordTagsWithThumbnailQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetKeywordTagsWithThumbnailQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetKeywordTagsWithThumbnailDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetLocationTagQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetLocationTagQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetLocationTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetLocationTagQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetLocationTagQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetLocationTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetLocationTagsWithThumbnailQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetLocationTagsWithThumbnailQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetLocationTagsWithThumbnailDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetLocationTagsWithThumbnailQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetLocationTagsWithThumbnailQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetLocationTagsWithThumbnailDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetMostLikedPicturesQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetMostLikedPicturesQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetMostLikedPicturesDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetMostLikedPicturesQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetMostLikedPicturesQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetMostLikedPicturesDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetMultiplePictureInfoQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetMultiplePictureInfoQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetMultiplePictureInfoDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetMultiplePictureInfoQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetMultiplePictureInfoQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetMultiplePictureInfoDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetOrientationTagsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetOrientationTagsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetOrientationTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetOrientationTagsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetOrientationTagsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetOrientationTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetParameterizedPermissionsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetParameterizedPermissionsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetParameterizedPermissionsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetParameterizedPermissionsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetParameterizedPermissionsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetParameterizedPermissionsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPersonTagQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPersonTagQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPersonTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPersonTagQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPersonTagQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPersonTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPersonTagsWithThumbnailQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPersonTagsWithThumbnailQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPersonTagsWithThumbnailDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPersonTagsWithThumbnailQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPersonTagsWithThumbnailQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPersonTagsWithThumbnailDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPictureGeoInfoQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPictureGeoInfoQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPictureGeoInfoDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPictureGeoInfoQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPictureGeoInfoQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPictureGeoInfoDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPictureInfoQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPictureInfoQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPictureInfoDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPictureInfoQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPictureInfoQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPictureInfoDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPicturesQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPicturesQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPicturesQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPicturesQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPicturesByAllSearchQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPicturesByAllSearchQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesByAllSearchDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPicturesByAllSearchQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPicturesByAllSearchQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesByAllSearchDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPicturesForCollectionQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPicturesForCollectionQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesForCollectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPicturesForCollectionQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPicturesForCollectionQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesForCollectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPicturesForLocationQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPicturesForLocationQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesForLocationDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPicturesForLocationQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPicturesForLocationQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPicturesForLocationDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetPublishedCollectionInfoByNameQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetPublishedCollectionInfoByNameQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPublishedCollectionInfoByNameDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetPublishedCollectionInfoByNameQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetPublishedCollectionInfoByNameQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetPublishedCollectionInfoByNameDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetRootCollectionQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetRootCollectionQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetRootCollectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetRootCollectionQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetRootCollectionQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetRootCollectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetUnverifiedCommentsQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetUnverifiedCommentsQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetUnverifiedCommentsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetUnverifiedCommentsQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetUnverifiedCommentsQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetUnverifiedCommentsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetUserQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetUserQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetUserDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetUserQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetUserQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetUserDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunGetUsersQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<GetUsersQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetUsersDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleGetUsersQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<GetUsersQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: GetUsersDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunMeQuery(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<MeQueryVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MeDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleMeQueries(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<MeQueryVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MeDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunAcceptCommentMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<AcceptCommentMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AcceptCommentDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleAcceptCommentMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<AcceptCommentMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AcceptCommentDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunAddArchiveTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<AddArchiveTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AddArchiveTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleAddArchiveTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<AddArchiveTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AddArchiveTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunAddPermissionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<AddPermissionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AddPermissionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleAddPermissionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<AddPermissionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AddPermissionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunAddUserMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<AddUserMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AddUserDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleAddUserMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<AddUserMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: AddUserDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunBulkEditMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<BulkEditMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: BulkEditDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleBulkEditMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<BulkEditMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: BulkEditDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunChangePasswordMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<ChangePasswordMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ChangePasswordDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleChangePasswordMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<ChangePasswordMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ChangePasswordDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunContactMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<ContactMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ContactDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleContactMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<ContactMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ContactDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateExhibitionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateExhibitionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateExhibitionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateExhibitionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateExhibitionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateExhibitionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateExhibitionPictureMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateExhibitionPictureMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateExhibitionPictureDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateExhibitionPictureMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateExhibitionPictureMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateExhibitionPictureDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateExhibitionSectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateExhibitionSectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateExhibitionSectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateExhibitionSectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateExhibitionSectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateExhibitionSectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateFaceTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateFaceTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateFaceTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateFaceTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateFaceTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateFaceTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateKeywordTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateKeywordTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateKeywordTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateKeywordTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateKeywordTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateKeywordTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateLinkMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateLinkMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateLinkDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateLinkMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateLinkMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateLinkDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateLocationTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateLocationTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateLocationTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateLocationTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateLocationTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateLocationTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateOrientationTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateOrientationTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateOrientationTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateOrientationTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateOrientationTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateOrientationTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreatePersonTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreatePersonTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePersonTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreatePersonTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreatePersonTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePersonTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreatePictureMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreatePictureMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePictureDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreatePictureMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreatePictureMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePictureDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreatePictureGeoInfoMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreatePictureGeoInfoMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePictureGeoInfoDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreatePictureGeoInfoMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreatePictureGeoInfoMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePictureGeoInfoDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreatePictureSequenceMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreatePictureSequenceMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePictureSequenceDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreatePictureSequenceMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreatePictureSequenceMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreatePictureSequenceDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunCreateSubCollectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<CreateSubCollectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateSubCollectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleCreateSubCollectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<CreateSubCollectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: CreateSubCollectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeclineCommentMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeclineCommentMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeclineCommentDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeclineCommentMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeclineCommentMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeclineCommentDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteCollectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteCollectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteCollectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteCollectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteCollectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteCollectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteExhibitionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteExhibitionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteExhibitionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteExhibitionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteExhibitionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteExhibitionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteExhibitionPictureMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteExhibitionPictureMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteExhibitionPictureDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteExhibitionPictureMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteExhibitionPictureMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteExhibitionPictureDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteExhibitionSectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteExhibitionSectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteExhibitionSectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteExhibitionSectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteExhibitionSectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteExhibitionSectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteFaceTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteFaceTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteFaceTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteFaceTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteFaceTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteFaceTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteKeywordTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteKeywordTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteKeywordTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteKeywordTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteKeywordTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteKeywordTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteLinkMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteLinkMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteLinkDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteLinkMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteLinkMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteLinkDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteLocationTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteLocationTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteLocationTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteLocationTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteLocationTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteLocationTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteOrientationTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteOrientationTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteOrientationTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteOrientationTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteOrientationTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteOrientationTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeleteParameterizedPermissionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeleteParameterizedPermissionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteParameterizedPermissionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeleteParameterizedPermissionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeleteParameterizedPermissionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeleteParameterizedPermissionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunDeletePersonTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<DeletePersonTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeletePersonTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleDeletePersonTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<DeletePersonTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: DeletePersonTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunFixCommentTextMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<FixCommentTextMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: FixCommentTextDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleFixCommentTextMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<FixCommentTextMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: FixCommentTextDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunForgotPasswordMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<ForgotPasswordMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ForgotPasswordDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleForgotPasswordMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<ForgotPasswordMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ForgotPasswordDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunIncreaseNotAPlaceCountMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<IncreaseNotAPlaceCountMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: IncreaseNotAPlaceCountDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleIncreaseNotAPlaceCountMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<IncreaseNotAPlaceCountMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: IncreaseNotAPlaceCountDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunLikeMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<LikeMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: LikeDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleLikeMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<LikeMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: LikeDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunLoginMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<LoginMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: LoginDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleLoginMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<LoginMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: LoginDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunMergeCollectionsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<MergeCollectionsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergeCollectionsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleMergeCollectionsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<MergeCollectionsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergeCollectionsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunMergeKeywordTagsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<MergeKeywordTagsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergeKeywordTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleMergeKeywordTagsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<MergeKeywordTagsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergeKeywordTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunMergeLocationTagsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<MergeLocationTagsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergeLocationTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleMergeLocationTagsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<MergeLocationTagsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergeLocationTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunMergePersonTagsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<MergePersonTagsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergePersonTagsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleMergePersonTagsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<MergePersonTagsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MergePersonTagsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunMultipleUploadMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<MultipleUploadMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MultipleUploadDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleMultipleUploadMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<MultipleUploadMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: MultipleUploadDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunPinCommentMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<PinCommentMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: PinCommentDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultiplePinCommentMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<PinCommentMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: PinCommentDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunPostCommentMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<PostCommentMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: PostCommentDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultiplePostCommentMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<PostCommentMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: PostCommentDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunRemoveArchiveTagMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<RemoveArchiveTagMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: RemoveArchiveTagDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleRemoveArchiveTagMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<RemoveArchiveTagMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: RemoveArchiveTagDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunRemoveUploadMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<RemoveUploadMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: RemoveUploadDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleRemoveUploadMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<RemoveUploadMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: RemoveUploadDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunRemoveUserMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<RemoveUserMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: RemoveUserDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleRemoveUserMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<RemoveUserMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: RemoveUserDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunResetPasswordMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<ResetPasswordMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ResetPasswordDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleResetPasswordMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<ResetPasswordMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: ResetPasswordDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunSetPicturesForCollectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<SetPicturesForCollectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: SetPicturesForCollectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleSetPicturesForCollectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<SetPicturesForCollectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: SetPicturesForCollectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUnpinCommentMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UnpinCommentMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UnpinCommentDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUnpinCommentMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UnpinCommentMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UnpinCommentDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUnpublishPictureMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UnpublishPictureMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UnpublishPictureDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUnpublishPictureMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UnpublishPictureMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UnpublishPictureDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateArchiveMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateArchiveMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateArchiveDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateArchiveMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateArchiveMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateArchiveDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateCollectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateCollectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateCollectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateCollectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateCollectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateCollectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateCollectionParentsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateCollectionParentsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateCollectionParentsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateCollectionParentsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateCollectionParentsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateCollectionParentsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateExhibitionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateExhibitionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateExhibitionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateExhibitionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateExhibitionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateExhibitionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateExhibitionPictureMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateExhibitionPictureMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateExhibitionPictureDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateExhibitionPictureMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateExhibitionPictureMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateExhibitionPictureDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateExhibitionSectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateExhibitionSectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateExhibitionSectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateExhibitionSectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateExhibitionSectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateExhibitionSectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateFaceTagDirectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateFaceTagDirectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateFaceTagDirectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateFaceTagDirectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateFaceTagDirectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateFaceTagDirectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateKeywordNameMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateKeywordNameMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateKeywordNameDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateKeywordNameMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateKeywordNameMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateKeywordNameDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateKeywordSynonymsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateKeywordSynonymsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateKeywordSynonymsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateKeywordSynonymsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateKeywordSynonymsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateKeywordSynonymsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateKeywordVisibilityMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateKeywordVisibilityMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateKeywordVisibilityDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateKeywordVisibilityMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateKeywordVisibilityMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateKeywordVisibilityDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLinkMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLinkMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLinkDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLinkMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLinkMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLinkDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationAcceptanceMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationAcceptanceMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationAcceptanceDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationAcceptanceMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationAcceptanceMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationAcceptanceDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationChildMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationChildMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationChildDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationChildMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationChildMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationChildDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationCoordinatesMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationCoordinatesMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationCoordinatesDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationCoordinatesMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationCoordinatesMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationCoordinatesDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationNameMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationNameMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationNameDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationNameMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationNameMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationNameDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationParentMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationParentMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationParentDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationParentMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationParentMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationParentDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationRootMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationRootMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationRootDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationRootMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationRootMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationRootDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationSynonymsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationSynonymsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationSynonymsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationSynonymsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationSynonymsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationSynonymsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateLocationVisibilityMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateLocationVisibilityMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationVisibilityDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateLocationVisibilityMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateLocationVisibilityMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateLocationVisibilityDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateMeMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateMeMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateMeDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateMeMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateMeMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateMeDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateOrientationTagDirectionMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateOrientationTagDirectionMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateOrientationTagDirectionDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateOrientationTagDirectionMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateOrientationTagDirectionMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateOrientationTagDirectionDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdatePersonNameMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdatePersonNameMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePersonNameDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdatePersonNameMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdatePersonNameMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePersonNameDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdatePersonSynonymsMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdatePersonSynonymsMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePersonSynonymsDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdatePersonSynonymsMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdatePersonSynonymsMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePersonSynonymsDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdatePictureMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdatePictureMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePictureDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdatePictureMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdatePictureMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePictureDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdatePictureSequenceDataMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdatePictureSequenceDataMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePictureSequenceDataDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdatePictureSequenceDataMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdatePictureSequenceDataMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdatePictureSequenceDataDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}

export function useCanRunUpdateUserMutation(
  options?: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variables?: Partial<UpdateUserMutationVariables>;
    withSomeVariables?: boolean;
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateUserDocument.loc?.source.body ?? '',
      variableSets: [options?.variables ?? {}],
      withSomeVariables: options?.withSomeVariables,
    },
  });
  useAuthChangeEffect(refetch);
  return { canRun: data?.canRunOperation?.[0] ?? (loading ? false : true), loading };
}

export function useCanRunMultipleUpdateUserMutations(
  options: Omit<
    Apollo.QueryHookOptions<CanRunOperationQuery, CanRunOperationQueryVariables>,
    'variables'
  > & {
    variableSets: Partial<UpdateUserMutationVariables>[];
  }
) {
  const { data, loading, refetch } = useCanRunOperationQuery({
    ...options,
    variables: {
      operation: UpdateUserDocument.loc?.source.body ?? '',
      variableSets: options.variableSets,
    },
  });
  useAuthChangeEffect(refetch);
  return {
    canRunMultiple:
      data?.canRunOperation ?? options.variableSets.map(_ => (loading ? false : true)),
    loading,
  };
}
