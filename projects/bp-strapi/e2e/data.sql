PGDMP         4                z        
   strapi-e2e    14.1    14.1 ?   ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    22609 
   strapi-e2e    DATABASE     i   CREATE DATABASE "strapi-e2e" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'German_Germany.1252';
    DROP DATABASE "strapi-e2e";
                postgres    false            ?            1259    27270    admin_permissions    TABLE     J  CREATE TABLE public.admin_permissions (
    id integer NOT NULL,
    action character varying(255),
    subject character varying(255),
    properties jsonb,
    conditions jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 %   DROP TABLE public.admin_permissions;
       public         heap    postgres    false            ?            1259    27275    admin_permissions_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.admin_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.admin_permissions_id_seq;
       public          postgres    false    209            ?           0    0    admin_permissions_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.admin_permissions_id_seq OWNED BY public.admin_permissions.id;
          public          postgres    false    210            ?            1259    27276    admin_permissions_role_links    TABLE     e   CREATE TABLE public.admin_permissions_role_links (
    permission_id integer,
    role_id integer
);
 0   DROP TABLE public.admin_permissions_role_links;
       public         heap    postgres    false            ?            1259    27279    admin_roles    TABLE     ;  CREATE TABLE public.admin_roles (
    id integer NOT NULL,
    name character varying(255),
    code character varying(255),
    description character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.admin_roles;
       public         heap    postgres    false            ?            1259    27284    admin_roles_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.admin_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_roles_id_seq;
       public          postgres    false    212                        0    0    admin_roles_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.admin_roles_id_seq OWNED BY public.admin_roles.id;
          public          postgres    false    213            ?            1259    27285    admin_users    TABLE     B  CREATE TABLE public.admin_users (
    id integer NOT NULL,
    firstname character varying(255),
    lastname character varying(255),
    username character varying(255),
    email character varying(255),
    password character varying(255),
    reset_password_token character varying(255),
    registration_token character varying(255),
    is_active boolean,
    blocked boolean,
    prefered_language character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.admin_users;
       public         heap    postgres    false            ?            1259    27290    admin_users_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_users_id_seq;
       public          postgres    false    214                       0    0    admin_users_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;
          public          postgres    false    215            ?            1259    27291    admin_users_roles_links    TABLE     Z   CREATE TABLE public.admin_users_roles_links (
    user_id integer,
    role_id integer
);
 +   DROP TABLE public.admin_users_roles_links;
       public         heap    postgres    false                       1259    28000    archive_tags    TABLE     ?   CREATE TABLE public.archive_tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
     DROP TABLE public.archive_tags;
       public         heap    postgres    false                       1259    27999    archive_tags_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.archive_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.archive_tags_id_seq;
       public          postgres    false    281                       0    0    archive_tags_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.archive_tags_id_seq OWNED BY public.archive_tags.id;
          public          postgres    false    280            ?            1259    27294    browse_root_collections    TABLE       CREATE TABLE public.browse_root_collections (
    id integer NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 +   DROP TABLE public.browse_root_collections;
       public         heap    postgres    false            ?            1259    27297 %   browse_root_collections_current_links    TABLE     ?   CREATE TABLE public.browse_root_collections_current_links (
    browse_root_collection_id integer,
    collection_id integer
);
 9   DROP TABLE public.browse_root_collections_current_links;
       public         heap    postgres    false            ?            1259    27300    browse_root_collections_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.browse_root_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.browse_root_collections_id_seq;
       public          postgres    false    217                       0    0    browse_root_collections_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.browse_root_collections_id_seq OWNED BY public.browse_root_collections.id;
          public          postgres    false    219            ?            1259    27301    collections    TABLE     _  CREATE TABLE public.collections (
    id integer NOT NULL,
    name character varying(255),
    description text,
    thumbnail character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.collections;
       public         heap    postgres    false            ?            1259    27306 #   collections_child_collections_links    TABLE     v   CREATE TABLE public.collections_child_collections_links (
    collection_id integer,
    inv_collection_id integer
);
 7   DROP TABLE public.collections_child_collections_links;
       public         heap    postgres    false            ?            1259    27309    collections_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.collections_id_seq;
       public          postgres    false    220                       0    0    collections_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;
          public          postgres    false    222            ?            1259    27310 $   collections_parent_collections_links    TABLE     w   CREATE TABLE public.collections_parent_collections_links (
    collection_id integer,
    inv_collection_id integer
);
 8   DROP TABLE public.collections_parent_collections_links;
       public         heap    postgres    false            ?            1259    27313    comments    TABLE     Z  CREATE TABLE public.comments (
    id integer NOT NULL,
    author character varying(255),
    text text,
    date timestamp(6) without time zone,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.comments;
       public         heap    postgres    false            ?            1259    27318    comments_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comments_id_seq;
       public          postgres    false    224                       0    0    comments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;
          public          postgres    false    225            ?            1259    27319    comments_picture_links    TABLE     _   CREATE TABLE public.comments_picture_links (
    comment_id integer,
    picture_id integer
);
 *   DROP TABLE public.comments_picture_links;
       public         heap    postgres    false            ?            1259    27322    components_common_synonyms    TABLE     m   CREATE TABLE public.components_common_synonyms (
    id integer NOT NULL,
    name character varying(255)
);
 .   DROP TABLE public.components_common_synonyms;
       public         heap    postgres    false            ?            1259    27325 !   components_common_synonyms_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.components_common_synonyms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.components_common_synonyms_id_seq;
       public          postgres    false    227                       0    0 !   components_common_synonyms_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.components_common_synonyms_id_seq OWNED BY public.components_common_synonyms.id;
          public          postgres    false    228            ?            1259    27326    components_location_coordinates    TABLE     ?   CREATE TABLE public.components_location_coordinates (
    id integer NOT NULL,
    latitude double precision,
    longitude double precision
);
 3   DROP TABLE public.components_location_coordinates;
       public         heap    postgres    false            ?            1259    27329 &   components_location_coordinates_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.components_location_coordinates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.components_location_coordinates_id_seq;
       public          postgres    false    229                       0    0 &   components_location_coordinates_id_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.components_location_coordinates_id_seq OWNED BY public.components_location_coordinates.id;
          public          postgres    false    230            ?            1259    27330    descriptions    TABLE       CREATE TABLE public.descriptions (
    id integer NOT NULL,
    text text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
     DROP TABLE public.descriptions;
       public         heap    postgres    false            ?            1259    27335    descriptions_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.descriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.descriptions_id_seq;
       public          postgres    false    231                       0    0    descriptions_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.descriptions_id_seq OWNED BY public.descriptions.id;
          public          postgres    false    232            ?            1259    27336    files    TABLE     {  CREATE TABLE public.files (
    id integer NOT NULL,
    name character varying(255),
    alternative_text character varying(255),
    caption character varying(255),
    width integer,
    height integer,
    formats jsonb,
    hash character varying(255),
    ext character varying(255),
    mime character varying(255),
    size numeric(10,2),
    url character varying(255),
    preview_url character varying(255),
    provider character varying(255),
    provider_metadata jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.files;
       public         heap    postgres    false            ?            1259    27341    files_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.files_id_seq;
       public          postgres    false    233            	           0    0    files_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;
          public          postgres    false    234            ?            1259    27342    files_related_morphs    TABLE     ?   CREATE TABLE public.files_related_morphs (
    file_id integer,
    related_id integer,
    related_type character varying(255),
    field character varying(255),
    "order" integer
);
 (   DROP TABLE public.files_related_morphs;
       public         heap    postgres    false            ?            1259    27347    keyword_tags    TABLE     ?   CREATE TABLE public.keyword_tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
     DROP TABLE public.keyword_tags;
       public         heap    postgres    false            ?            1259    27350    keyword_tags_components    TABLE     ?   CREATE TABLE public.keyword_tags_components (
    id integer NOT NULL,
    entity_id integer,
    component_id integer,
    component_type character varying(255),
    field character varying(255),
    "order" integer DEFAULT 0
);
 +   DROP TABLE public.keyword_tags_components;
       public         heap    postgres    false            ?            1259    27356    keyword_tags_components_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.keyword_tags_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.keyword_tags_components_id_seq;
       public          postgres    false    237            
           0    0    keyword_tags_components_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.keyword_tags_components_id_seq OWNED BY public.keyword_tags_components.id;
          public          postgres    false    238            ?            1259    27357    keyword_tags_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.keyword_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.keyword_tags_id_seq;
       public          postgres    false    236                       0    0    keyword_tags_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.keyword_tags_id_seq OWNED BY public.keyword_tags.id;
          public          postgres    false    239            ?            1259    27358    location_tags    TABLE     ?   CREATE TABLE public.location_tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 !   DROP TABLE public.location_tags;
       public         heap    postgres    false            ?            1259    27361    location_tags_components    TABLE     ?   CREATE TABLE public.location_tags_components (
    id integer NOT NULL,
    entity_id integer,
    component_id integer,
    component_type character varying(255),
    field character varying(255),
    "order" integer DEFAULT 0
);
 ,   DROP TABLE public.location_tags_components;
       public         heap    postgres    false            ?            1259    27367    location_tags_components_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.location_tags_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.location_tags_components_id_seq;
       public          postgres    false    241                       0    0    location_tags_components_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.location_tags_components_id_seq OWNED BY public.location_tags_components.id;
          public          postgres    false    242            ?            1259    27368    location_tags_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.location_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.location_tags_id_seq;
       public          postgres    false    240                       0    0    location_tags_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.location_tags_id_seq OWNED BY public.location_tags.id;
          public          postgres    false    243            ?            1259    27369    person_tags    TABLE     ?   CREATE TABLE public.person_tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.person_tags;
       public         heap    postgres    false            ?            1259    27372    person_tags_components    TABLE     ?   CREATE TABLE public.person_tags_components (
    id integer NOT NULL,
    entity_id integer,
    component_id integer,
    component_type character varying(255),
    field character varying(255),
    "order" integer DEFAULT 0
);
 *   DROP TABLE public.person_tags_components;
       public         heap    postgres    false            ?            1259    27378    person_tags_components_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.person_tags_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.person_tags_components_id_seq;
       public          postgres    false    245                       0    0    person_tags_components_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.person_tags_components_id_seq OWNED BY public.person_tags_components.id;
          public          postgres    false    246            ?            1259    27379    person_tags_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.person_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.person_tags_id_seq;
       public          postgres    false    244                       0    0    person_tags_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.person_tags_id_seq OWNED BY public.person_tags.id;
          public          postgres    false    247            ?            1259    27380    pictures    TABLE     H  CREATE TABLE public.pictures (
    id integer NOT NULL,
    wordpress_id integer,
    archive_identifier character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.pictures;
       public         heap    postgres    false                       1259    28008    pictures_archive_tag_links    TABLE     g   CREATE TABLE public.pictures_archive_tag_links (
    picture_id integer,
    archive_tag_id integer
);
 .   DROP TABLE public.pictures_archive_tag_links;
       public         heap    postgres    false            ?            1259    27383    pictures_collections_links    TABLE     f   CREATE TABLE public.pictures_collections_links (
    picture_id integer,
    collection_id integer
);
 .   DROP TABLE public.pictures_collections_links;
       public         heap    postgres    false            ?            1259    27386    pictures_descriptions_links    TABLE     h   CREATE TABLE public.pictures_descriptions_links (
    picture_id integer,
    description_id integer
);
 /   DROP TABLE public.pictures_descriptions_links;
       public         heap    postgres    false            ?            1259    27389    pictures_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.pictures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.pictures_id_seq;
       public          postgres    false    248                       0    0    pictures_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.pictures_id_seq OWNED BY public.pictures.id;
          public          postgres    false    251            ?            1259    27390    pictures_keyword_tags_links    TABLE     h   CREATE TABLE public.pictures_keyword_tags_links (
    picture_id integer,
    keyword_tag_id integer
);
 /   DROP TABLE public.pictures_keyword_tags_links;
       public         heap    postgres    false            ?            1259    27393    pictures_location_tags_links    TABLE     j   CREATE TABLE public.pictures_location_tags_links (
    picture_id integer,
    location_tag_id integer
);
 0   DROP TABLE public.pictures_location_tags_links;
       public         heap    postgres    false            ?            1259    27396    pictures_person_tags_links    TABLE     f   CREATE TABLE public.pictures_person_tags_links (
    picture_id integer,
    person_tag_id integer
);
 .   DROP TABLE public.pictures_person_tags_links;
       public         heap    postgres    false            ?            1259    27399    pictures_time_range_tag_links    TABLE     m   CREATE TABLE public.pictures_time_range_tag_links (
    picture_id integer,
    time_range_tag_id integer
);
 1   DROP TABLE public.pictures_time_range_tag_links;
       public         heap    postgres    false                        1259    27402 $   pictures_verified_keyword_tags_links    TABLE     q   CREATE TABLE public.pictures_verified_keyword_tags_links (
    picture_id integer,
    keyword_tag_id integer
);
 8   DROP TABLE public.pictures_verified_keyword_tags_links;
       public         heap    postgres    false                       1259    27405 %   pictures_verified_location_tags_links    TABLE     s   CREATE TABLE public.pictures_verified_location_tags_links (
    picture_id integer,
    location_tag_id integer
);
 9   DROP TABLE public.pictures_verified_location_tags_links;
       public         heap    postgres    false                       1259    27408 #   pictures_verified_person_tags_links    TABLE     o   CREATE TABLE public.pictures_verified_person_tags_links (
    picture_id integer,
    person_tag_id integer
);
 7   DROP TABLE public.pictures_verified_person_tags_links;
       public         heap    postgres    false                       1259    27411 &   pictures_verified_time_range_tag_links    TABLE     v   CREATE TABLE public.pictures_verified_time_range_tag_links (
    picture_id integer,
    time_range_tag_id integer
);
 :   DROP TABLE public.pictures_verified_time_range_tag_links;
       public         heap    postgres    false                       1259    27414    strapi_api_tokens    TABLE     h  CREATE TABLE public.strapi_api_tokens (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    type character varying(255),
    access_key character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 %   DROP TABLE public.strapi_api_tokens;
       public         heap    postgres    false                       1259    27419    strapi_api_tokens_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.strapi_api_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.strapi_api_tokens_id_seq;
       public          postgres    false    260                       0    0    strapi_api_tokens_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.strapi_api_tokens_id_seq OWNED BY public.strapi_api_tokens.id;
          public          postgres    false    261                       1259    27420    strapi_core_store_settings    TABLE     ?   CREATE TABLE public.strapi_core_store_settings (
    id integer NOT NULL,
    key character varying(255),
    value text,
    type character varying(255),
    environment character varying(255),
    tag character varying(255)
);
 .   DROP TABLE public.strapi_core_store_settings;
       public         heap    postgres    false                       1259    27425 !   strapi_core_store_settings_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.strapi_core_store_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.strapi_core_store_settings_id_seq;
       public          postgres    false    262                       0    0 !   strapi_core_store_settings_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.strapi_core_store_settings_id_seq OWNED BY public.strapi_core_store_settings.id;
          public          postgres    false    263                       1259    27426    strapi_database_schema    TABLE     ?   CREATE TABLE public.strapi_database_schema (
    id integer NOT NULL,
    schema json,
    "time" timestamp without time zone,
    hash character varying(255)
);
 *   DROP TABLE public.strapi_database_schema;
       public         heap    postgres    false            	           1259    27431    strapi_database_schema_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.strapi_database_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.strapi_database_schema_id_seq;
       public          postgres    false    264                       0    0    strapi_database_schema_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.strapi_database_schema_id_seq OWNED BY public.strapi_database_schema.id;
          public          postgres    false    265            
           1259    27432    strapi_migrations    TABLE     ?   CREATE TABLE public.strapi_migrations (
    id integer NOT NULL,
    name character varying(255),
    "time" timestamp without time zone
);
 %   DROP TABLE public.strapi_migrations;
       public         heap    postgres    false                       1259    27435    strapi_migrations_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.strapi_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.strapi_migrations_id_seq;
       public          postgres    false    266                       0    0    strapi_migrations_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.strapi_migrations_id_seq OWNED BY public.strapi_migrations.id;
          public          postgres    false    267                       1259    27436    strapi_webhooks    TABLE     ?   CREATE TABLE public.strapi_webhooks (
    id integer NOT NULL,
    name character varying(255),
    url text,
    headers jsonb,
    events jsonb,
    enabled boolean
);
 #   DROP TABLE public.strapi_webhooks;
       public         heap    postgres    false                       1259    27441    strapi_webhooks_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.strapi_webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.strapi_webhooks_id_seq;
       public          postgres    false    268                       0    0    strapi_webhooks_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.strapi_webhooks_id_seq OWNED BY public.strapi_webhooks.id;
          public          postgres    false    269                       1259    27442    time_range_tags    TABLE     )  CREATE TABLE public.time_range_tags (
    id integer NOT NULL,
    start timestamp(6) without time zone,
    "end" timestamp(6) without time zone,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 #   DROP TABLE public.time_range_tags;
       public         heap    postgres    false                       1259    27445    time_range_tags_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.time_range_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.time_range_tags_id_seq;
       public          postgres    false    270                       0    0    time_range_tags_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.time_range_tags_id_seq OWNED BY public.time_range_tags.id;
          public          postgres    false    271                       1259    27446    up_permissions    TABLE     ?   CREATE TABLE public.up_permissions (
    id integer NOT NULL,
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 "   DROP TABLE public.up_permissions;
       public         heap    postgres    false                       1259    27449    up_permissions_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.up_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.up_permissions_id_seq;
       public          postgres    false    272                       0    0    up_permissions_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.up_permissions_id_seq OWNED BY public.up_permissions.id;
          public          postgres    false    273                       1259    27450    up_permissions_role_links    TABLE     b   CREATE TABLE public.up_permissions_role_links (
    permission_id integer,
    role_id integer
);
 -   DROP TABLE public.up_permissions_role_links;
       public         heap    postgres    false                       1259    27453    up_roles    TABLE     8  CREATE TABLE public.up_roles (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    type character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.up_roles;
       public         heap    postgres    false                       1259    27458    up_roles_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.up_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.up_roles_id_seq;
       public          postgres    false    275                       0    0    up_roles_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.up_roles_id_seq OWNED BY public.up_roles.id;
          public          postgres    false    276                       1259    27459    up_users    TABLE     ?  CREATE TABLE public.up_users (
    id integer NOT NULL,
    username character varying(255),
    email character varying(255),
    provider character varying(255),
    password character varying(255),
    reset_password_token character varying(255),
    confirmation_token character varying(255),
    confirmed boolean,
    blocked boolean,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.up_users;
       public         heap    postgres    false                       1259    27464    up_users_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.up_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.up_users_id_seq;
       public          postgres    false    277                       0    0    up_users_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.up_users_id_seq OWNED BY public.up_users.id;
          public          postgres    false    278                       1259    27465    up_users_role_links    TABLE     V   CREATE TABLE public.up_users_role_links (
    user_id integer,
    role_id integer
);
 '   DROP TABLE public.up_users_role_links;
       public         heap    postgres    false            .           2604    27468    admin_permissions id    DEFAULT     |   ALTER TABLE ONLY public.admin_permissions ALTER COLUMN id SET DEFAULT nextval('public.admin_permissions_id_seq'::regclass);
 C   ALTER TABLE public.admin_permissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    209            /           2604    27469    admin_roles id    DEFAULT     p   ALTER TABLE ONLY public.admin_roles ALTER COLUMN id SET DEFAULT nextval('public.admin_roles_id_seq'::regclass);
 =   ALTER TABLE public.admin_roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    212            0           2604    27470    admin_users id    DEFAULT     p   ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);
 =   ALTER TABLE public.admin_users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            K           2604    28003    archive_tags id    DEFAULT     r   ALTER TABLE ONLY public.archive_tags ALTER COLUMN id SET DEFAULT nextval('public.archive_tags_id_seq'::regclass);
 >   ALTER TABLE public.archive_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    281    280    281            1           2604    27471    browse_root_collections id    DEFAULT     ?   ALTER TABLE ONLY public.browse_root_collections ALTER COLUMN id SET DEFAULT nextval('public.browse_root_collections_id_seq'::regclass);
 I   ALTER TABLE public.browse_root_collections ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    217            2           2604    27472    collections id    DEFAULT     p   ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);
 =   ALTER TABLE public.collections ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    220            3           2604    27473    comments id    DEFAULT     j   ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);
 :   ALTER TABLE public.comments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224            4           2604    27474    components_common_synonyms id    DEFAULT     ?   ALTER TABLE ONLY public.components_common_synonyms ALTER COLUMN id SET DEFAULT nextval('public.components_common_synonyms_id_seq'::regclass);
 L   ALTER TABLE public.components_common_synonyms ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    227            5           2604    27475 "   components_location_coordinates id    DEFAULT     ?   ALTER TABLE ONLY public.components_location_coordinates ALTER COLUMN id SET DEFAULT nextval('public.components_location_coordinates_id_seq'::regclass);
 Q   ALTER TABLE public.components_location_coordinates ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229            6           2604    27476    descriptions id    DEFAULT     r   ALTER TABLE ONLY public.descriptions ALTER COLUMN id SET DEFAULT nextval('public.descriptions_id_seq'::regclass);
 >   ALTER TABLE public.descriptions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    231            7           2604    27477    files id    DEFAULT     d   ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);
 7   ALTER TABLE public.files ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    233            8           2604    27478    keyword_tags id    DEFAULT     r   ALTER TABLE ONLY public.keyword_tags ALTER COLUMN id SET DEFAULT nextval('public.keyword_tags_id_seq'::regclass);
 >   ALTER TABLE public.keyword_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    236            :           2604    27479    keyword_tags_components id    DEFAULT     ?   ALTER TABLE ONLY public.keyword_tags_components ALTER COLUMN id SET DEFAULT nextval('public.keyword_tags_components_id_seq'::regclass);
 I   ALTER TABLE public.keyword_tags_components ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    238    237            ;           2604    27480    location_tags id    DEFAULT     t   ALTER TABLE ONLY public.location_tags ALTER COLUMN id SET DEFAULT nextval('public.location_tags_id_seq'::regclass);
 ?   ALTER TABLE public.location_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    243    240            =           2604    27481    location_tags_components id    DEFAULT     ?   ALTER TABLE ONLY public.location_tags_components ALTER COLUMN id SET DEFAULT nextval('public.location_tags_components_id_seq'::regclass);
 J   ALTER TABLE public.location_tags_components ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    242    241            >           2604    27482    person_tags id    DEFAULT     p   ALTER TABLE ONLY public.person_tags ALTER COLUMN id SET DEFAULT nextval('public.person_tags_id_seq'::regclass);
 =   ALTER TABLE public.person_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    247    244            @           2604    27483    person_tags_components id    DEFAULT     ?   ALTER TABLE ONLY public.person_tags_components ALTER COLUMN id SET DEFAULT nextval('public.person_tags_components_id_seq'::regclass);
 H   ALTER TABLE public.person_tags_components ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    246    245            A           2604    27484    pictures id    DEFAULT     j   ALTER TABLE ONLY public.pictures ALTER COLUMN id SET DEFAULT nextval('public.pictures_id_seq'::regclass);
 :   ALTER TABLE public.pictures ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    251    248            B           2604    27485    strapi_api_tokens id    DEFAULT     |   ALTER TABLE ONLY public.strapi_api_tokens ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_tokens_id_seq'::regclass);
 C   ALTER TABLE public.strapi_api_tokens ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    261    260            C           2604    27486    strapi_core_store_settings id    DEFAULT     ?   ALTER TABLE ONLY public.strapi_core_store_settings ALTER COLUMN id SET DEFAULT nextval('public.strapi_core_store_settings_id_seq'::regclass);
 L   ALTER TABLE public.strapi_core_store_settings ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    263    262            D           2604    27487    strapi_database_schema id    DEFAULT     ?   ALTER TABLE ONLY public.strapi_database_schema ALTER COLUMN id SET DEFAULT nextval('public.strapi_database_schema_id_seq'::regclass);
 H   ALTER TABLE public.strapi_database_schema ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    265    264            E           2604    27488    strapi_migrations id    DEFAULT     |   ALTER TABLE ONLY public.strapi_migrations ALTER COLUMN id SET DEFAULT nextval('public.strapi_migrations_id_seq'::regclass);
 C   ALTER TABLE public.strapi_migrations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    267    266            F           2604    27489    strapi_webhooks id    DEFAULT     x   ALTER TABLE ONLY public.strapi_webhooks ALTER COLUMN id SET DEFAULT nextval('public.strapi_webhooks_id_seq'::regclass);
 A   ALTER TABLE public.strapi_webhooks ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    269    268            G           2604    27490    time_range_tags id    DEFAULT     x   ALTER TABLE ONLY public.time_range_tags ALTER COLUMN id SET DEFAULT nextval('public.time_range_tags_id_seq'::regclass);
 A   ALTER TABLE public.time_range_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    271    270            H           2604    27491    up_permissions id    DEFAULT     v   ALTER TABLE ONLY public.up_permissions ALTER COLUMN id SET DEFAULT nextval('public.up_permissions_id_seq'::regclass);
 @   ALTER TABLE public.up_permissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    273    272            I           2604    27492    up_roles id    DEFAULT     j   ALTER TABLE ONLY public.up_roles ALTER COLUMN id SET DEFAULT nextval('public.up_roles_id_seq'::regclass);
 :   ALTER TABLE public.up_roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    276    275            J           2604    27493    up_users id    DEFAULT     j   ALTER TABLE ONLY public.up_users ALTER COLUMN id SET DEFAULT nextval('public.up_users_id_seq'::regclass);
 :   ALTER TABLE public.up_users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    278    277            ?          0    27270    admin_permissions 
   TABLE DATA           ?   COPY public.admin_permissions (id, action, subject, properties, conditions, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    209   S      ?          0    27276    admin_permissions_role_links 
   TABLE DATA           N   COPY public.admin_permissions_role_links (permission_id, role_id) FROM stdin;
    public          postgres    false    211   ?       ?          0    27279    admin_roles 
   TABLE DATA           x   COPY public.admin_roles (id, name, code, description, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    212   "      ?          0    27285    admin_users 
   TABLE DATA           ?   COPY public.admin_users (id, firstname, lastname, username, email, password, reset_password_token, registration_token, is_active, blocked, prefered_language, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    214   ?"      ?          0    27291    admin_users_roles_links 
   TABLE DATA           C   COPY public.admin_users_roles_links (user_id, role_id) FROM stdin;
    public          postgres    false    216   ?#      ?          0    28000    archive_tags 
   TABLE DATA           f   COPY public.archive_tags (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    281   ?#      ?          0    27294    browse_root_collections 
   TABLE DATA           y   COPY public.browse_root_collections (id, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    217   ,$      ?          0    27297 %   browse_root_collections_current_links 
   TABLE DATA           i   COPY public.browse_root_collections_current_links (browse_root_collection_id, collection_id) FROM stdin;
    public          postgres    false    218   w$      ?          0    27301    collections 
   TABLE DATA           ?   COPY public.collections (id, name, description, thumbnail, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    220   ?$      ?          0    27306 #   collections_child_collections_links 
   TABLE DATA           _   COPY public.collections_child_collections_links (collection_id, inv_collection_id) FROM stdin;
    public          postgres    false    221   v%      ?          0    27310 $   collections_parent_collections_links 
   TABLE DATA           `   COPY public.collections_parent_collections_links (collection_id, inv_collection_id) FROM stdin;
    public          postgres    false    223   ?%      ?          0    27313    comments 
   TABLE DATA           ~   COPY public.comments (id, author, text, date, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    224   ?%      ?          0    27319    comments_picture_links 
   TABLE DATA           H   COPY public.comments_picture_links (comment_id, picture_id) FROM stdin;
    public          postgres    false    226   ?&      ?          0    27322    components_common_synonyms 
   TABLE DATA           >   COPY public.components_common_synonyms (id, name) FROM stdin;
    public          postgres    false    227   '      ?          0    27326    components_location_coordinates 
   TABLE DATA           R   COPY public.components_location_coordinates (id, latitude, longitude) FROM stdin;
    public          postgres    false    229   ?'      ?          0    27330    descriptions 
   TABLE DATA           t   COPY public.descriptions (id, text, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    231   ?'      ?          0    27336    files 
   TABLE DATA           ?   COPY public.files (id, name, alternative_text, caption, width, height, formats, hash, ext, mime, size, url, preview_url, provider, provider_metadata, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    233   ?(      ?          0    27342    files_related_morphs 
   TABLE DATA           a   COPY public.files_related_morphs (file_id, related_id, related_type, field, "order") FROM stdin;
    public          postgres    false    235   ?+      ?          0    27347    keyword_tags 
   TABLE DATA           f   COPY public.keyword_tags (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    236   ,      ?          0    27350    keyword_tags_components 
   TABLE DATA           n   COPY public.keyword_tags_components (id, entity_id, component_id, component_type, field, "order") FROM stdin;
    public          postgres    false    237   ?,      ?          0    27358    location_tags 
   TABLE DATA           g   COPY public.location_tags (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    240   ?,      ?          0    27361    location_tags_components 
   TABLE DATA           o   COPY public.location_tags_components (id, entity_id, component_id, component_type, field, "order") FROM stdin;
    public          postgres    false    241   C-      ?          0    27369    person_tags 
   TABLE DATA           e   COPY public.person_tags (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    244   ?-      ?          0    27372    person_tags_components 
   TABLE DATA           m   COPY public.person_tags_components (id, entity_id, component_id, component_type, field, "order") FROM stdin;
    public          postgres    false    245   ,.      ?          0    27380    pictures 
   TABLE DATA           ?   COPY public.pictures (id, wordpress_id, archive_identifier, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    248   j.      ?          0    28008    pictures_archive_tag_links 
   TABLE DATA           P   COPY public.pictures_archive_tag_links (picture_id, archive_tag_id) FROM stdin;
    public          postgres    false    282   /      ?          0    27383    pictures_collections_links 
   TABLE DATA           O   COPY public.pictures_collections_links (picture_id, collection_id) FROM stdin;
    public          postgres    false    249   0/      ?          0    27386    pictures_descriptions_links 
   TABLE DATA           Q   COPY public.pictures_descriptions_links (picture_id, description_id) FROM stdin;
    public          postgres    false    250   `/      ?          0    27390    pictures_keyword_tags_links 
   TABLE DATA           Q   COPY public.pictures_keyword_tags_links (picture_id, keyword_tag_id) FROM stdin;
    public          postgres    false    252   ?/      ?          0    27393    pictures_location_tags_links 
   TABLE DATA           S   COPY public.pictures_location_tags_links (picture_id, location_tag_id) FROM stdin;
    public          postgres    false    253   ?/      ?          0    27396    pictures_person_tags_links 
   TABLE DATA           O   COPY public.pictures_person_tags_links (picture_id, person_tag_id) FROM stdin;
    public          postgres    false    254   ?/      ?          0    27399    pictures_time_range_tag_links 
   TABLE DATA           V   COPY public.pictures_time_range_tag_links (picture_id, time_range_tag_id) FROM stdin;
    public          postgres    false    255   ?/      ?          0    27402 $   pictures_verified_keyword_tags_links 
   TABLE DATA           Z   COPY public.pictures_verified_keyword_tags_links (picture_id, keyword_tag_id) FROM stdin;
    public          postgres    false    256   0      ?          0    27405 %   pictures_verified_location_tags_links 
   TABLE DATA           \   COPY public.pictures_verified_location_tags_links (picture_id, location_tag_id) FROM stdin;
    public          postgres    false    257   50      ?          0    27408 #   pictures_verified_person_tags_links 
   TABLE DATA           X   COPY public.pictures_verified_person_tags_links (picture_id, person_tag_id) FROM stdin;
    public          postgres    false    258   i0      ?          0    27411 &   pictures_verified_time_range_tag_links 
   TABLE DATA           _   COPY public.pictures_verified_time_range_tag_links (picture_id, time_range_tag_id) FROM stdin;
    public          postgres    false    259   ?0      ?          0    27414    strapi_api_tokens 
   TABLE DATA           ?   COPY public.strapi_api_tokens (id, name, description, type, access_key, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    260   ?0      ?          0    27420    strapi_core_store_settings 
   TABLE DATA           \   COPY public.strapi_core_store_settings (id, key, value, type, environment, tag) FROM stdin;
    public          postgres    false    262   ?0      ?          0    27426    strapi_database_schema 
   TABLE DATA           J   COPY public.strapi_database_schema (id, schema, "time", hash) FROM stdin;
    public          postgres    false    264   +J      ?          0    27432    strapi_migrations 
   TABLE DATA           =   COPY public.strapi_migrations (id, name, "time") FROM stdin;
    public          postgres    false    266   ?S      ?          0    27436    strapi_webhooks 
   TABLE DATA           R   COPY public.strapi_webhooks (id, name, url, headers, events, enabled) FROM stdin;
    public          postgres    false    268   ?S      ?          0    27442    time_range_tags 
   TABLE DATA           q   COPY public.time_range_tags (id, start, "end", created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    270   ?S      ?          0    27446    up_permissions 
   TABLE DATA           j   COPY public.up_permissions (id, action, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    272   QT      ?          0    27450    up_permissions_role_links 
   TABLE DATA           K   COPY public.up_permissions_role_links (permission_id, role_id) FROM stdin;
    public          postgres    false    274   2W      ?          0    27453    up_roles 
   TABLE DATA           u   COPY public.up_roles (id, name, description, type, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    275   ?W      ?          0    27459    up_users 
   TABLE DATA           ?   COPY public.up_users (id, username, email, provider, password, reset_password_token, confirmation_token, confirmed, blocked, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    277   ?X      ?          0    27465    up_users_role_links 
   TABLE DATA           ?   COPY public.up_users_role_links (user_id, role_id) FROM stdin;
    public          postgres    false    279   8Y                 0    0    admin_permissions_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.admin_permissions_id_seq', 196, true);
          public          postgres    false    210                       0    0    admin_roles_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_roles_id_seq', 3, true);
          public          postgres    false    213                       0    0    admin_users_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);
          public          postgres    false    215                       0    0    archive_tags_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.archive_tags_id_seq', 1, true);
          public          postgres    false    280                       0    0    browse_root_collections_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.browse_root_collections_id_seq', 1, true);
          public          postgres    false    219                       0    0    collections_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.collections_id_seq', 5, true);
          public          postgres    false    222                        0    0    comments_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.comments_id_seq', 1, true);
          public          postgres    false    225            !           0    0 !   components_common_synonyms_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.components_common_synonyms_id_seq', 10, true);
          public          postgres    false    228            "           0    0 &   components_location_coordinates_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.components_location_coordinates_id_seq', 2, true);
          public          postgres    false    230            #           0    0    descriptions_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.descriptions_id_seq', 2, true);
          public          postgres    false    232            $           0    0    files_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.files_id_seq', 5, true);
          public          postgres    false    234            %           0    0    keyword_tags_components_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.keyword_tags_components_id_seq', 4, true);
          public          postgres    false    238            &           0    0    keyword_tags_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.keyword_tags_id_seq', 3, true);
          public          postgres    false    239            '           0    0    location_tags_components_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.location_tags_components_id_seq', 8, true);
          public          postgres    false    242            (           0    0    location_tags_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.location_tags_id_seq', 2, true);
          public          postgres    false    243            )           0    0    person_tags_components_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.person_tags_components_id_seq', 2, true);
          public          postgres    false    246            *           0    0    person_tags_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.person_tags_id_seq', 2, true);
          public          postgres    false    247            +           0    0    pictures_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.pictures_id_seq', 5, true);
          public          postgres    false    251            ,           0    0    strapi_api_tokens_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.strapi_api_tokens_id_seq', 1, false);
          public          postgres    false    261            -           0    0 !   strapi_core_store_settings_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.strapi_core_store_settings_id_seq', 26, true);
          public          postgres    false    263            .           0    0    strapi_database_schema_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.strapi_database_schema_id_seq', 3, true);
          public          postgres    false    265            /           0    0    strapi_migrations_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.strapi_migrations_id_seq', 1, false);
          public          postgres    false    267            0           0    0    strapi_webhooks_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.strapi_webhooks_id_seq', 1, false);
          public          postgres    false    269            1           0    0    time_range_tags_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.time_range_tags_id_seq', 2, true);
          public          postgres    false    271            2           0    0    up_permissions_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.up_permissions_id_seq', 86, true);
          public          postgres    false    273            3           0    0    up_roles_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.up_roles_id_seq', 3, true);
          public          postgres    false    276            4           0    0    up_users_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.up_users_id_seq', 1, true);
          public          postgres    false    278            N           2606    27497 (   admin_permissions admin_permissions_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.admin_permissions DROP CONSTRAINT admin_permissions_pkey;
       public            postgres    false    209            T           2606    27499    admin_roles admin_roles_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.admin_roles DROP CONSTRAINT admin_roles_pkey;
       public            postgres    false    212            X           2606    27501    admin_users admin_users_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.admin_users DROP CONSTRAINT admin_users_pkey;
       public            postgres    false    214            ?           2606    28005    archive_tags archive_tags_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.archive_tags
    ADD CONSTRAINT archive_tags_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.archive_tags DROP CONSTRAINT archive_tags_pkey;
       public            postgres    false    281            ^           2606    27503 4   browse_root_collections browse_root_collections_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.browse_root_collections
    ADD CONSTRAINT browse_root_collections_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.browse_root_collections DROP CONSTRAINT browse_root_collections_pkey;
       public            postgres    false    217            d           2606    27505    collections collections_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.collections DROP CONSTRAINT collections_pkey;
       public            postgres    false    220            l           2606    27507    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    224            q           2606    27509 :   components_common_synonyms components_common_synonyms_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.components_common_synonyms
    ADD CONSTRAINT components_common_synonyms_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.components_common_synonyms DROP CONSTRAINT components_common_synonyms_pkey;
       public            postgres    false    227            s           2606    27511 D   components_location_coordinates components_location_coordinates_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public.components_location_coordinates
    ADD CONSTRAINT components_location_coordinates_pkey PRIMARY KEY (id);
 n   ALTER TABLE ONLY public.components_location_coordinates DROP CONSTRAINT components_location_coordinates_pkey;
       public            postgres    false    229            v           2606    27513    descriptions descriptions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT descriptions_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.descriptions DROP CONSTRAINT descriptions_pkey;
       public            postgres    false    231            z           2606    27515    files files_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.files DROP CONSTRAINT files_pkey;
       public            postgres    false    233            ?           2606    27517 4   keyword_tags_components keyword_tags_components_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.keyword_tags_components
    ADD CONSTRAINT keyword_tags_components_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.keyword_tags_components DROP CONSTRAINT keyword_tags_components_pkey;
       public            postgres    false    237                       2606    27519    keyword_tags keyword_tags_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.keyword_tags
    ADD CONSTRAINT keyword_tags_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.keyword_tags DROP CONSTRAINT keyword_tags_pkey;
       public            postgres    false    236            ?           2606    27521 6   location_tags_components location_tags_components_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.location_tags_components
    ADD CONSTRAINT location_tags_components_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.location_tags_components DROP CONSTRAINT location_tags_components_pkey;
       public            postgres    false    241            ?           2606    27523     location_tags location_tags_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.location_tags
    ADD CONSTRAINT location_tags_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.location_tags DROP CONSTRAINT location_tags_pkey;
       public            postgres    false    240            ?           2606    27525 2   person_tags_components person_tags_components_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.person_tags_components
    ADD CONSTRAINT person_tags_components_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.person_tags_components DROP CONSTRAINT person_tags_components_pkey;
       public            postgres    false    245            ?           2606    27527    person_tags person_tags_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.person_tags
    ADD CONSTRAINT person_tags_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.person_tags DROP CONSTRAINT person_tags_pkey;
       public            postgres    false    244            ?           2606    27529    pictures pictures_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.pictures DROP CONSTRAINT pictures_pkey;
       public            postgres    false    248            ?           2606    27531 (   strapi_api_tokens strapi_api_tokens_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.strapi_api_tokens DROP CONSTRAINT strapi_api_tokens_pkey;
       public            postgres    false    260            ?           2606    27533 :   strapi_core_store_settings strapi_core_store_settings_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.strapi_core_store_settings
    ADD CONSTRAINT strapi_core_store_settings_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.strapi_core_store_settings DROP CONSTRAINT strapi_core_store_settings_pkey;
       public            postgres    false    262            ?           2606    27535 2   strapi_database_schema strapi_database_schema_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.strapi_database_schema
    ADD CONSTRAINT strapi_database_schema_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.strapi_database_schema DROP CONSTRAINT strapi_database_schema_pkey;
       public            postgres    false    264            ?           2606    27537 (   strapi_migrations strapi_migrations_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.strapi_migrations
    ADD CONSTRAINT strapi_migrations_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.strapi_migrations DROP CONSTRAINT strapi_migrations_pkey;
       public            postgres    false    266            ?           2606    27539 $   strapi_webhooks strapi_webhooks_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.strapi_webhooks
    ADD CONSTRAINT strapi_webhooks_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.strapi_webhooks DROP CONSTRAINT strapi_webhooks_pkey;
       public            postgres    false    268            ?           2606    27541 $   time_range_tags time_range_tags_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.time_range_tags
    ADD CONSTRAINT time_range_tags_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.time_range_tags DROP CONSTRAINT time_range_tags_pkey;
       public            postgres    false    270            ?           2606    27543 "   up_permissions up_permissions_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.up_permissions DROP CONSTRAINT up_permissions_pkey;
       public            postgres    false    272            ?           2606    27545    up_roles up_roles_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.up_roles DROP CONSTRAINT up_roles_pkey;
       public            postgres    false    275            ?           2606    27547    up_users up_users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.up_users DROP CONSTRAINT up_users_pkey;
       public            postgres    false    277            L           1259    27548 "   admin_permissions_created_by_id_fk    INDEX     i   CREATE INDEX admin_permissions_created_by_id_fk ON public.admin_permissions USING btree (created_by_id);
 6   DROP INDEX public.admin_permissions_created_by_id_fk;
       public            postgres    false    209            P           1259    27549    admin_permissions_role_links_fk    INDEX     q   CREATE INDEX admin_permissions_role_links_fk ON public.admin_permissions_role_links USING btree (permission_id);
 3   DROP INDEX public.admin_permissions_role_links_fk;
       public            postgres    false    211            Q           1259    27550 #   admin_permissions_role_links_inv_fk    INDEX     o   CREATE INDEX admin_permissions_role_links_inv_fk ON public.admin_permissions_role_links USING btree (role_id);
 7   DROP INDEX public.admin_permissions_role_links_inv_fk;
       public            postgres    false    211            O           1259    27551 "   admin_permissions_updated_by_id_fk    INDEX     i   CREATE INDEX admin_permissions_updated_by_id_fk ON public.admin_permissions USING btree (updated_by_id);
 6   DROP INDEX public.admin_permissions_updated_by_id_fk;
       public            postgres    false    209            R           1259    27552    admin_roles_created_by_id_fk    INDEX     ]   CREATE INDEX admin_roles_created_by_id_fk ON public.admin_roles USING btree (created_by_id);
 0   DROP INDEX public.admin_roles_created_by_id_fk;
       public            postgres    false    212            U           1259    27553    admin_roles_updated_by_id_fk    INDEX     ]   CREATE INDEX admin_roles_updated_by_id_fk ON public.admin_roles USING btree (updated_by_id);
 0   DROP INDEX public.admin_roles_updated_by_id_fk;
       public            postgres    false    212            V           1259    27554    admin_users_created_by_id_fk    INDEX     ]   CREATE INDEX admin_users_created_by_id_fk ON public.admin_users USING btree (created_by_id);
 0   DROP INDEX public.admin_users_created_by_id_fk;
       public            postgres    false    214            Z           1259    27555    admin_users_roles_links_fk    INDEX     a   CREATE INDEX admin_users_roles_links_fk ON public.admin_users_roles_links USING btree (user_id);
 .   DROP INDEX public.admin_users_roles_links_fk;
       public            postgres    false    216            [           1259    27556    admin_users_roles_links_inv_fk    INDEX     e   CREATE INDEX admin_users_roles_links_inv_fk ON public.admin_users_roles_links USING btree (role_id);
 2   DROP INDEX public.admin_users_roles_links_inv_fk;
       public            postgres    false    216            Y           1259    27557    admin_users_updated_by_id_fk    INDEX     ]   CREATE INDEX admin_users_updated_by_id_fk ON public.admin_users USING btree (updated_by_id);
 0   DROP INDEX public.admin_users_updated_by_id_fk;
       public            postgres    false    214            ?           1259    28006    archive_tags_created_by_id_fk    INDEX     _   CREATE INDEX archive_tags_created_by_id_fk ON public.archive_tags USING btree (created_by_id);
 1   DROP INDEX public.archive_tags_created_by_id_fk;
       public            postgres    false    281            ?           1259    28007    archive_tags_updated_by_id_fk    INDEX     _   CREATE INDEX archive_tags_updated_by_id_fk ON public.archive_tags USING btree (updated_by_id);
 1   DROP INDEX public.archive_tags_updated_by_id_fk;
       public            postgres    false    281            \           1259    27558 (   browse_root_collections_created_by_id_fk    INDEX     u   CREATE INDEX browse_root_collections_created_by_id_fk ON public.browse_root_collections USING btree (created_by_id);
 <   DROP INDEX public.browse_root_collections_created_by_id_fk;
       public            postgres    false    217            `           1259    27559 (   browse_root_collections_current_links_fk    INDEX     ?   CREATE INDEX browse_root_collections_current_links_fk ON public.browse_root_collections_current_links USING btree (browse_root_collection_id);
 <   DROP INDEX public.browse_root_collections_current_links_fk;
       public            postgres    false    218            a           1259    27560 ,   browse_root_collections_current_links_inv_fk    INDEX     ?   CREATE INDEX browse_root_collections_current_links_inv_fk ON public.browse_root_collections_current_links USING btree (collection_id);
 @   DROP INDEX public.browse_root_collections_current_links_inv_fk;
       public            postgres    false    218            _           1259    27561 (   browse_root_collections_updated_by_id_fk    INDEX     u   CREATE INDEX browse_root_collections_updated_by_id_fk ON public.browse_root_collections USING btree (updated_by_id);
 <   DROP INDEX public.browse_root_collections_updated_by_id_fk;
       public            postgres    false    217            f           1259    27562 &   collections_child_collections_links_fk    INDEX        CREATE INDEX collections_child_collections_links_fk ON public.collections_child_collections_links USING btree (collection_id);
 :   DROP INDEX public.collections_child_collections_links_fk;
       public            postgres    false    221            g           1259    27563 *   collections_child_collections_links_inv_fk    INDEX     ?   CREATE INDEX collections_child_collections_links_inv_fk ON public.collections_child_collections_links USING btree (inv_collection_id);
 >   DROP INDEX public.collections_child_collections_links_inv_fk;
       public            postgres    false    221            b           1259    27564    collections_created_by_id_fk    INDEX     ]   CREATE INDEX collections_created_by_id_fk ON public.collections USING btree (created_by_id);
 0   DROP INDEX public.collections_created_by_id_fk;
       public            postgres    false    220            h           1259    27565 '   collections_parent_collections_links_fk    INDEX     ?   CREATE INDEX collections_parent_collections_links_fk ON public.collections_parent_collections_links USING btree (collection_id);
 ;   DROP INDEX public.collections_parent_collections_links_fk;
       public            postgres    false    223            i           1259    27566 +   collections_parent_collections_links_inv_fk    INDEX     ?   CREATE INDEX collections_parent_collections_links_inv_fk ON public.collections_parent_collections_links USING btree (inv_collection_id);
 ?   DROP INDEX public.collections_parent_collections_links_inv_fk;
       public            postgres    false    223            e           1259    27567    collections_updated_by_id_fk    INDEX     ]   CREATE INDEX collections_updated_by_id_fk ON public.collections USING btree (updated_by_id);
 0   DROP INDEX public.collections_updated_by_id_fk;
       public            postgres    false    220            j           1259    27569    comments_created_by_id_fk    INDEX     W   CREATE INDEX comments_created_by_id_fk ON public.comments USING btree (created_by_id);
 -   DROP INDEX public.comments_created_by_id_fk;
       public            postgres    false    224            n           1259    27570    comments_picture_links_fk    INDEX     b   CREATE INDEX comments_picture_links_fk ON public.comments_picture_links USING btree (comment_id);
 -   DROP INDEX public.comments_picture_links_fk;
       public            postgres    false    226            o           1259    27571    comments_picture_links_inv_fk    INDEX     f   CREATE INDEX comments_picture_links_inv_fk ON public.comments_picture_links USING btree (picture_id);
 1   DROP INDEX public.comments_picture_links_inv_fk;
       public            postgres    false    226            m           1259    27572    comments_updated_by_id_fk    INDEX     W   CREATE INDEX comments_updated_by_id_fk ON public.comments USING btree (updated_by_id);
 -   DROP INDEX public.comments_updated_by_id_fk;
       public            postgres    false    224            t           1259    27573    descriptions_created_by_id_fk    INDEX     _   CREATE INDEX descriptions_created_by_id_fk ON public.descriptions USING btree (created_by_id);
 1   DROP INDEX public.descriptions_created_by_id_fk;
       public            postgres    false    231            w           1259    27574    descriptions_updated_by_id_fk    INDEX     _   CREATE INDEX descriptions_updated_by_id_fk ON public.descriptions USING btree (updated_by_id);
 1   DROP INDEX public.descriptions_updated_by_id_fk;
       public            postgres    false    231            x           1259    27575    files_created_by_id_fk    INDEX     Q   CREATE INDEX files_created_by_id_fk ON public.files USING btree (created_by_id);
 *   DROP INDEX public.files_created_by_id_fk;
       public            postgres    false    233            |           1259    27576    files_related_morphs_fk    INDEX     [   CREATE INDEX files_related_morphs_fk ON public.files_related_morphs USING btree (file_id);
 +   DROP INDEX public.files_related_morphs_fk;
       public            postgres    false    235            {           1259    27577    files_updated_by_id_fk    INDEX     Q   CREATE INDEX files_updated_by_id_fk ON public.files USING btree (updated_by_id);
 *   DROP INDEX public.files_updated_by_id_fk;
       public            postgres    false    233            ?           1259    27578 !   keyword_tags_component_type_index    INDEX     o   CREATE INDEX keyword_tags_component_type_index ON public.keyword_tags_components USING btree (component_type);
 5   DROP INDEX public.keyword_tags_component_type_index;
       public            postgres    false    237            }           1259    27579    keyword_tags_created_by_id_fk    INDEX     _   CREATE INDEX keyword_tags_created_by_id_fk ON public.keyword_tags USING btree (created_by_id);
 1   DROP INDEX public.keyword_tags_created_by_id_fk;
       public            postgres    false    236            ?           1259    27580    keyword_tags_entity_fk    INDEX     _   CREATE INDEX keyword_tags_entity_fk ON public.keyword_tags_components USING btree (entity_id);
 *   DROP INDEX public.keyword_tags_entity_fk;
       public            postgres    false    237            ?           1259    27581    keyword_tags_field_index    INDEX     ]   CREATE INDEX keyword_tags_field_index ON public.keyword_tags_components USING btree (field);
 ,   DROP INDEX public.keyword_tags_field_index;
       public            postgres    false    237            ?           1259    27582    keyword_tags_updated_by_id_fk    INDEX     _   CREATE INDEX keyword_tags_updated_by_id_fk ON public.keyword_tags USING btree (updated_by_id);
 1   DROP INDEX public.keyword_tags_updated_by_id_fk;
       public            postgres    false    236            ?           1259    27583 "   location_tags_component_type_index    INDEX     q   CREATE INDEX location_tags_component_type_index ON public.location_tags_components USING btree (component_type);
 6   DROP INDEX public.location_tags_component_type_index;
       public            postgres    false    241            ?           1259    27584    location_tags_created_by_id_fk    INDEX     a   CREATE INDEX location_tags_created_by_id_fk ON public.location_tags USING btree (created_by_id);
 2   DROP INDEX public.location_tags_created_by_id_fk;
       public            postgres    false    240            ?           1259    27585    location_tags_entity_fk    INDEX     a   CREATE INDEX location_tags_entity_fk ON public.location_tags_components USING btree (entity_id);
 +   DROP INDEX public.location_tags_entity_fk;
       public            postgres    false    241            ?           1259    27586    location_tags_field_index    INDEX     _   CREATE INDEX location_tags_field_index ON public.location_tags_components USING btree (field);
 -   DROP INDEX public.location_tags_field_index;
       public            postgres    false    241            ?           1259    27587    location_tags_updated_by_id_fk    INDEX     a   CREATE INDEX location_tags_updated_by_id_fk ON public.location_tags USING btree (updated_by_id);
 2   DROP INDEX public.location_tags_updated_by_id_fk;
       public            postgres    false    240            ?           1259    27588     person_tags_component_type_index    INDEX     m   CREATE INDEX person_tags_component_type_index ON public.person_tags_components USING btree (component_type);
 4   DROP INDEX public.person_tags_component_type_index;
       public            postgres    false    245            ?           1259    27589    person_tags_created_by_id_fk    INDEX     ]   CREATE INDEX person_tags_created_by_id_fk ON public.person_tags USING btree (created_by_id);
 0   DROP INDEX public.person_tags_created_by_id_fk;
       public            postgres    false    244            ?           1259    27590    person_tags_entity_fk    INDEX     ]   CREATE INDEX person_tags_entity_fk ON public.person_tags_components USING btree (entity_id);
 )   DROP INDEX public.person_tags_entity_fk;
       public            postgres    false    245            ?           1259    27591    person_tags_field_index    INDEX     [   CREATE INDEX person_tags_field_index ON public.person_tags_components USING btree (field);
 +   DROP INDEX public.person_tags_field_index;
       public            postgres    false    245            ?           1259    27592    person_tags_updated_by_id_fk    INDEX     ]   CREATE INDEX person_tags_updated_by_id_fk ON public.person_tags USING btree (updated_by_id);
 0   DROP INDEX public.person_tags_updated_by_id_fk;
       public            postgres    false    244            ?           1259    28011    pictures_archive_tag_links_fk    INDEX     j   CREATE INDEX pictures_archive_tag_links_fk ON public.pictures_archive_tag_links USING btree (picture_id);
 1   DROP INDEX public.pictures_archive_tag_links_fk;
       public            postgres    false    282            ?           1259    28012 !   pictures_archive_tag_links_inv_fk    INDEX     r   CREATE INDEX pictures_archive_tag_links_inv_fk ON public.pictures_archive_tag_links USING btree (archive_tag_id);
 5   DROP INDEX public.pictures_archive_tag_links_inv_fk;
       public            postgres    false    282            ?           1259    27593    pictures_collections_links_fk    INDEX     j   CREATE INDEX pictures_collections_links_fk ON public.pictures_collections_links USING btree (picture_id);
 1   DROP INDEX public.pictures_collections_links_fk;
       public            postgres    false    249            ?           1259    27594 !   pictures_collections_links_inv_fk    INDEX     q   CREATE INDEX pictures_collections_links_inv_fk ON public.pictures_collections_links USING btree (collection_id);
 5   DROP INDEX public.pictures_collections_links_inv_fk;
       public            postgres    false    249            ?           1259    27595    pictures_created_by_id_fk    INDEX     W   CREATE INDEX pictures_created_by_id_fk ON public.pictures USING btree (created_by_id);
 -   DROP INDEX public.pictures_created_by_id_fk;
       public            postgres    false    248            ?           1259    27596    pictures_descriptions_links_fk    INDEX     l   CREATE INDEX pictures_descriptions_links_fk ON public.pictures_descriptions_links USING btree (picture_id);
 2   DROP INDEX public.pictures_descriptions_links_fk;
       public            postgres    false    250            ?           1259    27597 "   pictures_descriptions_links_inv_fk    INDEX     t   CREATE INDEX pictures_descriptions_links_inv_fk ON public.pictures_descriptions_links USING btree (description_id);
 6   DROP INDEX public.pictures_descriptions_links_inv_fk;
       public            postgres    false    250            ?           1259    27598    pictures_keyword_tags_links_fk    INDEX     l   CREATE INDEX pictures_keyword_tags_links_fk ON public.pictures_keyword_tags_links USING btree (picture_id);
 2   DROP INDEX public.pictures_keyword_tags_links_fk;
       public            postgres    false    252            ?           1259    27599 "   pictures_keyword_tags_links_inv_fk    INDEX     t   CREATE INDEX pictures_keyword_tags_links_inv_fk ON public.pictures_keyword_tags_links USING btree (keyword_tag_id);
 6   DROP INDEX public.pictures_keyword_tags_links_inv_fk;
       public            postgres    false    252            ?           1259    27600    pictures_location_tags_links_fk    INDEX     n   CREATE INDEX pictures_location_tags_links_fk ON public.pictures_location_tags_links USING btree (picture_id);
 3   DROP INDEX public.pictures_location_tags_links_fk;
       public            postgres    false    253            ?           1259    27601 #   pictures_location_tags_links_inv_fk    INDEX     w   CREATE INDEX pictures_location_tags_links_inv_fk ON public.pictures_location_tags_links USING btree (location_tag_id);
 7   DROP INDEX public.pictures_location_tags_links_inv_fk;
       public            postgres    false    253            ?           1259    27602    pictures_person_tags_links_fk    INDEX     j   CREATE INDEX pictures_person_tags_links_fk ON public.pictures_person_tags_links USING btree (picture_id);
 1   DROP INDEX public.pictures_person_tags_links_fk;
       public            postgres    false    254            ?           1259    27603 !   pictures_person_tags_links_inv_fk    INDEX     q   CREATE INDEX pictures_person_tags_links_inv_fk ON public.pictures_person_tags_links USING btree (person_tag_id);
 5   DROP INDEX public.pictures_person_tags_links_inv_fk;
       public            postgres    false    254            ?           1259    27604     pictures_time_range_tag_links_fk    INDEX     p   CREATE INDEX pictures_time_range_tag_links_fk ON public.pictures_time_range_tag_links USING btree (picture_id);
 4   DROP INDEX public.pictures_time_range_tag_links_fk;
       public            postgres    false    255            ?           1259    27605 $   pictures_time_range_tag_links_inv_fk    INDEX     {   CREATE INDEX pictures_time_range_tag_links_inv_fk ON public.pictures_time_range_tag_links USING btree (time_range_tag_id);
 8   DROP INDEX public.pictures_time_range_tag_links_inv_fk;
       public            postgres    false    255            ?           1259    27606    pictures_updated_by_id_fk    INDEX     W   CREATE INDEX pictures_updated_by_id_fk ON public.pictures USING btree (updated_by_id);
 -   DROP INDEX public.pictures_updated_by_id_fk;
       public            postgres    false    248            ?           1259    27607 '   pictures_verified_keyword_tags_links_fk    INDEX     ~   CREATE INDEX pictures_verified_keyword_tags_links_fk ON public.pictures_verified_keyword_tags_links USING btree (picture_id);
 ;   DROP INDEX public.pictures_verified_keyword_tags_links_fk;
       public            postgres    false    256            ?           1259    27608 +   pictures_verified_keyword_tags_links_inv_fk    INDEX     ?   CREATE INDEX pictures_verified_keyword_tags_links_inv_fk ON public.pictures_verified_keyword_tags_links USING btree (keyword_tag_id);
 ?   DROP INDEX public.pictures_verified_keyword_tags_links_inv_fk;
       public            postgres    false    256            ?           1259    27609 (   pictures_verified_location_tags_links_fk    INDEX     ?   CREATE INDEX pictures_verified_location_tags_links_fk ON public.pictures_verified_location_tags_links USING btree (picture_id);
 <   DROP INDEX public.pictures_verified_location_tags_links_fk;
       public            postgres    false    257            ?           1259    27610 ,   pictures_verified_location_tags_links_inv_fk    INDEX     ?   CREATE INDEX pictures_verified_location_tags_links_inv_fk ON public.pictures_verified_location_tags_links USING btree (location_tag_id);
 @   DROP INDEX public.pictures_verified_location_tags_links_inv_fk;
       public            postgres    false    257            ?           1259    27611 &   pictures_verified_person_tags_links_fk    INDEX     |   CREATE INDEX pictures_verified_person_tags_links_fk ON public.pictures_verified_person_tags_links USING btree (picture_id);
 :   DROP INDEX public.pictures_verified_person_tags_links_fk;
       public            postgres    false    258            ?           1259    27612 *   pictures_verified_person_tags_links_inv_fk    INDEX     ?   CREATE INDEX pictures_verified_person_tags_links_inv_fk ON public.pictures_verified_person_tags_links USING btree (person_tag_id);
 >   DROP INDEX public.pictures_verified_person_tags_links_inv_fk;
       public            postgres    false    258            ?           1259    27613 )   pictures_verified_time_range_tag_links_fk    INDEX     ?   CREATE INDEX pictures_verified_time_range_tag_links_fk ON public.pictures_verified_time_range_tag_links USING btree (picture_id);
 =   DROP INDEX public.pictures_verified_time_range_tag_links_fk;
       public            postgres    false    259            ?           1259    27614 -   pictures_verified_time_range_tag_links_inv_fk    INDEX     ?   CREATE INDEX pictures_verified_time_range_tag_links_inv_fk ON public.pictures_verified_time_range_tag_links USING btree (time_range_tag_id);
 A   DROP INDEX public.pictures_verified_time_range_tag_links_inv_fk;
       public            postgres    false    259            ?           1259    27615 "   strapi_api_tokens_created_by_id_fk    INDEX     i   CREATE INDEX strapi_api_tokens_created_by_id_fk ON public.strapi_api_tokens USING btree (created_by_id);
 6   DROP INDEX public.strapi_api_tokens_created_by_id_fk;
       public            postgres    false    260            ?           1259    27616 "   strapi_api_tokens_updated_by_id_fk    INDEX     i   CREATE INDEX strapi_api_tokens_updated_by_id_fk ON public.strapi_api_tokens USING btree (updated_by_id);
 6   DROP INDEX public.strapi_api_tokens_updated_by_id_fk;
       public            postgres    false    260            ?           1259    27617     time_range_tags_created_by_id_fk    INDEX     e   CREATE INDEX time_range_tags_created_by_id_fk ON public.time_range_tags USING btree (created_by_id);
 4   DROP INDEX public.time_range_tags_created_by_id_fk;
       public            postgres    false    270            ?           1259    27618     time_range_tags_updated_by_id_fk    INDEX     e   CREATE INDEX time_range_tags_updated_by_id_fk ON public.time_range_tags USING btree (updated_by_id);
 4   DROP INDEX public.time_range_tags_updated_by_id_fk;
       public            postgres    false    270            ?           1259    27619    up_permissions_created_by_id_fk    INDEX     c   CREATE INDEX up_permissions_created_by_id_fk ON public.up_permissions USING btree (created_by_id);
 3   DROP INDEX public.up_permissions_created_by_id_fk;
       public            postgres    false    272            ?           1259    27620    up_permissions_role_links_fk    INDEX     k   CREATE INDEX up_permissions_role_links_fk ON public.up_permissions_role_links USING btree (permission_id);
 0   DROP INDEX public.up_permissions_role_links_fk;
       public            postgres    false    274            ?           1259    27621     up_permissions_role_links_inv_fk    INDEX     i   CREATE INDEX up_permissions_role_links_inv_fk ON public.up_permissions_role_links USING btree (role_id);
 4   DROP INDEX public.up_permissions_role_links_inv_fk;
       public            postgres    false    274            ?           1259    27622    up_permissions_updated_by_id_fk    INDEX     c   CREATE INDEX up_permissions_updated_by_id_fk ON public.up_permissions USING btree (updated_by_id);
 3   DROP INDEX public.up_permissions_updated_by_id_fk;
       public            postgres    false    272            ?           1259    27623    up_roles_created_by_id_fk    INDEX     W   CREATE INDEX up_roles_created_by_id_fk ON public.up_roles USING btree (created_by_id);
 -   DROP INDEX public.up_roles_created_by_id_fk;
       public            postgres    false    275            ?           1259    27624    up_roles_updated_by_id_fk    INDEX     W   CREATE INDEX up_roles_updated_by_id_fk ON public.up_roles USING btree (updated_by_id);
 -   DROP INDEX public.up_roles_updated_by_id_fk;
       public            postgres    false    275            ?           1259    27625    up_users_created_by_id_fk    INDEX     W   CREATE INDEX up_users_created_by_id_fk ON public.up_users USING btree (created_by_id);
 -   DROP INDEX public.up_users_created_by_id_fk;
       public            postgres    false    277            ?           1259    27626    up_users_role_links_fk    INDEX     Y   CREATE INDEX up_users_role_links_fk ON public.up_users_role_links USING btree (user_id);
 *   DROP INDEX public.up_users_role_links_fk;
       public            postgres    false    279            ?           1259    27627    up_users_role_links_inv_fk    INDEX     ]   CREATE INDEX up_users_role_links_inv_fk ON public.up_users_role_links USING btree (role_id);
 .   DROP INDEX public.up_users_role_links_inv_fk;
       public            postgres    false    279            ?           1259    27628    up_users_updated_by_id_fk    INDEX     W   CREATE INDEX up_users_updated_by_id_fk ON public.up_users USING btree (updated_by_id);
 -   DROP INDEX public.up_users_updated_by_id_fk;
       public            postgres    false    277            ?           2606    27629 4   admin_permissions admin_permissions_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.admin_permissions DROP CONSTRAINT admin_permissions_created_by_id_fk;
       public          postgres    false    3416    209    214            ?           2606    27634 <   admin_permissions_role_links admin_permissions_role_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_permissions_role_links
    ADD CONSTRAINT admin_permissions_role_links_fk FOREIGN KEY (permission_id) REFERENCES public.admin_permissions(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.admin_permissions_role_links DROP CONSTRAINT admin_permissions_role_links_fk;
       public          postgres    false    3406    211    209            ?           2606    27639 @   admin_permissions_role_links admin_permissions_role_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_permissions_role_links
    ADD CONSTRAINT admin_permissions_role_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.admin_permissions_role_links DROP CONSTRAINT admin_permissions_role_links_inv_fk;
       public          postgres    false    211    212    3412            ?           2606    27644 4   admin_permissions admin_permissions_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.admin_permissions DROP CONSTRAINT admin_permissions_updated_by_id_fk;
       public          postgres    false    3416    214    209            ?           2606    27649 (   admin_roles admin_roles_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_roles DROP CONSTRAINT admin_roles_created_by_id_fk;
       public          postgres    false    214    3416    212            ?           2606    27654 (   admin_roles admin_roles_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_roles DROP CONSTRAINT admin_roles_updated_by_id_fk;
       public          postgres    false    214    3416    212            ?           2606    27659 (   admin_users admin_users_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_users DROP CONSTRAINT admin_users_created_by_id_fk;
       public          postgres    false    214    214    3416            ?           2606    27664 2   admin_users_roles_links admin_users_roles_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_users_roles_links
    ADD CONSTRAINT admin_users_roles_links_fk FOREIGN KEY (user_id) REFERENCES public.admin_users(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.admin_users_roles_links DROP CONSTRAINT admin_users_roles_links_fk;
       public          postgres    false    214    3416    216            ?           2606    27669 6   admin_users_roles_links admin_users_roles_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_users_roles_links
    ADD CONSTRAINT admin_users_roles_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.admin_users_roles_links DROP CONSTRAINT admin_users_roles_links_inv_fk;
       public          postgres    false    216    3412    212            ?           2606    27674 (   admin_users admin_users_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_users DROP CONSTRAINT admin_users_updated_by_id_fk;
       public          postgres    false    214    214    3416                        2606    28013 *   archive_tags archive_tags_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.archive_tags
    ADD CONSTRAINT archive_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.archive_tags DROP CONSTRAINT archive_tags_created_by_id_fk;
       public          postgres    false    3416    281    214            !           2606    28018 *   archive_tags archive_tags_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.archive_tags
    ADD CONSTRAINT archive_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.archive_tags DROP CONSTRAINT archive_tags_updated_by_id_fk;
       public          postgres    false    3416    281    214            ?           2606    27679 @   browse_root_collections browse_root_collections_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.browse_root_collections
    ADD CONSTRAINT browse_root_collections_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 j   ALTER TABLE ONLY public.browse_root_collections DROP CONSTRAINT browse_root_collections_created_by_id_fk;
       public          postgres    false    214    3416    217            ?           2606    27684 N   browse_root_collections_current_links browse_root_collections_current_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.browse_root_collections_current_links
    ADD CONSTRAINT browse_root_collections_current_links_fk FOREIGN KEY (browse_root_collection_id) REFERENCES public.browse_root_collections(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.browse_root_collections_current_links DROP CONSTRAINT browse_root_collections_current_links_fk;
       public          postgres    false    3422    218    217            ?           2606    27689 R   browse_root_collections_current_links browse_root_collections_current_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.browse_root_collections_current_links
    ADD CONSTRAINT browse_root_collections_current_links_inv_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 |   ALTER TABLE ONLY public.browse_root_collections_current_links DROP CONSTRAINT browse_root_collections_current_links_inv_fk;
       public          postgres    false    218    220    3428            ?           2606    27694 @   browse_root_collections browse_root_collections_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.browse_root_collections
    ADD CONSTRAINT browse_root_collections_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 j   ALTER TABLE ONLY public.browse_root_collections DROP CONSTRAINT browse_root_collections_updated_by_id_fk;
       public          postgres    false    3416    217    214            ?           2606    27699 J   collections_child_collections_links collections_child_collections_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.collections_child_collections_links
    ADD CONSTRAINT collections_child_collections_links_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 t   ALTER TABLE ONLY public.collections_child_collections_links DROP CONSTRAINT collections_child_collections_links_fk;
       public          postgres    false    221    220    3428            ?           2606    27704 N   collections_child_collections_links collections_child_collections_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.collections_child_collections_links
    ADD CONSTRAINT collections_child_collections_links_inv_fk FOREIGN KEY (inv_collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.collections_child_collections_links DROP CONSTRAINT collections_child_collections_links_inv_fk;
       public          postgres    false    3428    220    221            ?           2606    27709 (   collections collections_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.collections DROP CONSTRAINT collections_created_by_id_fk;
       public          postgres    false    214    220    3416            ?           2606    27714 L   collections_parent_collections_links collections_parent_collections_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.collections_parent_collections_links
    ADD CONSTRAINT collections_parent_collections_links_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 v   ALTER TABLE ONLY public.collections_parent_collections_links DROP CONSTRAINT collections_parent_collections_links_fk;
       public          postgres    false    220    3428    223            ?           2606    27719 P   collections_parent_collections_links collections_parent_collections_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.collections_parent_collections_links
    ADD CONSTRAINT collections_parent_collections_links_inv_fk FOREIGN KEY (inv_collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 z   ALTER TABLE ONLY public.collections_parent_collections_links DROP CONSTRAINT collections_parent_collections_links_inv_fk;
       public          postgres    false    3428    220    223            ?           2606    27724 (   collections collections_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.collections DROP CONSTRAINT collections_updated_by_id_fk;
       public          postgres    false    214    220    3416            ?           2606    27729 "   comments comments_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_created_by_id_fk;
       public          postgres    false    3416    214    224            ?           2606    27734 0   comments_picture_links comments_picture_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.comments_picture_links
    ADD CONSTRAINT comments_picture_links_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.comments_picture_links DROP CONSTRAINT comments_picture_links_fk;
       public          postgres    false    224    226    3436            ?           2606    27739 4   comments_picture_links comments_picture_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.comments_picture_links
    ADD CONSTRAINT comments_picture_links_inv_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.comments_picture_links DROP CONSTRAINT comments_picture_links_inv_fk;
       public          postgres    false    248    226    3482            ?           2606    27744 "   comments comments_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_updated_by_id_fk;
       public          postgres    false    3416    224    214            ?           2606    27749 *   descriptions descriptions_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT descriptions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.descriptions DROP CONSTRAINT descriptions_created_by_id_fk;
       public          postgres    false    231    214    3416            ?           2606    27754 *   descriptions descriptions_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT descriptions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.descriptions DROP CONSTRAINT descriptions_updated_by_id_fk;
       public          postgres    false    231    3416    214            ?           2606    27759    files files_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.files DROP CONSTRAINT files_created_by_id_fk;
       public          postgres    false    214    233    3416            ?           2606    27764 ,   files_related_morphs files_related_morphs_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.files_related_morphs
    ADD CONSTRAINT files_related_morphs_fk FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.files_related_morphs DROP CONSTRAINT files_related_morphs_fk;
       public          postgres    false    233    3450    235            ?           2606    27769    files files_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.files DROP CONSTRAINT files_updated_by_id_fk;
       public          postgres    false    214    3416    233            ?           2606    27774 *   keyword_tags keyword_tags_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.keyword_tags
    ADD CONSTRAINT keyword_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.keyword_tags DROP CONSTRAINT keyword_tags_created_by_id_fk;
       public          postgres    false    214    3416    236            ?           2606    27779 .   keyword_tags_components keyword_tags_entity_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.keyword_tags_components
    ADD CONSTRAINT keyword_tags_entity_fk FOREIGN KEY (entity_id) REFERENCES public.keyword_tags(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.keyword_tags_components DROP CONSTRAINT keyword_tags_entity_fk;
       public          postgres    false    236    237    3455            ?           2606    27784 *   keyword_tags keyword_tags_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.keyword_tags
    ADD CONSTRAINT keyword_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.keyword_tags DROP CONSTRAINT keyword_tags_updated_by_id_fk;
       public          postgres    false    236    214    3416            ?           2606    27789 ,   location_tags location_tags_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.location_tags
    ADD CONSTRAINT location_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 V   ALTER TABLE ONLY public.location_tags DROP CONSTRAINT location_tags_created_by_id_fk;
       public          postgres    false    3416    214    240            ?           2606    27794 0   location_tags_components location_tags_entity_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.location_tags_components
    ADD CONSTRAINT location_tags_entity_fk FOREIGN KEY (entity_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.location_tags_components DROP CONSTRAINT location_tags_entity_fk;
       public          postgres    false    240    3464    241            ?           2606    27799 ,   location_tags location_tags_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.location_tags
    ADD CONSTRAINT location_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 V   ALTER TABLE ONLY public.location_tags DROP CONSTRAINT location_tags_updated_by_id_fk;
       public          postgres    false    240    214    3416            ?           2606    27804 (   person_tags person_tags_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.person_tags
    ADD CONSTRAINT person_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.person_tags DROP CONSTRAINT person_tags_created_by_id_fk;
       public          postgres    false    214    3416    244            ?           2606    27809 ,   person_tags_components person_tags_entity_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.person_tags_components
    ADD CONSTRAINT person_tags_entity_fk FOREIGN KEY (entity_id) REFERENCES public.person_tags(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.person_tags_components DROP CONSTRAINT person_tags_entity_fk;
       public          postgres    false    245    3473    244            ?           2606    27814 (   person_tags person_tags_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.person_tags
    ADD CONSTRAINT person_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.person_tags DROP CONSTRAINT person_tags_updated_by_id_fk;
       public          postgres    false    244    3416    214            "           2606    28023 8   pictures_archive_tag_links pictures_archive_tag_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_archive_tag_links
    ADD CONSTRAINT pictures_archive_tag_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.pictures_archive_tag_links DROP CONSTRAINT pictures_archive_tag_links_fk;
       public          postgres    false    282    248    3482            #           2606    28028 <   pictures_archive_tag_links pictures_archive_tag_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_archive_tag_links
    ADD CONSTRAINT pictures_archive_tag_links_inv_fk FOREIGN KEY (archive_tag_id) REFERENCES public.archive_tags(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_archive_tag_links DROP CONSTRAINT pictures_archive_tag_links_inv_fk;
       public          postgres    false    281    282    3538            ?           2606    27819 8   pictures_collections_links pictures_collections_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_collections_links
    ADD CONSTRAINT pictures_collections_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.pictures_collections_links DROP CONSTRAINT pictures_collections_links_fk;
       public          postgres    false    248    3482    249            ?           2606    27824 <   pictures_collections_links pictures_collections_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_collections_links
    ADD CONSTRAINT pictures_collections_links_inv_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_collections_links DROP CONSTRAINT pictures_collections_links_inv_fk;
       public          postgres    false    249    3428    220            ?           2606    27829 "   pictures pictures_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.pictures DROP CONSTRAINT pictures_created_by_id_fk;
       public          postgres    false    248    214    3416                        2606    27834 :   pictures_descriptions_links pictures_descriptions_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_descriptions_links
    ADD CONSTRAINT pictures_descriptions_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.pictures_descriptions_links DROP CONSTRAINT pictures_descriptions_links_fk;
       public          postgres    false    248    3482    250                       2606    27839 >   pictures_descriptions_links pictures_descriptions_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_descriptions_links
    ADD CONSTRAINT pictures_descriptions_links_inv_fk FOREIGN KEY (description_id) REFERENCES public.descriptions(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.pictures_descriptions_links DROP CONSTRAINT pictures_descriptions_links_inv_fk;
       public          postgres    false    3446    250    231                       2606    27844 :   pictures_keyword_tags_links pictures_keyword_tags_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_keyword_tags_links
    ADD CONSTRAINT pictures_keyword_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.pictures_keyword_tags_links DROP CONSTRAINT pictures_keyword_tags_links_fk;
       public          postgres    false    248    3482    252                       2606    27849 >   pictures_keyword_tags_links pictures_keyword_tags_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_keyword_tags_links
    ADD CONSTRAINT pictures_keyword_tags_links_inv_fk FOREIGN KEY (keyword_tag_id) REFERENCES public.keyword_tags(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.pictures_keyword_tags_links DROP CONSTRAINT pictures_keyword_tags_links_inv_fk;
       public          postgres    false    236    3455    252                       2606    27854 <   pictures_location_tags_links pictures_location_tags_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_location_tags_links
    ADD CONSTRAINT pictures_location_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_location_tags_links DROP CONSTRAINT pictures_location_tags_links_fk;
       public          postgres    false    253    248    3482                       2606    27859 @   pictures_location_tags_links pictures_location_tags_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_location_tags_links
    ADD CONSTRAINT pictures_location_tags_links_inv_fk FOREIGN KEY (location_tag_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.pictures_location_tags_links DROP CONSTRAINT pictures_location_tags_links_inv_fk;
       public          postgres    false    3464    253    240                       2606    27864 8   pictures_person_tags_links pictures_person_tags_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_person_tags_links
    ADD CONSTRAINT pictures_person_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.pictures_person_tags_links DROP CONSTRAINT pictures_person_tags_links_fk;
       public          postgres    false    254    3482    248                       2606    27869 <   pictures_person_tags_links pictures_person_tags_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_person_tags_links
    ADD CONSTRAINT pictures_person_tags_links_inv_fk FOREIGN KEY (person_tag_id) REFERENCES public.person_tags(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_person_tags_links DROP CONSTRAINT pictures_person_tags_links_inv_fk;
       public          postgres    false    244    254    3473                       2606    27874 >   pictures_time_range_tag_links pictures_time_range_tag_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_time_range_tag_links
    ADD CONSTRAINT pictures_time_range_tag_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.pictures_time_range_tag_links DROP CONSTRAINT pictures_time_range_tag_links_fk;
       public          postgres    false    248    3482    255            	           2606    27879 B   pictures_time_range_tag_links pictures_time_range_tag_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_time_range_tag_links
    ADD CONSTRAINT pictures_time_range_tag_links_inv_fk FOREIGN KEY (time_range_tag_id) REFERENCES public.time_range_tags(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.pictures_time_range_tag_links DROP CONSTRAINT pictures_time_range_tag_links_inv_fk;
       public          postgres    false    270    255    3518            ?           2606    27884 "   pictures pictures_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.pictures DROP CONSTRAINT pictures_updated_by_id_fk;
       public          postgres    false    214    3416    248            
           2606    27889 L   pictures_verified_keyword_tags_links pictures_verified_keyword_tags_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links
    ADD CONSTRAINT pictures_verified_keyword_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 v   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links DROP CONSTRAINT pictures_verified_keyword_tags_links_fk;
       public          postgres    false    248    3482    256                       2606    27894 P   pictures_verified_keyword_tags_links pictures_verified_keyword_tags_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links
    ADD CONSTRAINT pictures_verified_keyword_tags_links_inv_fk FOREIGN KEY (keyword_tag_id) REFERENCES public.keyword_tags(id) ON DELETE CASCADE;
 z   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links DROP CONSTRAINT pictures_verified_keyword_tags_links_inv_fk;
       public          postgres    false    236    256    3455                       2606    27899 N   pictures_verified_location_tags_links pictures_verified_location_tags_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_location_tags_links
    ADD CONSTRAINT pictures_verified_location_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.pictures_verified_location_tags_links DROP CONSTRAINT pictures_verified_location_tags_links_fk;
       public          postgres    false    248    3482    257                       2606    27904 R   pictures_verified_location_tags_links pictures_verified_location_tags_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_location_tags_links
    ADD CONSTRAINT pictures_verified_location_tags_links_inv_fk FOREIGN KEY (location_tag_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 |   ALTER TABLE ONLY public.pictures_verified_location_tags_links DROP CONSTRAINT pictures_verified_location_tags_links_inv_fk;
       public          postgres    false    3464    257    240                       2606    27909 J   pictures_verified_person_tags_links pictures_verified_person_tags_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_person_tags_links
    ADD CONSTRAINT pictures_verified_person_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 t   ALTER TABLE ONLY public.pictures_verified_person_tags_links DROP CONSTRAINT pictures_verified_person_tags_links_fk;
       public          postgres    false    248    258    3482                       2606    27914 N   pictures_verified_person_tags_links pictures_verified_person_tags_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_person_tags_links
    ADD CONSTRAINT pictures_verified_person_tags_links_inv_fk FOREIGN KEY (person_tag_id) REFERENCES public.person_tags(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.pictures_verified_person_tags_links DROP CONSTRAINT pictures_verified_person_tags_links_inv_fk;
       public          postgres    false    3473    258    244                       2606    27919 P   pictures_verified_time_range_tag_links pictures_verified_time_range_tag_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links
    ADD CONSTRAINT pictures_verified_time_range_tag_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 z   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links DROP CONSTRAINT pictures_verified_time_range_tag_links_fk;
       public          postgres    false    3482    248    259                       2606    27924 T   pictures_verified_time_range_tag_links pictures_verified_time_range_tag_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links
    ADD CONSTRAINT pictures_verified_time_range_tag_links_inv_fk FOREIGN KEY (time_range_tag_id) REFERENCES public.time_range_tags(id) ON DELETE CASCADE;
 ~   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links DROP CONSTRAINT pictures_verified_time_range_tag_links_inv_fk;
       public          postgres    false    270    259    3518                       2606    27929 4   strapi_api_tokens strapi_api_tokens_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.strapi_api_tokens DROP CONSTRAINT strapi_api_tokens_created_by_id_fk;
       public          postgres    false    260    3416    214                       2606    27934 4   strapi_api_tokens strapi_api_tokens_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.strapi_api_tokens DROP CONSTRAINT strapi_api_tokens_updated_by_id_fk;
       public          postgres    false    3416    214    260                       2606    27939 0   time_range_tags time_range_tags_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.time_range_tags
    ADD CONSTRAINT time_range_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 Z   ALTER TABLE ONLY public.time_range_tags DROP CONSTRAINT time_range_tags_created_by_id_fk;
       public          postgres    false    270    3416    214                       2606    27944 0   time_range_tags time_range_tags_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.time_range_tags
    ADD CONSTRAINT time_range_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 Z   ALTER TABLE ONLY public.time_range_tags DROP CONSTRAINT time_range_tags_updated_by_id_fk;
       public          postgres    false    214    3416    270                       2606    27949 .   up_permissions up_permissions_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 X   ALTER TABLE ONLY public.up_permissions DROP CONSTRAINT up_permissions_created_by_id_fk;
       public          postgres    false    272    3416    214                       2606    27954 6   up_permissions_role_links up_permissions_role_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_permissions_role_links
    ADD CONSTRAINT up_permissions_role_links_fk FOREIGN KEY (permission_id) REFERENCES public.up_permissions(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.up_permissions_role_links DROP CONSTRAINT up_permissions_role_links_fk;
       public          postgres    false    3522    274    272                       2606    27959 :   up_permissions_role_links up_permissions_role_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_permissions_role_links
    ADD CONSTRAINT up_permissions_role_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.up_permissions_role_links DROP CONSTRAINT up_permissions_role_links_inv_fk;
       public          postgres    false    275    274    3528                       2606    27964 .   up_permissions up_permissions_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 X   ALTER TABLE ONLY public.up_permissions DROP CONSTRAINT up_permissions_updated_by_id_fk;
       public          postgres    false    214    272    3416                       2606    27969 "   up_roles up_roles_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_roles DROP CONSTRAINT up_roles_created_by_id_fk;
       public          postgres    false    3416    275    214                       2606    27974 "   up_roles up_roles_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_roles DROP CONSTRAINT up_roles_updated_by_id_fk;
       public          postgres    false    275    3416    214                       2606    27979 "   up_users up_users_created_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_users DROP CONSTRAINT up_users_created_by_id_fk;
       public          postgres    false    214    277    3416                       2606    27984 *   up_users_role_links up_users_role_links_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_users_role_links
    ADD CONSTRAINT up_users_role_links_fk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.up_users_role_links DROP CONSTRAINT up_users_role_links_fk;
       public          postgres    false    3532    277    279                       2606    27989 .   up_users_role_links up_users_role_links_inv_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_users_role_links
    ADD CONSTRAINT up_users_role_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.up_users_role_links DROP CONSTRAINT up_users_role_links_inv_fk;
       public          postgres    false    279    275    3528                       2606    27994 "   up_users up_users_updated_by_id_fk    FK CONSTRAINT     ?   ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_users DROP CONSTRAINT up_users_updated_by_id_fk;
       public          postgres    false    277    3416    214            ?   m  x??\?n?8??y??כ?????????
7??F;??v?ž?J?~?Dt?ԉ?@N?:?G?")????]?^?b?X?E??l??kVͳ?????U?6?C????????YU??lY??ٲ??bn'?????<[??????O?]U??????ß?^̼??<??"?Q2?~??????
??vB??t?=???i???*ߊį˷|?z6_?q?
?????UY??y?m^?4_I RJ??U?͆?4????Kw?[Y?ز?VR???!????H#7??I?w>?+?z^? & }0v??}}??j֤???g??t?#?r????:b }????^??T?c??????b??z=_?g????^??g??JP?&?6?j)??8??`w?;?#?=Ϲ???v???T@??????|u`???ڴ{??,??˾7:?&{???5???}?Ε~^i?&???????7????J+nT?2. D<T-LU?'q[?g??iէ?kQ?&?Z??o?? }/????˰???e!H?`}???z@??U>"??
y)ϛ ?3Q??G	?؎?y1H?????w????Bt	.з?v?o??]ʉ0??W???????}D?Ё??t?p??0 ??5??㲐?t)"l?mW?9??0H?2H"@?½I??"?E??Т/???.???? ?ut?K?!??K??Ƞ??:?? K??"?.??????TojD?ѕ???[??-?z?<?9?q?7??8??Sxa@??*!U?????? ?h???? w"H<?mty??p?}?p???H)??7?wy??? \?'???D??.?y??%?+?p?]~h ???,??vQ >F`?????h?8?o?]?F??.?&F??Y@???e??o㚪?2?#ڃ?l??P8ѡp????Ɗ ???m!e??֊ ?@?"D?]???M???hd?Ɏ?JW??7?#0j??=ϲ??.G????u?5??L?v?&?rx/c??[L????`?U?Y??O0,?.?2??A?Sn?f??x????S?.9 ??2?O?j#x??????	lw,?.%??,=^????%]J~??=}l??$]??Z6?5?j???? ,Q?+????^x
h՚7e????֗$?Om???$??a??`?R?R? ^.?iU?e??%???(?G -???IA?r_????}?]b?R?2p?????LY?? ????:sO??B/??JLҥ??-?? ?????US?~(W???vJ?R??j}?N??up?o?]??W?^?ؒėt)??+"???o??Պ$??mu?.AO[7? 	0?????])^x[u??K᧬?p????]?)??(X??`H?\?[??p?P9]?A/^??? ???E?V?0???A6B?N???H?%?+:????6P~??X?? ?~t	kԺ<0???;c??8@?J???!x8!0E????F??MB?;P?QB????3???N>2(????CK?????=^?b?8&P????Ar?b?ćf??  ????Iͷ????M^?"??J?B?fq?aBU~?x?ڟZ?ZI??	Y??$?Q?g??nY??W??b??{/ܠ???V??????T$]΃cR?r-???????v!???Sҥ??Y?˴[H?W?WN?⣶[$????=ǂ?kWd??}S???|???c[W?????????????Es?jݦ??h????9??.g?l?$?t??)E5????zS??n=?X?H?G?y?r??mUx?H{q?
????
\@6*??(?J??? r??ݱ?c?!p?^??A?? ?;??-V??V???),??@7j???ay;q?^??{QAW0??Fie?b??6]As??rjeiY?wBll)?'???;??	?uQ?????F?]?̮??y%????w??]f&3??w-;@?]t?u???B??t?z?L??H0x֎Y????Z?v??+M?:~??????+l?z~^?ش?޴?6?sZ?ۋ?$]qG????	n??+6?.?6D??d!c???#x??y?????k??ke~x??fy?9|?Lloגt??F??am?ns??Z?uj[?z??r?~???S?4sv?tZ
?f/;??C?0 /I#????8燼?/b??^5-?j?36	?)?????$@????????M?xbl?7{6	?ψqh?m?
?t??%?\4?#???Qy|4	??TTkh?⃐??P#Ot?J???I????$C???1??+Nd???GB?p?#?,???⅙C?J?`?Z#9k??v???????3{)q???8?Qs ?4Q?LWi??V3?=M??????w≒?A?? <??&?޳???2???ImC?e???_???'? ?k?\???s?ˮ????0c????\>????|?X
D??D??i???}?Qジ??2@=-?f?????I??d
?9Q#?; 7?X;??z?a??YR?f???FoP??ݏTw????ް??e@???	?{0Ϯ??????Þ?Y??5W?ՠqP??2 -?LZ???????????z?????Y??el,4??el?? ?РN,#?&??g掞y??Q?m??f#c?W/?vN????????????<?d?E?ͣ???J?7?Lې?$;?Jv?????1\?`Y	1U???HWb?Q?????dfN?<?$????J?}'?a???$????9I?@F2Ǟ?I4?sqH?b$??Tר˞?V????t!??>??"?1??b??? :??sp?\?*??%?jM?^z2?҄?]iB?(?S???ʌ?2?8㘮Vűplt?ѯ?9?+??]???3?????c?Z??Pu@$ }????_??4X??      ?   :  x?%??m?0????`II$?K??#??A??y??'??gݳ?9??=}????_&Ҡ????@ ??D$"?HD"???X??? b!b!b!6b?ln7????????g='??l?0?43?{????(D!
Q?B??hD#шF4??? 1?Ab?? ^ċx?ϻ?????7?t????ڄM؄M؄MؤMڤMڤM?7??????X??.??.???6?f?l?m???????o???G{?G{?G{?G{?G[?Җ???-miK[?Ҷ???mmk[??ֶ????hG;?юv????}??y??᫇??????<-(?|      ?   ?   x?u?=o? @g?+?؊???l?v???
????H????j$?!???+/?d??+N??????3???3??pG?7?g???p????q??F?v3Ȃ~8n??0v????˧?F??u)ĵ??T`?X?b[???x|"??7s? i
L??$??L?u?Vy??P?,??Ea?
|?????a?(_D??+?q?_??i~ O?~?      ?   ?   x?E??
?@ E?3_?­ӼLsAE!???e?G??q???SZ.????ހ?W?W`f@?????B:M??rеӛ?2ëFR?6?6?ԫL?}2?n/?I~???O???g5??(??i?f???Ԯ[,?TKQL???????_#μ??Zx?<`???a? ?_??4?      ?      x?3?4?????? ]      ?   F   x?3??H-JJ-*?u?(J?+?u??II-J,J??,?4202?50?54V04?26?2??374?)?\1z\\\ 2??      ?   ;   x?uȱ  ??p??B????shger?Q?q5f?"?gê5????
u???E?      ?      x?3?4?????? k       ?   ?   x?????0???}?޵??V????@B? ??ź`l???&??_?????qt?6L?????Q*?>U?mN
lf???q??*!?D??P,FId?2"ƍ?AV???a??l??7?v?0??????-?7??؜s2`C?4?G/CG?C??2Z?T?$??ϥ????????n<?? H?j0&??:h I?%??m      ?      x?????? ? ?      ?      x?3?4?2?4?2?4?2?&@~? (       ?   #  x??P9n?0??WLz[??:?ҥu?c
?4?߇ʁ???????{ey	?ڃ?7?p???H? ^?x?l?L?a???̂???L);?`CD2%α,f[ba?$]4??'?5H??M???gw?肆??J???s????,?G'O k???p$?ɻ?'??`'?p??f7?cN?^?????"?x&D>f?์?XvΔ4N????/???D:G?O?G?ş??h???????ڮ[???UP??uC??`=?jP?a?7m????n???|S?JՇ???w?O?      ?      x?3?4?????? r!      ?   y   x?=?9?0@?Z:?.@???&M??4?-@???"??T???-h???&??M??[G?Ɯ?*???????ht?ؖ?C.?&?V???;!]??p?:??T?p???iU>?M??!??8)?      ?   B   x?%ʹ?0??F??]??1?%??+?????<nڨ!Q??$???^Ŋ??}eH?<*"/?k      ?   ?   x?}?A
?0E??)??f&????ݴh???????H*|f???? ??~???n?M??6Mh?y6???e3?9???h???Z?۪?-???$??2pWK??ATR?p?5??}W?!CN??"?a????????錤JSt?"A9?Z??g#8?oA?U       ?     x???]N?0F??U?<ϸ???Y+@?B??A	T@5?A?}좂???8??p??؇:'ׅ??my<??J?(-?˾~ٷ???{??}??K?(ݔ???]?O???n^?????c?@?n+\????????f)??޷??c{?T?~???X??>???^?v?\?& ??Oל??R7{??n?Z????	?9?b
??L??P&?????W?mӝ??}&SH?T???BF????QI-???4<<?ݏ>??p?-L㍇??D	?Q???㣘?_?????f?M?_?????蟷u??2??
?c'?????U(??V̭B^?I???{@n???5?<D=??2< qHJ??<????=?1C???ڄ?????"??©?TFS!"??:`l?`??D????@@?XS?????;p?
?<??X#/lX%?n'?*.??!H????[&?)??$??f"??"??©?TF??f??"?آ?L$?"%?ߊ???	??L??"??S??	*?w&n?"?I???h?6r?Ԇ?f?FM??2L?GN???????e&?????L?$0~?95??KM?1?S9&??컎?o̩	???[4?i??^d???a??? ?jd?)Y???M???	?[?`Ұ5]n?1???1?n?&?C&?	ȱ??5?Xf?)?0?$?[Aa5[j?)??1Ne???S?j~?	0?h0???H	???XM?/`~:?:2??,i????&p???d?Z?(??      ?   =   x?3?4?L,ȴ?*?L.)-JՃҜ??)????\&?F??r?W`?i?_??)~1z\\\ 15?      ?   p   x?m?K
?@??u?)r??~83}7!d??"A???,?P??????:?#???ķ?d(;ꡣ??6?????x????`?m?*??t?.????܎?ܪ??gnz?R?1?%       ?   5   x?3?4?4?L??????+???ϫ?-??3???
?q+0?2J??3!F??? ?!.      ?   j   x?3?tJLQ?H,?J*-JW?4202?50"CS+3+cS=sSK?????????????????!?!??obQvj?BANbr*??F ?f?f?F??????????? ?H      ?   W   x?3?4??Ē??<??????̼Ē?bNd?!?	???h?9P,7???2/??2???0?2?c?O?P??nF\1z\\\ ?O<?      ?   r   x?3?????S?H-J?I)???4202?50"CS+C+SC=3s#????????????????)?!?!??wbIFbQf^?BprFni^6?9?V??z????Z???Z?͉????   {      ?   .   x?3?4?4?L??????+???ϫ?-??3??8?8??)????? 1X      ?   ?   x?}??? ??3L?j?g???	ri???(?*?H>??l8m??zC
p/???֊?!?CfoP;?H?8럫3?N@]A?q?lWp??d3 B~?C?-??iWVd?
?;??t	J???*T?'?Y?7?9??Q?      ?      x?3?4?2b# 6b ????? '??      ?       x?3?4?2?4?2c#.N.S ????? 4?|      ?      x?3?4?2?4?2b# 6?=... '??      ?      x?3?4?????? d      ?      x?3?4?????? ?#      ?      x?????? ? ?      ?      x?3?4?2?4?????? ??      ?      x?3?4?2?4?????? ??      ?   $   x?3?4?2b# 6bS 6?4???|#?=... S?a      ?      x?3?4?2b#NC.c ????? ??      ?      x?3?4?2bN#?=... V      ?      x?????? ? ?      ?      x??]ݎGv?=M???J#ɲ=??;?m`׎$??i????!??즻?3;V?"o ???&@? W???DO?????"?͡Ƶ?Rî?S????ΩS??????b?????k???Y?GP???dQFuZ???f???(?????????`??7?E???F?pX??N?I5<z3<_d??y?Gu? ?Ë4?A)??@T?S??2?2?~?|???Ei?]
2?Z\?&p-??eQ?_?8
??	(a??˧?%??(????x3IZ?aa?V??a????m?U?????/҆1NBb???tN???y?`Zd?=??*?R?DIj?䎓???Z?????"+??GAۇ?yY@?SP???J?`U!/s{e??.~?????B??J?}??????,?W?S?|cU%ͣZئm??C\??ɱUjE?J???i]????y??U?«L??WD ?)5ZB??:?(\m?t?&N@Qi????ސ?a	????>/?Ѐ????U$??P???<?q?\?????g??{?71o?c?a?BۗI?4??x+???)ǜ??????"????????/oJ?&?rq????P???v???M?EZV??.??,??4???T?q'(???QO"????8?4??9&????l?/??1???;M[YØ}??1CЍz֫1znZ4G?V̚h?"?*c]C?L݇?,rs???`T"?k@\|??>?????	?|f6&IA2?^ߨ???2??2V?ˢW???5^?wN?K`?s,????ڌ_/&??͆N?????يO???!WV??e}0,?j?p?zh?`?1??<+?K`?EV???
?~?2pJ?????????V?????H?????+{ ???v???;???cx??a?|e?m??ͦ-B$Y+?E?9?P?b?AN:\?X!"i+-ݗY?J8??'????<=?Qt????ND?>???3??y,R?~?m1?????}Í???&?3??f΢?T?-n?P?#^#?&?ƫ??8-??kY????b?Q2??.v/,e???=??0?r0N????W?Ό6?@-r2V??FL???N?zjc??? ???????u?iIr?^?Ң?E?u?Ίz??r?~??iTY???e	a???]???f??vh???`???T¦Œ??????D{?H?5????.??%?J???v??ҞB@??g??U???fy???r??U?3??aQ?O??V??./ALߊ90??D,^?e5"?K??X"[?I?J?ٖ??l??s??,??,Fa???E???)f\??%s??}?ق?H?#Kb?O?^?t!?z?\??f?W?-?$1?%ښu??6:橊A?*??YA?<?y??,??3??5V?????@?)//d42ƾ?شȢ??S?"\eF	^\????gFpl?9˻_?S?|?iw( ?G?t?DRR???"?kE?8u]?狚?d?!1?!bؿ!ZU???|????>1?????EZ??e*dҹ??ȱ^?G((ɟ*<?>$8???]?G6???L?F뻔|I?i?:
Q~sZ<???+hA?-?*4uTN@=TS?u??!}?S?
?X???_?H?vF?0>ufhꝵ??eZ+t??/??H?S?ҼL? _\?h7v?M??e?#?%???????? E??"9?y?E?S?4
???&??Z???7??$?
??IV?G??Q?c?H?n???5]???r4-?x?????h&?m5S??u?X???!7ki????}9K???'E?OKɱ???'^?#?+Q͞ə??-)h??ӞӪ???IʒX?%9??8/ |DҊ?y??X&f{m/??????Y+????A'??1aPͿ????\I?Y1?>x?????^d?Y?f?l?ݶY?/7??.4(6/1$?c?jv|C?G8]j:?
P??'
P??P??-?]??"??>~?{vl?{?Zj???.????.??*Ϣ??*2?S??4????0vu??Z??+???7??????}?p??K???v?@?{?K???8?dSDꄡ??Ju<??q?KQA?p?????TF??????v?:?/?$?;T?`?bJ&????QrP????E???h|?6??vj???
6}w?\ߦ(	Pr?P??=????(kb?l???q???(?i*?5ISzM????,ߥ6?z'??O3,'??|T?ԕ??????N\0???$y? ?jݍ_??:???Jc?η??;??l6??Y?y?N??׶z?ï??q?u[?t??Sl????c?T??)_?8<?S;????T@??????#???/?F??~w~?c?????8$??MGql???7'?η???#9????C??ޠwB&7??	?1Ɇ?????:??{(A??>nn7??=?a
s???,*BP???9P?vlK?n?-???l{?+?k?j?F#??Am??{W?Cs?3w[v;?????/?????? ;v>??N?C????????s4??Hw_???.?tä?.??<y?8?R
b?-̫:??+$S??)	\??uR?:K_=?? K?Ǥp\	???M??)??S??'Woq??4"?<??&?	^+?cףi?$??&??Ș?m?q @????|s/??DM?˻?????ӣ#t?Qz?h2??FC?(3+??7??5l????\9Qdɖ??O?{>`但k:Ӈ?:??E	?\????$F?_u?"?Z8 ?[l.????T?;HzT??9??	?0Ziʙ????ԏ??,? ?MLN?.????uʢ?DG???"ʀj??c??X6???=M??L????z?Z??Z?xQ?pZ׃4?Ҡ??l??s·?F+??2C????AQ?E??9????v^epvV?p???	??T!Ҏ??qZ??4?p5	?ҙ??HO?r{?'??????9:??????????????ϻ?}??????_??'zt?????B?>?޿???o?????z?????A?>^??3??????>?F_??ߢ??޿?7????+??ǿ~???g?c????I????"0??Y? ?ߚ????GOg??+M?Ё??oF̮???5????i?????<W?6T?<?i ? ?]??????;װ	/?幭???f???wEO?ӈ,??+?ESX? %Z??²?&[=??Ц?nm?????b?Vd?!????q?=???????]?6?>A?i??g??ۍ?4?#?S?6?{?????"?U,???[GW???????Y_}6?auLۡ??2$??%X?F}??/??_??m??+A3}?e?U??ɖTd????:??[?k????u%OG? ?ҋ$??[?-?,T7y?????*??K?x?O?C̉??!???/J?G????;?f?5	4~3??ܮ???nW]?N???sɮR??N,Ɋ?nM???ae/???B_S4??ԴX?V5??
4ͣZ?r?H?|S!S?k#??6?V???Q[?Yo?A????)n)67??P?[r?q?m?V s&???|ʊ6'?\ɒ??Z?S?m?RR?4?!}??eyoG?4???5?ܠ?A?{?????[F??????X??D??-?6?+?B6?n??S???xQ?^??M?HR?~E?N?t?<??n͊k??nW?^?tM0???Ttb????W?Q0a?R?S?????S?DeSb?po.??[l???M????ڑ???.?@')??ڠ??P???Ȇ??(???O?o?#B?n^??<?[L͓ڕp?u@??]u]?A?M?g?V?w?M?&s??i?g??????觕'v@?y^?b{?|?r}v??!?@?=??$8Y??
NVp??????du?du????#?cD??x&sD??PN?\??Qŧ??0?A?@?R?9E͜?f???VP"??y?Y?x????Ma?
??ٴ4?>?N?پRZ???f?G?aks??3?$k?$V???r?8?	????????{?z?1?՘?N>???]EV?&???x???߫+P?P??\?/?K9zW?5(?'@???dY}?
????4?.j????/l|Y?5?2?,z^??4??/??	??2?Y#kg?>?ِVX???dh9?m?U?????K?]???D???Q!??`Z????C	IK??ԒɡD܇O~O??$???{ ?	  e???Ouy?JLR??ʥD݋Q??U?Qq?j??)???~??α?V/?lmǧ?Kd?^??z鄭?? ?2#
?????-?:???6m/Ѧ????ݏ??S?FX?@????_^8???Y???5?1?9ㅽ?*?o??n??.Z??ٖ,#3AB?''????v<?? ~??k?l,?I?,?y!7o??l_?(??񢢔????????Lw?????~??ֺ@??o0M,~??p+?tK??ݴhK?$?????$?G?? o?&??@'
r( ?$;fJ?????Y?]c????9l!???ufN??nF.??y??V?+$J?5z??W??	\?ְq???????4Ɠ?+?d1??U̜jV????j??>2???X???(?Σ?~????????O??}?ht??gG??x??>????v????}?$#V?T????h??
?yQ\60ȪT?/"???QF?ʩ`oR?ٙ?:???j?(????&?H?n8´?Ѩ??Hp7K㲨??????4O?U??Cޠ????3W_?uMW?v?X?NX??cK+??????	Q?689???J?t6??&U??솧?6?CcO[f
V?l???sx?? I2??9t"Ӽ?;^??5+??8Kk?f?1?4J?ʂ??I??E??[??yR 	~?݌?W?8?rO('???? ?V]??$?7q??Vpu??[??L7??s?*?h`?o|????X?<??+?|D??#???56͝1l???U?fyCD??????0a?{?׿?r???6?F?EuF5???5iU?HT7y<T6?.??8]\?:蕒???E????9\Z%?g7?C5??(-?K?.?1??????? V??NA???6X?????)t??A=??t?YQ??J??h k?? :?~3?????_?~??? ???Ӥ?߿?s=?F5??$G? &|.
?B????A]???Q???9??????_?6.?%?~???o??'Jۧ?(??F?ِ???r(?q?,??\?SK??6??8??E?~ @aL?9?s<cE	?s9 (EE?4??
?1??Ȩ?v?G???d?Y_`/ЬṂ???z??TfGp?g???o?m?$]??5/J??<	?r??I6ZR^??u?/?-"???H??|?e??`?$-?n"?E?c??x??;Fkġ:\?dM?S?=?|???:???[??sm??????v?v??΢???=?*}?a??c=X:??6?NF?m??,???~???7h??RϬ-{vMJ?0:$??w????N???XWn&?y?}(?L=bw#kl?h?:???n?R=T?(S?HX??X?*$??}5jL?$dn=??GP_?ށ~2????^?mz??????n]	$??NڇCv???}?
?`???gv=?Ḡ??x,??W??8??0z]?<˹ ?Veg???B񉨱鲙?L?LB?-??)??(1??Ȱ륆?pU[`f??hL]?؅?J[??8?.??\h?(?(???~?T?S)??]????e?~?{?K?E?Űt4?L	?3ҩ?!?bM?-????ӻ?]???u?֦?2?8h?Kj????Ѧ_?isd?b*???C????O????Ҥ_/??z???M???Q????;?]???R?m????Ys??v'7??6??W?v'ׂ??C??^????
>X?????yP???*?p̏\?%?S???\d??{iRY?|add??kKB?]ě¾ښ@??5X3?_??*?L?}??s?	???H?3???^\?`?}???b??N?~ʰ8???TX?2?op?Mo#L?h?0???"5\?????p^a?÷???R?u?5~0?5?????7??a?[͘???G?????Đ??h݅\???^X, ???@{m?	w?xq?V????#@R?~??5?
???c??AU?????I?eA0??Vk??"?Z??r?Z?%?h[?TY?ۈ?%?G*q???[E??Y??n???b??z?X??????q]ˊ|?f??©D}#U??,hڴG???蛺?????S?S???{|??R???)u??v%?]R5? ?[?t?%}.??u?Sn݂G?{??)??8?z?{?j???5<?]????Uټ&?oy?F??)6?]??e-???x?d}????Y5M?A??????53>dw????Tw}Wû??4?J?m8?3??ރs$???+v?z?DQ??pyá,l?˲D??????0??m??l?m-?????@޾??C???a}?:?Q?F}Y????*6?'???{e&?گ?r????ݳ+n?]??&?>r?n????ތ???T???KwM??G<????&x4??۔???S???R0:?脜?;rbVN?5|h?^??ݻ???`??      ?   n	  x??]Ko?8>7???9]??"?mO[???i7h???H?AQNӢ?}%Y?%?a??0??C??g?o>??~??h?ě??ۣ(???KGK??c?ſXB??w?⟅?ù7??9???,Jc??F¬?x^Ӏ?S?kB|?\r#??MO?y??L???????P?{?MhE?e?[?Gn{U.?If??E	?s?1?1S??!?.se[?^텶!?+?x[????V?1:/>_QQ?#??g4o ?j??W?P????.{|??-~6C?#?]`b?l???0:5
?U?6`?\???)cF?,jQ?/1?I?F????3t"?C???П=zuD{???`?~?45?f?Z?d??s????8?_??Re????}?i?e]???8?"/?????o?|???sڼi??(???d?$???h_??,kkA0$???D?!VI#???rh
Rt\d8???ѷ?8 9ν??????g????F4٢&?1?΋?i{TQ??+???B`$??u??z??I^????ቀ?1#_G?2?u????BI??xY??8ޯj?{Ġ?;?s?????6??yƲ???X???e??d(P?Y
?	??y????vi????Ex0?(F?kf?
???
GO(??????qp???:?=f?-'???"??!ߖ?6?5?"??6B??H?)?6҄^?BA???^.t????#??v?H??ץMѺ?-?T?ᜣos??|
-?<?˅`8?C???	??h??״?|!@???6F????, ?H1????????/FѶ?ˋ?+?{0 V????'??"a??:??u02\?v?Z?ܿɦ)?????1????2???	?s?k?9???TOǐ?ٵ=???ʭ??	Cǳ?g?yv`C^?tϚ݊?g0ϺMxǿw????????H>?ge\Y??5??\?{̽.???X?@??=k5	?Mku%?v?i[?mM???????9?:bҚr??`?3&??D??r??6???3?jF??$8#/????q?fX?N#?,^ڌc?Ľ4h?? ?? )???˧p??ր??,?xJ??n\W??]A\?Ag??~:?(??t,??O??Q*t??1???< ?q???:?Z&??)?%?;??S???e????'?Iآpǡ?C?9?????{?????Pb?C?-??P}WO?C?:?#-}ҊXPnw?e???6m5?????A?gs9?r?%?\?,y?&??Zu?8K?.H??v????+?W2|E???Cb?S}???)-?@9J??"?|??Eb??skq???J??G2#?G/??;pz?_???mt??&?]=?8{?}??=??b?D ????ix ????6`????6??h3y??>??????{^?fJ1`Y?Gh?j???E?#"???4/i0g???*?Ʈ??"??'?*???b??rCj]?T????a?`'??7?}?u՟>~???????	??X˴?B?.??#??B 9?r??g?{?W??uK???e?Hn?b[??Qe?2?U??\+?_;P?7?ryL??r1x?oS????>??)Rl???b???j?l??W;?@?4#8??"???Sb??&?M;z?r?~?\?m?bL?n??mMGՍ:?$cs?|w????r#?*o?:?2
e?l??XR??s?)?ޒ?T?V+u???N????:??m?~E????0?ލ???m???7<????$
?2@??[ɌNP????????X
k?v?ZP,Q?KQ?WR3,zՙ?]?-?ط?"??At???3]?8*?zϤ7Kw5s%!{(]?e?l???C??s???v?? w?> lk^Y;??oW???.???Bjw?0??z?????[a1C֥?)!?5??%?[@)?V98?_?"?v??ɣ? V9?^?f?U{۪???f/Ɲ???MiM???r,K4Վ?	UU?<?{???#??'??9?=4Q??$????RD]?(?PS???6??9rp?p??P?ui?#30:(0<????s(Y?>L?h???9W?ڹ^Ia?p\?yW??cp~c?(?ve`w??j횘4???????v????`7ϺHA???2?;?t????,?????k;4??}?wɕ?~ye??-??/Wi?o-?--H???ŕ??[??De?ܒW?s[C???FJ?j???Y?OKC};xn?f?ͩWDw?P?t???֮?I?Z?@pdk{km???w???????2u?T???*Cd?i,8??y?????y~??~ ?2????????(O/???	G]{?E???|?)?Mh?E?Տ??I}?????<???ڗ/K?CK^9??ڼ.%z5???????}ͯ#?4X?x????o?.???]?wy???vr}9???????M?]?ܡ?7S????}???m?.nng??????:;;?(? "      ?      x?????? ? ?      ?      x?????? ? ?      ?   ^   x?u??? ??d
h???????(?)?Z?/??H??L?H,???tYKT?2j`?
wӷ????zB??7Y?V??_?{󏺳V?b"?^"?      ?   ?  x???]n?0 ???? ?ѽ@_(xST???z?%?hIl?g?H?|??dz???\5Y6?????j??H>???h????ŌE???'*2I3????????92]!(Kg?y]???k?'?닯P?q????͹F????f?M?C?UY?ѷ߃???????9?Nv?WM? ???LhBgoo}ݐ/n????1???ۗ?iFr?Ƅ??ID???Z?&??dAK3}??????d!u???`??????/?1???5"pF?4"??T?m?_?p#n0?s?z??a7????F?Ǯ*Ʃ7???	W@??*ꄳ?5:ue8???7V??$o??V??[D?9?? <???H?U??3!S|w}ݐ?l?T(??"d???&|K?? a?????OH'6W??F??(b??HR???2?????(?ZB?Fqu??H+XԵ]????????hlQ????H?Z???:????qT=????zJP???????㪚?x\]So???]__<?޳??Yh3?m????6?ZI'm;qU????HZ?MD?vFN\?v&N\J?&N??'p??????UQ?y???m^^??s??;???}b??X?bG?^???z?_?S3?ʉM^?B??F?m?ط??v??ټ/>??K??כ?QE????d?QE?<?ﭯ4u???????	?܎?!0.????eH=?",Iv?WZ??K'???/5y?V      ?   ?   x?л?0E??A??Ƚ??:??#?0?9?s?Z???}Μ???t?C???[?]{2^???	[?z߾w??6?|o?k??%$?????I?2?"? ?"? ?H"?$?H"?$?H??"?(??"?(??"?h???k???m??&q?v????Î???1?6?      ?   ?   x?u?M
?0???)???&??k? ???PZ????`Zx0?1o?<du??8??9??.?C?3???p?q?<B?܁r?I?/?HURO?ޠ?NXԫ??O??mK
yL???o:@???Z2n??Bh???@r?=b?r??v?F???^??O??PYA56?s?#KX?      ?   ?   x?3?,I-.q.-J,?/??!??TΜ???N?DC?Bw?|Gӌ2C}?2??47?Rߔ?J???¬?4?t??*?Pàp??,Wâ*#??*?L?4202?50?5?T04?2??25?37?D71?20?36??4?4?????? b+,f      ?      x?3?4?????? k      