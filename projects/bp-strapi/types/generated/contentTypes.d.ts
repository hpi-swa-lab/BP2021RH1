import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
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
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<'admin::api-token', 'oneToMany', 'admin::api-token-permission'>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
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
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    token: Attribute.Relation<'admin::api-token-permission', 'manyToOne', 'admin::api-token'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
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
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
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
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<'admin::role', 'oneToMany', 'admin::permission'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
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
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
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
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
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
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> & Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiArchiveTagArchiveTag extends Schema.CollectionType {
  collectionName: 'archive_tags';
  info: {
    description: '';
    displayName: 'Archive_Tag';
    pluralName: 'archive-tags';
    singularName: 'archive-tag';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::archive-tag.archive-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    deleted: Attribute.Boolean & Attribute.DefaultTo<false>;
    email: Attribute.Email;
    exhibitions: Attribute.Relation<
      'api::archive-tag.archive-tag',
      'oneToMany',
      'api::exhibition.exhibition'
    >;
    hidden: Attribute.Boolean & Attribute.DefaultTo<false>;
    links: Attribute.Relation<'api::archive-tag.archive-tag', 'oneToMany', 'api::link.link'>;
    logo: Attribute.Media<'images'>;
    longDescription: Attribute.RichText;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    paypalClient: Attribute.String;
    paypalDonationText: Attribute.String;
    paypalPurpose: Attribute.String;
    pictures: Attribute.Relation<
      'api::archive-tag.archive-tag',
      'oneToMany',
      'api::picture.picture'
    >;
    publishedAt: Attribute.DateTime;
    restrictImageDownloading: Attribute.Boolean;
    shortDescription: Attribute.Text;
    showcasePicture: Attribute.Relation<
      'api::archive-tag.archive-tag',
      'oneToOne',
      'api::picture.picture'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::archive-tag.archive-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiBrowseRootCollectionBrowseRootCollection extends Schema.SingleType {
  collectionName: 'browse_root_collections';
  info: {
    displayName: 'Browse root collection';
    pluralName: 'browse-root-collections';
    singularName: 'browse-root-collection';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::browse-root-collection.browse-root-collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    current: Attribute.Relation<
      'api::browse-root-collection.browse-root-collection',
      'oneToOne',
      'api::collection.collection'
    >;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::browse-root-collection.browse-root-collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCollectionCollection extends Schema.CollectionType {
  collectionName: 'collections';
  info: {
    description: '';
    displayName: 'Collection';
    pluralName: 'collections';
    singularName: 'collection';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    child_collections: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::collection.collection'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::collection.collection', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.RichText;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    parent_collections: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::collection.collection'
    >;
    pictures: Attribute.Relation<
      'api::collection.collection',
      'manyToMany',
      'api::picture.picture'
    >;
    publishedAt: Attribute.DateTime;
    thumbnail: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::collection.collection', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    visible: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
  };
}

export interface ApiCommentComment extends Schema.CollectionType {
  collectionName: 'comments';
  info: {
    description: '';
    displayName: 'Comment';
    pluralName: 'comments';
    singularName: 'comment';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    accepted: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    author: Attribute.String;
    childComments: Attribute.Relation<'api::comment.comment', 'oneToMany', 'api::comment.comment'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::comment.comment', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    date: Attribute.DateTime & Attribute.Required;
    parentComment: Attribute.Relation<'api::comment.comment', 'manyToOne', 'api::comment.comment'>;
    picture: Attribute.Relation<'api::comment.comment', 'manyToOne', 'api::picture.picture'>;
    pinned: Attribute.Boolean & Attribute.DefaultTo<false>;
    publishedAt: Attribute.DateTime;
    text: Attribute.RichText & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::comment.comment', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiDescriptionDescription extends Schema.CollectionType {
  collectionName: 'descriptions';
  info: {
    displayName: 'Description';
    pluralName: 'descriptions';
    singularName: 'description';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::description.description', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    pictures: Attribute.Relation<
      'api::description.description',
      'manyToMany',
      'api::picture.picture'
    >;
    publishedAt: Attribute.DateTime;
    text: Attribute.RichText & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::description.description', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiExhibitionPictureExhibitionPicture extends Schema.CollectionType {
  collectionName: 'exhibition_pictures';
  info: {
    description: '';
    displayName: 'Exhibition_Picture';
    pluralName: 'exhibition-pictures';
    singularName: 'exhibition-picture';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::exhibition-picture.exhibition-picture',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    exhibition_idealot: Attribute.Relation<
      'api::exhibition-picture.exhibition-picture',
      'manyToOne',
      'api::exhibition.exhibition'
    >;
    exhibition_section: Attribute.Relation<
      'api::exhibition-picture.exhibition-picture',
      'manyToOne',
      'api::exhibition-section.exhibition-section'
    >;
    order: Attribute.Integer;
    picture: Attribute.Relation<
      'api::exhibition-picture.exhibition-picture',
      'manyToOne',
      'api::picture.picture'
    >;
    publishedAt: Attribute.DateTime;
    subtitle: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::exhibition-picture.exhibition-picture',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiExhibitionSectionExhibitionSection extends Schema.CollectionType {
  collectionName: 'exhibition_sections';
  info: {
    description: '';
    displayName: 'Exhibition_Section';
    pluralName: 'exhibition-sections';
    singularName: 'exhibition-section';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::exhibition-section.exhibition-section',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    exhibition: Attribute.Relation<
      'api::exhibition-section.exhibition-section',
      'manyToOne',
      'api::exhibition.exhibition'
    >;
    exhibition_pictures: Attribute.Relation<
      'api::exhibition-section.exhibition-section',
      'oneToMany',
      'api::exhibition-picture.exhibition-picture'
    >;
    order: Attribute.Integer;
    publishedAt: Attribute.DateTime;
    text: Attribute.RichText;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::exhibition-section.exhibition-section',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiExhibitionExhibition extends Schema.CollectionType {
  collectionName: 'exhibitions';
  info: {
    description: '';
    displayName: 'Exhibition';
    pluralName: 'exhibitions';
    singularName: 'exhibition';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    archive_tag: Attribute.Relation<
      'api::exhibition.exhibition',
      'manyToOne',
      'api::archive-tag.archive-tag'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::exhibition.exhibition', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    exhibition_sections: Attribute.Relation<
      'api::exhibition.exhibition',
      'oneToMany',
      'api::exhibition-section.exhibition-section'
    >;
    idealot_pictures: Attribute.Relation<
      'api::exhibition.exhibition',
      'oneToMany',
      'api::exhibition-picture.exhibition-picture'
    >;
    introduction: Attribute.RichText;
    is_published: Attribute.Boolean;
    publishedAt: Attribute.DateTime;
    title: Attribute.String;
    title_picture: Attribute.Relation<
      'api::exhibition.exhibition',
      'oneToOne',
      'api::exhibition-picture.exhibition-picture'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::exhibition.exhibition', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiFaceTagFaceTag extends Schema.CollectionType {
  collectionName: 'face_tags';
  info: {
    description: '';
    displayName: 'Face_Tag';
    pluralName: 'face-tags';
    singularName: 'face-tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::face-tag.face-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    person_tag: Attribute.Relation<
      'api::face-tag.face-tag',
      'oneToOne',
      'api::person-tag.person-tag'
    >;
    picture: Attribute.Relation<'api::face-tag.face-tag', 'manyToOne', 'api::picture.picture'>;
    tag_direction: Attribute.Integer;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::face-tag.face-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    x: Attribute.Float;
    y: Attribute.Float;
  };
}

export interface ApiKeywordTagKeywordTag extends Schema.CollectionType {
  collectionName: 'keyword_tags';
  info: {
    description: '';
    displayName: 'Keyword_Tag';
    pluralName: 'keyword-tags';
    singularName: 'keyword-tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::keyword-tag.keyword-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    pictures: Attribute.Relation<
      'api::keyword-tag.keyword-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    synonyms: Attribute.Component<'common.synonyms', true>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::keyword-tag.keyword-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    verified_pictures: Attribute.Relation<
      'api::keyword-tag.keyword-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    visible: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ApiLinkLink extends Schema.CollectionType {
  collectionName: 'links';
  info: {
    description: '';
    displayName: 'Link';
    pluralName: 'links';
    singularName: 'link';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    archive_tag: Attribute.Relation<'api::link.link', 'manyToOne', 'api::archive-tag.archive-tag'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::link.link', 'oneToOne', 'admin::user'> & Attribute.Private;
    title: Attribute.RichText;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::link.link', 'oneToOne', 'admin::user'> & Attribute.Private;
    url: Attribute.RichText & Attribute.Required;
  };
}

export interface ApiLocationTagLocationTag extends Schema.CollectionType {
  collectionName: 'location_tags';
  info: {
    description: '';
    displayName: 'Location_Tag';
    pluralName: 'location-tags';
    singularName: 'location-tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accepted: Attribute.Boolean;
    child_tags: Attribute.Relation<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    coordinates: Attribute.Component<'location.coordinates'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::location-tag.location-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    parent_tags: Attribute.Relation<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    pictures: Attribute.Relation<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    root: Attribute.Boolean;
    synonyms: Attribute.Component<'common.synonyms', true>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::location-tag.location-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    verified_pictures: Attribute.Relation<
      'api::location-tag.location-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    visible: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ApiOrientationTagOrientationTag extends Schema.CollectionType {
  collectionName: 'orientation_tags';
  info: {
    description: '';
    displayName: 'Orientation_Tag';
    pluralName: 'orientation-tags';
    singularName: 'orientation-tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::orientation-tag.orientation-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    location_tag: Attribute.Relation<
      'api::orientation-tag.orientation-tag',
      'oneToOne',
      'api::location-tag.location-tag'
    >;
    picture: Attribute.Relation<
      'api::orientation-tag.orientation-tag',
      'manyToOne',
      'api::picture.picture'
    >;
    tag_direction: Attribute.Integer;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::orientation-tag.orientation-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    x: Attribute.Float;
    y: Attribute.Float;
  };
}

export interface ApiParameterizedPermissionParameterizedPermission extends Schema.CollectionType {
  collectionName: 'parameterized_permissions';
  info: {
    description: '';
    displayName: 'Parameterized_Permission';
    pluralName: 'parameterized-permissions';
    singularName: 'parameterized-permission';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    archive_tag: Attribute.Relation<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'api::archive-tag.archive-tag'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    on_other_users: Attribute.Boolean;
    operation_name: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users_permissions_user: Attribute.Relation<
      'api::parameterized-permission.parameterized-permission',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiPersonTagPersonTag extends Schema.CollectionType {
  collectionName: 'person_tags';
  info: {
    description: '';
    displayName: 'Person_Tag';
    pluralName: 'person-tags';
    singularName: 'person-tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::person-tag.person-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    pictures: Attribute.Relation<
      'api::person-tag.person-tag',
      'manyToMany',
      'api::picture.picture'
    >;
    synonyms: Attribute.Component<'common.synonyms', true>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::person-tag.person-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    verified_pictures: Attribute.Relation<
      'api::person-tag.person-tag',
      'manyToMany',
      'api::picture.picture'
    >;
  };
}

export interface ApiPictureGeoInfoPictureGeoInfo extends Schema.CollectionType {
  collectionName: 'picture_geo_infos';
  info: {
    description: '';
    displayName: 'Picture_Geo_Info';
    pluralName: 'picture-geo-infos';
    singularName: 'picture-geo-info';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::picture-geo-info.picture-geo-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    latitude: Attribute.Float;
    longitude: Attribute.Float;
    picture: Attribute.Relation<
      'api::picture-geo-info.picture-geo-info',
      'manyToOne',
      'api::picture.picture'
    >;
    radius: Attribute.Decimal;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::picture-geo-info.picture-geo-info',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPictureSequencePictureSequence extends Schema.CollectionType {
  collectionName: 'picture_sequences';
  info: {
    description: '';
    displayName: 'Picture_Sequence';
    pluralName: 'picture-sequences';
    singularName: 'picture-sequence';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::picture-sequence.picture-sequence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    pictures: Attribute.Relation<
      'api::picture-sequence.picture-sequence',
      'oneToMany',
      'api::picture.picture'
    >;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::picture-sequence.picture-sequence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPicturePicture extends Schema.CollectionType {
  collectionName: 'pictures';
  info: {
    description: '';
    displayName: 'Picture';
    pluralName: 'pictures';
    singularName: 'picture';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    archive_identifier: Attribute.String;
    archive_tag: Attribute.Relation<
      'api::picture.picture',
      'manyToOne',
      'api::archive-tag.archive-tag'
    >;
    collections: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::collection.collection'
    >;
    comments: Attribute.Relation<'api::picture.picture', 'oneToMany', 'api::comment.comment'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::picture.picture', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    deleted: Attribute.Boolean & Attribute.DefaultTo<false>;
    descriptions: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::description.description'
    >;
    exhibition_pictures: Attribute.Relation<
      'api::picture.picture',
      'oneToMany',
      'api::exhibition-picture.exhibition-picture'
    >;
    face_tags: Attribute.Relation<'api::picture.picture', 'oneToMany', 'api::face-tag.face-tag'>;
    is_not_a_place_count: Attribute.Integer;
    is_text: Attribute.Boolean & Attribute.DefaultTo<false>;
    keyword_tags: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::keyword-tag.keyword-tag'
    >;
    likes: Attribute.Integer;
    linked_pictures: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::picture.picture'
    >;
    linked_texts: Attribute.Relation<'api::picture.picture', 'manyToMany', 'api::picture.picture'>;
    location_tags: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    media: Attribute.Media<'images' | 'files' | 'videos'> & Attribute.Required;
    orientation_tags: Attribute.Relation<
      'api::picture.picture',
      'oneToMany',
      'api::orientation-tag.orientation-tag'
    >;
    person_tags: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::person-tag.person-tag'
    >;
    picture_geo_infos: Attribute.Relation<
      'api::picture.picture',
      'oneToMany',
      'api::picture-geo-info.picture-geo-info'
    >;
    picture_sequence: Attribute.Relation<
      'api::picture.picture',
      'manyToOne',
      'api::picture-sequence.picture-sequence'
    >;
    picture_sequence_order: Attribute.Integer;
    publishedAt: Attribute.DateTime;
    time_range_tag: Attribute.Relation<
      'api::picture.picture',
      'manyToOne',
      'api::time-range-tag.time-range-tag'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::picture.picture', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    verified_keyword_tags: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::keyword-tag.keyword-tag'
    >;
    verified_location_tags: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::location-tag.location-tag'
    >;
    verified_person_tags: Attribute.Relation<
      'api::picture.picture',
      'manyToMany',
      'api::person-tag.person-tag'
    >;
    verified_time_range_tag: Attribute.Relation<
      'api::picture.picture',
      'manyToOne',
      'api::time-range-tag.time-range-tag'
    >;
    wordpress_id: Attribute.Integer & Attribute.Unique;
  };
}

export interface ApiTimeRangeTagTimeRangeTag extends Schema.CollectionType {
  collectionName: 'time_range_tags';
  info: {
    description: '';
    displayName: 'Time_Range_Tag';
    pluralName: 'time-range-tags';
    singularName: 'time-range-tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::time-range-tag.time-range-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    end: Attribute.DateTime & Attribute.Required;
    isEstimate: Attribute.Boolean;
    pictures: Attribute.Relation<
      'api::time-range-tag.time-range-tag',
      'oneToMany',
      'api::picture.picture'
    >;
    start: Attribute.DateTime & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::time-range-tag.time-range-tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    verified_pictures: Attribute.Relation<
      'api::time-range-tag.time-range-tag',
      'oneToMany',
      'api::picture.picture'
    >;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
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
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'plugin::content-releases.release', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<['ready', 'blocked', 'failed', 'done', 'empty']> &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'plugin::content-releases.release', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
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
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<'plugin::content-releases.release-action', 'morphToOne'>;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
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
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<'plugin::upload.file', 'manyToOne', 'plugin::upload.folder'> &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
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
    children: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.folder'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    files: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.file'>;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<'plugin::upload.folder', 'manyToOne', 'plugin::upload.folder'>;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
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
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
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
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    isSuperUser: Attribute.Boolean & Attribute.DefaultTo<false>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    resetPasswordTokenCreatedAt: Attribute.DateTime;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::archive-tag.archive-tag': ApiArchiveTagArchiveTag;
      'api::browse-root-collection.browse-root-collection': ApiBrowseRootCollectionBrowseRootCollection;
      'api::collection.collection': ApiCollectionCollection;
      'api::comment.comment': ApiCommentComment;
      'api::description.description': ApiDescriptionDescription;
      'api::exhibition-picture.exhibition-picture': ApiExhibitionPictureExhibitionPicture;
      'api::exhibition-section.exhibition-section': ApiExhibitionSectionExhibitionSection;
      'api::exhibition.exhibition': ApiExhibitionExhibition;
      'api::face-tag.face-tag': ApiFaceTagFaceTag;
      'api::keyword-tag.keyword-tag': ApiKeywordTagKeywordTag;
      'api::link.link': ApiLinkLink;
      'api::location-tag.location-tag': ApiLocationTagLocationTag;
      'api::orientation-tag.orientation-tag': ApiOrientationTagOrientationTag;
      'api::parameterized-permission.parameterized-permission': ApiParameterizedPermissionParameterizedPermission;
      'api::person-tag.person-tag': ApiPersonTagPersonTag;
      'api::picture-geo-info.picture-geo-info': ApiPictureGeoInfoPictureGeoInfo;
      'api::picture-sequence.picture-sequence': ApiPictureSequencePictureSequence;
      'api::picture.picture': ApiPicturePicture;
      'api::time-range-tag.time-range-tag': ApiTimeRangeTagTimeRangeTag;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
