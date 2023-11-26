import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  RichTextAttribute,
  TextAttribute,
  MediaAttribute,
  SingleTypeSchema,
  FloatAttribute,
  ComponentAttribute,
  ComponentSchema,
} from '@strapi/strapi';

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::permission', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::permission', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<'admin::user', 'manyToMany', 'admin::role'> & PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: RelationAttribute<'admin::role', 'oneToMany', 'admin::permission'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    type: EnumerationAttribute<['read-only', 'full-access', 'custom']> &
      RequiredAttribute &
      DefaultTo<'read-only'>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: DateTimeAttribute;
    permissions: RelationAttribute<'admin::api-token', 'oneToMany', 'admin::api-token-permission'>;
    expiresAt: DateTimeAttribute;
    lifespan: IntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::api-token', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::api-token', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface AdminApiTokenPermission extends CollectionTypeSchema {
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    token: RelationAttribute<'admin::api-token-permission', 'manyToOne', 'admin::api-token'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::api-token-permission', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::api-token-permission', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<'plugin::upload.file', 'morphToMany'>;
    folder: RelationAttribute<'plugin::upload.file', 'manyToOne', 'plugin::upload.folder'> &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::upload.file', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::upload.file', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<'plugin::upload.folder', 'manyToOne', 'plugin::upload.folder'>;
    children: RelationAttribute<'plugin::upload.folder', 'oneToMany', 'plugin::upload.folder'>;
    files: RelationAttribute<'plugin::upload.folder', 'oneToMany', 'plugin::upload.file'>;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::upload.folder', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::upload.folder', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    isSuperUser: BooleanAttribute & DefaultTo<false>;
    resetPasswordTokenCreatedAt: DateTimeAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiArchiveTagArchiveTag extends CollectionTypeSchema {
  info: {
    singularName: 'archive-tag';
    pluralName: 'archive-tags';
    displayName: 'Archive_Tag';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: StringAttribute & RequiredAttribute & UniqueAttribute;
    pictures: RelationAttribute<
      'api::archive-tag.archive-tag',
      'oneToMany',
      'api::picture.picture'
    >;
    longDescription: RichTextAttribute;
    showcasePicture: RelationAttribute<
      'api::archive-tag.archive-tag',
      'oneToOne',
      'api::picture.picture'
    >;
    links: RelationAttribute<'api::archive-tag.archive-tag', 'oneToMany', 'api::link.link'>;
    shortDescription: TextAttribute;
    logo: MediaAttribute;
    paypalClient: StringAttribute;
    paypalDonationText: StringAttribute;
    paypalPurpose: StringAttribute;
    restrictImageDownloading: BooleanAttribute;
    email: EmailAttribute;
    exhibitions: RelationAttribute<
      'api::archive-tag.archive-tag',
      'oneToMany',
      'api::exhibition.exhibition'
    >;
    hidden: BooleanAttribute & DefaultTo<false>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::archive-tag.archive-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::archive-tag.archive-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiBrowseRootCollectionBrowseRootCollection extends SingleTypeSchema {
  info: {
    singularName: 'browse-root-collection';
    pluralName: 'browse-root-collections';
    displayName: 'Browse root collection';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    current: RelationAttribute<
      'api::browse-root-collection.browse-root-collection',
      'oneToOne',
      'api::collection.collection'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::browse-root-collection.browse-root-collection',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::browse-root-collection.browse-root-collection',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiCollectionCollection extends CollectionTypeSchema {
  info: {
    singularName: 'collection';
    pluralName: 'collections';
    displayName: 'Collection';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: StringAttribute & RequiredAttribute & UniqueAttribute;
    description: RichTextAttribute;
    child_collections: RelationAttribute<
      'api::collection.collection',
      'manyToMany',
      'api::collection.collection'
    >;
    parent_collections: RelationAttribute<
      'api::collection.collection',
      'manyToMany',
      'api::collection.collection'
    >;
    pictures: RelationAttribute<'api::collection.collection', 'manyToMany', 'api::picture.picture'>;
    thumbnail: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::collection.collection', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::collection.collection', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiCommentComment extends CollectionTypeSchema {
  info: {
    singularName: 'comment';
    pluralName: 'comments';
    displayName: 'Comment';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: StringAttribute;
    text: RichTextAttribute & RequiredAttribute;
    date: DateTimeAttribute & RequiredAttribute;
    picture: RelationAttribute<'api::comment.comment', 'manyToOne', 'api::picture.picture'>;
    pinned: BooleanAttribute & DefaultTo<false>;
    childComments: RelationAttribute<'api::comment.comment', 'oneToMany', 'api::comment.comment'>;
    parentComment: RelationAttribute<'api::comment.comment', 'manyToOne', 'api::comment.comment'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::comment.comment', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::comment.comment', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiDescriptionDescription extends CollectionTypeSchema {
  info: {
    singularName: 'description';
    pluralName: 'descriptions';
    displayName: 'Description';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    text: RichTextAttribute & RequiredAttribute;
    pictures: RelationAttribute<
      'api::description.description',
      'manyToMany',
      'api::picture.picture'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::description.description', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::description.description', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiExhibitionExhibition extends CollectionTypeSchema {
  info: {
    singularName: 'exhibition';
    pluralName: 'exhibitions';
    displayName: 'Exhibition';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: StringAttribute;
    introduction: RichTextAttribute;
    title_picture: RelationAttribute<
      'api::exhibition.exhibition',
      'oneToOne',
      'api::exhibition-picture.exhibition-picture'
    >;
    exhibition_sections: RelationAttribute<
      'api::exhibition.exhibition',
      'oneToMany',
      'api::exhibition-section.exhibition-section'
    >;
    idealot_pictures: RelationAttribute<
      'api::exhibition.exhibition',
      'oneToMany',
      'api::exhibition-picture.exhibition-picture'
    >;
    is_published: BooleanAttribute;
    archive_tag: RelationAttribute<
      'api::exhibition.exhibition',
      'manyToOne',
      'api::archive-tag.archive-tag'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::exhibition.exhibition', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::exhibition.exhibition', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiExhibitionPictureExhibitionPicture extends CollectionTypeSchema {
  info: {
    singularName: 'exhibition-picture';
    pluralName: 'exhibition-pictures';
    displayName: 'Exhibition_Picture';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    picture: RelationAttribute<
      'api::exhibition-picture.exhibition-picture',
      'manyToOne',
      'api::picture.picture'
    >;
    subtitle: StringAttribute;
    exhibition_section: RelationAttribute<
      'api::exhibition-picture.exhibition-picture',
      'manyToOne',
      'api::exhibition-section.exhibition-section'
    >;
    exhibition_idealot: RelationAttribute<
      'api::exhibition-picture.exhibition-picture',
      'manyToOne',
      'api::exhibition.exhibition'
    >;
    order: IntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::exhibition-picture.exhibition-picture',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::exhibition-picture.exhibition-picture',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiExhibitionSectionExhibitionSection extends CollectionTypeSchema {
  info: {
    singularName: 'exhibition-section';
    pluralName: 'exhibition-sections';
    displayName: 'Exhibition_Section';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: StringAttribute;
    text: RichTextAttribute;
    exhibition_pictures: RelationAttribute<
      'api::exhibition-section.exhibition-section',
      'oneToMany',
      'api::exhibition-picture.exhibition-picture'
    >;
    exhibition: RelationAttribute<
      'api::exhibition-section.exhibition-section',
      'manyToOne',
      'api::exhibition.exhibition'
    >;
    order: IntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::exhibition-section.exhibition-section',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::exhibition-section.exhibition-section',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiFaceTagFaceTag extends CollectionTypeSchema {
  info: {
    singularName: 'face-tag';
    pluralName: 'face-tags';
    displayName: 'Face_Tag';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    x: FloatAttribute;
    y: FloatAttribute;
    person_tag: RelationAttribute<
      'api::face-tag.face-tag',
      'oneToOne',
      'api::person-tag.person-tag'
    >;
    picture: RelationAttribute<'api::face-tag.face-tag', 'manyToOne', 'api::picture.picture'>;
    tag_direction: IntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::face-tag.face-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::face-tag.face-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiKeywordTagKeywordTag extends CollectionTypeSchema {
  info: {
    singularName: 'keyword-tag';
    pluralName: 'keyword-tags';
    displayName: 'Keyword_Tag';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: StringAttribute & RequiredAttribute & UniqueAttribute;
    pictures: RelationAttribute<
      'api::keyword-tag.keyword-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    verified_pictures: RelationAttribute<
      'api::keyword-tag.keyword-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    synonyms: ComponentAttribute<'common.synonyms', true>;
    visible: BooleanAttribute & DefaultTo<false>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::keyword-tag.keyword-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::keyword-tag.keyword-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiLinkLink extends CollectionTypeSchema {
  info: {
    singularName: 'link';
    pluralName: 'links';
    displayName: 'Link';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    title: RichTextAttribute;
    url: RichTextAttribute & RequiredAttribute;
    archive_tag: RelationAttribute<'api::link.link', 'manyToOne', 'api::archive-tag.archive-tag'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::link.link', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'api::link.link', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface ApiLocationTagLocationTag extends CollectionTypeSchema {
  info: {
    singularName: 'location-tag';
    pluralName: 'location-tags';
    displayName: 'Location_Tag';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    coordinates: ComponentAttribute<'location.coordinates'>;
    pictures: RelationAttribute<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    verified_pictures: RelationAttribute<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    synonyms: ComponentAttribute<'common.synonyms', true>;
    visible: BooleanAttribute & DefaultTo<false>;
    parent_tags: RelationAttribute<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    child_tags: RelationAttribute<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    accepted: BooleanAttribute;
    root: BooleanAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::location-tag.location-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::location-tag.location-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiParameterizedPermissionParameterizedPermission extends CollectionTypeSchema {
  info: {
    singularName: 'parameterized-permission';
    pluralName: 'parameterized-permissions';
    displayName: 'Parameterized_Permission';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    operation_name: StringAttribute;
    users_permissions_user: RelationAttribute<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    archive_tag: RelationAttribute<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'api::archive-tag.archive-tag'
    >;
    on_other_users: BooleanAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiPersonTagPersonTag extends CollectionTypeSchema {
  info: {
    singularName: 'person-tag';
    pluralName: 'person-tags';
    displayName: 'Person_Tag';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: StringAttribute & RequiredAttribute & UniqueAttribute;
    pictures: RelationAttribute<'api::person-tag.person-tag', 'manyToMany', 'api::picture.picture'>;
    verified_pictures: RelationAttribute<
      'api::person-tag.person-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    synonyms: ComponentAttribute<'common.synonyms', true>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::person-tag.person-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::person-tag.person-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiPicturePicture extends CollectionTypeSchema {
  info: {
    singularName: 'picture';
    pluralName: 'pictures';
    displayName: 'Picture';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    media: MediaAttribute & RequiredAttribute;
    wordpress_id: IntegerAttribute & UniqueAttribute;
    descriptions: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::description.description'
    >;
    comments: RelationAttribute<'api::picture.picture', 'oneToMany', 'api::comment.comment'>;
    keyword_tags: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::keyword-tag.keyword-tag'
    >;
    time_range_tag: RelationAttribute<
      'api::picture.picture',
      'manyToOne',
      'api::time-range-tag.time-range-tag'
    >;
    collections: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::collection.collection'
    >;
    person_tags: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::person-tag.person-tag'
    >;
    location_tags: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    verified_person_tags: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::person-tag.person-tag'
    >;
    verified_location_tags: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    verified_keyword_tags: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::keyword-tag.keyword-tag'
    >;
    verified_time_range_tag: RelationAttribute<
      'api::picture.picture',
      'manyToOne',
      'api::time-range-tag.time-range-tag'
    >;
    is_text: BooleanAttribute & DefaultTo<false>;
    archive_identifier: StringAttribute;
    archive_tag: RelationAttribute<
      'api::picture.picture',
      'manyToOne',
      'api::archive-tag.archive-tag'
    >;
    likes: IntegerAttribute;
    linked_texts: RelationAttribute<'api::picture.picture', 'manyToMany', 'api::picture.picture'>;
    linked_pictures: RelationAttribute<
      'api::picture.picture',
      'manyToMany',
      'api::picture.picture'
    >;
    picture_geo_infos: RelationAttribute<
      'api::picture.picture',
      'oneToMany',
      'api::picture-geo-info.picture-geo-info'
    >;
    is_not_a_place_count: IntegerAttribute;
    face_tags: RelationAttribute<'api::picture.picture', 'oneToMany', 'api::face-tag.face-tag'>;
    picture_sequence: RelationAttribute<
      'api::picture.picture',
      'manyToOne',
      'api::picture-sequence.picture-sequence'
    >;
    picture_sequence_order: IntegerAttribute;
    exhibition_pictures: RelationAttribute<
      'api::picture.picture',
      'oneToMany',
      'api::exhibition-picture.exhibition-picture'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::picture.picture', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::picture.picture', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiPictureGeoInfoPictureGeoInfo extends CollectionTypeSchema {
  info: {
    singularName: 'picture-geo-info';
    pluralName: 'picture-geo-infos';
    displayName: 'Picture_Geo_Info';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    picture: RelationAttribute<
      'api::picture-geo-info.picture-geo-info',
      'manyToOne',
      'api::picture.picture'
    >;
    latitude: FloatAttribute;
    longitude: FloatAttribute;
    radius: DecimalAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::picture-geo-info.picture-geo-info',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::picture-geo-info.picture-geo-info',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiPictureSequencePictureSequence extends CollectionTypeSchema {
  info: {
    singularName: 'picture-sequence';
    pluralName: 'picture-sequences';
    displayName: 'Picture_Sequence';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    pictures: RelationAttribute<
      'api::picture-sequence.picture-sequence',
      'oneToMany',
      'api::picture.picture'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::picture-sequence.picture-sequence',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::picture-sequence.picture-sequence',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiTimeRangeTagTimeRangeTag extends CollectionTypeSchema {
  info: {
    singularName: 'time-range-tag';
    pluralName: 'time-range-tags';
    displayName: 'Time_Range_Tag';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    start: DateTimeAttribute & RequiredAttribute;
    end: DateTimeAttribute & RequiredAttribute;
    pictures: RelationAttribute<
      'api::time-range-tag.time-range-tag',
      'oneToMany',
      'api::picture.picture'
    >;
    verified_pictures: RelationAttribute<
      'api::time-range-tag.time-range-tag',
      'oneToMany',
      'api::picture.picture'
    >;
    isEstimate: BooleanAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::time-range-tag.time-range-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::time-range-tag.time-range-tag', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface CommonSynonyms extends ComponentSchema {
  info: {
    displayName: 'synonym';
    icon: 'layer-group';
    description: '';
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
  };
}

export interface LocationCoordinates extends ComponentSchema {
  info: {
    displayName: 'Coordinates';
    icon: 'map-marked-alt';
  };
  attributes: {
    latitude: FloatAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: -90;
        max: 90;
      }>;
    longitude: FloatAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: -180;
        max: 180;
      }>;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::archive-tag.archive-tag': ApiArchiveTagArchiveTag;
      'api::browse-root-collection.browse-root-collection': ApiBrowseRootCollectionBrowseRootCollection;
      'api::collection.collection': ApiCollectionCollection;
      'api::comment.comment': ApiCommentComment;
      'api::description.description': ApiDescriptionDescription;
      'api::exhibition.exhibition': ApiExhibitionExhibition;
      'api::exhibition-picture.exhibition-picture': ApiExhibitionPictureExhibitionPicture;
      'api::exhibition-section.exhibition-section': ApiExhibitionSectionExhibitionSection;
      'api::face-tag.face-tag': ApiFaceTagFaceTag;
      'api::keyword-tag.keyword-tag': ApiKeywordTagKeywordTag;
      'api::link.link': ApiLinkLink;
      'api::location-tag.location-tag': ApiLocationTagLocationTag;
      'api::parameterized-permission.parameterized-permission': ApiParameterizedPermissionParameterizedPermission;
      'api::person-tag.person-tag': ApiPersonTagPersonTag;
      'api::picture.picture': ApiPicturePicture;
      'api::picture-geo-info.picture-geo-info': ApiPictureGeoInfoPictureGeoInfo;
      'api::picture-sequence.picture-sequence': ApiPictureSequencePictureSequence;
      'api::time-range-tag.time-range-tag': ApiTimeRangeTagTimeRangeTag;
      'common.synonyms': CommonSynonyms;
      'location.coordinates': LocationCoordinates;
    }
  }
}
