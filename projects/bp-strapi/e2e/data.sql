PGDMP     ,    2                {        
   strapi-e2e    15.3    15.3 �   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    129417 
   strapi-e2e    DATABASE     w   CREATE DATABASE "strapi-e2e" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE "strapi-e2e";
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    5            �            1259    129418    admin_permissions    TABLE     J  CREATE TABLE public.admin_permissions (
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
       public         heap    postgres    false    5            �            1259    129423    admin_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.admin_permissions_id_seq;
       public          postgres    false    214    5            �           0    0    admin_permissions_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.admin_permissions_id_seq OWNED BY public.admin_permissions.id;
          public          postgres    false    215            �            1259    129424    admin_permissions_role_links    TABLE     ~   CREATE TABLE public.admin_permissions_role_links (
    permission_id integer,
    role_id integer,
    id integer NOT NULL
);
 0   DROP TABLE public.admin_permissions_role_links;
       public         heap    postgres    false    5            �            1259    129427 #   admin_permissions_role_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_permissions_role_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.admin_permissions_role_links_id_seq;
       public          postgres    false    216    5            �           0    0 #   admin_permissions_role_links_id_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.admin_permissions_role_links_id_seq OWNED BY public.admin_permissions_role_links.id;
          public          postgres    false    217            �            1259    129428    admin_roles    TABLE     ;  CREATE TABLE public.admin_roles (
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
       public         heap    postgres    false    5            �            1259    129433    admin_roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_roles_id_seq;
       public          postgres    false    5    218            �           0    0    admin_roles_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.admin_roles_id_seq OWNED BY public.admin_roles.id;
          public          postgres    false    219            �            1259    129434    admin_users    TABLE     B  CREATE TABLE public.admin_users (
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
       public         heap    postgres    false    5            �            1259    129439    admin_users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_users_id_seq;
       public          postgres    false    5    220            �           0    0    admin_users_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;
          public          postgres    false    221            �            1259    129440    admin_users_roles_links    TABLE     s   CREATE TABLE public.admin_users_roles_links (
    user_id integer,
    role_id integer,
    id integer NOT NULL
);
 +   DROP TABLE public.admin_users_roles_links;
       public         heap    postgres    false    5            �            1259    129443    admin_users_roles_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_users_roles_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.admin_users_roles_links_id_seq;
       public          postgres    false    5    222            �           0    0    admin_users_roles_links_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.admin_users_roles_links_id_seq OWNED BY public.admin_users_roles_links.id;
          public          postgres    false    223            �            1259    129444    archive_tags    TABLE     +  CREATE TABLE public.archive_tags (
    id integer NOT NULL,
    name character varying(255),
    long_description text,
    short_description text,
    paypal_client character varying(255),
    paypal_donation_text character varying(255),
    paypal_purpose character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    restrict_image_downloading boolean,
    published_at timestamp(6) without time zone,
    email character varying(255)
);
     DROP TABLE public.archive_tags;
       public         heap    postgres    false    5            �            1259    129449    archive_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.archive_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.archive_tags_id_seq;
       public          postgres    false    224    5            �           0    0    archive_tags_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.archive_tags_id_seq OWNED BY public.archive_tags.id;
          public          postgres    false    225            �            1259    129450 #   archive_tags_showcase_picture_links    TABLE     �   CREATE TABLE public.archive_tags_showcase_picture_links (
    archive_tag_id integer,
    picture_id integer,
    id integer NOT NULL
);
 7   DROP TABLE public.archive_tags_showcase_picture_links;
       public         heap    postgres    false    5            �            1259    129453 *   archive_tags_showcase_picture_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.archive_tags_showcase_picture_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.archive_tags_showcase_picture_links_id_seq;
       public          postgres    false    5    226            �           0    0 *   archive_tags_showcase_picture_links_id_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.archive_tags_showcase_picture_links_id_seq OWNED BY public.archive_tags_showcase_picture_links.id;
          public          postgres    false    227            �            1259    129454    browse_root_collections    TABLE       CREATE TABLE public.browse_root_collections (
    id integer NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 +   DROP TABLE public.browse_root_collections;
       public         heap    postgres    false    5            �            1259    129457 %   browse_root_collections_current_links    TABLE     �   CREATE TABLE public.browse_root_collections_current_links (
    browse_root_collection_id integer,
    collection_id integer,
    id integer NOT NULL
);
 9   DROP TABLE public.browse_root_collections_current_links;
       public         heap    postgres    false    5            �            1259    129460 ,   browse_root_collections_current_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.browse_root_collections_current_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.browse_root_collections_current_links_id_seq;
       public          postgres    false    5    229            �           0    0 ,   browse_root_collections_current_links_id_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.browse_root_collections_current_links_id_seq OWNED BY public.browse_root_collections_current_links.id;
          public          postgres    false    230            �            1259    129461    browse_root_collections_id_seq    SEQUENCE     �   CREATE SEQUENCE public.browse_root_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.browse_root_collections_id_seq;
       public          postgres    false    5    228            �           0    0    browse_root_collections_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.browse_root_collections_id_seq OWNED BY public.browse_root_collections.id;
          public          postgres    false    231            �            1259    129462    collections    TABLE     _  CREATE TABLE public.collections (
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
       public         heap    postgres    false    5            �            1259    129467 #   collections_child_collections_links    TABLE     �   CREATE TABLE public.collections_child_collections_links (
    collection_id integer,
    inv_collection_id integer,
    id integer NOT NULL
);
 7   DROP TABLE public.collections_child_collections_links;
       public         heap    postgres    false    5            �            1259    129470 *   collections_child_collections_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.collections_child_collections_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.collections_child_collections_links_id_seq;
       public          postgres    false    233    5            �           0    0 *   collections_child_collections_links_id_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.collections_child_collections_links_id_seq OWNED BY public.collections_child_collections_links.id;
          public          postgres    false    234            �            1259    129471    collections_id_seq    SEQUENCE     �   CREATE SEQUENCE public.collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.collections_id_seq;
       public          postgres    false    5    232            �           0    0    collections_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;
          public          postgres    false    235            �            1259    129472 $   collections_parent_collections_links    TABLE     �   CREATE TABLE public.collections_parent_collections_links (
    collection_id integer,
    inv_collection_id integer,
    id integer NOT NULL
);
 8   DROP TABLE public.collections_parent_collections_links;
       public         heap    postgres    false    5            �            1259    129475 +   collections_parent_collections_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.collections_parent_collections_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 B   DROP SEQUENCE public.collections_parent_collections_links_id_seq;
       public          postgres    false    236    5            �           0    0 +   collections_parent_collections_links_id_seq    SEQUENCE OWNED BY     {   ALTER SEQUENCE public.collections_parent_collections_links_id_seq OWNED BY public.collections_parent_collections_links.id;
          public          postgres    false    237            �            1259    129476    comments    TABLE     n  CREATE TABLE public.comments (
    id integer NOT NULL,
    author character varying(255),
    text text,
    date timestamp(6) without time zone,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    pinned boolean
);
    DROP TABLE public.comments;
       public         heap    postgres    false    5            �            1259    129481    comments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comments_id_seq;
       public          postgres    false    238    5            �           0    0    comments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;
          public          postgres    false    239            �            1259    129482    comments_parent_comment_links    TABLE     �   CREATE TABLE public.comments_parent_comment_links (
    id integer NOT NULL,
    comment_id integer,
    inv_comment_id integer
);
 1   DROP TABLE public.comments_parent_comment_links;
       public         heap    postgres    false    5            �            1259    129485 $   comments_parent_comment_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_parent_comment_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.comments_parent_comment_links_id_seq;
       public          postgres    false    240    5            �           0    0 $   comments_parent_comment_links_id_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.comments_parent_comment_links_id_seq OWNED BY public.comments_parent_comment_links.id;
          public          postgres    false    241            �            1259    129486    comments_picture_links    TABLE     x   CREATE TABLE public.comments_picture_links (
    comment_id integer,
    picture_id integer,
    id integer NOT NULL
);
 *   DROP TABLE public.comments_picture_links;
       public         heap    postgres    false    5            �            1259    129489    comments_picture_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comments_picture_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.comments_picture_links_id_seq;
       public          postgres    false    5    242            �           0    0    comments_picture_links_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.comments_picture_links_id_seq OWNED BY public.comments_picture_links.id;
          public          postgres    false    243            �            1259    129490    components_common_synonyms    TABLE     m   CREATE TABLE public.components_common_synonyms (
    id integer NOT NULL,
    name character varying(255)
);
 .   DROP TABLE public.components_common_synonyms;
       public         heap    postgres    false    5            �            1259    129493 !   components_common_synonyms_id_seq    SEQUENCE     �   CREATE SEQUENCE public.components_common_synonyms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.components_common_synonyms_id_seq;
       public          postgres    false    5    244            �           0    0 !   components_common_synonyms_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.components_common_synonyms_id_seq OWNED BY public.components_common_synonyms.id;
          public          postgres    false    245            �            1259    129494    components_location_coordinates    TABLE     �   CREATE TABLE public.components_location_coordinates (
    id integer NOT NULL,
    latitude double precision,
    longitude double precision
);
 3   DROP TABLE public.components_location_coordinates;
       public         heap    postgres    false    5            �            1259    129497 &   components_location_coordinates_id_seq    SEQUENCE     �   CREATE SEQUENCE public.components_location_coordinates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.components_location_coordinates_id_seq;
       public          postgres    false    246    5            �           0    0 &   components_location_coordinates_id_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.components_location_coordinates_id_seq OWNED BY public.components_location_coordinates.id;
          public          postgres    false    247            �            1259    129498    descriptions    TABLE       CREATE TABLE public.descriptions (
    id integer NOT NULL,
    text text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
     DROP TABLE public.descriptions;
       public         heap    postgres    false    5            �            1259    129503    descriptions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.descriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.descriptions_id_seq;
       public          postgres    false    5    248            �           0    0    descriptions_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.descriptions_id_seq OWNED BY public.descriptions.id;
          public          postgres    false    249            �            1259    129504 	   face_tags    TABLE       CREATE TABLE public.face_tags (
    id integer NOT NULL,
    x double precision,
    y double precision,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    tag_direction integer
);
    DROP TABLE public.face_tags;
       public         heap    postgres    false    5            �            1259    129507    face_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.face_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.face_tags_id_seq;
       public          postgres    false    5    250            �           0    0    face_tags_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.face_tags_id_seq OWNED BY public.face_tags.id;
          public          postgres    false    251            �            1259    129508    face_tags_person_tag_links    TABLE     �   CREATE TABLE public.face_tags_person_tag_links (
    id integer NOT NULL,
    face_tag_id integer,
    person_tag_id integer
);
 .   DROP TABLE public.face_tags_person_tag_links;
       public         heap    postgres    false    5            �            1259    129511 !   face_tags_person_tag_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.face_tags_person_tag_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.face_tags_person_tag_links_id_seq;
       public          postgres    false    252    5            �           0    0 !   face_tags_person_tag_links_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.face_tags_person_tag_links_id_seq OWNED BY public.face_tags_person_tag_links.id;
          public          postgres    false    253            �            1259    129512    face_tags_picture_links    TABLE     z   CREATE TABLE public.face_tags_picture_links (
    id integer NOT NULL,
    face_tag_id integer,
    picture_id integer
);
 +   DROP TABLE public.face_tags_picture_links;
       public         heap    postgres    false    5            �            1259    129515    face_tags_picture_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.face_tags_picture_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.face_tags_picture_links_id_seq;
       public          postgres    false    5    254            �           0    0    face_tags_picture_links_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.face_tags_picture_links_id_seq OWNED BY public.face_tags_picture_links.id;
          public          postgres    false    255                        1259    129516    files    TABLE     �  CREATE TABLE public.files (
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
    updated_by_id integer,
    folder_path character varying(255)
);
    DROP TABLE public.files;
       public         heap    postgres    false    5                       1259    129521    files_folder_links    TABLE     p   CREATE TABLE public.files_folder_links (
    id integer NOT NULL,
    file_id integer,
    folder_id integer
);
 &   DROP TABLE public.files_folder_links;
       public         heap    postgres    false    5                       1259    129524    files_folder_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.files_folder_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.files_folder_links_id_seq;
       public          postgres    false    5    257            �           0    0    files_folder_links_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.files_folder_links_id_seq OWNED BY public.files_folder_links.id;
          public          postgres    false    258                       1259    129525    files_id_seq    SEQUENCE     �   CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.files_id_seq;
       public          postgres    false    256    5            �           0    0    files_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;
          public          postgres    false    259                       1259    129526    files_related_morphs    TABLE     �   CREATE TABLE public.files_related_morphs (
    file_id integer,
    related_id integer,
    related_type character varying(255),
    field character varying(255),
    "order" integer,
    id integer NOT NULL
);
 (   DROP TABLE public.files_related_morphs;
       public         heap    postgres    false    5                       1259    129531    files_related_morphs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.files_related_morphs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.files_related_morphs_id_seq;
       public          postgres    false    260    5            �           0    0    files_related_morphs_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.files_related_morphs_id_seq OWNED BY public.files_related_morphs.id;
          public          postgres    false    261                       1259    129532    keyword_tags    TABLE       CREATE TABLE public.keyword_tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    visible boolean
);
     DROP TABLE public.keyword_tags;
       public         heap    postgres    false    5                       1259    129535    keyword_tags_components    TABLE     �   CREATE TABLE public.keyword_tags_components (
    id integer NOT NULL,
    entity_id integer,
    component_id integer,
    component_type character varying(255),
    field character varying(255),
    "order" integer DEFAULT 0
);
 +   DROP TABLE public.keyword_tags_components;
       public         heap    postgres    false    5                       1259    129541    keyword_tags_components_id_seq    SEQUENCE     �   CREATE SEQUENCE public.keyword_tags_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.keyword_tags_components_id_seq;
       public          postgres    false    5    263            �           0    0    keyword_tags_components_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.keyword_tags_components_id_seq OWNED BY public.keyword_tags_components.id;
          public          postgres    false    264            	           1259    129542    keyword_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.keyword_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.keyword_tags_id_seq;
       public          postgres    false    5    262            �           0    0    keyword_tags_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.keyword_tags_id_seq OWNED BY public.keyword_tags.id;
          public          postgres    false    265            
           1259    129543    links    TABLE     �   CREATE TABLE public.links (
    id integer NOT NULL,
    title text,
    url text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.links;
       public         heap    postgres    false    5                       1259    129548    links_archive_tag_links    TABLE     z   CREATE TABLE public.links_archive_tag_links (
    link_id integer,
    archive_tag_id integer,
    id integer NOT NULL
);
 +   DROP TABLE public.links_archive_tag_links;
       public         heap    postgres    false    5                       1259    129551    links_archive_tag_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.links_archive_tag_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.links_archive_tag_links_id_seq;
       public          postgres    false    267    5            �           0    0    links_archive_tag_links_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.links_archive_tag_links_id_seq OWNED BY public.links_archive_tag_links.id;
          public          postgres    false    268                       1259    129552    links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.links_id_seq;
       public          postgres    false    266    5            �           0    0    links_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.links_id_seq OWNED BY public.links.id;
          public          postgres    false    269                       1259    129553    location_tags    TABLE     1  CREATE TABLE public.location_tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    visible boolean,
    accepted boolean,
    root boolean
);
 !   DROP TABLE public.location_tags;
       public         heap    postgres    false    5                       1259    129556    location_tags_components    TABLE     �   CREATE TABLE public.location_tags_components (
    id integer NOT NULL,
    entity_id integer,
    component_id integer,
    component_type character varying(255),
    field character varying(255),
    "order" integer DEFAULT 0
);
 ,   DROP TABLE public.location_tags_components;
       public         heap    postgres    false    5                       1259    129562    location_tags_components_id_seq    SEQUENCE     �   CREATE SEQUENCE public.location_tags_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.location_tags_components_id_seq;
       public          postgres    false    271    5            �           0    0    location_tags_components_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.location_tags_components_id_seq OWNED BY public.location_tags_components.id;
          public          postgres    false    272                       1259    129563    location_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.location_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.location_tags_id_seq;
       public          postgres    false    5    270            �           0    0    location_tags_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.location_tags_id_seq OWNED BY public.location_tags.id;
          public          postgres    false    273            [           1259    130635    location_tags_parent_tags_links    TABLE     �   CREATE TABLE public.location_tags_parent_tags_links (
    id integer NOT NULL,
    location_tag_id integer,
    inv_location_tag_id integer
);
 3   DROP TABLE public.location_tags_parent_tags_links;
       public         heap    postgres    false    5            Z           1259    130634 &   location_tags_parent_tags_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.location_tags_parent_tags_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.location_tags_parent_tags_links_id_seq;
       public          postgres    false    5    347            �           0    0 &   location_tags_parent_tags_links_id_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.location_tags_parent_tags_links_id_seq OWNED BY public.location_tags_parent_tags_links.id;
          public          postgres    false    346                       1259    129564    parameterized_permissions    TABLE     &  CREATE TABLE public.parameterized_permissions (
    id integer NOT NULL,
    operation_name character varying(255),
    on_other_users boolean,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 -   DROP TABLE public.parameterized_permissions;
       public         heap    postgres    false    5                       1259    129567 +   parameterized_permissions_archive_tag_links    TABLE     �   CREATE TABLE public.parameterized_permissions_archive_tag_links (
    id integer NOT NULL,
    parameterized_permission_id integer,
    archive_tag_id integer
);
 ?   DROP TABLE public.parameterized_permissions_archive_tag_links;
       public         heap    postgres    false    5                       1259    129570 2   parameterized_permissions_archive_tag_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.parameterized_permissions_archive_tag_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 I   DROP SEQUENCE public.parameterized_permissions_archive_tag_links_id_seq;
       public          postgres    false    275    5            �           0    0 2   parameterized_permissions_archive_tag_links_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.parameterized_permissions_archive_tag_links_id_seq OWNED BY public.parameterized_permissions_archive_tag_links.id;
          public          postgres    false    276                       1259    129571     parameterized_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.parameterized_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.parameterized_permissions_id_seq;
       public          postgres    false    5    274            �           0    0     parameterized_permissions_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.parameterized_permissions_id_seq OWNED BY public.parameterized_permissions.id;
          public          postgres    false    277                       1259    129572 6   parameterized_permissions_users_permissions_user_links    TABLE     �   CREATE TABLE public.parameterized_permissions_users_permissions_user_links (
    id integer NOT NULL,
    parameterized_permission_id integer,
    user_id integer
);
 J   DROP TABLE public.parameterized_permissions_users_permissions_user_links;
       public         heap    postgres    false    5                       1259    129575 =   parameterized_permissions_users_permissions_user_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.parameterized_permissions_users_permissions_user_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 T   DROP SEQUENCE public.parameterized_permissions_users_permissions_user_links_id_seq;
       public          postgres    false    5    278            �           0    0 =   parameterized_permissions_users_permissions_user_links_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.parameterized_permissions_users_permissions_user_links_id_seq OWNED BY public.parameterized_permissions_users_permissions_user_links.id;
          public          postgres    false    279                       1259    129576    person_tags    TABLE     �   CREATE TABLE public.person_tags (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.person_tags;
       public         heap    postgres    false    5                       1259    129579    person_tags_components    TABLE     �   CREATE TABLE public.person_tags_components (
    id integer NOT NULL,
    entity_id integer,
    component_id integer,
    component_type character varying(255),
    field character varying(255),
    "order" integer DEFAULT 0
);
 *   DROP TABLE public.person_tags_components;
       public         heap    postgres    false    5                       1259    129585    person_tags_components_id_seq    SEQUENCE     �   CREATE SEQUENCE public.person_tags_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.person_tags_components_id_seq;
       public          postgres    false    281    5            �           0    0    person_tags_components_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.person_tags_components_id_seq OWNED BY public.person_tags_components.id;
          public          postgres    false    282                       1259    129586    person_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.person_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.person_tags_id_seq;
       public          postgres    false    5    280            �           0    0    person_tags_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.person_tags_id_seq OWNED BY public.person_tags.id;
          public          postgres    false    283                       1259    129587    picture_geo_infos    TABLE     0  CREATE TABLE public.picture_geo_infos (
    id integer NOT NULL,
    latitude double precision,
    longitude double precision,
    radius numeric(10,2),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 %   DROP TABLE public.picture_geo_infos;
       public         heap    postgres    false    5                       1259    129590    picture_geo_infos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.picture_geo_infos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.picture_geo_infos_id_seq;
       public          postgres    false    5    284            �           0    0    picture_geo_infos_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.picture_geo_infos_id_seq OWNED BY public.picture_geo_infos.id;
          public          postgres    false    285                       1259    129591    picture_geo_infos_picture_links    TABLE     �   CREATE TABLE public.picture_geo_infos_picture_links (
    id integer NOT NULL,
    picture_geo_info_id integer,
    picture_id integer
);
 3   DROP TABLE public.picture_geo_infos_picture_links;
       public         heap    postgres    false    5                       1259    129594 &   picture_geo_infos_picture_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.picture_geo_infos_picture_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.picture_geo_infos_picture_links_id_seq;
       public          postgres    false    286    5            �           0    0 &   picture_geo_infos_picture_links_id_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.picture_geo_infos_picture_links_id_seq OWNED BY public.picture_geo_infos_picture_links.id;
          public          postgres    false    287                        1259    129595    pictures    TABLE     �  CREATE TABLE public.pictures (
    id integer NOT NULL,
    wordpress_id integer,
    is_text boolean,
    archive_identifier character varying(255),
    likes integer,
    is_not_a_place_count integer,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
    DROP TABLE public.pictures;
       public         heap    postgres    false    5            !           1259    129598    pictures_archive_tag_links    TABLE     �   CREATE TABLE public.pictures_archive_tag_links (
    picture_id integer,
    archive_tag_id integer,
    id integer NOT NULL
);
 .   DROP TABLE public.pictures_archive_tag_links;
       public         heap    postgres    false    5            "           1259    129601 !   pictures_archive_tag_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_archive_tag_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.pictures_archive_tag_links_id_seq;
       public          postgres    false    5    289            �           0    0 !   pictures_archive_tag_links_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.pictures_archive_tag_links_id_seq OWNED BY public.pictures_archive_tag_links.id;
          public          postgres    false    290            #           1259    129602    pictures_collections_links    TABLE        CREATE TABLE public.pictures_collections_links (
    picture_id integer,
    collection_id integer,
    id integer NOT NULL
);
 .   DROP TABLE public.pictures_collections_links;
       public         heap    postgres    false    5            $           1259    129605 !   pictures_collections_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_collections_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.pictures_collections_links_id_seq;
       public          postgres    false    5    291            �           0    0 !   pictures_collections_links_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.pictures_collections_links_id_seq OWNED BY public.pictures_collections_links.id;
          public          postgres    false    292            %           1259    129606    pictures_descriptions_links    TABLE     �   CREATE TABLE public.pictures_descriptions_links (
    picture_id integer,
    description_id integer,
    id integer NOT NULL
);
 /   DROP TABLE public.pictures_descriptions_links;
       public         heap    postgres    false    5            &           1259    129609 "   pictures_descriptions_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_descriptions_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.pictures_descriptions_links_id_seq;
       public          postgres    false    5    293            �           0    0 "   pictures_descriptions_links_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.pictures_descriptions_links_id_seq OWNED BY public.pictures_descriptions_links.id;
          public          postgres    false    294            '           1259    129610    pictures_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.pictures_id_seq;
       public          postgres    false    5    288            �           0    0    pictures_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.pictures_id_seq OWNED BY public.pictures.id;
          public          postgres    false    295            (           1259    129611    pictures_keyword_tags_links    TABLE     �   CREATE TABLE public.pictures_keyword_tags_links (
    picture_id integer,
    keyword_tag_id integer,
    id integer NOT NULL
);
 /   DROP TABLE public.pictures_keyword_tags_links;
       public         heap    postgres    false    5            )           1259    129614 "   pictures_keyword_tags_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_keyword_tags_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.pictures_keyword_tags_links_id_seq;
       public          postgres    false    296    5            �           0    0 "   pictures_keyword_tags_links_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.pictures_keyword_tags_links_id_seq OWNED BY public.pictures_keyword_tags_links.id;
          public          postgres    false    297            *           1259    129615    pictures_linked_pictures_links    TABLE     �   CREATE TABLE public.pictures_linked_pictures_links (
    id integer NOT NULL,
    picture_id integer,
    inv_picture_id integer
);
 2   DROP TABLE public.pictures_linked_pictures_links;
       public         heap    postgres    false    5            +           1259    129618 %   pictures_linked_pictures_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_linked_pictures_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.pictures_linked_pictures_links_id_seq;
       public          postgres    false    298    5            �           0    0 %   pictures_linked_pictures_links_id_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.pictures_linked_pictures_links_id_seq OWNED BY public.pictures_linked_pictures_links.id;
          public          postgres    false    299            ,           1259    129619    pictures_linked_texts_links    TABLE     �   CREATE TABLE public.pictures_linked_texts_links (
    id integer NOT NULL,
    picture_id integer,
    inv_picture_id integer
);
 /   DROP TABLE public.pictures_linked_texts_links;
       public         heap    postgres    false    5            -           1259    129622 "   pictures_linked_texts_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_linked_texts_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.pictures_linked_texts_links_id_seq;
       public          postgres    false    300    5            �           0    0 "   pictures_linked_texts_links_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.pictures_linked_texts_links_id_seq OWNED BY public.pictures_linked_texts_links.id;
          public          postgres    false    301            .           1259    129623    pictures_location_tags_links    TABLE     �   CREATE TABLE public.pictures_location_tags_links (
    picture_id integer,
    location_tag_id integer,
    id integer NOT NULL
);
 0   DROP TABLE public.pictures_location_tags_links;
       public         heap    postgres    false    5            /           1259    129626 #   pictures_location_tags_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_location_tags_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.pictures_location_tags_links_id_seq;
       public          postgres    false    5    302            �           0    0 #   pictures_location_tags_links_id_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.pictures_location_tags_links_id_seq OWNED BY public.pictures_location_tags_links.id;
          public          postgres    false    303            0           1259    129627    pictures_person_tags_links    TABLE        CREATE TABLE public.pictures_person_tags_links (
    picture_id integer,
    person_tag_id integer,
    id integer NOT NULL
);
 .   DROP TABLE public.pictures_person_tags_links;
       public         heap    postgres    false    5            1           1259    129630 !   pictures_person_tags_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_person_tags_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.pictures_person_tags_links_id_seq;
       public          postgres    false    304    5            �           0    0 !   pictures_person_tags_links_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.pictures_person_tags_links_id_seq OWNED BY public.pictures_person_tags_links.id;
          public          postgres    false    305            2           1259    129631    pictures_time_range_tag_links    TABLE     �   CREATE TABLE public.pictures_time_range_tag_links (
    picture_id integer,
    time_range_tag_id integer,
    id integer NOT NULL
);
 1   DROP TABLE public.pictures_time_range_tag_links;
       public         heap    postgres    false    5            3           1259    129634 $   pictures_time_range_tag_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_time_range_tag_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.pictures_time_range_tag_links_id_seq;
       public          postgres    false    306    5            �           0    0 $   pictures_time_range_tag_links_id_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.pictures_time_range_tag_links_id_seq OWNED BY public.pictures_time_range_tag_links.id;
          public          postgres    false    307            4           1259    129635 $   pictures_verified_keyword_tags_links    TABLE     �   CREATE TABLE public.pictures_verified_keyword_tags_links (
    picture_id integer,
    keyword_tag_id integer,
    id integer NOT NULL
);
 8   DROP TABLE public.pictures_verified_keyword_tags_links;
       public         heap    postgres    false    5            5           1259    129638 +   pictures_verified_keyword_tags_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_verified_keyword_tags_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 B   DROP SEQUENCE public.pictures_verified_keyword_tags_links_id_seq;
       public          postgres    false    5    308            �           0    0 +   pictures_verified_keyword_tags_links_id_seq    SEQUENCE OWNED BY     {   ALTER SEQUENCE public.pictures_verified_keyword_tags_links_id_seq OWNED BY public.pictures_verified_keyword_tags_links.id;
          public          postgres    false    309            6           1259    129639 %   pictures_verified_location_tags_links    TABLE     �   CREATE TABLE public.pictures_verified_location_tags_links (
    picture_id integer,
    location_tag_id integer,
    id integer NOT NULL
);
 9   DROP TABLE public.pictures_verified_location_tags_links;
       public         heap    postgres    false    5            7           1259    129642 ,   pictures_verified_location_tags_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_verified_location_tags_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.pictures_verified_location_tags_links_id_seq;
       public          postgres    false    310    5            �           0    0 ,   pictures_verified_location_tags_links_id_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.pictures_verified_location_tags_links_id_seq OWNED BY public.pictures_verified_location_tags_links.id;
          public          postgres    false    311            8           1259    129643 #   pictures_verified_person_tags_links    TABLE     �   CREATE TABLE public.pictures_verified_person_tags_links (
    picture_id integer,
    person_tag_id integer,
    id integer NOT NULL
);
 7   DROP TABLE public.pictures_verified_person_tags_links;
       public         heap    postgres    false    5            9           1259    129646 *   pictures_verified_person_tags_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_verified_person_tags_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.pictures_verified_person_tags_links_id_seq;
       public          postgres    false    5    312            �           0    0 *   pictures_verified_person_tags_links_id_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.pictures_verified_person_tags_links_id_seq OWNED BY public.pictures_verified_person_tags_links.id;
          public          postgres    false    313            :           1259    129647 &   pictures_verified_time_range_tag_links    TABLE     �   CREATE TABLE public.pictures_verified_time_range_tag_links (
    picture_id integer,
    time_range_tag_id integer,
    id integer NOT NULL
);
 :   DROP TABLE public.pictures_verified_time_range_tag_links;
       public         heap    postgres    false    5            ;           1259    129650 -   pictures_verified_time_range_tag_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pictures_verified_time_range_tag_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 D   DROP SEQUENCE public.pictures_verified_time_range_tag_links_id_seq;
       public          postgres    false    5    314            �           0    0 -   pictures_verified_time_range_tag_links_id_seq    SEQUENCE OWNED BY        ALTER SEQUENCE public.pictures_verified_time_range_tag_links_id_seq OWNED BY public.pictures_verified_time_range_tag_links.id;
          public          postgres    false    315            <           1259    129651    strapi_api_token_permissions    TABLE       CREATE TABLE public.strapi_api_token_permissions (
    id integer NOT NULL,
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 0   DROP TABLE public.strapi_api_token_permissions;
       public         heap    postgres    false    5            =           1259    129654 #   strapi_api_token_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.strapi_api_token_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.strapi_api_token_permissions_id_seq;
       public          postgres    false    5    316            �           0    0 #   strapi_api_token_permissions_id_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.strapi_api_token_permissions_id_seq OWNED BY public.strapi_api_token_permissions.id;
          public          postgres    false    317            >           1259    129655 (   strapi_api_token_permissions_token_links    TABLE     �   CREATE TABLE public.strapi_api_token_permissions_token_links (
    id integer NOT NULL,
    api_token_permission_id integer,
    api_token_id integer
);
 <   DROP TABLE public.strapi_api_token_permissions_token_links;
       public         heap    postgres    false    5            ?           1259    129658 /   strapi_api_token_permissions_token_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.strapi_api_token_permissions_token_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 F   DROP SEQUENCE public.strapi_api_token_permissions_token_links_id_seq;
       public          postgres    false    5    318            �           0    0 /   strapi_api_token_permissions_token_links_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.strapi_api_token_permissions_token_links_id_seq OWNED BY public.strapi_api_token_permissions_token_links.id;
          public          postgres    false    319            @           1259    129659    strapi_api_tokens    TABLE     �  CREATE TABLE public.strapi_api_tokens (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    type character varying(255),
    access_key character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    last_used_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    lifespan integer
);
 %   DROP TABLE public.strapi_api_tokens;
       public         heap    postgres    false    5            A           1259    129664    strapi_api_tokens_id_seq    SEQUENCE     �   CREATE SEQUENCE public.strapi_api_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.strapi_api_tokens_id_seq;
       public          postgres    false    5    320            �           0    0    strapi_api_tokens_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.strapi_api_tokens_id_seq OWNED BY public.strapi_api_tokens.id;
          public          postgres    false    321            B           1259    129665    strapi_core_store_settings    TABLE     �   CREATE TABLE public.strapi_core_store_settings (
    id integer NOT NULL,
    key character varying(255),
    value text,
    type character varying(255),
    environment character varying(255),
    tag character varying(255)
);
 .   DROP TABLE public.strapi_core_store_settings;
       public         heap    postgres    false    5            C           1259    129670 !   strapi_core_store_settings_id_seq    SEQUENCE     �   CREATE SEQUENCE public.strapi_core_store_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.strapi_core_store_settings_id_seq;
       public          postgres    false    5    322            �           0    0 !   strapi_core_store_settings_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.strapi_core_store_settings_id_seq OWNED BY public.strapi_core_store_settings.id;
          public          postgres    false    323            D           1259    129671    strapi_database_schema    TABLE     �   CREATE TABLE public.strapi_database_schema (
    id integer NOT NULL,
    schema json,
    "time" timestamp without time zone,
    hash character varying(255)
);
 *   DROP TABLE public.strapi_database_schema;
       public         heap    postgres    false    5            E           1259    129676    strapi_database_schema_id_seq    SEQUENCE     �   CREATE SEQUENCE public.strapi_database_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.strapi_database_schema_id_seq;
       public          postgres    false    324    5            �           0    0    strapi_database_schema_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.strapi_database_schema_id_seq OWNED BY public.strapi_database_schema.id;
          public          postgres    false    325            F           1259    129677    strapi_migrations    TABLE     �   CREATE TABLE public.strapi_migrations (
    id integer NOT NULL,
    name character varying(255),
    "time" timestamp without time zone
);
 %   DROP TABLE public.strapi_migrations;
       public         heap    postgres    false    5            G           1259    129680    strapi_migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.strapi_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.strapi_migrations_id_seq;
       public          postgres    false    5    326            �           0    0    strapi_migrations_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.strapi_migrations_id_seq OWNED BY public.strapi_migrations.id;
          public          postgres    false    327            H           1259    129681    strapi_webhooks    TABLE     �   CREATE TABLE public.strapi_webhooks (
    id integer NOT NULL,
    name character varying(255),
    url text,
    headers jsonb,
    events jsonb,
    enabled boolean
);
 #   DROP TABLE public.strapi_webhooks;
       public         heap    postgres    false    5            I           1259    129686    strapi_webhooks_id_seq    SEQUENCE     �   CREATE SEQUENCE public.strapi_webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.strapi_webhooks_id_seq;
       public          postgres    false    5    328            �           0    0    strapi_webhooks_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.strapi_webhooks_id_seq OWNED BY public.strapi_webhooks.id;
          public          postgres    false    329            J           1259    129687    time_range_tags    TABLE     B  CREATE TABLE public.time_range_tags (
    id integer NOT NULL,
    start timestamp(6) without time zone,
    "end" timestamp(6) without time zone,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    is_estimate boolean
);
 #   DROP TABLE public.time_range_tags;
       public         heap    postgres    false    5            K           1259    129690    time_range_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.time_range_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.time_range_tags_id_seq;
       public          postgres    false    330    5            �           0    0    time_range_tags_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.time_range_tags_id_seq OWNED BY public.time_range_tags.id;
          public          postgres    false    331            L           1259    129691    up_permissions    TABLE     �   CREATE TABLE public.up_permissions (
    id integer NOT NULL,
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 "   DROP TABLE public.up_permissions;
       public         heap    postgres    false    5            M           1259    129694    up_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.up_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.up_permissions_id_seq;
       public          postgres    false    332    5            �           0    0    up_permissions_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.up_permissions_id_seq OWNED BY public.up_permissions.id;
          public          postgres    false    333            N           1259    129695    up_permissions_role_links    TABLE     {   CREATE TABLE public.up_permissions_role_links (
    permission_id integer,
    role_id integer,
    id integer NOT NULL
);
 -   DROP TABLE public.up_permissions_role_links;
       public         heap    postgres    false    5            O           1259    129698     up_permissions_role_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.up_permissions_role_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.up_permissions_role_links_id_seq;
       public          postgres    false    5    334            �           0    0     up_permissions_role_links_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.up_permissions_role_links_id_seq OWNED BY public.up_permissions_role_links.id;
          public          postgres    false    335            P           1259    129699    up_roles    TABLE     8  CREATE TABLE public.up_roles (
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
       public         heap    postgres    false    5            Q           1259    129704    up_roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.up_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.up_roles_id_seq;
       public          postgres    false    5    336            �           0    0    up_roles_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.up_roles_id_seq OWNED BY public.up_roles.id;
          public          postgres    false    337            R           1259    129705    up_users    TABLE     J  CREATE TABLE public.up_users (
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
    updated_by_id integer,
    is_super_user boolean,
    reset_password_token_created_at timestamp(6) without time zone
);
    DROP TABLE public.up_users;
       public         heap    postgres    false    5            S           1259    129710    up_users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.up_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.up_users_id_seq;
       public          postgres    false    338    5            �           0    0    up_users_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.up_users_id_seq OWNED BY public.up_users.id;
          public          postgres    false    339            T           1259    129711    up_users_role_links    TABLE     o   CREATE TABLE public.up_users_role_links (
    user_id integer,
    role_id integer,
    id integer NOT NULL
);
 '   DROP TABLE public.up_users_role_links;
       public         heap    postgres    false    5            U           1259    129714    up_users_role_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.up_users_role_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.up_users_role_links_id_seq;
       public          postgres    false    340    5            �           0    0    up_users_role_links_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.up_users_role_links_id_seq OWNED BY public.up_users_role_links.id;
          public          postgres    false    341            V           1259    129715    upload_folders    TABLE     +  CREATE TABLE public.upload_folders (
    id integer NOT NULL,
    name character varying(255),
    path_id integer,
    path character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);
 "   DROP TABLE public.upload_folders;
       public         heap    postgres    false    5            W           1259    129720    upload_folders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.upload_folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.upload_folders_id_seq;
       public          postgres    false    5    342            �           0    0    upload_folders_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.upload_folders_id_seq OWNED BY public.upload_folders.id;
          public          postgres    false    343            X           1259    129721    upload_folders_parent_links    TABLE        CREATE TABLE public.upload_folders_parent_links (
    id integer NOT NULL,
    folder_id integer,
    inv_folder_id integer
);
 /   DROP TABLE public.upload_folders_parent_links;
       public         heap    postgres    false    5            Y           1259    129724 "   upload_folders_parent_links_id_seq    SEQUENCE     �   CREATE SEQUENCE public.upload_folders_parent_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.upload_folders_parent_links_id_seq;
       public          postgres    false    5    344            �           0    0 "   upload_folders_parent_links_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.upload_folders_parent_links_id_seq OWNED BY public.upload_folders_parent_links.id;
          public          postgres    false    345            �           2604    129725    admin_permissions id    DEFAULT     |   ALTER TABLE ONLY public.admin_permissions ALTER COLUMN id SET DEFAULT nextval('public.admin_permissions_id_seq'::regclass);
 C   ALTER TABLE public.admin_permissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            �           2604    129726    admin_permissions_role_links id    DEFAULT     �   ALTER TABLE ONLY public.admin_permissions_role_links ALTER COLUMN id SET DEFAULT nextval('public.admin_permissions_role_links_id_seq'::regclass);
 N   ALTER TABLE public.admin_permissions_role_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216            �           2604    129727    admin_roles id    DEFAULT     p   ALTER TABLE ONLY public.admin_roles ALTER COLUMN id SET DEFAULT nextval('public.admin_roles_id_seq'::regclass);
 =   ALTER TABLE public.admin_roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    129728    admin_users id    DEFAULT     p   ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);
 =   ALTER TABLE public.admin_users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220            �           2604    129729    admin_users_roles_links id    DEFAULT     �   ALTER TABLE ONLY public.admin_users_roles_links ALTER COLUMN id SET DEFAULT nextval('public.admin_users_roles_links_id_seq'::regclass);
 I   ALTER TABLE public.admin_users_roles_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222            �           2604    129730    archive_tags id    DEFAULT     r   ALTER TABLE ONLY public.archive_tags ALTER COLUMN id SET DEFAULT nextval('public.archive_tags_id_seq'::regclass);
 >   ALTER TABLE public.archive_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    129731 &   archive_tags_showcase_picture_links id    DEFAULT     �   ALTER TABLE ONLY public.archive_tags_showcase_picture_links ALTER COLUMN id SET DEFAULT nextval('public.archive_tags_showcase_picture_links_id_seq'::regclass);
 U   ALTER TABLE public.archive_tags_showcase_picture_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226            �           2604    129732    browse_root_collections id    DEFAULT     �   ALTER TABLE ONLY public.browse_root_collections ALTER COLUMN id SET DEFAULT nextval('public.browse_root_collections_id_seq'::regclass);
 I   ALTER TABLE public.browse_root_collections ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    228            �           2604    129733 (   browse_root_collections_current_links id    DEFAULT     �   ALTER TABLE ONLY public.browse_root_collections_current_links ALTER COLUMN id SET DEFAULT nextval('public.browse_root_collections_current_links_id_seq'::regclass);
 W   ALTER TABLE public.browse_root_collections_current_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229            �           2604    129734    collections id    DEFAULT     p   ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);
 =   ALTER TABLE public.collections ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    232            �           2604    129735 &   collections_child_collections_links id    DEFAULT     �   ALTER TABLE ONLY public.collections_child_collections_links ALTER COLUMN id SET DEFAULT nextval('public.collections_child_collections_links_id_seq'::regclass);
 U   ALTER TABLE public.collections_child_collections_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    233            �           2604    129736 '   collections_parent_collections_links id    DEFAULT     �   ALTER TABLE ONLY public.collections_parent_collections_links ALTER COLUMN id SET DEFAULT nextval('public.collections_parent_collections_links_id_seq'::regclass);
 V   ALTER TABLE public.collections_parent_collections_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    236            �           2604    129737    comments id    DEFAULT     j   ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);
 :   ALTER TABLE public.comments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    238            �           2604    129738     comments_parent_comment_links id    DEFAULT     �   ALTER TABLE ONLY public.comments_parent_comment_links ALTER COLUMN id SET DEFAULT nextval('public.comments_parent_comment_links_id_seq'::regclass);
 O   ALTER TABLE public.comments_parent_comment_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    241    240            �           2604    129739    comments_picture_links id    DEFAULT     �   ALTER TABLE ONLY public.comments_picture_links ALTER COLUMN id SET DEFAULT nextval('public.comments_picture_links_id_seq'::regclass);
 H   ALTER TABLE public.comments_picture_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    243    242            �           2604    129740    components_common_synonyms id    DEFAULT     �   ALTER TABLE ONLY public.components_common_synonyms ALTER COLUMN id SET DEFAULT nextval('public.components_common_synonyms_id_seq'::regclass);
 L   ALTER TABLE public.components_common_synonyms ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    245    244            �           2604    129741 "   components_location_coordinates id    DEFAULT     �   ALTER TABLE ONLY public.components_location_coordinates ALTER COLUMN id SET DEFAULT nextval('public.components_location_coordinates_id_seq'::regclass);
 Q   ALTER TABLE public.components_location_coordinates ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    247    246            �           2604    129742    descriptions id    DEFAULT     r   ALTER TABLE ONLY public.descriptions ALTER COLUMN id SET DEFAULT nextval('public.descriptions_id_seq'::regclass);
 >   ALTER TABLE public.descriptions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    249    248            �           2604    129743    face_tags id    DEFAULT     l   ALTER TABLE ONLY public.face_tags ALTER COLUMN id SET DEFAULT nextval('public.face_tags_id_seq'::regclass);
 ;   ALTER TABLE public.face_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    251    250            �           2604    129744    face_tags_person_tag_links id    DEFAULT     �   ALTER TABLE ONLY public.face_tags_person_tag_links ALTER COLUMN id SET DEFAULT nextval('public.face_tags_person_tag_links_id_seq'::regclass);
 L   ALTER TABLE public.face_tags_person_tag_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    253    252            �           2604    129745    face_tags_picture_links id    DEFAULT     �   ALTER TABLE ONLY public.face_tags_picture_links ALTER COLUMN id SET DEFAULT nextval('public.face_tags_picture_links_id_seq'::regclass);
 I   ALTER TABLE public.face_tags_picture_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    255    254            �           2604    129746    files id    DEFAULT     d   ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);
 7   ALTER TABLE public.files ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    259    256            �           2604    129747    files_folder_links id    DEFAULT     ~   ALTER TABLE ONLY public.files_folder_links ALTER COLUMN id SET DEFAULT nextval('public.files_folder_links_id_seq'::regclass);
 D   ALTER TABLE public.files_folder_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    258    257            �           2604    129748    files_related_morphs id    DEFAULT     �   ALTER TABLE ONLY public.files_related_morphs ALTER COLUMN id SET DEFAULT nextval('public.files_related_morphs_id_seq'::regclass);
 F   ALTER TABLE public.files_related_morphs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    261    260            �           2604    129749    keyword_tags id    DEFAULT     r   ALTER TABLE ONLY public.keyword_tags ALTER COLUMN id SET DEFAULT nextval('public.keyword_tags_id_seq'::regclass);
 >   ALTER TABLE public.keyword_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    265    262            �           2604    129750    keyword_tags_components id    DEFAULT     �   ALTER TABLE ONLY public.keyword_tags_components ALTER COLUMN id SET DEFAULT nextval('public.keyword_tags_components_id_seq'::regclass);
 I   ALTER TABLE public.keyword_tags_components ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    264    263            �           2604    129751    links id    DEFAULT     d   ALTER TABLE ONLY public.links ALTER COLUMN id SET DEFAULT nextval('public.links_id_seq'::regclass);
 7   ALTER TABLE public.links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    269    266            �           2604    129752    links_archive_tag_links id    DEFAULT     �   ALTER TABLE ONLY public.links_archive_tag_links ALTER COLUMN id SET DEFAULT nextval('public.links_archive_tag_links_id_seq'::regclass);
 I   ALTER TABLE public.links_archive_tag_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    268    267            �           2604    129753    location_tags id    DEFAULT     t   ALTER TABLE ONLY public.location_tags ALTER COLUMN id SET DEFAULT nextval('public.location_tags_id_seq'::regclass);
 ?   ALTER TABLE public.location_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    273    270            �           2604    129754    location_tags_components id    DEFAULT     �   ALTER TABLE ONLY public.location_tags_components ALTER COLUMN id SET DEFAULT nextval('public.location_tags_components_id_seq'::regclass);
 J   ALTER TABLE public.location_tags_components ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    272    271                       2604    130638 "   location_tags_parent_tags_links id    DEFAULT     �   ALTER TABLE ONLY public.location_tags_parent_tags_links ALTER COLUMN id SET DEFAULT nextval('public.location_tags_parent_tags_links_id_seq'::regclass);
 Q   ALTER TABLE public.location_tags_parent_tags_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    346    347    347            �           2604    129755    parameterized_permissions id    DEFAULT     �   ALTER TABLE ONLY public.parameterized_permissions ALTER COLUMN id SET DEFAULT nextval('public.parameterized_permissions_id_seq'::regclass);
 K   ALTER TABLE public.parameterized_permissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    277    274            �           2604    129756 .   parameterized_permissions_archive_tag_links id    DEFAULT     �   ALTER TABLE ONLY public.parameterized_permissions_archive_tag_links ALTER COLUMN id SET DEFAULT nextval('public.parameterized_permissions_archive_tag_links_id_seq'::regclass);
 ]   ALTER TABLE public.parameterized_permissions_archive_tag_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    276    275            �           2604    129757 9   parameterized_permissions_users_permissions_user_links id    DEFAULT     �   ALTER TABLE ONLY public.parameterized_permissions_users_permissions_user_links ALTER COLUMN id SET DEFAULT nextval('public.parameterized_permissions_users_permissions_user_links_id_seq'::regclass);
 h   ALTER TABLE public.parameterized_permissions_users_permissions_user_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    279    278            �           2604    129758    person_tags id    DEFAULT     p   ALTER TABLE ONLY public.person_tags ALTER COLUMN id SET DEFAULT nextval('public.person_tags_id_seq'::regclass);
 =   ALTER TABLE public.person_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    283    280            �           2604    129759    person_tags_components id    DEFAULT     �   ALTER TABLE ONLY public.person_tags_components ALTER COLUMN id SET DEFAULT nextval('public.person_tags_components_id_seq'::regclass);
 H   ALTER TABLE public.person_tags_components ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    282    281            �           2604    129760    picture_geo_infos id    DEFAULT     |   ALTER TABLE ONLY public.picture_geo_infos ALTER COLUMN id SET DEFAULT nextval('public.picture_geo_infos_id_seq'::regclass);
 C   ALTER TABLE public.picture_geo_infos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    285    284            �           2604    129761 "   picture_geo_infos_picture_links id    DEFAULT     �   ALTER TABLE ONLY public.picture_geo_infos_picture_links ALTER COLUMN id SET DEFAULT nextval('public.picture_geo_infos_picture_links_id_seq'::regclass);
 Q   ALTER TABLE public.picture_geo_infos_picture_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    287    286            �           2604    129762    pictures id    DEFAULT     j   ALTER TABLE ONLY public.pictures ALTER COLUMN id SET DEFAULT nextval('public.pictures_id_seq'::regclass);
 :   ALTER TABLE public.pictures ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    295    288            �           2604    129763    pictures_archive_tag_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_archive_tag_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_archive_tag_links_id_seq'::regclass);
 L   ALTER TABLE public.pictures_archive_tag_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    290    289            �           2604    129764    pictures_collections_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_collections_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_collections_links_id_seq'::regclass);
 L   ALTER TABLE public.pictures_collections_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    292    291            �           2604    129765    pictures_descriptions_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_descriptions_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_descriptions_links_id_seq'::regclass);
 M   ALTER TABLE public.pictures_descriptions_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    294    293            �           2604    129766    pictures_keyword_tags_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_keyword_tags_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_keyword_tags_links_id_seq'::regclass);
 M   ALTER TABLE public.pictures_keyword_tags_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    297    296            �           2604    129767 !   pictures_linked_pictures_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_linked_pictures_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_linked_pictures_links_id_seq'::regclass);
 P   ALTER TABLE public.pictures_linked_pictures_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    299    298            �           2604    129768    pictures_linked_texts_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_linked_texts_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_linked_texts_links_id_seq'::regclass);
 M   ALTER TABLE public.pictures_linked_texts_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    301    300            �           2604    129769    pictures_location_tags_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_location_tags_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_location_tags_links_id_seq'::regclass);
 N   ALTER TABLE public.pictures_location_tags_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    303    302            �           2604    129770    pictures_person_tags_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_person_tags_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_person_tags_links_id_seq'::regclass);
 L   ALTER TABLE public.pictures_person_tags_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    305    304            �           2604    129771     pictures_time_range_tag_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_time_range_tag_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_time_range_tag_links_id_seq'::regclass);
 O   ALTER TABLE public.pictures_time_range_tag_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    307    306            �           2604    129772 '   pictures_verified_keyword_tags_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_verified_keyword_tags_links_id_seq'::regclass);
 V   ALTER TABLE public.pictures_verified_keyword_tags_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    309    308            �           2604    129773 (   pictures_verified_location_tags_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_verified_location_tags_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_verified_location_tags_links_id_seq'::regclass);
 W   ALTER TABLE public.pictures_verified_location_tags_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    311    310            �           2604    129774 &   pictures_verified_person_tags_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_verified_person_tags_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_verified_person_tags_links_id_seq'::regclass);
 U   ALTER TABLE public.pictures_verified_person_tags_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    313    312                        2604    129775 )   pictures_verified_time_range_tag_links id    DEFAULT     �   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links ALTER COLUMN id SET DEFAULT nextval('public.pictures_verified_time_range_tag_links_id_seq'::regclass);
 X   ALTER TABLE public.pictures_verified_time_range_tag_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    315    314                       2604    129776    strapi_api_token_permissions id    DEFAULT     �   ALTER TABLE ONLY public.strapi_api_token_permissions ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_token_permissions_id_seq'::regclass);
 N   ALTER TABLE public.strapi_api_token_permissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    317    316                       2604    129777 +   strapi_api_token_permissions_token_links id    DEFAULT     �   ALTER TABLE ONLY public.strapi_api_token_permissions_token_links ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_token_permissions_token_links_id_seq'::regclass);
 Z   ALTER TABLE public.strapi_api_token_permissions_token_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    319    318                       2604    129778    strapi_api_tokens id    DEFAULT     |   ALTER TABLE ONLY public.strapi_api_tokens ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_tokens_id_seq'::regclass);
 C   ALTER TABLE public.strapi_api_tokens ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    321    320                       2604    129779    strapi_core_store_settings id    DEFAULT     �   ALTER TABLE ONLY public.strapi_core_store_settings ALTER COLUMN id SET DEFAULT nextval('public.strapi_core_store_settings_id_seq'::regclass);
 L   ALTER TABLE public.strapi_core_store_settings ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    323    322                       2604    129780    strapi_database_schema id    DEFAULT     �   ALTER TABLE ONLY public.strapi_database_schema ALTER COLUMN id SET DEFAULT nextval('public.strapi_database_schema_id_seq'::regclass);
 H   ALTER TABLE public.strapi_database_schema ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    325    324                       2604    129781    strapi_migrations id    DEFAULT     |   ALTER TABLE ONLY public.strapi_migrations ALTER COLUMN id SET DEFAULT nextval('public.strapi_migrations_id_seq'::regclass);
 C   ALTER TABLE public.strapi_migrations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    327    326                       2604    129782    strapi_webhooks id    DEFAULT     x   ALTER TABLE ONLY public.strapi_webhooks ALTER COLUMN id SET DEFAULT nextval('public.strapi_webhooks_id_seq'::regclass);
 A   ALTER TABLE public.strapi_webhooks ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    329    328                       2604    129783    time_range_tags id    DEFAULT     x   ALTER TABLE ONLY public.time_range_tags ALTER COLUMN id SET DEFAULT nextval('public.time_range_tags_id_seq'::regclass);
 A   ALTER TABLE public.time_range_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    331    330            	           2604    129784    up_permissions id    DEFAULT     v   ALTER TABLE ONLY public.up_permissions ALTER COLUMN id SET DEFAULT nextval('public.up_permissions_id_seq'::regclass);
 @   ALTER TABLE public.up_permissions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    333    332            
           2604    129785    up_permissions_role_links id    DEFAULT     �   ALTER TABLE ONLY public.up_permissions_role_links ALTER COLUMN id SET DEFAULT nextval('public.up_permissions_role_links_id_seq'::regclass);
 K   ALTER TABLE public.up_permissions_role_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    335    334                       2604    129786    up_roles id    DEFAULT     j   ALTER TABLE ONLY public.up_roles ALTER COLUMN id SET DEFAULT nextval('public.up_roles_id_seq'::regclass);
 :   ALTER TABLE public.up_roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    337    336                       2604    129787    up_users id    DEFAULT     j   ALTER TABLE ONLY public.up_users ALTER COLUMN id SET DEFAULT nextval('public.up_users_id_seq'::regclass);
 :   ALTER TABLE public.up_users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    339    338                       2604    129788    up_users_role_links id    DEFAULT     �   ALTER TABLE ONLY public.up_users_role_links ALTER COLUMN id SET DEFAULT nextval('public.up_users_role_links_id_seq'::regclass);
 E   ALTER TABLE public.up_users_role_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    341    340                       2604    129789    upload_folders id    DEFAULT     v   ALTER TABLE ONLY public.upload_folders ALTER COLUMN id SET DEFAULT nextval('public.upload_folders_id_seq'::regclass);
 @   ALTER TABLE public.upload_folders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    343    342                       2604    129790    upload_folders_parent_links id    DEFAULT     �   ALTER TABLE ONLY public.upload_folders_parent_links ALTER COLUMN id SET DEFAULT nextval('public.upload_folders_parent_links_id_seq'::regclass);
 M   ALTER TABLE public.upload_folders_parent_links ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    345    344                      0    129418    admin_permissions 
   TABLE DATA           �   COPY public.admin_permissions (id, action, subject, properties, conditions, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    214   ��                0    129424    admin_permissions_role_links 
   TABLE DATA           R   COPY public.admin_permissions_role_links (permission_id, role_id, id) FROM stdin;
    public          postgres    false    216   ��                 0    129428    admin_roles 
   TABLE DATA           x   COPY public.admin_roles (id, name, code, description, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    218   �      "          0    129434    admin_users 
   TABLE DATA           �   COPY public.admin_users (id, firstname, lastname, username, email, password, reset_password_token, registration_token, is_active, blocked, prefered_language, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    220   ��      $          0    129440    admin_users_roles_links 
   TABLE DATA           G   COPY public.admin_users_roles_links (user_id, role_id, id) FROM stdin;
    public          postgres    false    222   ��      &          0    129444    archive_tags 
   TABLE DATA           �   COPY public.archive_tags (id, name, long_description, short_description, paypal_client, paypal_donation_text, paypal_purpose, created_at, updated_at, created_by_id, updated_by_id, restrict_image_downloading, published_at, email) FROM stdin;
    public          postgres    false    224   ��      (          0    129450 #   archive_tags_showcase_picture_links 
   TABLE DATA           ]   COPY public.archive_tags_showcase_picture_links (archive_tag_id, picture_id, id) FROM stdin;
    public          postgres    false    226   6�      *          0    129454    browse_root_collections 
   TABLE DATA           y   COPY public.browse_root_collections (id, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    228   Z�      +          0    129457 %   browse_root_collections_current_links 
   TABLE DATA           m   COPY public.browse_root_collections_current_links (browse_root_collection_id, collection_id, id) FROM stdin;
    public          postgres    false    229   ��      .          0    129462    collections 
   TABLE DATA           �   COPY public.collections (id, name, description, thumbnail, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    232   ��      /          0    129467 #   collections_child_collections_links 
   TABLE DATA           c   COPY public.collections_child_collections_links (collection_id, inv_collection_id, id) FROM stdin;
    public          postgres    false    233   ��      2          0    129472 $   collections_parent_collections_links 
   TABLE DATA           d   COPY public.collections_parent_collections_links (collection_id, inv_collection_id, id) FROM stdin;
    public          postgres    false    236          4          0    129476    comments 
   TABLE DATA           �   COPY public.comments (id, author, text, date, created_at, updated_at, published_at, created_by_id, updated_by_id, pinned) FROM stdin;
    public          postgres    false    238   ?       6          0    129482    comments_parent_comment_links 
   TABLE DATA           W   COPY public.comments_parent_comment_links (id, comment_id, inv_comment_id) FROM stdin;
    public          postgres    false    240   v      8          0    129486    comments_picture_links 
   TABLE DATA           L   COPY public.comments_picture_links (comment_id, picture_id, id) FROM stdin;
    public          postgres    false    242   �      :          0    129490    components_common_synonyms 
   TABLE DATA           >   COPY public.components_common_synonyms (id, name) FROM stdin;
    public          postgres    false    244   �      <          0    129494    components_location_coordinates 
   TABLE DATA           R   COPY public.components_location_coordinates (id, latitude, longitude) FROM stdin;
    public          postgres    false    246   ?      >          0    129498    descriptions 
   TABLE DATA           t   COPY public.descriptions (id, text, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    248   �      @          0    129504 	   face_tags 
   TABLE DATA           r   COPY public.face_tags (id, x, y, created_at, updated_at, created_by_id, updated_by_id, tag_direction) FROM stdin;
    public          postgres    false    250   m      B          0    129508    face_tags_person_tag_links 
   TABLE DATA           T   COPY public.face_tags_person_tag_links (id, face_tag_id, person_tag_id) FROM stdin;
    public          postgres    false    252   �      D          0    129512    face_tags_picture_links 
   TABLE DATA           N   COPY public.face_tags_picture_links (id, face_tag_id, picture_id) FROM stdin;
    public          postgres    false    254   �      F          0    129516    files 
   TABLE DATA           �   COPY public.files (id, name, alternative_text, caption, width, height, formats, hash, ext, mime, size, url, preview_url, provider, provider_metadata, created_at, updated_at, created_by_id, updated_by_id, folder_path) FROM stdin;
    public          postgres    false    256   �      G          0    129521    files_folder_links 
   TABLE DATA           D   COPY public.files_folder_links (id, file_id, folder_id) FROM stdin;
    public          postgres    false    257   �      J          0    129526    files_related_morphs 
   TABLE DATA           e   COPY public.files_related_morphs (file_id, related_id, related_type, field, "order", id) FROM stdin;
    public          postgres    false    260   �      L          0    129532    keyword_tags 
   TABLE DATA           o   COPY public.keyword_tags (id, name, created_at, updated_at, created_by_id, updated_by_id, visible) FROM stdin;
    public          postgres    false    262   �      M          0    129535    keyword_tags_components 
   TABLE DATA           n   COPY public.keyword_tags_components (id, entity_id, component_id, component_type, field, "order") FROM stdin;
    public          postgres    false    263   �      P          0    129543    links 
   TABLE DATA           e   COPY public.links (id, title, url, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    266   �      Q          0    129548    links_archive_tag_links 
   TABLE DATA           N   COPY public.links_archive_tag_links (link_id, archive_tag_id, id) FROM stdin;
    public          postgres    false    267         T          0    129553    location_tags 
   TABLE DATA           �   COPY public.location_tags (id, name, created_at, updated_at, created_by_id, updated_by_id, visible, accepted, root) FROM stdin;
    public          postgres    false    270   +      U          0    129556    location_tags_components 
   TABLE DATA           o   COPY public.location_tags_components (id, entity_id, component_id, component_type, field, "order") FROM stdin;
    public          postgres    false    271   9      �          0    130635    location_tags_parent_tags_links 
   TABLE DATA           c   COPY public.location_tags_parent_tags_links (id, location_tag_id, inv_location_tag_id) FROM stdin;
    public          postgres    false    347   �      X          0    129564    parameterized_permissions 
   TABLE DATA           �   COPY public.parameterized_permissions (id, operation_name, on_other_users, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    274   �      Y          0    129567 +   parameterized_permissions_archive_tag_links 
   TABLE DATA           v   COPY public.parameterized_permissions_archive_tag_links (id, parameterized_permission_id, archive_tag_id) FROM stdin;
    public          postgres    false    275   0      \          0    129572 6   parameterized_permissions_users_permissions_user_links 
   TABLE DATA           z   COPY public.parameterized_permissions_users_permissions_user_links (id, parameterized_permission_id, user_id) FROM stdin;
    public          postgres    false    278   �      ^          0    129576    person_tags 
   TABLE DATA           e   COPY public.person_tags (id, name, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    280   �      _          0    129579    person_tags_components 
   TABLE DATA           m   COPY public.person_tags_components (id, entity_id, component_id, component_type, field, "order") FROM stdin;
    public          postgres    false    281   C       b          0    129587    picture_geo_infos 
   TABLE DATA           �   COPY public.picture_geo_infos (id, latitude, longitude, radius, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    284   �       d          0    129591    picture_geo_infos_picture_links 
   TABLE DATA           ^   COPY public.picture_geo_infos_picture_links (id, picture_geo_info_id, picture_id) FROM stdin;
    public          postgres    false    286   �       f          0    129595    pictures 
   TABLE DATA           �   COPY public.pictures (id, wordpress_id, is_text, archive_identifier, likes, is_not_a_place_count, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    288   �       g          0    129598    pictures_archive_tag_links 
   TABLE DATA           T   COPY public.pictures_archive_tag_links (picture_id, archive_tag_id, id) FROM stdin;
    public          postgres    false    289   �#      i          0    129602    pictures_collections_links 
   TABLE DATA           S   COPY public.pictures_collections_links (picture_id, collection_id, id) FROM stdin;
    public          postgres    false    291   �#      k          0    129606    pictures_descriptions_links 
   TABLE DATA           U   COPY public.pictures_descriptions_links (picture_id, description_id, id) FROM stdin;
    public          postgres    false    293   �%      n          0    129611    pictures_keyword_tags_links 
   TABLE DATA           U   COPY public.pictures_keyword_tags_links (picture_id, keyword_tag_id, id) FROM stdin;
    public          postgres    false    296   �%      p          0    129615    pictures_linked_pictures_links 
   TABLE DATA           X   COPY public.pictures_linked_pictures_links (id, picture_id, inv_picture_id) FROM stdin;
    public          postgres    false    298   &      r          0    129619    pictures_linked_texts_links 
   TABLE DATA           U   COPY public.pictures_linked_texts_links (id, picture_id, inv_picture_id) FROM stdin;
    public          postgres    false    300   4&      t          0    129623    pictures_location_tags_links 
   TABLE DATA           W   COPY public.pictures_location_tags_links (picture_id, location_tag_id, id) FROM stdin;
    public          postgres    false    302   Q&      v          0    129627    pictures_person_tags_links 
   TABLE DATA           S   COPY public.pictures_person_tags_links (picture_id, person_tag_id, id) FROM stdin;
    public          postgres    false    304   t&      x          0    129631    pictures_time_range_tag_links 
   TABLE DATA           Z   COPY public.pictures_time_range_tag_links (picture_id, time_range_tag_id, id) FROM stdin;
    public          postgres    false    306   �&      z          0    129635 $   pictures_verified_keyword_tags_links 
   TABLE DATA           ^   COPY public.pictures_verified_keyword_tags_links (picture_id, keyword_tag_id, id) FROM stdin;
    public          postgres    false    308   �&      |          0    129639 %   pictures_verified_location_tags_links 
   TABLE DATA           `   COPY public.pictures_verified_location_tags_links (picture_id, location_tag_id, id) FROM stdin;
    public          postgres    false    310   L'      ~          0    129643 #   pictures_verified_person_tags_links 
   TABLE DATA           \   COPY public.pictures_verified_person_tags_links (picture_id, person_tag_id, id) FROM stdin;
    public          postgres    false    312   �'      �          0    129647 &   pictures_verified_time_range_tag_links 
   TABLE DATA           c   COPY public.pictures_verified_time_range_tag_links (picture_id, time_range_tag_id, id) FROM stdin;
    public          postgres    false    314   (      �          0    129651    strapi_api_token_permissions 
   TABLE DATA           x   COPY public.strapi_api_token_permissions (id, action, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    316   ?(      �          0    129655 (   strapi_api_token_permissions_token_links 
   TABLE DATA           m   COPY public.strapi_api_token_permissions_token_links (id, api_token_permission_id, api_token_id) FROM stdin;
    public          postgres    false    318   \(      �          0    129659    strapi_api_tokens 
   TABLE DATA           �   COPY public.strapi_api_tokens (id, name, description, type, access_key, created_at, updated_at, created_by_id, updated_by_id, last_used_at, expires_at, lifespan) FROM stdin;
    public          postgres    false    320   y(      �          0    129665    strapi_core_store_settings 
   TABLE DATA           \   COPY public.strapi_core_store_settings (id, key, value, type, environment, tag) FROM stdin;
    public          postgres    false    322   �(      �          0    129671    strapi_database_schema 
   TABLE DATA           J   COPY public.strapi_database_schema (id, schema, "time", hash) FROM stdin;
    public          postgres    false    324   cL      �          0    129677    strapi_migrations 
   TABLE DATA           =   COPY public.strapi_migrations (id, name, "time") FROM stdin;
    public          postgres    false    326   IZ      �          0    129681    strapi_webhooks 
   TABLE DATA           R   COPY public.strapi_webhooks (id, name, url, headers, events, enabled) FROM stdin;
    public          postgres    false    328   fZ      �          0    129687    time_range_tags 
   TABLE DATA           ~   COPY public.time_range_tags (id, start, "end", created_at, updated_at, created_by_id, updated_by_id, is_estimate) FROM stdin;
    public          postgres    false    330   �Z      �          0    129691    up_permissions 
   TABLE DATA           j   COPY public.up_permissions (id, action, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    332   _[      �          0    129695    up_permissions_role_links 
   TABLE DATA           O   COPY public.up_permissions_role_links (permission_id, role_id, id) FROM stdin;
    public          postgres    false    334   �^      �          0    129699    up_roles 
   TABLE DATA           u   COPY public.up_roles (id, name, description, type, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    336   6`      �          0    129705    up_users 
   TABLE DATA           �   COPY public.up_users (id, username, email, provider, password, reset_password_token, confirmation_token, confirmed, blocked, created_at, updated_at, created_by_id, updated_by_id, is_super_user, reset_password_token_created_at) FROM stdin;
    public          postgres    false    338   �`      �          0    129711    up_users_role_links 
   TABLE DATA           C   COPY public.up_users_role_links (user_id, role_id, id) FROM stdin;
    public          postgres    false    340   �a      �          0    129715    upload_folders 
   TABLE DATA           w   COPY public.upload_folders (id, name, path_id, path, created_at, updated_at, created_by_id, updated_by_id) FROM stdin;
    public          postgres    false    342   �a      �          0    129721    upload_folders_parent_links 
   TABLE DATA           S   COPY public.upload_folders_parent_links (id, folder_id, inv_folder_id) FROM stdin;
    public          postgres    false    344   �a      �           0    0    admin_permissions_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.admin_permissions_id_seq', 262, true);
          public          postgres    false    215            �           0    0 #   admin_permissions_role_links_id_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.admin_permissions_role_links_id_seq', 236, true);
          public          postgres    false    217            �           0    0    admin_roles_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_roles_id_seq', 3, true);
          public          postgres    false    219            �           0    0    admin_users_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);
          public          postgres    false    221            �           0    0    admin_users_roles_links_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.admin_users_roles_links_id_seq', 1, true);
          public          postgres    false    223            �           0    0    archive_tags_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.archive_tags_id_seq', 1, true);
          public          postgres    false    225            �           0    0 *   archive_tags_showcase_picture_links_id_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.archive_tags_showcase_picture_links_id_seq', 97, true);
          public          postgres    false    227            �           0    0 ,   browse_root_collections_current_links_id_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.browse_root_collections_current_links_id_seq', 1, true);
          public          postgres    false    230            �           0    0    browse_root_collections_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.browse_root_collections_id_seq', 1, true);
          public          postgres    false    231            �           0    0 *   collections_child_collections_links_id_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.collections_child_collections_links_id_seq', 1, false);
          public          postgres    false    234            �           0    0    collections_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.collections_id_seq', 18, true);
          public          postgres    false    235            �           0    0 +   collections_parent_collections_links_id_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.collections_parent_collections_links_id_seq', 18, true);
          public          postgres    false    237            �           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 43, true);
          public          postgres    false    239            �           0    0 $   comments_parent_comment_links_id_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('public.comments_parent_comment_links_id_seq', 21, true);
          public          postgres    false    241            �           0    0    comments_picture_links_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.comments_picture_links_id_seq', 43, true);
          public          postgres    false    243            �           0    0 !   components_common_synonyms_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.components_common_synonyms_id_seq', 10, true);
          public          postgres    false    245            �           0    0 &   components_location_coordinates_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.components_location_coordinates_id_seq', 2, true);
          public          postgres    false    247            �           0    0    descriptions_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.descriptions_id_seq', 4, true);
          public          postgres    false    249            �           0    0    face_tags_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.face_tags_id_seq', 1, false);
          public          postgres    false    251            �           0    0 !   face_tags_person_tag_links_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.face_tags_person_tag_links_id_seq', 1, false);
          public          postgres    false    253                        0    0    face_tags_picture_links_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.face_tags_picture_links_id_seq', 1, false);
          public          postgres    false    255                       0    0    files_folder_links_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.files_folder_links_id_seq', 1, false);
          public          postgres    false    258                       0    0    files_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.files_id_seq', 79, true);
          public          postgres    false    259                       0    0    files_related_morphs_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.files_related_morphs_id_seq', 179, true);
          public          postgres    false    261                       0    0    keyword_tags_components_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.keyword_tags_components_id_seq', 4, true);
          public          postgres    false    264                       0    0    keyword_tags_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.keyword_tags_id_seq', 17, true);
          public          postgres    false    265                       0    0    links_archive_tag_links_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.links_archive_tag_links_id_seq', 117, true);
          public          postgres    false    268                       0    0    links_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.links_id_seq', 117, true);
          public          postgres    false    269                       0    0    location_tags_components_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.location_tags_components_id_seq', 8, true);
          public          postgres    false    272            	           0    0    location_tags_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.location_tags_id_seq', 16, true);
          public          postgres    false    273            
           0    0 &   location_tags_parent_tags_links_id_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.location_tags_parent_tags_links_id_seq', 1, false);
          public          postgres    false    346                       0    0 2   parameterized_permissions_archive_tag_links_id_seq    SEQUENCE SET     a   SELECT pg_catalog.setval('public.parameterized_permissions_archive_tag_links_id_seq', 20, true);
          public          postgres    false    276                       0    0     parameterized_permissions_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.parameterized_permissions_id_seq', 83, true);
          public          postgres    false    277                       0    0 =   parameterized_permissions_users_permissions_user_links_id_seq    SEQUENCE SET     l   SELECT pg_catalog.setval('public.parameterized_permissions_users_permissions_user_links_id_seq', 83, true);
          public          postgres    false    279                       0    0    person_tags_components_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.person_tags_components_id_seq', 2, true);
          public          postgres    false    282                       0    0    person_tags_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.person_tags_id_seq', 8, true);
          public          postgres    false    283                       0    0    picture_geo_infos_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.picture_geo_infos_id_seq', 1, false);
          public          postgres    false    285                       0    0 &   picture_geo_infos_picture_links_id_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.picture_geo_infos_picture_links_id_seq', 1, false);
          public          postgres    false    287                       0    0 !   pictures_archive_tag_links_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.pictures_archive_tag_links_id_seq', 16, true);
          public          postgres    false    290                       0    0 !   pictures_collections_links_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.pictures_collections_links_id_seq', 123, true);
          public          postgres    false    292                       0    0 "   pictures_descriptions_links_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.pictures_descriptions_links_id_seq', 17, true);
          public          postgres    false    294                       0    0    pictures_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.pictures_id_seq', 133, true);
          public          postgres    false    295                       0    0 "   pictures_keyword_tags_links_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.pictures_keyword_tags_links_id_seq', 1, true);
          public          postgres    false    297                       0    0 %   pictures_linked_pictures_links_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.pictures_linked_pictures_links_id_seq', 14, true);
          public          postgres    false    299                       0    0 "   pictures_linked_texts_links_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.pictures_linked_texts_links_id_seq', 1, false);
          public          postgres    false    301                       0    0 #   pictures_location_tags_links_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.pictures_location_tags_links_id_seq', 1, true);
          public          postgres    false    303                       0    0 !   pictures_person_tags_links_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.pictures_person_tags_links_id_seq', 1, false);
          public          postgres    false    305                       0    0 $   pictures_time_range_tag_links_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.pictures_time_range_tag_links_id_seq', 9, true);
          public          postgres    false    307                       0    0 +   pictures_verified_keyword_tags_links_id_seq    SEQUENCE SET     Z   SELECT pg_catalog.setval('public.pictures_verified_keyword_tags_links_id_seq', 40, true);
          public          postgres    false    309                       0    0 ,   pictures_verified_location_tags_links_id_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('public.pictures_verified_location_tags_links_id_seq', 46, true);
          public          postgres    false    311                       0    0 *   pictures_verified_person_tags_links_id_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.pictures_verified_person_tags_links_id_seq', 26, true);
          public          postgres    false    313                       0    0 -   pictures_verified_time_range_tag_links_id_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('public.pictures_verified_time_range_tag_links_id_seq', 3, true);
          public          postgres    false    315                        0    0 #   strapi_api_token_permissions_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.strapi_api_token_permissions_id_seq', 1, false);
          public          postgres    false    317            !           0    0 /   strapi_api_token_permissions_token_links_id_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('public.strapi_api_token_permissions_token_links_id_seq', 1, false);
          public          postgres    false    319            "           0    0    strapi_api_tokens_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.strapi_api_tokens_id_seq', 1, false);
          public          postgres    false    321            #           0    0 !   strapi_core_store_settings_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.strapi_core_store_settings_id_seq', 36, true);
          public          postgres    false    323            $           0    0    strapi_database_schema_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.strapi_database_schema_id_seq', 10, true);
          public          postgres    false    325            %           0    0    strapi_migrations_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.strapi_migrations_id_seq', 1, false);
          public          postgres    false    327            &           0    0    strapi_webhooks_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.strapi_webhooks_id_seq', 1, false);
          public          postgres    false    329            '           0    0    time_range_tags_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.time_range_tags_id_seq', 9, true);
          public          postgres    false    331            (           0    0    up_permissions_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.up_permissions_id_seq', 102, true);
          public          postgres    false    333            )           0    0     up_permissions_role_links_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.up_permissions_role_links_id_seq', 96, true);
          public          postgres    false    335            *           0    0    up_roles_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.up_roles_id_seq', 3, true);
          public          postgres    false    337            +           0    0    up_users_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.up_users_id_seq', 1, true);
          public          postgres    false    339            ,           0    0    up_users_role_links_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.up_users_role_links_id_seq', 5, true);
          public          postgres    false    341            -           0    0    upload_folders_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.upload_folders_id_seq', 1, false);
          public          postgres    false    343            .           0    0 "   upload_folders_parent_links_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.upload_folders_parent_links_id_seq', 1, false);
          public          postgres    false    345                       2606    129794 (   admin_permissions admin_permissions_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.admin_permissions DROP CONSTRAINT admin_permissions_pkey;
       public            postgres    false    214                       2606    129796 >   admin_permissions_role_links admin_permissions_role_links_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.admin_permissions_role_links
    ADD CONSTRAINT admin_permissions_role_links_pkey PRIMARY KEY (id);
 h   ALTER TABLE ONLY public.admin_permissions_role_links DROP CONSTRAINT admin_permissions_role_links_pkey;
       public            postgres    false    216                       2606    129798    admin_roles admin_roles_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.admin_roles DROP CONSTRAINT admin_roles_pkey;
       public            postgres    false    218                       2606    129800    admin_users admin_users_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.admin_users DROP CONSTRAINT admin_users_pkey;
       public            postgres    false    220            $           2606    129802 4   admin_users_roles_links admin_users_roles_links_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.admin_users_roles_links
    ADD CONSTRAINT admin_users_roles_links_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.admin_users_roles_links DROP CONSTRAINT admin_users_roles_links_pkey;
       public            postgres    false    222            '           2606    129804    archive_tags archive_tags_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.archive_tags
    ADD CONSTRAINT archive_tags_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.archive_tags DROP CONSTRAINT archive_tags_pkey;
       public            postgres    false    224            ,           2606    129806 L   archive_tags_showcase_picture_links archive_tags_showcase_picture_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.archive_tags_showcase_picture_links
    ADD CONSTRAINT archive_tags_showcase_picture_links_pkey PRIMARY KEY (id);
 v   ALTER TABLE ONLY public.archive_tags_showcase_picture_links DROP CONSTRAINT archive_tags_showcase_picture_links_pkey;
       public            postgres    false    226            4           2606    129808 P   browse_root_collections_current_links browse_root_collections_current_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.browse_root_collections_current_links
    ADD CONSTRAINT browse_root_collections_current_links_pkey PRIMARY KEY (id);
 z   ALTER TABLE ONLY public.browse_root_collections_current_links DROP CONSTRAINT browse_root_collections_current_links_pkey;
       public            postgres    false    229            /           2606    129810 4   browse_root_collections browse_root_collections_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.browse_root_collections
    ADD CONSTRAINT browse_root_collections_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.browse_root_collections DROP CONSTRAINT browse_root_collections_pkey;
       public            postgres    false    228            <           2606    129812 L   collections_child_collections_links collections_child_collections_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.collections_child_collections_links
    ADD CONSTRAINT collections_child_collections_links_pkey PRIMARY KEY (id);
 v   ALTER TABLE ONLY public.collections_child_collections_links DROP CONSTRAINT collections_child_collections_links_pkey;
       public            postgres    false    233            @           2606    129814 N   collections_parent_collections_links collections_parent_collections_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.collections_parent_collections_links
    ADD CONSTRAINT collections_parent_collections_links_pkey PRIMARY KEY (id);
 x   ALTER TABLE ONLY public.collections_parent_collections_links DROP CONSTRAINT collections_parent_collections_links_pkey;
       public            postgres    false    236            7           2606    129816    collections collections_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.collections DROP CONSTRAINT collections_pkey;
       public            postgres    false    232            H           2606    129818 @   comments_parent_comment_links comments_parent_comment_links_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.comments_parent_comment_links
    ADD CONSTRAINT comments_parent_comment_links_pkey PRIMARY KEY (id);
 j   ALTER TABLE ONLY public.comments_parent_comment_links DROP CONSTRAINT comments_parent_comment_links_pkey;
       public            postgres    false    240            L           2606    129820 2   comments_picture_links comments_picture_links_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.comments_picture_links
    ADD CONSTRAINT comments_picture_links_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.comments_picture_links DROP CONSTRAINT comments_picture_links_pkey;
       public            postgres    false    242            C           2606    129822    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public            postgres    false    238            N           2606    129824 :   components_common_synonyms components_common_synonyms_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.components_common_synonyms
    ADD CONSTRAINT components_common_synonyms_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.components_common_synonyms DROP CONSTRAINT components_common_synonyms_pkey;
       public            postgres    false    244            P           2606    129826 D   components_location_coordinates components_location_coordinates_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.components_location_coordinates
    ADD CONSTRAINT components_location_coordinates_pkey PRIMARY KEY (id);
 n   ALTER TABLE ONLY public.components_location_coordinates DROP CONSTRAINT components_location_coordinates_pkey;
       public            postgres    false    246            S           2606    129828    descriptions descriptions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT descriptions_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.descriptions DROP CONSTRAINT descriptions_pkey;
       public            postgres    false    248            \           2606    129830 :   face_tags_person_tag_links face_tags_person_tag_links_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.face_tags_person_tag_links
    ADD CONSTRAINT face_tags_person_tag_links_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.face_tags_person_tag_links DROP CONSTRAINT face_tags_person_tag_links_pkey;
       public            postgres    false    252            `           2606    129832 4   face_tags_picture_links face_tags_picture_links_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.face_tags_picture_links
    ADD CONSTRAINT face_tags_picture_links_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.face_tags_picture_links DROP CONSTRAINT face_tags_picture_links_pkey;
       public            postgres    false    254            W           2606    129834    face_tags face_tags_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.face_tags
    ADD CONSTRAINT face_tags_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.face_tags DROP CONSTRAINT face_tags_pkey;
       public            postgres    false    250            i           2606    129836 *   files_folder_links files_folder_links_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.files_folder_links
    ADD CONSTRAINT files_folder_links_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.files_folder_links DROP CONSTRAINT files_folder_links_pkey;
       public            postgres    false    257            c           2606    129838    files files_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.files DROP CONSTRAINT files_pkey;
       public            postgres    false    256            l           2606    129840 .   files_related_morphs files_related_morphs_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.files_related_morphs
    ADD CONSTRAINT files_related_morphs_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.files_related_morphs DROP CONSTRAINT files_related_morphs_pkey;
       public            postgres    false    260            s           2606    129842 4   keyword_tags_components keyword_tags_components_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.keyword_tags_components
    ADD CONSTRAINT keyword_tags_components_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.keyword_tags_components DROP CONSTRAINT keyword_tags_components_pkey;
       public            postgres    false    263            o           2606    129844    keyword_tags keyword_tags_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.keyword_tags
    ADD CONSTRAINT keyword_tags_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.keyword_tags DROP CONSTRAINT keyword_tags_pkey;
       public            postgres    false    262            }           2606    129846 4   links_archive_tag_links links_archive_tag_links_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.links_archive_tag_links
    ADD CONSTRAINT links_archive_tag_links_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.links_archive_tag_links DROP CONSTRAINT links_archive_tag_links_pkey;
       public            postgres    false    267            x           2606    129848    links links_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.links DROP CONSTRAINT links_pkey;
       public            postgres    false    266            �           2606    129850 6   location_tags_components location_tags_components_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.location_tags_components
    ADD CONSTRAINT location_tags_components_pkey PRIMARY KEY (id);
 `   ALTER TABLE ONLY public.location_tags_components DROP CONSTRAINT location_tags_components_pkey;
       public            postgres    false    271                       2606    130640 D   location_tags_parent_tags_links location_tags_parent_tags_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.location_tags_parent_tags_links
    ADD CONSTRAINT location_tags_parent_tags_links_pkey PRIMARY KEY (id);
 n   ALTER TABLE ONLY public.location_tags_parent_tags_links DROP CONSTRAINT location_tags_parent_tags_links_pkey;
       public            postgres    false    347            �           2606    129852     location_tags location_tags_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.location_tags
    ADD CONSTRAINT location_tags_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.location_tags DROP CONSTRAINT location_tags_pkey;
       public            postgres    false    270            �           2606    129854 \   parameterized_permissions_archive_tag_links parameterized_permissions_archive_tag_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.parameterized_permissions_archive_tag_links
    ADD CONSTRAINT parameterized_permissions_archive_tag_links_pkey PRIMARY KEY (id);
 �   ALTER TABLE ONLY public.parameterized_permissions_archive_tag_links DROP CONSTRAINT parameterized_permissions_archive_tag_links_pkey;
       public            postgres    false    275            �           2606    129856 8   parameterized_permissions parameterized_permissions_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.parameterized_permissions
    ADD CONSTRAINT parameterized_permissions_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.parameterized_permissions DROP CONSTRAINT parameterized_permissions_pkey;
       public            postgres    false    274            �           2606    129858 r   parameterized_permissions_users_permissions_user_links parameterized_permissions_users_permissions_user_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.parameterized_permissions_users_permissions_user_links
    ADD CONSTRAINT parameterized_permissions_users_permissions_user_links_pkey PRIMARY KEY (id);
 �   ALTER TABLE ONLY public.parameterized_permissions_users_permissions_user_links DROP CONSTRAINT parameterized_permissions_users_permissions_user_links_pkey;
       public            postgres    false    278            �           2606    129860 2   person_tags_components person_tags_components_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.person_tags_components
    ADD CONSTRAINT person_tags_components_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.person_tags_components DROP CONSTRAINT person_tags_components_pkey;
       public            postgres    false    281            �           2606    129862    person_tags person_tags_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.person_tags
    ADD CONSTRAINT person_tags_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.person_tags DROP CONSTRAINT person_tags_pkey;
       public            postgres    false    280            �           2606    129864 D   picture_geo_infos_picture_links picture_geo_infos_picture_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.picture_geo_infos_picture_links
    ADD CONSTRAINT picture_geo_infos_picture_links_pkey PRIMARY KEY (id);
 n   ALTER TABLE ONLY public.picture_geo_infos_picture_links DROP CONSTRAINT picture_geo_infos_picture_links_pkey;
       public            postgres    false    286            �           2606    129866 (   picture_geo_infos picture_geo_infos_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.picture_geo_infos
    ADD CONSTRAINT picture_geo_infos_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.picture_geo_infos DROP CONSTRAINT picture_geo_infos_pkey;
       public            postgres    false    284            �           2606    129868 :   pictures_archive_tag_links pictures_archive_tag_links_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.pictures_archive_tag_links
    ADD CONSTRAINT pictures_archive_tag_links_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.pictures_archive_tag_links DROP CONSTRAINT pictures_archive_tag_links_pkey;
       public            postgres    false    289            �           2606    129870 :   pictures_collections_links pictures_collections_links_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.pictures_collections_links
    ADD CONSTRAINT pictures_collections_links_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.pictures_collections_links DROP CONSTRAINT pictures_collections_links_pkey;
       public            postgres    false    291            �           2606    129872 <   pictures_descriptions_links pictures_descriptions_links_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.pictures_descriptions_links
    ADD CONSTRAINT pictures_descriptions_links_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.pictures_descriptions_links DROP CONSTRAINT pictures_descriptions_links_pkey;
       public            postgres    false    293            �           2606    129874 <   pictures_keyword_tags_links pictures_keyword_tags_links_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.pictures_keyword_tags_links
    ADD CONSTRAINT pictures_keyword_tags_links_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.pictures_keyword_tags_links DROP CONSTRAINT pictures_keyword_tags_links_pkey;
       public            postgres    false    296            �           2606    129876 B   pictures_linked_pictures_links pictures_linked_pictures_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.pictures_linked_pictures_links
    ADD CONSTRAINT pictures_linked_pictures_links_pkey PRIMARY KEY (id);
 l   ALTER TABLE ONLY public.pictures_linked_pictures_links DROP CONSTRAINT pictures_linked_pictures_links_pkey;
       public            postgres    false    298            �           2606    129878 <   pictures_linked_texts_links pictures_linked_texts_links_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.pictures_linked_texts_links
    ADD CONSTRAINT pictures_linked_texts_links_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.pictures_linked_texts_links DROP CONSTRAINT pictures_linked_texts_links_pkey;
       public            postgres    false    300            �           2606    129880 >   pictures_location_tags_links pictures_location_tags_links_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.pictures_location_tags_links
    ADD CONSTRAINT pictures_location_tags_links_pkey PRIMARY KEY (id);
 h   ALTER TABLE ONLY public.pictures_location_tags_links DROP CONSTRAINT pictures_location_tags_links_pkey;
       public            postgres    false    302            �           2606    129882 :   pictures_person_tags_links pictures_person_tags_links_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.pictures_person_tags_links
    ADD CONSTRAINT pictures_person_tags_links_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.pictures_person_tags_links DROP CONSTRAINT pictures_person_tags_links_pkey;
       public            postgres    false    304            �           2606    129884    pictures pictures_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.pictures DROP CONSTRAINT pictures_pkey;
       public            postgres    false    288            �           2606    129886 @   pictures_time_range_tag_links pictures_time_range_tag_links_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.pictures_time_range_tag_links
    ADD CONSTRAINT pictures_time_range_tag_links_pkey PRIMARY KEY (id);
 j   ALTER TABLE ONLY public.pictures_time_range_tag_links DROP CONSTRAINT pictures_time_range_tag_links_pkey;
       public            postgres    false    306            �           2606    129888 N   pictures_verified_keyword_tags_links pictures_verified_keyword_tags_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links
    ADD CONSTRAINT pictures_verified_keyword_tags_links_pkey PRIMARY KEY (id);
 x   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links DROP CONSTRAINT pictures_verified_keyword_tags_links_pkey;
       public            postgres    false    308            �           2606    129890 P   pictures_verified_location_tags_links pictures_verified_location_tags_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_location_tags_links
    ADD CONSTRAINT pictures_verified_location_tags_links_pkey PRIMARY KEY (id);
 z   ALTER TABLE ONLY public.pictures_verified_location_tags_links DROP CONSTRAINT pictures_verified_location_tags_links_pkey;
       public            postgres    false    310            �           2606    129892 L   pictures_verified_person_tags_links pictures_verified_person_tags_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_person_tags_links
    ADD CONSTRAINT pictures_verified_person_tags_links_pkey PRIMARY KEY (id);
 v   ALTER TABLE ONLY public.pictures_verified_person_tags_links DROP CONSTRAINT pictures_verified_person_tags_links_pkey;
       public            postgres    false    312            �           2606    129894 R   pictures_verified_time_range_tag_links pictures_verified_time_range_tag_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links
    ADD CONSTRAINT pictures_verified_time_range_tag_links_pkey PRIMARY KEY (id);
 |   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links DROP CONSTRAINT pictures_verified_time_range_tag_links_pkey;
       public            postgres    false    314            �           2606    129896 >   strapi_api_token_permissions strapi_api_token_permissions_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_pkey PRIMARY KEY (id);
 h   ALTER TABLE ONLY public.strapi_api_token_permissions DROP CONSTRAINT strapi_api_token_permissions_pkey;
       public            postgres    false    316            �           2606    129898 V   strapi_api_token_permissions_token_links strapi_api_token_permissions_token_links_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.strapi_api_token_permissions_token_links
    ADD CONSTRAINT strapi_api_token_permissions_token_links_pkey PRIMARY KEY (id);
 �   ALTER TABLE ONLY public.strapi_api_token_permissions_token_links DROP CONSTRAINT strapi_api_token_permissions_token_links_pkey;
       public            postgres    false    318            �           2606    129900 (   strapi_api_tokens strapi_api_tokens_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.strapi_api_tokens DROP CONSTRAINT strapi_api_tokens_pkey;
       public            postgres    false    320            �           2606    129902 :   strapi_core_store_settings strapi_core_store_settings_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.strapi_core_store_settings
    ADD CONSTRAINT strapi_core_store_settings_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.strapi_core_store_settings DROP CONSTRAINT strapi_core_store_settings_pkey;
       public            postgres    false    322            �           2606    129904 2   strapi_database_schema strapi_database_schema_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.strapi_database_schema
    ADD CONSTRAINT strapi_database_schema_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.strapi_database_schema DROP CONSTRAINT strapi_database_schema_pkey;
       public            postgres    false    324            �           2606    129906 (   strapi_migrations strapi_migrations_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.strapi_migrations
    ADD CONSTRAINT strapi_migrations_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.strapi_migrations DROP CONSTRAINT strapi_migrations_pkey;
       public            postgres    false    326            �           2606    129908 $   strapi_webhooks strapi_webhooks_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.strapi_webhooks
    ADD CONSTRAINT strapi_webhooks_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.strapi_webhooks DROP CONSTRAINT strapi_webhooks_pkey;
       public            postgres    false    328            �           2606    129910 $   time_range_tags time_range_tags_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.time_range_tags
    ADD CONSTRAINT time_range_tags_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.time_range_tags DROP CONSTRAINT time_range_tags_pkey;
       public            postgres    false    330            �           2606    129912 "   up_permissions up_permissions_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.up_permissions DROP CONSTRAINT up_permissions_pkey;
       public            postgres    false    332            �           2606    129914 8   up_permissions_role_links up_permissions_role_links_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public.up_permissions_role_links
    ADD CONSTRAINT up_permissions_role_links_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY public.up_permissions_role_links DROP CONSTRAINT up_permissions_role_links_pkey;
       public            postgres    false    334            �           2606    129916    up_roles up_roles_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.up_roles DROP CONSTRAINT up_roles_pkey;
       public            postgres    false    336                       2606    129918    up_users up_users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.up_users DROP CONSTRAINT up_users_pkey;
       public            postgres    false    338                       2606    129920 ,   up_users_role_links up_users_role_links_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.up_users_role_links
    ADD CONSTRAINT up_users_role_links_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.up_users_role_links DROP CONSTRAINT up_users_role_links_pkey;
       public            postgres    false    340                       2606    129922 <   upload_folders_parent_links upload_folders_parent_links_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.upload_folders_parent_links
    ADD CONSTRAINT upload_folders_parent_links_pkey PRIMARY KEY (id);
 f   ALTER TABLE ONLY public.upload_folders_parent_links DROP CONSTRAINT upload_folders_parent_links_pkey;
       public            postgres    false    344            
           2606    129924 +   upload_folders upload_folders_path_id_index 
   CONSTRAINT     i   ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_path_id_index UNIQUE (path_id);
 U   ALTER TABLE ONLY public.upload_folders DROP CONSTRAINT upload_folders_path_id_index;
       public            postgres    false    342                       2606    129926 (   upload_folders upload_folders_path_index 
   CONSTRAINT     c   ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_path_index UNIQUE (path);
 R   ALTER TABLE ONLY public.upload_folders DROP CONSTRAINT upload_folders_path_index;
       public            postgres    false    342                       2606    129928 "   upload_folders upload_folders_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.upload_folders DROP CONSTRAINT upload_folders_pkey;
       public            postgres    false    342                       1259    129929 "   admin_permissions_created_by_id_fk    INDEX     i   CREATE INDEX admin_permissions_created_by_id_fk ON public.admin_permissions USING btree (created_by_id);
 6   DROP INDEX public.admin_permissions_created_by_id_fk;
       public            postgres    false    214                       1259    129930    admin_permissions_role_links_fk    INDEX     q   CREATE INDEX admin_permissions_role_links_fk ON public.admin_permissions_role_links USING btree (permission_id);
 3   DROP INDEX public.admin_permissions_role_links_fk;
       public            postgres    false    216                       1259    129931 #   admin_permissions_role_links_inv_fk    INDEX     o   CREATE INDEX admin_permissions_role_links_inv_fk ON public.admin_permissions_role_links USING btree (role_id);
 7   DROP INDEX public.admin_permissions_role_links_inv_fk;
       public            postgres    false    216                       1259    129932 "   admin_permissions_updated_by_id_fk    INDEX     i   CREATE INDEX admin_permissions_updated_by_id_fk ON public.admin_permissions USING btree (updated_by_id);
 6   DROP INDEX public.admin_permissions_updated_by_id_fk;
       public            postgres    false    214                       1259    129933    admin_roles_created_by_id_fk    INDEX     ]   CREATE INDEX admin_roles_created_by_id_fk ON public.admin_roles USING btree (created_by_id);
 0   DROP INDEX public.admin_roles_created_by_id_fk;
       public            postgres    false    218                       1259    129934    admin_roles_updated_by_id_fk    INDEX     ]   CREATE INDEX admin_roles_updated_by_id_fk ON public.admin_roles USING btree (updated_by_id);
 0   DROP INDEX public.admin_roles_updated_by_id_fk;
       public            postgres    false    218                       1259    129935    admin_users_created_by_id_fk    INDEX     ]   CREATE INDEX admin_users_created_by_id_fk ON public.admin_users USING btree (created_by_id);
 0   DROP INDEX public.admin_users_created_by_id_fk;
       public            postgres    false    220            !           1259    129936    admin_users_roles_links_fk    INDEX     a   CREATE INDEX admin_users_roles_links_fk ON public.admin_users_roles_links USING btree (user_id);
 .   DROP INDEX public.admin_users_roles_links_fk;
       public            postgres    false    222            "           1259    129937    admin_users_roles_links_inv_fk    INDEX     e   CREATE INDEX admin_users_roles_links_inv_fk ON public.admin_users_roles_links USING btree (role_id);
 2   DROP INDEX public.admin_users_roles_links_inv_fk;
       public            postgres    false    222                        1259    129938    admin_users_updated_by_id_fk    INDEX     ]   CREATE INDEX admin_users_updated_by_id_fk ON public.admin_users USING btree (updated_by_id);
 0   DROP INDEX public.admin_users_updated_by_id_fk;
       public            postgres    false    220            %           1259    129939    archive_tags_created_by_id_fk    INDEX     _   CREATE INDEX archive_tags_created_by_id_fk ON public.archive_tags USING btree (created_by_id);
 1   DROP INDEX public.archive_tags_created_by_id_fk;
       public            postgres    false    224            )           1259    129940 &   archive_tags_showcase_picture_links_fk    INDEX     �   CREATE INDEX archive_tags_showcase_picture_links_fk ON public.archive_tags_showcase_picture_links USING btree (archive_tag_id);
 :   DROP INDEX public.archive_tags_showcase_picture_links_fk;
       public            postgres    false    226            *           1259    129941 *   archive_tags_showcase_picture_links_inv_fk    INDEX     �   CREATE INDEX archive_tags_showcase_picture_links_inv_fk ON public.archive_tags_showcase_picture_links USING btree (picture_id);
 >   DROP INDEX public.archive_tags_showcase_picture_links_inv_fk;
       public            postgres    false    226            (           1259    129942    archive_tags_updated_by_id_fk    INDEX     _   CREATE INDEX archive_tags_updated_by_id_fk ON public.archive_tags USING btree (updated_by_id);
 1   DROP INDEX public.archive_tags_updated_by_id_fk;
       public            postgres    false    224            -           1259    129943 (   browse_root_collections_created_by_id_fk    INDEX     u   CREATE INDEX browse_root_collections_created_by_id_fk ON public.browse_root_collections USING btree (created_by_id);
 <   DROP INDEX public.browse_root_collections_created_by_id_fk;
       public            postgres    false    228            1           1259    129944 (   browse_root_collections_current_links_fk    INDEX     �   CREATE INDEX browse_root_collections_current_links_fk ON public.browse_root_collections_current_links USING btree (browse_root_collection_id);
 <   DROP INDEX public.browse_root_collections_current_links_fk;
       public            postgres    false    229            2           1259    129945 ,   browse_root_collections_current_links_inv_fk    INDEX     �   CREATE INDEX browse_root_collections_current_links_inv_fk ON public.browse_root_collections_current_links USING btree (collection_id);
 @   DROP INDEX public.browse_root_collections_current_links_inv_fk;
       public            postgres    false    229            0           1259    129946 (   browse_root_collections_updated_by_id_fk    INDEX     u   CREATE INDEX browse_root_collections_updated_by_id_fk ON public.browse_root_collections USING btree (updated_by_id);
 <   DROP INDEX public.browse_root_collections_updated_by_id_fk;
       public            postgres    false    228            9           1259    129947 &   collections_child_collections_links_fk    INDEX        CREATE INDEX collections_child_collections_links_fk ON public.collections_child_collections_links USING btree (collection_id);
 :   DROP INDEX public.collections_child_collections_links_fk;
       public            postgres    false    233            :           1259    129948 *   collections_child_collections_links_inv_fk    INDEX     �   CREATE INDEX collections_child_collections_links_inv_fk ON public.collections_child_collections_links USING btree (inv_collection_id);
 >   DROP INDEX public.collections_child_collections_links_inv_fk;
       public            postgres    false    233            5           1259    129949    collections_created_by_id_fk    INDEX     ]   CREATE INDEX collections_created_by_id_fk ON public.collections USING btree (created_by_id);
 0   DROP INDEX public.collections_created_by_id_fk;
       public            postgres    false    232            =           1259    129950 '   collections_parent_collections_links_fk    INDEX     �   CREATE INDEX collections_parent_collections_links_fk ON public.collections_parent_collections_links USING btree (collection_id);
 ;   DROP INDEX public.collections_parent_collections_links_fk;
       public            postgres    false    236            >           1259    129951 +   collections_parent_collections_links_inv_fk    INDEX     �   CREATE INDEX collections_parent_collections_links_inv_fk ON public.collections_parent_collections_links USING btree (inv_collection_id);
 ?   DROP INDEX public.collections_parent_collections_links_inv_fk;
       public            postgres    false    236            8           1259    129952    collections_updated_by_id_fk    INDEX     ]   CREATE INDEX collections_updated_by_id_fk ON public.collections USING btree (updated_by_id);
 0   DROP INDEX public.collections_updated_by_id_fk;
       public            postgres    false    232            A           1259    129953    comments_created_by_id_fk    INDEX     W   CREATE INDEX comments_created_by_id_fk ON public.comments USING btree (created_by_id);
 -   DROP INDEX public.comments_created_by_id_fk;
       public            postgres    false    238            E           1259    129954     comments_parent_comment_links_fk    INDEX     p   CREATE INDEX comments_parent_comment_links_fk ON public.comments_parent_comment_links USING btree (comment_id);
 4   DROP INDEX public.comments_parent_comment_links_fk;
       public            postgres    false    240            F           1259    129955 $   comments_parent_comment_links_inv_fk    INDEX     x   CREATE INDEX comments_parent_comment_links_inv_fk ON public.comments_parent_comment_links USING btree (inv_comment_id);
 8   DROP INDEX public.comments_parent_comment_links_inv_fk;
       public            postgres    false    240            I           1259    129956    comments_picture_links_fk    INDEX     b   CREATE INDEX comments_picture_links_fk ON public.comments_picture_links USING btree (comment_id);
 -   DROP INDEX public.comments_picture_links_fk;
       public            postgres    false    242            J           1259    129957    comments_picture_links_inv_fk    INDEX     f   CREATE INDEX comments_picture_links_inv_fk ON public.comments_picture_links USING btree (picture_id);
 1   DROP INDEX public.comments_picture_links_inv_fk;
       public            postgres    false    242            D           1259    129958    comments_updated_by_id_fk    INDEX     W   CREATE INDEX comments_updated_by_id_fk ON public.comments USING btree (updated_by_id);
 -   DROP INDEX public.comments_updated_by_id_fk;
       public            postgres    false    238            Q           1259    129959    descriptions_created_by_id_fk    INDEX     _   CREATE INDEX descriptions_created_by_id_fk ON public.descriptions USING btree (created_by_id);
 1   DROP INDEX public.descriptions_created_by_id_fk;
       public            postgres    false    248            T           1259    129960    descriptions_updated_by_id_fk    INDEX     _   CREATE INDEX descriptions_updated_by_id_fk ON public.descriptions USING btree (updated_by_id);
 1   DROP INDEX public.descriptions_updated_by_id_fk;
       public            postgres    false    248            U           1259    129961    face_tags_created_by_id_fk    INDEX     Y   CREATE INDEX face_tags_created_by_id_fk ON public.face_tags USING btree (created_by_id);
 .   DROP INDEX public.face_tags_created_by_id_fk;
       public            postgres    false    250            Y           1259    129962    face_tags_person_tag_links_fk    INDEX     k   CREATE INDEX face_tags_person_tag_links_fk ON public.face_tags_person_tag_links USING btree (face_tag_id);
 1   DROP INDEX public.face_tags_person_tag_links_fk;
       public            postgres    false    252            Z           1259    129963 !   face_tags_person_tag_links_inv_fk    INDEX     q   CREATE INDEX face_tags_person_tag_links_inv_fk ON public.face_tags_person_tag_links USING btree (person_tag_id);
 5   DROP INDEX public.face_tags_person_tag_links_inv_fk;
       public            postgres    false    252            ]           1259    129964    face_tags_picture_links_fk    INDEX     e   CREATE INDEX face_tags_picture_links_fk ON public.face_tags_picture_links USING btree (face_tag_id);
 .   DROP INDEX public.face_tags_picture_links_fk;
       public            postgres    false    254            ^           1259    129965    face_tags_picture_links_inv_fk    INDEX     h   CREATE INDEX face_tags_picture_links_inv_fk ON public.face_tags_picture_links USING btree (picture_id);
 2   DROP INDEX public.face_tags_picture_links_inv_fk;
       public            postgres    false    254            X           1259    129966    face_tags_updated_by_id_fk    INDEX     Y   CREATE INDEX face_tags_updated_by_id_fk ON public.face_tags USING btree (updated_by_id);
 .   DROP INDEX public.face_tags_updated_by_id_fk;
       public            postgres    false    250            a           1259    129967    files_created_by_id_fk    INDEX     Q   CREATE INDEX files_created_by_id_fk ON public.files USING btree (created_by_id);
 *   DROP INDEX public.files_created_by_id_fk;
       public            postgres    false    256            f           1259    129968    files_folder_links_fk    INDEX     W   CREATE INDEX files_folder_links_fk ON public.files_folder_links USING btree (file_id);
 )   DROP INDEX public.files_folder_links_fk;
       public            postgres    false    257            g           1259    129969    files_folder_links_inv_fk    INDEX     ]   CREATE INDEX files_folder_links_inv_fk ON public.files_folder_links USING btree (folder_id);
 -   DROP INDEX public.files_folder_links_inv_fk;
       public            postgres    false    257            j           1259    129970    files_related_morphs_fk    INDEX     [   CREATE INDEX files_related_morphs_fk ON public.files_related_morphs USING btree (file_id);
 +   DROP INDEX public.files_related_morphs_fk;
       public            postgres    false    260            d           1259    129971    files_updated_by_id_fk    INDEX     Q   CREATE INDEX files_updated_by_id_fk ON public.files USING btree (updated_by_id);
 *   DROP INDEX public.files_updated_by_id_fk;
       public            postgres    false    256            q           1259    129972 !   keyword_tags_component_type_index    INDEX     o   CREATE INDEX keyword_tags_component_type_index ON public.keyword_tags_components USING btree (component_type);
 5   DROP INDEX public.keyword_tags_component_type_index;
       public            postgres    false    263            m           1259    129973    keyword_tags_created_by_id_fk    INDEX     _   CREATE INDEX keyword_tags_created_by_id_fk ON public.keyword_tags USING btree (created_by_id);
 1   DROP INDEX public.keyword_tags_created_by_id_fk;
       public            postgres    false    262            t           1259    129974    keyword_tags_entity_fk    INDEX     _   CREATE INDEX keyword_tags_entity_fk ON public.keyword_tags_components USING btree (entity_id);
 *   DROP INDEX public.keyword_tags_entity_fk;
       public            postgres    false    263            u           1259    129975    keyword_tags_field_index    INDEX     ]   CREATE INDEX keyword_tags_field_index ON public.keyword_tags_components USING btree (field);
 ,   DROP INDEX public.keyword_tags_field_index;
       public            postgres    false    263            p           1259    129976    keyword_tags_updated_by_id_fk    INDEX     _   CREATE INDEX keyword_tags_updated_by_id_fk ON public.keyword_tags USING btree (updated_by_id);
 1   DROP INDEX public.keyword_tags_updated_by_id_fk;
       public            postgres    false    262            z           1259    129977    links_archive_tag_links_fk    INDEX     a   CREATE INDEX links_archive_tag_links_fk ON public.links_archive_tag_links USING btree (link_id);
 .   DROP INDEX public.links_archive_tag_links_fk;
       public            postgres    false    267            {           1259    129978    links_archive_tag_links_inv_fk    INDEX     l   CREATE INDEX links_archive_tag_links_inv_fk ON public.links_archive_tag_links USING btree (archive_tag_id);
 2   DROP INDEX public.links_archive_tag_links_inv_fk;
       public            postgres    false    267            v           1259    129979    links_created_by_id_fk    INDEX     Q   CREATE INDEX links_created_by_id_fk ON public.links USING btree (created_by_id);
 *   DROP INDEX public.links_created_by_id_fk;
       public            postgres    false    266            y           1259    129980    links_updated_by_id_fk    INDEX     Q   CREATE INDEX links_updated_by_id_fk ON public.links USING btree (updated_by_id);
 *   DROP INDEX public.links_updated_by_id_fk;
       public            postgres    false    266            �           1259    129981 "   location_tags_component_type_index    INDEX     q   CREATE INDEX location_tags_component_type_index ON public.location_tags_components USING btree (component_type);
 6   DROP INDEX public.location_tags_component_type_index;
       public            postgres    false    271            ~           1259    129982    location_tags_created_by_id_fk    INDEX     a   CREATE INDEX location_tags_created_by_id_fk ON public.location_tags USING btree (created_by_id);
 2   DROP INDEX public.location_tags_created_by_id_fk;
       public            postgres    false    270            �           1259    129983    location_tags_entity_fk    INDEX     a   CREATE INDEX location_tags_entity_fk ON public.location_tags_components USING btree (entity_id);
 +   DROP INDEX public.location_tags_entity_fk;
       public            postgres    false    271            �           1259    129984    location_tags_field_index    INDEX     _   CREATE INDEX location_tags_field_index ON public.location_tags_components USING btree (field);
 -   DROP INDEX public.location_tags_field_index;
       public            postgres    false    271                       1259    130641 "   location_tags_parent_tags_links_fk    INDEX     y   CREATE INDEX location_tags_parent_tags_links_fk ON public.location_tags_parent_tags_links USING btree (location_tag_id);
 6   DROP INDEX public.location_tags_parent_tags_links_fk;
       public            postgres    false    347                       1259    130642 &   location_tags_parent_tags_links_inv_fk    INDEX     �   CREATE INDEX location_tags_parent_tags_links_inv_fk ON public.location_tags_parent_tags_links USING btree (inv_location_tag_id);
 :   DROP INDEX public.location_tags_parent_tags_links_inv_fk;
       public            postgres    false    347            �           1259    129985    location_tags_updated_by_id_fk    INDEX     a   CREATE INDEX location_tags_updated_by_id_fk ON public.location_tags USING btree (updated_by_id);
 2   DROP INDEX public.location_tags_updated_by_id_fk;
       public            postgres    false    270            �           1259    129986 .   parameterized_permissions_archive_tag_links_fk    INDEX     �   CREATE INDEX parameterized_permissions_archive_tag_links_fk ON public.parameterized_permissions_archive_tag_links USING btree (parameterized_permission_id);
 B   DROP INDEX public.parameterized_permissions_archive_tag_links_fk;
       public            postgres    false    275            �           1259    129987 2   parameterized_permissions_archive_tag_links_inv_fk    INDEX     �   CREATE INDEX parameterized_permissions_archive_tag_links_inv_fk ON public.parameterized_permissions_archive_tag_links USING btree (archive_tag_id);
 F   DROP INDEX public.parameterized_permissions_archive_tag_links_inv_fk;
       public            postgres    false    275            �           1259    129988 *   parameterized_permissions_created_by_id_fk    INDEX     y   CREATE INDEX parameterized_permissions_created_by_id_fk ON public.parameterized_permissions USING btree (created_by_id);
 >   DROP INDEX public.parameterized_permissions_created_by_id_fk;
       public            postgres    false    274            �           1259    129989 *   parameterized_permissions_updated_by_id_fk    INDEX     y   CREATE INDEX parameterized_permissions_updated_by_id_fk ON public.parameterized_permissions USING btree (updated_by_id);
 >   DROP INDEX public.parameterized_permissions_updated_by_id_fk;
       public            postgres    false    274            �           1259    129990 9   parameterized_permissions_users_permissions_user_links_fk    INDEX     �   CREATE INDEX parameterized_permissions_users_permissions_user_links_fk ON public.parameterized_permissions_users_permissions_user_links USING btree (parameterized_permission_id);
 M   DROP INDEX public.parameterized_permissions_users_permissions_user_links_fk;
       public            postgres    false    278            �           1259    129991 =   parameterized_permissions_users_permissions_user_links_inv_fk    INDEX     �   CREATE INDEX parameterized_permissions_users_permissions_user_links_inv_fk ON public.parameterized_permissions_users_permissions_user_links USING btree (user_id);
 Q   DROP INDEX public.parameterized_permissions_users_permissions_user_links_inv_fk;
       public            postgres    false    278            �           1259    129992     person_tags_component_type_index    INDEX     m   CREATE INDEX person_tags_component_type_index ON public.person_tags_components USING btree (component_type);
 4   DROP INDEX public.person_tags_component_type_index;
       public            postgres    false    281            �           1259    129993    person_tags_created_by_id_fk    INDEX     ]   CREATE INDEX person_tags_created_by_id_fk ON public.person_tags USING btree (created_by_id);
 0   DROP INDEX public.person_tags_created_by_id_fk;
       public            postgres    false    280            �           1259    129994    person_tags_entity_fk    INDEX     ]   CREATE INDEX person_tags_entity_fk ON public.person_tags_components USING btree (entity_id);
 )   DROP INDEX public.person_tags_entity_fk;
       public            postgres    false    281            �           1259    129995    person_tags_field_index    INDEX     [   CREATE INDEX person_tags_field_index ON public.person_tags_components USING btree (field);
 +   DROP INDEX public.person_tags_field_index;
       public            postgres    false    281            �           1259    129996    person_tags_updated_by_id_fk    INDEX     ]   CREATE INDEX person_tags_updated_by_id_fk ON public.person_tags USING btree (updated_by_id);
 0   DROP INDEX public.person_tags_updated_by_id_fk;
       public            postgres    false    280            �           1259    129997 "   picture_geo_infos_created_by_id_fk    INDEX     i   CREATE INDEX picture_geo_infos_created_by_id_fk ON public.picture_geo_infos USING btree (created_by_id);
 6   DROP INDEX public.picture_geo_infos_created_by_id_fk;
       public            postgres    false    284            �           1259    129998 "   picture_geo_infos_picture_links_fk    INDEX     }   CREATE INDEX picture_geo_infos_picture_links_fk ON public.picture_geo_infos_picture_links USING btree (picture_geo_info_id);
 6   DROP INDEX public.picture_geo_infos_picture_links_fk;
       public            postgres    false    286            �           1259    129999 &   picture_geo_infos_picture_links_inv_fk    INDEX     x   CREATE INDEX picture_geo_infos_picture_links_inv_fk ON public.picture_geo_infos_picture_links USING btree (picture_id);
 :   DROP INDEX public.picture_geo_infos_picture_links_inv_fk;
       public            postgres    false    286            �           1259    130000 "   picture_geo_infos_updated_by_id_fk    INDEX     i   CREATE INDEX picture_geo_infos_updated_by_id_fk ON public.picture_geo_infos USING btree (updated_by_id);
 6   DROP INDEX public.picture_geo_infos_updated_by_id_fk;
       public            postgres    false    284            �           1259    130001    pictures_archive_tag_links_fk    INDEX     j   CREATE INDEX pictures_archive_tag_links_fk ON public.pictures_archive_tag_links USING btree (picture_id);
 1   DROP INDEX public.pictures_archive_tag_links_fk;
       public            postgres    false    289            �           1259    130002 !   pictures_archive_tag_links_inv_fk    INDEX     r   CREATE INDEX pictures_archive_tag_links_inv_fk ON public.pictures_archive_tag_links USING btree (archive_tag_id);
 5   DROP INDEX public.pictures_archive_tag_links_inv_fk;
       public            postgres    false    289            �           1259    130003    pictures_collections_links_fk    INDEX     j   CREATE INDEX pictures_collections_links_fk ON public.pictures_collections_links USING btree (picture_id);
 1   DROP INDEX public.pictures_collections_links_fk;
       public            postgres    false    291            �           1259    130004 !   pictures_collections_links_inv_fk    INDEX     q   CREATE INDEX pictures_collections_links_inv_fk ON public.pictures_collections_links USING btree (collection_id);
 5   DROP INDEX public.pictures_collections_links_inv_fk;
       public            postgres    false    291            �           1259    130005    pictures_created_by_id_fk    INDEX     W   CREATE INDEX pictures_created_by_id_fk ON public.pictures USING btree (created_by_id);
 -   DROP INDEX public.pictures_created_by_id_fk;
       public            postgres    false    288            �           1259    130006    pictures_descriptions_links_fk    INDEX     l   CREATE INDEX pictures_descriptions_links_fk ON public.pictures_descriptions_links USING btree (picture_id);
 2   DROP INDEX public.pictures_descriptions_links_fk;
       public            postgres    false    293            �           1259    130007 "   pictures_descriptions_links_inv_fk    INDEX     t   CREATE INDEX pictures_descriptions_links_inv_fk ON public.pictures_descriptions_links USING btree (description_id);
 6   DROP INDEX public.pictures_descriptions_links_inv_fk;
       public            postgres    false    293            �           1259    130008    pictures_keyword_tags_links_fk    INDEX     l   CREATE INDEX pictures_keyword_tags_links_fk ON public.pictures_keyword_tags_links USING btree (picture_id);
 2   DROP INDEX public.pictures_keyword_tags_links_fk;
       public            postgres    false    296            �           1259    130009 "   pictures_keyword_tags_links_inv_fk    INDEX     t   CREATE INDEX pictures_keyword_tags_links_inv_fk ON public.pictures_keyword_tags_links USING btree (keyword_tag_id);
 6   DROP INDEX public.pictures_keyword_tags_links_inv_fk;
       public            postgres    false    296            �           1259    130010 !   pictures_linked_pictures_links_fk    INDEX     r   CREATE INDEX pictures_linked_pictures_links_fk ON public.pictures_linked_pictures_links USING btree (picture_id);
 5   DROP INDEX public.pictures_linked_pictures_links_fk;
       public            postgres    false    298            �           1259    130011 %   pictures_linked_pictures_links_inv_fk    INDEX     z   CREATE INDEX pictures_linked_pictures_links_inv_fk ON public.pictures_linked_pictures_links USING btree (inv_picture_id);
 9   DROP INDEX public.pictures_linked_pictures_links_inv_fk;
       public            postgres    false    298            �           1259    130012    pictures_linked_texts_links_fk    INDEX     l   CREATE INDEX pictures_linked_texts_links_fk ON public.pictures_linked_texts_links USING btree (picture_id);
 2   DROP INDEX public.pictures_linked_texts_links_fk;
       public            postgres    false    300            �           1259    130013 "   pictures_linked_texts_links_inv_fk    INDEX     t   CREATE INDEX pictures_linked_texts_links_inv_fk ON public.pictures_linked_texts_links USING btree (inv_picture_id);
 6   DROP INDEX public.pictures_linked_texts_links_inv_fk;
       public            postgres    false    300            �           1259    130014    pictures_location_tags_links_fk    INDEX     n   CREATE INDEX pictures_location_tags_links_fk ON public.pictures_location_tags_links USING btree (picture_id);
 3   DROP INDEX public.pictures_location_tags_links_fk;
       public            postgres    false    302            �           1259    130015 #   pictures_location_tags_links_inv_fk    INDEX     w   CREATE INDEX pictures_location_tags_links_inv_fk ON public.pictures_location_tags_links USING btree (location_tag_id);
 7   DROP INDEX public.pictures_location_tags_links_inv_fk;
       public            postgres    false    302            �           1259    130016    pictures_person_tags_links_fk    INDEX     j   CREATE INDEX pictures_person_tags_links_fk ON public.pictures_person_tags_links USING btree (picture_id);
 1   DROP INDEX public.pictures_person_tags_links_fk;
       public            postgres    false    304            �           1259    130017 !   pictures_person_tags_links_inv_fk    INDEX     q   CREATE INDEX pictures_person_tags_links_inv_fk ON public.pictures_person_tags_links USING btree (person_tag_id);
 5   DROP INDEX public.pictures_person_tags_links_inv_fk;
       public            postgres    false    304            �           1259    130018     pictures_time_range_tag_links_fk    INDEX     p   CREATE INDEX pictures_time_range_tag_links_fk ON public.pictures_time_range_tag_links USING btree (picture_id);
 4   DROP INDEX public.pictures_time_range_tag_links_fk;
       public            postgres    false    306            �           1259    130019 $   pictures_time_range_tag_links_inv_fk    INDEX     {   CREATE INDEX pictures_time_range_tag_links_inv_fk ON public.pictures_time_range_tag_links USING btree (time_range_tag_id);
 8   DROP INDEX public.pictures_time_range_tag_links_inv_fk;
       public            postgres    false    306            �           1259    130020    pictures_updated_by_id_fk    INDEX     W   CREATE INDEX pictures_updated_by_id_fk ON public.pictures USING btree (updated_by_id);
 -   DROP INDEX public.pictures_updated_by_id_fk;
       public            postgres    false    288            �           1259    130021 '   pictures_verified_keyword_tags_links_fk    INDEX     ~   CREATE INDEX pictures_verified_keyword_tags_links_fk ON public.pictures_verified_keyword_tags_links USING btree (picture_id);
 ;   DROP INDEX public.pictures_verified_keyword_tags_links_fk;
       public            postgres    false    308            �           1259    130022 +   pictures_verified_keyword_tags_links_inv_fk    INDEX     �   CREATE INDEX pictures_verified_keyword_tags_links_inv_fk ON public.pictures_verified_keyword_tags_links USING btree (keyword_tag_id);
 ?   DROP INDEX public.pictures_verified_keyword_tags_links_inv_fk;
       public            postgres    false    308            �           1259    130023 (   pictures_verified_location_tags_links_fk    INDEX     �   CREATE INDEX pictures_verified_location_tags_links_fk ON public.pictures_verified_location_tags_links USING btree (picture_id);
 <   DROP INDEX public.pictures_verified_location_tags_links_fk;
       public            postgres    false    310            �           1259    130024 ,   pictures_verified_location_tags_links_inv_fk    INDEX     �   CREATE INDEX pictures_verified_location_tags_links_inv_fk ON public.pictures_verified_location_tags_links USING btree (location_tag_id);
 @   DROP INDEX public.pictures_verified_location_tags_links_inv_fk;
       public            postgres    false    310            �           1259    130025 &   pictures_verified_person_tags_links_fk    INDEX     |   CREATE INDEX pictures_verified_person_tags_links_fk ON public.pictures_verified_person_tags_links USING btree (picture_id);
 :   DROP INDEX public.pictures_verified_person_tags_links_fk;
       public            postgres    false    312            �           1259    130026 *   pictures_verified_person_tags_links_inv_fk    INDEX     �   CREATE INDEX pictures_verified_person_tags_links_inv_fk ON public.pictures_verified_person_tags_links USING btree (person_tag_id);
 >   DROP INDEX public.pictures_verified_person_tags_links_inv_fk;
       public            postgres    false    312            �           1259    130027 )   pictures_verified_time_range_tag_links_fk    INDEX     �   CREATE INDEX pictures_verified_time_range_tag_links_fk ON public.pictures_verified_time_range_tag_links USING btree (picture_id);
 =   DROP INDEX public.pictures_verified_time_range_tag_links_fk;
       public            postgres    false    314            �           1259    130028 -   pictures_verified_time_range_tag_links_inv_fk    INDEX     �   CREATE INDEX pictures_verified_time_range_tag_links_inv_fk ON public.pictures_verified_time_range_tag_links USING btree (time_range_tag_id);
 A   DROP INDEX public.pictures_verified_time_range_tag_links_inv_fk;
       public            postgres    false    314            �           1259    130029 -   strapi_api_token_permissions_created_by_id_fk    INDEX        CREATE INDEX strapi_api_token_permissions_created_by_id_fk ON public.strapi_api_token_permissions USING btree (created_by_id);
 A   DROP INDEX public.strapi_api_token_permissions_created_by_id_fk;
       public            postgres    false    316            �           1259    130030 +   strapi_api_token_permissions_token_links_fk    INDEX     �   CREATE INDEX strapi_api_token_permissions_token_links_fk ON public.strapi_api_token_permissions_token_links USING btree (api_token_permission_id);
 ?   DROP INDEX public.strapi_api_token_permissions_token_links_fk;
       public            postgres    false    318            �           1259    130031 /   strapi_api_token_permissions_token_links_inv_fk    INDEX     �   CREATE INDEX strapi_api_token_permissions_token_links_inv_fk ON public.strapi_api_token_permissions_token_links USING btree (api_token_id);
 C   DROP INDEX public.strapi_api_token_permissions_token_links_inv_fk;
       public            postgres    false    318            �           1259    130032 -   strapi_api_token_permissions_updated_by_id_fk    INDEX        CREATE INDEX strapi_api_token_permissions_updated_by_id_fk ON public.strapi_api_token_permissions USING btree (updated_by_id);
 A   DROP INDEX public.strapi_api_token_permissions_updated_by_id_fk;
       public            postgres    false    316            �           1259    130033 "   strapi_api_tokens_created_by_id_fk    INDEX     i   CREATE INDEX strapi_api_tokens_created_by_id_fk ON public.strapi_api_tokens USING btree (created_by_id);
 6   DROP INDEX public.strapi_api_tokens_created_by_id_fk;
       public            postgres    false    320            �           1259    130034 "   strapi_api_tokens_updated_by_id_fk    INDEX     i   CREATE INDEX strapi_api_tokens_updated_by_id_fk ON public.strapi_api_tokens USING btree (updated_by_id);
 6   DROP INDEX public.strapi_api_tokens_updated_by_id_fk;
       public            postgres    false    320            �           1259    130035     time_range_tags_created_by_id_fk    INDEX     e   CREATE INDEX time_range_tags_created_by_id_fk ON public.time_range_tags USING btree (created_by_id);
 4   DROP INDEX public.time_range_tags_created_by_id_fk;
       public            postgres    false    330            �           1259    130036     time_range_tags_updated_by_id_fk    INDEX     e   CREATE INDEX time_range_tags_updated_by_id_fk ON public.time_range_tags USING btree (updated_by_id);
 4   DROP INDEX public.time_range_tags_updated_by_id_fk;
       public            postgres    false    330            �           1259    130037    up_permissions_created_by_id_fk    INDEX     c   CREATE INDEX up_permissions_created_by_id_fk ON public.up_permissions USING btree (created_by_id);
 3   DROP INDEX public.up_permissions_created_by_id_fk;
       public            postgres    false    332            �           1259    130038    up_permissions_role_links_fk    INDEX     k   CREATE INDEX up_permissions_role_links_fk ON public.up_permissions_role_links USING btree (permission_id);
 0   DROP INDEX public.up_permissions_role_links_fk;
       public            postgres    false    334            �           1259    130039     up_permissions_role_links_inv_fk    INDEX     i   CREATE INDEX up_permissions_role_links_inv_fk ON public.up_permissions_role_links USING btree (role_id);
 4   DROP INDEX public.up_permissions_role_links_inv_fk;
       public            postgres    false    334            �           1259    130040    up_permissions_updated_by_id_fk    INDEX     c   CREATE INDEX up_permissions_updated_by_id_fk ON public.up_permissions USING btree (updated_by_id);
 3   DROP INDEX public.up_permissions_updated_by_id_fk;
       public            postgres    false    332            �           1259    130041    up_roles_created_by_id_fk    INDEX     W   CREATE INDEX up_roles_created_by_id_fk ON public.up_roles USING btree (created_by_id);
 -   DROP INDEX public.up_roles_created_by_id_fk;
       public            postgres    false    336            �           1259    130042    up_roles_updated_by_id_fk    INDEX     W   CREATE INDEX up_roles_updated_by_id_fk ON public.up_roles USING btree (updated_by_id);
 -   DROP INDEX public.up_roles_updated_by_id_fk;
       public            postgres    false    336                        1259    130043    up_users_created_by_id_fk    INDEX     W   CREATE INDEX up_users_created_by_id_fk ON public.up_users USING btree (created_by_id);
 -   DROP INDEX public.up_users_created_by_id_fk;
       public            postgres    false    338                       1259    130044    up_users_role_links_fk    INDEX     Y   CREATE INDEX up_users_role_links_fk ON public.up_users_role_links USING btree (user_id);
 *   DROP INDEX public.up_users_role_links_fk;
       public            postgres    false    340                       1259    130045    up_users_role_links_inv_fk    INDEX     ]   CREATE INDEX up_users_role_links_inv_fk ON public.up_users_role_links USING btree (role_id);
 .   DROP INDEX public.up_users_role_links_inv_fk;
       public            postgres    false    340                       1259    130046    up_users_updated_by_id_fk    INDEX     W   CREATE INDEX up_users_updated_by_id_fk ON public.up_users USING btree (updated_by_id);
 -   DROP INDEX public.up_users_updated_by_id_fk;
       public            postgres    false    338            e           1259    130047    upload_files_folder_path_index    INDEX     W   CREATE INDEX upload_files_folder_path_index ON public.files USING btree (folder_path);
 2   DROP INDEX public.upload_files_folder_path_index;
       public            postgres    false    256                       1259    130048    upload_folders_created_by_id_fk    INDEX     c   CREATE INDEX upload_folders_created_by_id_fk ON public.upload_folders USING btree (created_by_id);
 3   DROP INDEX public.upload_folders_created_by_id_fk;
       public            postgres    false    342                       1259    130049    upload_folders_parent_links_fk    INDEX     k   CREATE INDEX upload_folders_parent_links_fk ON public.upload_folders_parent_links USING btree (folder_id);
 2   DROP INDEX public.upload_folders_parent_links_fk;
       public            postgres    false    344                       1259    130050 "   upload_folders_parent_links_inv_fk    INDEX     s   CREATE INDEX upload_folders_parent_links_inv_fk ON public.upload_folders_parent_links USING btree (inv_folder_id);
 6   DROP INDEX public.upload_folders_parent_links_inv_fk;
       public            postgres    false    344                       1259    130051    upload_folders_updated_by_id_fk    INDEX     c   CREATE INDEX upload_folders_updated_by_id_fk ON public.upload_folders USING btree (updated_by_id);
 3   DROP INDEX public.upload_folders_updated_by_id_fk;
       public            postgres    false    342                       2606    130052 4   admin_permissions admin_permissions_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.admin_permissions DROP CONSTRAINT admin_permissions_created_by_id_fk;
       public          postgres    false    214    220    3615                       2606    130057 <   admin_permissions_role_links admin_permissions_role_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_permissions_role_links
    ADD CONSTRAINT admin_permissions_role_links_fk FOREIGN KEY (permission_id) REFERENCES public.admin_permissions(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.admin_permissions_role_links DROP CONSTRAINT admin_permissions_role_links_fk;
       public          postgres    false    3603    216    214                       2606    130062 @   admin_permissions_role_links admin_permissions_role_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_permissions_role_links
    ADD CONSTRAINT admin_permissions_role_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.admin_permissions_role_links DROP CONSTRAINT admin_permissions_role_links_inv_fk;
       public          postgres    false    3611    218    216                       2606    130067 4   admin_permissions admin_permissions_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.admin_permissions DROP CONSTRAINT admin_permissions_updated_by_id_fk;
       public          postgres    false    3615    220    214                       2606    130072 (   admin_roles admin_roles_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_roles DROP CONSTRAINT admin_roles_created_by_id_fk;
       public          postgres    false    3615    218    220                       2606    130077 (   admin_roles admin_roles_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_roles DROP CONSTRAINT admin_roles_updated_by_id_fk;
       public          postgres    false    218    220    3615                       2606    130082 (   admin_users admin_users_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_users DROP CONSTRAINT admin_users_created_by_id_fk;
       public          postgres    false    220    220    3615                        2606    130087 2   admin_users_roles_links admin_users_roles_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_users_roles_links
    ADD CONSTRAINT admin_users_roles_links_fk FOREIGN KEY (user_id) REFERENCES public.admin_users(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.admin_users_roles_links DROP CONSTRAINT admin_users_roles_links_fk;
       public          postgres    false    222    220    3615            !           2606    130092 6   admin_users_roles_links admin_users_roles_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_users_roles_links
    ADD CONSTRAINT admin_users_roles_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.admin_users_roles_links DROP CONSTRAINT admin_users_roles_links_inv_fk;
       public          postgres    false    3611    222    218                       2606    130097 (   admin_users admin_users_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.admin_users DROP CONSTRAINT admin_users_updated_by_id_fk;
       public          postgres    false    220    3615    220            "           2606    130102 *   archive_tags archive_tags_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.archive_tags
    ADD CONSTRAINT archive_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.archive_tags DROP CONSTRAINT archive_tags_created_by_id_fk;
       public          postgres    false    220    224    3615            $           2606    130107 J   archive_tags_showcase_picture_links archive_tags_showcase_picture_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.archive_tags_showcase_picture_links
    ADD CONSTRAINT archive_tags_showcase_picture_links_fk FOREIGN KEY (archive_tag_id) REFERENCES public.archive_tags(id) ON DELETE CASCADE;
 t   ALTER TABLE ONLY public.archive_tags_showcase_picture_links DROP CONSTRAINT archive_tags_showcase_picture_links_fk;
       public          postgres    false    3623    226    224            %           2606    130112 N   archive_tags_showcase_picture_links archive_tags_showcase_picture_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.archive_tags_showcase_picture_links
    ADD CONSTRAINT archive_tags_showcase_picture_links_inv_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.archive_tags_showcase_picture_links DROP CONSTRAINT archive_tags_showcase_picture_links_inv_fk;
       public          postgres    false    3750    226    288            #           2606    130117 *   archive_tags archive_tags_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.archive_tags
    ADD CONSTRAINT archive_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.archive_tags DROP CONSTRAINT archive_tags_updated_by_id_fk;
       public          postgres    false    3615    220    224            &           2606    130122 @   browse_root_collections browse_root_collections_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.browse_root_collections
    ADD CONSTRAINT browse_root_collections_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 j   ALTER TABLE ONLY public.browse_root_collections DROP CONSTRAINT browse_root_collections_created_by_id_fk;
       public          postgres    false    228    3615    220            (           2606    130127 N   browse_root_collections_current_links browse_root_collections_current_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.browse_root_collections_current_links
    ADD CONSTRAINT browse_root_collections_current_links_fk FOREIGN KEY (browse_root_collection_id) REFERENCES public.browse_root_collections(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.browse_root_collections_current_links DROP CONSTRAINT browse_root_collections_current_links_fk;
       public          postgres    false    229    228    3631            )           2606    130132 R   browse_root_collections_current_links browse_root_collections_current_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.browse_root_collections_current_links
    ADD CONSTRAINT browse_root_collections_current_links_inv_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 |   ALTER TABLE ONLY public.browse_root_collections_current_links DROP CONSTRAINT browse_root_collections_current_links_inv_fk;
       public          postgres    false    232    3639    229            '           2606    130137 @   browse_root_collections browse_root_collections_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.browse_root_collections
    ADD CONSTRAINT browse_root_collections_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 j   ALTER TABLE ONLY public.browse_root_collections DROP CONSTRAINT browse_root_collections_updated_by_id_fk;
       public          postgres    false    228    220    3615            ,           2606    130142 J   collections_child_collections_links collections_child_collections_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.collections_child_collections_links
    ADD CONSTRAINT collections_child_collections_links_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 t   ALTER TABLE ONLY public.collections_child_collections_links DROP CONSTRAINT collections_child_collections_links_fk;
       public          postgres    false    232    3639    233            -           2606    130147 N   collections_child_collections_links collections_child_collections_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.collections_child_collections_links
    ADD CONSTRAINT collections_child_collections_links_inv_fk FOREIGN KEY (inv_collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.collections_child_collections_links DROP CONSTRAINT collections_child_collections_links_inv_fk;
       public          postgres    false    233    3639    232            *           2606    130152 (   collections collections_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.collections DROP CONSTRAINT collections_created_by_id_fk;
       public          postgres    false    232    220    3615            .           2606    130157 L   collections_parent_collections_links collections_parent_collections_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.collections_parent_collections_links
    ADD CONSTRAINT collections_parent_collections_links_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 v   ALTER TABLE ONLY public.collections_parent_collections_links DROP CONSTRAINT collections_parent_collections_links_fk;
       public          postgres    false    236    3639    232            /           2606    130162 P   collections_parent_collections_links collections_parent_collections_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.collections_parent_collections_links
    ADD CONSTRAINT collections_parent_collections_links_inv_fk FOREIGN KEY (inv_collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 z   ALTER TABLE ONLY public.collections_parent_collections_links DROP CONSTRAINT collections_parent_collections_links_inv_fk;
       public          postgres    false    3639    236    232            +           2606    130167 (   collections collections_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.collections DROP CONSTRAINT collections_updated_by_id_fk;
       public          postgres    false    232    3615    220            0           2606    130172 "   comments comments_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_created_by_id_fk;
       public          postgres    false    220    3615    238            2           2606    130177 >   comments_parent_comment_links comments_parent_comment_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments_parent_comment_links
    ADD CONSTRAINT comments_parent_comment_links_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.comments_parent_comment_links DROP CONSTRAINT comments_parent_comment_links_fk;
       public          postgres    false    3651    240    238            3           2606    130182 B   comments_parent_comment_links comments_parent_comment_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments_parent_comment_links
    ADD CONSTRAINT comments_parent_comment_links_inv_fk FOREIGN KEY (inv_comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.comments_parent_comment_links DROP CONSTRAINT comments_parent_comment_links_inv_fk;
       public          postgres    false    3651    240    238            4           2606    130187 0   comments_picture_links comments_picture_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments_picture_links
    ADD CONSTRAINT comments_picture_links_fk FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.comments_picture_links DROP CONSTRAINT comments_picture_links_fk;
       public          postgres    false    238    3651    242            5           2606    130192 4   comments_picture_links comments_picture_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments_picture_links
    ADD CONSTRAINT comments_picture_links_inv_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.comments_picture_links DROP CONSTRAINT comments_picture_links_inv_fk;
       public          postgres    false    288    242    3750            1           2606    130197 "   comments comments_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_updated_by_id_fk;
       public          postgres    false    220    238    3615            6           2606    130202 *   descriptions descriptions_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT descriptions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.descriptions DROP CONSTRAINT descriptions_created_by_id_fk;
       public          postgres    false    248    220    3615            7           2606    130207 *   descriptions descriptions_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT descriptions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.descriptions DROP CONSTRAINT descriptions_updated_by_id_fk;
       public          postgres    false    248    3615    220            8           2606    130212 $   face_tags face_tags_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.face_tags
    ADD CONSTRAINT face_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.face_tags DROP CONSTRAINT face_tags_created_by_id_fk;
       public          postgres    false    250    3615    220            :           2606    130217 8   face_tags_person_tag_links face_tags_person_tag_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.face_tags_person_tag_links
    ADD CONSTRAINT face_tags_person_tag_links_fk FOREIGN KEY (face_tag_id) REFERENCES public.face_tags(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.face_tags_person_tag_links DROP CONSTRAINT face_tags_person_tag_links_fk;
       public          postgres    false    252    3671    250            ;           2606    130222 <   face_tags_person_tag_links face_tags_person_tag_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.face_tags_person_tag_links
    ADD CONSTRAINT face_tags_person_tag_links_inv_fk FOREIGN KEY (person_tag_id) REFERENCES public.person_tags(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.face_tags_person_tag_links DROP CONSTRAINT face_tags_person_tag_links_inv_fk;
       public          postgres    false    252    3733    280            <           2606    130227 2   face_tags_picture_links face_tags_picture_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.face_tags_picture_links
    ADD CONSTRAINT face_tags_picture_links_fk FOREIGN KEY (face_tag_id) REFERENCES public.face_tags(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.face_tags_picture_links DROP CONSTRAINT face_tags_picture_links_fk;
       public          postgres    false    254    3671    250            =           2606    130232 6   face_tags_picture_links face_tags_picture_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.face_tags_picture_links
    ADD CONSTRAINT face_tags_picture_links_inv_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.face_tags_picture_links DROP CONSTRAINT face_tags_picture_links_inv_fk;
       public          postgres    false    254    3750    288            9           2606    130237 $   face_tags face_tags_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.face_tags
    ADD CONSTRAINT face_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.face_tags DROP CONSTRAINT face_tags_updated_by_id_fk;
       public          postgres    false    250    220    3615            >           2606    130242    files files_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.files DROP CONSTRAINT files_created_by_id_fk;
       public          postgres    false    220    256    3615            @           2606    130247 (   files_folder_links files_folder_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.files_folder_links
    ADD CONSTRAINT files_folder_links_fk FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.files_folder_links DROP CONSTRAINT files_folder_links_fk;
       public          postgres    false    256    257    3683            A           2606    130252 ,   files_folder_links files_folder_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.files_folder_links
    ADD CONSTRAINT files_folder_links_inv_fk FOREIGN KEY (folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.files_folder_links DROP CONSTRAINT files_folder_links_inv_fk;
       public          postgres    false    342    3854    257            B           2606    130257 ,   files_related_morphs files_related_morphs_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.files_related_morphs
    ADD CONSTRAINT files_related_morphs_fk FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.files_related_morphs DROP CONSTRAINT files_related_morphs_fk;
       public          postgres    false    260    3683    256            ?           2606    130262    files files_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.files DROP CONSTRAINT files_updated_by_id_fk;
       public          postgres    false    3615    256    220            C           2606    130267 *   keyword_tags keyword_tags_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.keyword_tags
    ADD CONSTRAINT keyword_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.keyword_tags DROP CONSTRAINT keyword_tags_created_by_id_fk;
       public          postgres    false    3615    220    262            E           2606    130272 .   keyword_tags_components keyword_tags_entity_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.keyword_tags_components
    ADD CONSTRAINT keyword_tags_entity_fk FOREIGN KEY (entity_id) REFERENCES public.keyword_tags(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.keyword_tags_components DROP CONSTRAINT keyword_tags_entity_fk;
       public          postgres    false    3695    263    262            D           2606    130277 *   keyword_tags keyword_tags_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.keyword_tags
    ADD CONSTRAINT keyword_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.keyword_tags DROP CONSTRAINT keyword_tags_updated_by_id_fk;
       public          postgres    false    3615    220    262            H           2606    130282 2   links_archive_tag_links links_archive_tag_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.links_archive_tag_links
    ADD CONSTRAINT links_archive_tag_links_fk FOREIGN KEY (link_id) REFERENCES public.links(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.links_archive_tag_links DROP CONSTRAINT links_archive_tag_links_fk;
       public          postgres    false    3704    267    266            I           2606    130287 6   links_archive_tag_links links_archive_tag_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.links_archive_tag_links
    ADD CONSTRAINT links_archive_tag_links_inv_fk FOREIGN KEY (archive_tag_id) REFERENCES public.archive_tags(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.links_archive_tag_links DROP CONSTRAINT links_archive_tag_links_inv_fk;
       public          postgres    false    3623    267    224            F           2606    130292    links links_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.links DROP CONSTRAINT links_created_by_id_fk;
       public          postgres    false    266    3615    220            G           2606    130297    links links_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.links DROP CONSTRAINT links_updated_by_id_fk;
       public          postgres    false    3615    220    266            J           2606    130302 ,   location_tags location_tags_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.location_tags
    ADD CONSTRAINT location_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 V   ALTER TABLE ONLY public.location_tags DROP CONSTRAINT location_tags_created_by_id_fk;
       public          postgres    false    220    270    3615            L           2606    130307 0   location_tags_components location_tags_entity_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.location_tags_components
    ADD CONSTRAINT location_tags_entity_fk FOREIGN KEY (entity_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.location_tags_components DROP CONSTRAINT location_tags_entity_fk;
       public          postgres    false    3712    271    270            �           2606    130643 B   location_tags_parent_tags_links location_tags_parent_tags_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.location_tags_parent_tags_links
    ADD CONSTRAINT location_tags_parent_tags_links_fk FOREIGN KEY (location_tag_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.location_tags_parent_tags_links DROP CONSTRAINT location_tags_parent_tags_links_fk;
       public          postgres    false    270    347    3712            �           2606    130648 F   location_tags_parent_tags_links location_tags_parent_tags_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.location_tags_parent_tags_links
    ADD CONSTRAINT location_tags_parent_tags_links_inv_fk FOREIGN KEY (inv_location_tag_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 p   ALTER TABLE ONLY public.location_tags_parent_tags_links DROP CONSTRAINT location_tags_parent_tags_links_inv_fk;
       public          postgres    false    3712    270    347            K           2606    130312 ,   location_tags location_tags_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.location_tags
    ADD CONSTRAINT location_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 V   ALTER TABLE ONLY public.location_tags DROP CONSTRAINT location_tags_updated_by_id_fk;
       public          postgres    false    220    3615    270            O           2606    130317 Z   parameterized_permissions_archive_tag_links parameterized_permissions_archive_tag_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.parameterized_permissions_archive_tag_links
    ADD CONSTRAINT parameterized_permissions_archive_tag_links_fk FOREIGN KEY (parameterized_permission_id) REFERENCES public.parameterized_permissions(id) ON DELETE CASCADE;
 �   ALTER TABLE ONLY public.parameterized_permissions_archive_tag_links DROP CONSTRAINT parameterized_permissions_archive_tag_links_fk;
       public          postgres    false    274    3721    275            P           2606    130322 ^   parameterized_permissions_archive_tag_links parameterized_permissions_archive_tag_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.parameterized_permissions_archive_tag_links
    ADD CONSTRAINT parameterized_permissions_archive_tag_links_inv_fk FOREIGN KEY (archive_tag_id) REFERENCES public.archive_tags(id) ON DELETE CASCADE;
 �   ALTER TABLE ONLY public.parameterized_permissions_archive_tag_links DROP CONSTRAINT parameterized_permissions_archive_tag_links_inv_fk;
       public          postgres    false    275    224    3623            M           2606    130327 D   parameterized_permissions parameterized_permissions_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.parameterized_permissions
    ADD CONSTRAINT parameterized_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 n   ALTER TABLE ONLY public.parameterized_permissions DROP CONSTRAINT parameterized_permissions_created_by_id_fk;
       public          postgres    false    220    3615    274            N           2606    130332 D   parameterized_permissions parameterized_permissions_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.parameterized_permissions
    ADD CONSTRAINT parameterized_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 n   ALTER TABLE ONLY public.parameterized_permissions DROP CONSTRAINT parameterized_permissions_updated_by_id_fk;
       public          postgres    false    220    274    3615            Q           2606    130337 p   parameterized_permissions_users_permissions_user_links parameterized_permissions_users_permissions_user_links_fk    FK CONSTRAINT     	  ALTER TABLE ONLY public.parameterized_permissions_users_permissions_user_links
    ADD CONSTRAINT parameterized_permissions_users_permissions_user_links_fk FOREIGN KEY (parameterized_permission_id) REFERENCES public.parameterized_permissions(id) ON DELETE CASCADE;
 �   ALTER TABLE ONLY public.parameterized_permissions_users_permissions_user_links DROP CONSTRAINT parameterized_permissions_users_permissions_user_links_fk;
       public          postgres    false    278    3721    274            R           2606    130342 t   parameterized_permissions_users_permissions_user_links parameterized_permissions_users_permissions_user_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.parameterized_permissions_users_permissions_user_links
    ADD CONSTRAINT parameterized_permissions_users_permissions_user_links_inv_fk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;
 �   ALTER TABLE ONLY public.parameterized_permissions_users_permissions_user_links DROP CONSTRAINT parameterized_permissions_users_permissions_user_links_inv_fk;
       public          postgres    false    278    3842    338            S           2606    130347 (   person_tags person_tags_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.person_tags
    ADD CONSTRAINT person_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.person_tags DROP CONSTRAINT person_tags_created_by_id_fk;
       public          postgres    false    220    3615    280            U           2606    130352 ,   person_tags_components person_tags_entity_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.person_tags_components
    ADD CONSTRAINT person_tags_entity_fk FOREIGN KEY (entity_id) REFERENCES public.person_tags(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.person_tags_components DROP CONSTRAINT person_tags_entity_fk;
       public          postgres    false    280    281    3733            T           2606    130357 (   person_tags person_tags_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.person_tags
    ADD CONSTRAINT person_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 R   ALTER TABLE ONLY public.person_tags DROP CONSTRAINT person_tags_updated_by_id_fk;
       public          postgres    false    220    280    3615            V           2606    130362 4   picture_geo_infos picture_geo_infos_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.picture_geo_infos
    ADD CONSTRAINT picture_geo_infos_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.picture_geo_infos DROP CONSTRAINT picture_geo_infos_created_by_id_fk;
       public          postgres    false    220    284    3615            X           2606    130367 B   picture_geo_infos_picture_links picture_geo_infos_picture_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.picture_geo_infos_picture_links
    ADD CONSTRAINT picture_geo_infos_picture_links_fk FOREIGN KEY (picture_geo_info_id) REFERENCES public.picture_geo_infos(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.picture_geo_infos_picture_links DROP CONSTRAINT picture_geo_infos_picture_links_fk;
       public          postgres    false    284    286    3742            Y           2606    130372 F   picture_geo_infos_picture_links picture_geo_infos_picture_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.picture_geo_infos_picture_links
    ADD CONSTRAINT picture_geo_infos_picture_links_inv_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 p   ALTER TABLE ONLY public.picture_geo_infos_picture_links DROP CONSTRAINT picture_geo_infos_picture_links_inv_fk;
       public          postgres    false    288    286    3750            W           2606    130377 4   picture_geo_infos picture_geo_infos_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.picture_geo_infos
    ADD CONSTRAINT picture_geo_infos_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.picture_geo_infos DROP CONSTRAINT picture_geo_infos_updated_by_id_fk;
       public          postgres    false    284    3615    220            \           2606    130382 8   pictures_archive_tag_links pictures_archive_tag_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_archive_tag_links
    ADD CONSTRAINT pictures_archive_tag_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.pictures_archive_tag_links DROP CONSTRAINT pictures_archive_tag_links_fk;
       public          postgres    false    288    289    3750            ]           2606    130387 <   pictures_archive_tag_links pictures_archive_tag_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_archive_tag_links
    ADD CONSTRAINT pictures_archive_tag_links_inv_fk FOREIGN KEY (archive_tag_id) REFERENCES public.archive_tags(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_archive_tag_links DROP CONSTRAINT pictures_archive_tag_links_inv_fk;
       public          postgres    false    289    224    3623            ^           2606    130392 8   pictures_collections_links pictures_collections_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_collections_links
    ADD CONSTRAINT pictures_collections_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.pictures_collections_links DROP CONSTRAINT pictures_collections_links_fk;
       public          postgres    false    3750    288    291            _           2606    130397 <   pictures_collections_links pictures_collections_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_collections_links
    ADD CONSTRAINT pictures_collections_links_inv_fk FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_collections_links DROP CONSTRAINT pictures_collections_links_inv_fk;
       public          postgres    false    232    291    3639            Z           2606    130402 "   pictures pictures_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.pictures DROP CONSTRAINT pictures_created_by_id_fk;
       public          postgres    false    220    288    3615            `           2606    130407 :   pictures_descriptions_links pictures_descriptions_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_descriptions_links
    ADD CONSTRAINT pictures_descriptions_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.pictures_descriptions_links DROP CONSTRAINT pictures_descriptions_links_fk;
       public          postgres    false    288    293    3750            a           2606    130412 >   pictures_descriptions_links pictures_descriptions_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_descriptions_links
    ADD CONSTRAINT pictures_descriptions_links_inv_fk FOREIGN KEY (description_id) REFERENCES public.descriptions(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.pictures_descriptions_links DROP CONSTRAINT pictures_descriptions_links_inv_fk;
       public          postgres    false    248    293    3667            b           2606    130417 :   pictures_keyword_tags_links pictures_keyword_tags_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_keyword_tags_links
    ADD CONSTRAINT pictures_keyword_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.pictures_keyword_tags_links DROP CONSTRAINT pictures_keyword_tags_links_fk;
       public          postgres    false    288    296    3750            c           2606    130422 >   pictures_keyword_tags_links pictures_keyword_tags_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_keyword_tags_links
    ADD CONSTRAINT pictures_keyword_tags_links_inv_fk FOREIGN KEY (keyword_tag_id) REFERENCES public.keyword_tags(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.pictures_keyword_tags_links DROP CONSTRAINT pictures_keyword_tags_links_inv_fk;
       public          postgres    false    296    3695    262            d           2606    130427 @   pictures_linked_pictures_links pictures_linked_pictures_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_linked_pictures_links
    ADD CONSTRAINT pictures_linked_pictures_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.pictures_linked_pictures_links DROP CONSTRAINT pictures_linked_pictures_links_fk;
       public          postgres    false    288    298    3750            e           2606    130432 D   pictures_linked_pictures_links pictures_linked_pictures_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_linked_pictures_links
    ADD CONSTRAINT pictures_linked_pictures_links_inv_fk FOREIGN KEY (inv_picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 n   ALTER TABLE ONLY public.pictures_linked_pictures_links DROP CONSTRAINT pictures_linked_pictures_links_inv_fk;
       public          postgres    false    288    3750    298            f           2606    130437 :   pictures_linked_texts_links pictures_linked_texts_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_linked_texts_links
    ADD CONSTRAINT pictures_linked_texts_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.pictures_linked_texts_links DROP CONSTRAINT pictures_linked_texts_links_fk;
       public          postgres    false    288    300    3750            g           2606    130442 >   pictures_linked_texts_links pictures_linked_texts_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_linked_texts_links
    ADD CONSTRAINT pictures_linked_texts_links_inv_fk FOREIGN KEY (inv_picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.pictures_linked_texts_links DROP CONSTRAINT pictures_linked_texts_links_inv_fk;
       public          postgres    false    288    300    3750            h           2606    130447 <   pictures_location_tags_links pictures_location_tags_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_location_tags_links
    ADD CONSTRAINT pictures_location_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_location_tags_links DROP CONSTRAINT pictures_location_tags_links_fk;
       public          postgres    false    288    302    3750            i           2606    130452 @   pictures_location_tags_links pictures_location_tags_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_location_tags_links
    ADD CONSTRAINT pictures_location_tags_links_inv_fk FOREIGN KEY (location_tag_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.pictures_location_tags_links DROP CONSTRAINT pictures_location_tags_links_inv_fk;
       public          postgres    false    270    302    3712            j           2606    130457 8   pictures_person_tags_links pictures_person_tags_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_person_tags_links
    ADD CONSTRAINT pictures_person_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.pictures_person_tags_links DROP CONSTRAINT pictures_person_tags_links_fk;
       public          postgres    false    288    304    3750            k           2606    130462 <   pictures_person_tags_links pictures_person_tags_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_person_tags_links
    ADD CONSTRAINT pictures_person_tags_links_inv_fk FOREIGN KEY (person_tag_id) REFERENCES public.person_tags(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.pictures_person_tags_links DROP CONSTRAINT pictures_person_tags_links_inv_fk;
       public          postgres    false    304    3733    280            l           2606    130467 >   pictures_time_range_tag_links pictures_time_range_tag_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_time_range_tag_links
    ADD CONSTRAINT pictures_time_range_tag_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.pictures_time_range_tag_links DROP CONSTRAINT pictures_time_range_tag_links_fk;
       public          postgres    false    288    306    3750            m           2606    130472 B   pictures_time_range_tag_links pictures_time_range_tag_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_time_range_tag_links
    ADD CONSTRAINT pictures_time_range_tag_links_inv_fk FOREIGN KEY (time_range_tag_id) REFERENCES public.time_range_tags(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.pictures_time_range_tag_links DROP CONSTRAINT pictures_time_range_tag_links_inv_fk;
       public          postgres    false    3826    306    330            [           2606    130477 "   pictures pictures_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.pictures DROP CONSTRAINT pictures_updated_by_id_fk;
       public          postgres    false    220    288    3615            n           2606    130482 L   pictures_verified_keyword_tags_links pictures_verified_keyword_tags_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links
    ADD CONSTRAINT pictures_verified_keyword_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 v   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links DROP CONSTRAINT pictures_verified_keyword_tags_links_fk;
       public          postgres    false    3750    308    288            o           2606    130487 P   pictures_verified_keyword_tags_links pictures_verified_keyword_tags_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links
    ADD CONSTRAINT pictures_verified_keyword_tags_links_inv_fk FOREIGN KEY (keyword_tag_id) REFERENCES public.keyword_tags(id) ON DELETE CASCADE;
 z   ALTER TABLE ONLY public.pictures_verified_keyword_tags_links DROP CONSTRAINT pictures_verified_keyword_tags_links_inv_fk;
       public          postgres    false    3695    308    262            p           2606    130492 N   pictures_verified_location_tags_links pictures_verified_location_tags_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_location_tags_links
    ADD CONSTRAINT pictures_verified_location_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.pictures_verified_location_tags_links DROP CONSTRAINT pictures_verified_location_tags_links_fk;
       public          postgres    false    3750    310    288            q           2606    130497 R   pictures_verified_location_tags_links pictures_verified_location_tags_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_location_tags_links
    ADD CONSTRAINT pictures_verified_location_tags_links_inv_fk FOREIGN KEY (location_tag_id) REFERENCES public.location_tags(id) ON DELETE CASCADE;
 |   ALTER TABLE ONLY public.pictures_verified_location_tags_links DROP CONSTRAINT pictures_verified_location_tags_links_inv_fk;
       public          postgres    false    3712    310    270            r           2606    130502 J   pictures_verified_person_tags_links pictures_verified_person_tags_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_person_tags_links
    ADD CONSTRAINT pictures_verified_person_tags_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 t   ALTER TABLE ONLY public.pictures_verified_person_tags_links DROP CONSTRAINT pictures_verified_person_tags_links_fk;
       public          postgres    false    3750    312    288            s           2606    130507 N   pictures_verified_person_tags_links pictures_verified_person_tags_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_person_tags_links
    ADD CONSTRAINT pictures_verified_person_tags_links_inv_fk FOREIGN KEY (person_tag_id) REFERENCES public.person_tags(id) ON DELETE CASCADE;
 x   ALTER TABLE ONLY public.pictures_verified_person_tags_links DROP CONSTRAINT pictures_verified_person_tags_links_inv_fk;
       public          postgres    false    3733    312    280            t           2606    130512 P   pictures_verified_time_range_tag_links pictures_verified_time_range_tag_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links
    ADD CONSTRAINT pictures_verified_time_range_tag_links_fk FOREIGN KEY (picture_id) REFERENCES public.pictures(id) ON DELETE CASCADE;
 z   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links DROP CONSTRAINT pictures_verified_time_range_tag_links_fk;
       public          postgres    false    3750    314    288            u           2606    130517 T   pictures_verified_time_range_tag_links pictures_verified_time_range_tag_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links
    ADD CONSTRAINT pictures_verified_time_range_tag_links_inv_fk FOREIGN KEY (time_range_tag_id) REFERENCES public.time_range_tags(id) ON DELETE CASCADE;
 ~   ALTER TABLE ONLY public.pictures_verified_time_range_tag_links DROP CONSTRAINT pictures_verified_time_range_tag_links_inv_fk;
       public          postgres    false    3826    314    330            v           2606    130522 J   strapi_api_token_permissions strapi_api_token_permissions_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 t   ALTER TABLE ONLY public.strapi_api_token_permissions DROP CONSTRAINT strapi_api_token_permissions_created_by_id_fk;
       public          postgres    false    3615    316    220            x           2606    130527 T   strapi_api_token_permissions_token_links strapi_api_token_permissions_token_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.strapi_api_token_permissions_token_links
    ADD CONSTRAINT strapi_api_token_permissions_token_links_fk FOREIGN KEY (api_token_permission_id) REFERENCES public.strapi_api_token_permissions(id) ON DELETE CASCADE;
 ~   ALTER TABLE ONLY public.strapi_api_token_permissions_token_links DROP CONSTRAINT strapi_api_token_permissions_token_links_fk;
       public          postgres    false    3806    318    316            y           2606    130532 X   strapi_api_token_permissions_token_links strapi_api_token_permissions_token_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.strapi_api_token_permissions_token_links
    ADD CONSTRAINT strapi_api_token_permissions_token_links_inv_fk FOREIGN KEY (api_token_id) REFERENCES public.strapi_api_tokens(id) ON DELETE CASCADE;
 �   ALTER TABLE ONLY public.strapi_api_token_permissions_token_links DROP CONSTRAINT strapi_api_token_permissions_token_links_inv_fk;
       public          postgres    false    318    3814    320            w           2606    130537 J   strapi_api_token_permissions strapi_api_token_permissions_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 t   ALTER TABLE ONLY public.strapi_api_token_permissions DROP CONSTRAINT strapi_api_token_permissions_updated_by_id_fk;
       public          postgres    false    316    3615    220            z           2606    130542 4   strapi_api_tokens strapi_api_tokens_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.strapi_api_tokens DROP CONSTRAINT strapi_api_tokens_created_by_id_fk;
       public          postgres    false    220    320    3615            {           2606    130547 4   strapi_api_tokens strapi_api_tokens_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.strapi_api_tokens DROP CONSTRAINT strapi_api_tokens_updated_by_id_fk;
       public          postgres    false    3615    320    220            |           2606    130552 0   time_range_tags time_range_tags_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.time_range_tags
    ADD CONSTRAINT time_range_tags_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 Z   ALTER TABLE ONLY public.time_range_tags DROP CONSTRAINT time_range_tags_created_by_id_fk;
       public          postgres    false    3615    330    220            }           2606    130557 0   time_range_tags time_range_tags_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.time_range_tags
    ADD CONSTRAINT time_range_tags_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 Z   ALTER TABLE ONLY public.time_range_tags DROP CONSTRAINT time_range_tags_updated_by_id_fk;
       public          postgres    false    3615    330    220            ~           2606    130562 .   up_permissions up_permissions_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 X   ALTER TABLE ONLY public.up_permissions DROP CONSTRAINT up_permissions_created_by_id_fk;
       public          postgres    false    3615    332    220            �           2606    130567 6   up_permissions_role_links up_permissions_role_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_permissions_role_links
    ADD CONSTRAINT up_permissions_role_links_fk FOREIGN KEY (permission_id) REFERENCES public.up_permissions(id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.up_permissions_role_links DROP CONSTRAINT up_permissions_role_links_fk;
       public          postgres    false    3830    334    332            �           2606    130572 :   up_permissions_role_links up_permissions_role_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_permissions_role_links
    ADD CONSTRAINT up_permissions_role_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.up_permissions_role_links DROP CONSTRAINT up_permissions_role_links_inv_fk;
       public          postgres    false    336    334    3838                       2606    130577 .   up_permissions up_permissions_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 X   ALTER TABLE ONLY public.up_permissions DROP CONSTRAINT up_permissions_updated_by_id_fk;
       public          postgres    false    332    220    3615            �           2606    130582 "   up_roles up_roles_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_roles DROP CONSTRAINT up_roles_created_by_id_fk;
       public          postgres    false    220    336    3615            �           2606    130587 "   up_roles up_roles_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_roles DROP CONSTRAINT up_roles_updated_by_id_fk;
       public          postgres    false    3615    336    220            �           2606    130592 "   up_users up_users_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_users DROP CONSTRAINT up_users_created_by_id_fk;
       public          postgres    false    3615    220    338            �           2606    130597 *   up_users_role_links up_users_role_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_users_role_links
    ADD CONSTRAINT up_users_role_links_fk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.up_users_role_links DROP CONSTRAINT up_users_role_links_fk;
       public          postgres    false    338    3842    340            �           2606    130602 .   up_users_role_links up_users_role_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_users_role_links
    ADD CONSTRAINT up_users_role_links_inv_fk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.up_users_role_links DROP CONSTRAINT up_users_role_links_inv_fk;
       public          postgres    false    340    336    3838            �           2606    130607 "   up_users up_users_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.up_users DROP CONSTRAINT up_users_updated_by_id_fk;
       public          postgres    false    338    220    3615            �           2606    130612 .   upload_folders upload_folders_created_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 X   ALTER TABLE ONLY public.upload_folders DROP CONSTRAINT upload_folders_created_by_id_fk;
       public          postgres    false    342    220    3615            �           2606    130617 :   upload_folders_parent_links upload_folders_parent_links_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.upload_folders_parent_links
    ADD CONSTRAINT upload_folders_parent_links_fk FOREIGN KEY (folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.upload_folders_parent_links DROP CONSTRAINT upload_folders_parent_links_fk;
       public          postgres    false    344    342    3854            �           2606    130622 >   upload_folders_parent_links upload_folders_parent_links_inv_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.upload_folders_parent_links
    ADD CONSTRAINT upload_folders_parent_links_inv_fk FOREIGN KEY (inv_folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public.upload_folders_parent_links DROP CONSTRAINT upload_folders_parent_links_inv_fk;
       public          postgres    false    342    3854    344            �           2606    130627 .   upload_folders upload_folders_updated_by_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;
 X   ALTER TABLE ONLY public.upload_folders DROP CONSTRAINT upload_folders_updated_by_id_fk;
       public          postgres    false    342    220    3615                 x��]�o���A�׆�)����C_��>���&jlɐ�ͥE����ds���`g�m�o�Ù!9��7����(g�EU��l'��h=�nVU�^,j���&���}]=7tRWU;YT�]�EUN�����,�j���n�[l뚍���n~��&��`�E�߭�beS�G ����_7�BU�����ۻ%mu��_�o��j9�?j8q�s��Ţ�ִ{�>n��e^�Ƥ ))e�*�z;4�ʗo�Ǫ��?�NR�C����=������z�X�Tz���`����<W�r��S��d̉�E�}e9Ǡ�R�ޣN�P��E����6��q/*&VQ��7��n�]�ӫ�A}p��1 h,%n�nh�1��ON��D���s�s*�?D���"���m�f^,w�Q��M�����0�L���k:���rR�����t��/-D�~�_Tt��X����9�_�	��_�Ǧ� ��Hד�M�3��t�3|;�������r�*S"��2��a!��s��4����:CoXU&��Gd��oy3�sf�s��$A=u�M��|��@�;K�M��Bt�.h��vSߞq���`h9�uS 'NUN�#R�g�="�!@G D���7�.D@����<��4R$R�HL�Wu��G��G"���Fq7������z�ț�SN����<�7�(�"��F_,j�5"�0%=G�%�%j�"R���|LN�<(U'��<Ȝ�KDa���)!҈%]�#c�.�e�!�nA�g��.�~�`'��o)9]�FDa�7�`���CDx51��� L��D�4�ġ��3��hh� b����g2�1j��ݏp���q���5&�.FJ���v��_��i]U�̙J�C�@s�U@*��T8Dx�hg� �4��4B8��#�ULB��Q"=[�4_N�m#C0�0~�M���]��!�!����]ٺ���H�g1A�@c�~|x�	����_3!�oqM�.�π��s��`X�.��҃�Sm^&��|:��b��.8 �������5�Y4�nt�C$������}U�%����A|�� <�ؒ�	�@�j<h�֔�]�~�A�s%�s�ﮦ /<,�(˻d�����V�0�g��Ia�S��"U����r�vÂ.J�.Q����{��{�{�Z@��{�D�Ӆ��.dp�n�3N��Tۀ��;|��H.Y�� �=���2 ygx�mGn�.D�\Q^
`٫U�Y%q����
�q]O�^*{Z�����R8�'m�.ʏ�Wy^��R$ �B��W\8��M�<��a�A��2]��l]��$��U�yw�x�m��.��d���@����gAǅ�[�������� �S���?�`3`25	'�q h0�LOP��xvq��s<,{�T�+/��"#Q�	�TĶ�18]�:i�
�=b2`�'+eq��Jm��Է�ᄀ�B�����8��;�@�Ц{W�f! �p��������@S���°2 /N1�3�.�{�,<�!m�J� Q8^7�]��e?��_�����5Jpal%��.�t��=i�G8�Py{~q=��'՞�������j�u�u�{NG�'7b�d�.[��F��l"��3R'�>����9�kY5���6�7�u�H�yPӀi�i�
��)',�\M�57唑0e�����c�}�*a!�����%4��۩J�ceY�
Y>��鈖����}��i[zEOC�̞?Ǻ�ӳ��(,��	��羆�`���c���*�;N�ONp<DAUs& o�����ֆ���i�j��c:mN���1�����¡����m�-�������!A��N�5����;�.Q�vx8,� 6V�~/��(Vl�l(��?��n���l.t�^ڶ�amW�ދD��3��T%�81X��j�b
f�\��d��oY�)7�L�#��8���L�,-�6�m�$6���c�.�?�W%"E�#ū�U�`-Qk�k�=��ZuQ��{gD.z6���X���u]�(RU���5 >y ��D��:�R{��t�)>�I$8�3.N���N���U�U���J�N�(��ѡ�$�E�#�:3i�z���F�N�鵔9pDIl_�޾���<�导\���aM`�B�gC�N<Q��h�7��}��O�ez\P�@!��P+1����L�m�Z���}X�r�.��Ǿ´�b�Wpy���U��s��w��wY���} ���e2@!!Z�����I��er�9�#w+ ����TM��"��g՟�l}0(J�@�Qm��i0,F�)Е��������R�n��.�����l��-����pP�fS��$�$$��,p�����ۉM�ꉖH���i�!���:ԡF�YFF)8N��p�Y�Fi۾��B�TZ�I?!#6/eU���i���ṟ���,Lg�752�C�B\���Iҥ�5��țw�B̽�y.(j;9���N&~x�ǳ�o2U�O� [��t�mR�<E����Wf�$/�4��� �����2|�,��ԩ7��y�a�Kt�u���'g�B��M�����m��%[�����t��9�d7� �f��,!jw�',t9��xe�D��,�R��~3j���_A�N<��C��pgӨ7+]ȅy��=�`�y�oMq��c2��\V���10�Y�4#�_6 ��� ��D�*�`{}Bi�K���L/oy�Q��.%��?��E��G�>*�:l/fJm�g*_��"ҥL��S�����X�Sdپ�m�AL����t9vl��>Вֻ9�e����]c�3_�3!_�G���I@f!�3A1H���a-�M��O�˰kg�2�|Y����`ޓ��r�|����t	��K��iT�̥s�����%8��_�<��#����E-^�h5/ʟ�X��j���;�/�m�q�V�3ҥ!8;��q�1Nw	C�0���2t����؎���t)�Sfpƥ� ]BG� ���x�1<�zvE�y���w�)H�B8>3��Q���t	�1��\��r)���>]�c��Ec�v�_��k�c������ơ>S��"�y]�Hg5�
���6��N����A�'ߑ��Y��n!����=['O�K~����?�ٿ������:Y�i����B~1��]���q�yʹѲ���4t7�>������R��$̍I�o�f���GZw��+�۳]E�Rc��d*{+Lх�0O�6R�w`(�<�g~���1�`/�)�T�k�{�x���<izݥ��_���<>z�	p��z�[g�K��qA:��	��a#f�X=/��0R$�6⳺����z������W�V�������W���?���j�X^m�X�m���.P�z��͏o�t�u�!��.5�t(�a��t�G�K��I҅&1�����������o���Ʀ������w��(�EdJ��K�9eVCkƁ�.]j��4�荀�^o�O�|��U��5           x�%�A�� C�_���6�p���9FR6���'�#�㗿@rM���q�4��p\���C,�-Dh� �!���F!P4B��`q��C��)^�>�P"��B��)^�x�H�r���E��%^-�x(�o�W,�x�Q��A�W��%^]�x�����?N`��Nl����t~ol����'~�ۃ��/Ni8��Y8G{����s��+<��K{��;��\�x����-^'Z�.�x�����������`���F�Y�&0�Mbě7#�\�q�zE�������.\�n��wW�[��ݍ+�=x����^��w���^k��<m�	����V?�WC�bɭ�J~MWtj�+"�;Gm����:�XZM=K��"�vc��p�H��T)�P��CYC�(k(�Q���^j쯗۽�Fl�2���|���R�����ؾS�d�$��Ǥı��LKk0/q���ı3�LMk�rm&'�5��hk0=��`~���E[���Sm�(�LR�5��hklMkl�k0Q1�`�b��T�X�����cf+�LW�5��k0a1�`��Z�hJ��\�u/��瘝�	y#V�s��warYw4�|���e]�?�u��\�e2�����}~޽�la3�����p�co��A��Ϗ���{??3iO�F��+>�yV�)����~�4��+j؝I�ݙ�nڝ�+�4����\�'SݞL�t;15����<��R���K�3���;��K�3�?�+��δ��^�L.��0�����?s^o          �   x�u�=o� @g�+�؊���l�v��
����H����j$�!���+/�d��+N������3��3��pG�7�g���p����q��F�v3Ȃ~8n��0v����˧�F��u)ĵ��T`�X�b[���x|"��7s� i
L��$��L�u�Vy��P�,��Ea�
|����?a�(_D��+�q�_��i~ O�~�      "   �   x�E��
�@ E�3_�­ӼLsAE!���e�G��q���SZ.����ހ�W�W`f@����B:M��rеӛ�2ëFR�6�6�ԫL�}2�n/�I~���O���g5��(��i�f���Ԯ[,�TKQL�������_#μ��Zx�<`���a� �_��4�      $      x�3�4�4����� �X      &   d   x�3��H-JJ-*�u�(J�+�u��II-J,J��,����"###]3]CcCS+cs+=sCC����HJ��������B������h������� FP�      (      x�3�4�4����� c�      *   ;   x�uȱ  ��p�?B����shger�Q�q5f�"�gê5����
u���E�      +      x�3�4�4����� �Z      .     x����n�0�g�~��;�e�ԩ�Ę�7 !��v��ױ�JT{�t�[�w��8u�p��4�]�i�(�o�"E�+�K������*��X�:�N�$P`f��P�F3(�"�
P*����i?G�����vN^����-�|L�<4��̇���y�TB3���I�`hC���$�a`I��CFh�΁�E=��W��]
�P�"��@YF��-%^����v}۹�� w�ݲ6~����s�n�+
}=[VP0���Χ�"c���>Vv�,�~ �b��      /      x������ � �      2   -   x�ȹ @���*��tC�u����2V)��KM���r�@      4   '  x��P;O�@��_a�6J���l+!�,n�
G���J��8<D�T~�����������/1@���a1(m /������E�y�s&�� [��īŖ��EA4�m���崂L�պ���M>`��p�Ft�08<j	x�:�&��|�w�Nf�`�p��b^�8��=ëd�`$~E~����(��g��D8a60ɑҔ(�t�6!0��G�3��E����/�?��?]��h�]�ݺn����������ͮ�tU]����V�����h�r�ʲ|��p      6      x������ � �      8      x�3�4�4����� �[      :   y   x�=�9�0@�Z:�.@���&M��4�-@���"��T���-h��&��M��[G�Ɯ�*�������ht�ؖ�C.�&�V���;!]��p�:��T�p���iU>�M��!��8)�      <   B   x�%ʹ�0��F��]��1�%��+�����<nڨ!Q�$���^Ŋ��}eH�<*"/�k      >   �   x���A
�0E��)��f2��R
�ޕ���j�6��Q,�TQ����Il��^Pv���}�/џä
U(�mI�����>
�I@����-mJ��։2�\A��2S����$��qf0��m]�p���^�E].�+�h��q��zL��Z����D�q}\��霯��x_�D�`r��2i2�'��jM��G�����+�9��E�&      @      x������ � �      B      x������ � �      D      x������ � �      F      x�՝�n䶲�{�"��g+�_�y� ���dv2�}p����l�(J�"�37�+�۵�_/��Z�_�������7T*�@!|���4}l�����_��~\�秏��|^��ۗ�?��_���s<R�=Rћ����V��h�<������K�i���/���>woU���~龮O�������_O��������y_�7%���}z���ڼV��U��=?�xz�<]����POB5|�H������i|�����M�t��{�=5eY#�Ε��+�����o�^���S�K��c�@a�^�P�a��� #|opy�������?����o~`˟���ⅱ�_yx�c��oa�_D,_�/h�n�҅�`�.�����6"o	p��Ja��q����ն�`/�#
$�4ZcQ����Q�y����%��>�NY`ޛ��k�=Y������C�/0o���,�8l��ec�^f���_dmT�Gc�,�
��,�k#��o�����Ȍ��,g�^tG�H,9��i{_`�.Ewd�I�F�����Y�y�Vݓ�+�BW�y�wf�ޙIc�(2".�`��)8Q�	���,��ubm��2��U�;��Qcg	�	���0`�5o�~�9�'��ӥ�0�=-��m�@�����ZuO஖����c�}a�y�w�A�E֐�2���0�7p*��08:���f�a��]ȵ~ˀ�7�̀�?������5z�`/�#x$d�癁x_`�.Ew��I,c��f�a�y�V���e)L��N3�}a�y�w�A�E������8/�m(	���,�_2X�.�����K~}���������_�[�nqO�8Z�uf"v���7�Yw����o�]��__3�P�m�a� {�ŏ[ĴQ���V���>�:svn�����~���f�NOڵ�#l�_d�/��2��e��������鯯������yL_�������|��Zv��Ԁ���4�C������XKr���r�l�"�.�8��Zf$�e�a��.#(X����7ɺ�k5w
�7��.�`���`��&R�-����Z���ӡ�k6S�I2ҙtJ�n֘p�KT\8�>�.��Q'[����qX��7�Ib��S�Ke�9q^W]��1m���M�F\h�M-#g��`��F�d�PCGY?r�8/�0�`���l��>�3.�agZ)AO#�Vwر,�����h$�6]}ZĴ%3nk"9�� l��|Y�6�q�����m�x��Ȁ�u��[Ĵa�M��Z�`��ԍ>�v+;�D�S�AC���5�"�-�ڭ�t���ĊU���6�6=����A�몃��i��H�-����[�}b�Vv�e�V Z2i;1Fr��C��i��HE-���fZ�,˨��L;�0t����E֤^X�v��ˮI}�k��'��$-��;�l-ؑ0*������2��if�o"5�B�װɟ�n�/�b$Xw���u�Ĭ%18l^Wl�EL[6�D*l�E6�R�k��l,ˎ�ܛ�W�0[��t��[ĴEW��&�W�{�l��;BX��`�Y�R�{��E�n��`�-bڒ�v�&��1�D�lC4��,��L���&�C�^Wl�EL[r]�5��.,b������S�mu[�}��2:�I���몃��i��H�-���f����8g�u[���I�Nh���a��`�-bڂ��&Ra-"�	��yL6_w�e�IP�c�
�#�y]u��1m�9��D�-���&�z���;ز�%�I1c� 3��Ul���7�
[h���B7���`�Y�Q�G+�#�ټ�:�`����0�5�<�1ؖ/�prJ���`˲��z:td��F7]u��1m�atk"y,b�ٖ���lYv���c�"��u��[Ĵ%}lM$�,��-� �R�-��l<��j�����^Wl�EL[rak"y!���&Z!�,Xw�e�A�f��^�9�f��6�"�-�@ؚH^ 1�d�DC���,;v❜'�E}x]u��1mA�|�g}1�T�>�:���l�vz#'3�a��`�-bڢ;�&�w�1�֝�f��u[��"L��������6]u��1m�9��D�-���fZF�ᒂu[��Q��+5��ug6]u��1mA�|�ם	,"�Q�2�({\����-��0��g�V��l^Wl�EL[rݚHF�lt�p��8g�u[��n�~ֽ8l^Wl�EL[6�D���{�l���S`���eaR�<���ި�Ul�ݮ�5��]����&�Ͽ����-�������:����`�-bڂ��&�??X�`S��Ny<���o��,;�H6"�ȧ���:�`��� l��T�B�l��l1�@�u[�����ȁv��l7]u��1m��l�&ҏ��-b���j�F�`���,;���D��"�ټ�:�`����v��D�vU`�����`���,;f�XRa�)�]�u��[Ĵa�M��Z�`�r�_w�e���8�i�h��Y7]u��1m�����ύ�-b��WZh�0`���e����Y�9r���UlӖF�&����"�n�z��A]_w����2s�G�E������iK¶5�[`�ͮ�N&Xw�e�A����)vQ�MWl�EL[rݚHF�l��D6�w|����	�`�t��F��:�`��� l���$qؖ���)�Vv���Bg��H�E6���:�`��� j���O 1��z6*�36_�Mf�?0l�b�x���6�"�-y�ck"��G`�M�W����Vw�e�?��g1Y�ː�Ul���7�~)��E6�z	]v�m�;ز��v8�Y�z]u��1mA�|���[�`���4J��t}���e����H;�l�F^Wl�EL[6�D*l�E6A�%��9����,��ij��c��^Wl�EL[t�vk"}ζ���F[��E��#_w�e�?�f2�^2�ȩ�Ul���7�|�n`�mYu�F��6��;ز��I/�J;���몃��i��H>u2���&ZJ{�����-������c�����`�-bڂ��&�O�,�q�pzJ���`�s��,S˩���u��[Ĵa�M$_�(���&[bz:����,;���@�bؼ�:�`�������D��h`�m�0�����`SYvx7�f����:�u��[Ĵa�M��������ZNn��|���-���zJ�u�l6��6�"�-yPwk"��n`�Mʆ��a�;ز� �Ҝk>D>��u��[Ĵa�M$�%����^g�Q���|����ܝ��f�^��������|�KTwz~���;��#��|�O;IZA����6_w�e�K�]�8=��(�����-bڒGܶ&����aS?Q�
�J�P����M�ɸi��0�|�����
3v���f��#9�B�v뽻��<��˲���Sb�[���2��if�o"ys>������4�X��`���2}��[��|���4�d��п���#|����
�������Rk���	��J�Խ7�a�����8_�T�q�Ww/����%�ޛ2���<<u��W���MZ����HE�?|�R����l�򍜇*����b�
�b�ޫ��
*���s�l��4O�DN��tՍT�EL[p��M$� X�P[?*ר���C���g����l�4�K�骃��iK�mM$�1�lKM���EX~Cm�\����?�D�k���5i�|����n���]�N�Թ���)�F��@\�d̢�h�"�gM�)�_�Rz٩���,Ɩ�msz�AL�����g޾� ��f�=��t"2��ºfްAPX���+��y�FQqᙷo$}�:�C��]�΂uYv�X��8)*#so��n:[Ĵ�C�����lT�v�u��nߏ�Tg95Q��0PX�X�U�U�?XY�XEŅ�*�H�X:��c�a}s����+<8�G����&�^XWx�AaU����U�l�Hzx�N��-��
������BN����A�l��ƀ�i��1[�cd���4 �   �k�� S��|"?
�O�h1	����Ivdo�b�q�2�"���O�h�Y���e�)B�N�0�X+h#�q��2��!�ƨ^T��d�A�C�� �=$B�C �d�=�&�$�u��5�֔3&���� �uͶa�����6�VV9ۆ���³m�H�l;t����E�-a`�Ň��M�х�X|l���4
����3>@���t|l���S,>tKT���o��k��Ç�<-�      G      x������ � �      J   �  x���AN\1��}��׶�ms�lF�D Dr��Z,��%1�+덫+������ק�?�_?������G�����V����^����Q[���Ӌ��^��������Ȯ�-��jQ6���^�O�k/�N���f(O7�B�xs+��	ux�0���h
�Y9u8m1������;�&�w�w�w_ �$>@|I|���� �%��K�ė��/�_ �$>@|K�A|K�A|K�A|K�A|K�A|K�A|K�A|K��)q�-q���%�	�v�|�7�%�	�vI}��]b��n��'��%�	�vI~��]���}u�~���>��ddo��7�ٛ��M�A�&� {�}���>� � �&�E�M�����7�/�o�_d�d�Ⱦ�~�}��"�&�E�M����7�w�o���d�e�ɾ�~�}��&�.�M�]����7�w�o��?o}�Y�H����#�12F�50fƨ�����0vƨ�h��g4�̳�<[0j���<[0j���<[0j���<[0jaf�Z��B�f�Ш���ˀb�B�f�@{�r�-Z�Ik�i-G�Ѫ���F��r�-[;��\o�J�}<�|��������������[�[=�<�g�k��3s��ٰ�
c4����s�1Z�v����p;c��C����L      L     x����j�0�����s��$�W�Wވ���jY��7K+Ʀ����s�#��{��02�ЦS�F����ݜBDj��������/�ӐV�_�5�h%��s��i�(
��i^u�<��a^����{��OKM���0��&�J���?���v.�7��4^Ưq��a���1
Ac�~��r���.U(��b�n�YO�KX�%�ՃK�ʁe*�6�<�qV�l���N���l�p�X��m�7k�o:ֲ�ݒDv ٝJT��-TU�}��d      M   5   x�3�4�4�L������+���ϫ�-�3���
�q+0�2J��3!F��� �!.      P      x������ � �      Q      x������ � �      T   �   x�uѽN1�9�y�Z�󝑉&�����
a�ӓ��E�d���吸[����//?�]
F��Z�LD�g�_�Qb��EfPd�w|����a��T�����:����ʎ�q�P����S�.��H�&�k�����6<�ߔS��xNy;m�-咲�����]���5h��-��w��G$�j��	�FTY0��X:�p���Æ|�	l��1��칇i�F�������y���m��:��GX�����_      U   W   x�3�4��Ē��<������̼Ē�bNd�!�	���h�9P,7���2/?�2���0�2�c�O�P��nF\1z\\\ �O<�      �      x������ � �      X   c  x���KO�0 ��+�D���e	�.B���%ML�ȣJR��ߦ��4�c����'�؞NpɒwEqY�:QW-y�!�2�4>s�y@�4r�$TƷK�nf���u�\�\秃�y�;~0O�|��nҒ��HȀdO;~�^`vh�B�ny���}�<���p?��o��Z+V�+�W��}�VX"G�R���Vdݺ��U�`����d��SܕK�q��(���GJ�,9�1���C����Ǫ�d�ߗ><�$s^Z%�t�I�����FA�0��2�x���,��z;J���������m��ڔ�)�@G��0<�!��Q�ncaF������y��x#��/��U�I�S�ALH��M�"޸�ژ$����HJѶ�n���^zhyca�F�۴�>�n[����4��qpw�C�7�Ꮖ�FR�K�)�QI�����	�q`Ƌn���o���es�q?��o��O�q�y��K&�� ��\�X�aUԩ|D�Ql<N[ȃ��L�p���A�.�$�[*)=ā�P��3Ja�
C��$��2"i��U}�B�g�����,ށ���J�1q�̢d%*㎌�v�����=�z�`Ư[=#�!�O���G.4)����zQ����]��8�X&Ag1�	8l����$�:i��a[�K!��3Ǔ�C\7G@�^�`<L�������N�"L�DI!�Y���,�%�Y�@��f�bCW� ��o�t1SJbȖ�/������Q���-()0�`"{0
�?���'�B5s����?�M�C|`��i.v-&����1zƼ���}�aS�u'���bR��B渑���&��(r�(��y�O]k�g➜�l����<      Y   \   x����0�7.�&�8���:�ڑFB8&4ÂV��n�A�����]��H���{��u�=g��9a��<p���v�����1�t�?      \     x�����0�������_���2� ��ZO(ͭk��<Z�C��V�.���*�$��	#$x�L���a��S���F�=�`��F`����
|F�36>c�36>c�3��R��n�����g�6'�}N6{�U�ͥ�����J|Fγ;J�\L���L�:ܑ�w�W�9�.&{]̩�G������a�q��>�W5�k��3
�Q��_*�uT�S�b��,��U�us��WM�����g4sF�㨧�����c4���f�}u����{C�q�������:Y�      ^   r   x�3�����S�H-J�I)���4202�50"CS+C+SC=3s#����������������)�!�!��wbIFbQf^�BprFni^6�9�V��z���Z���Z�͉����   {      _   .   x�3�4�4�L������+���ϫ�-�3��8�8��)����� 1X      b      x������ � �      d      x������ � �      f   �  x���Mn�0�}
_ �����	�i��G(-%�b�jP�B��L��zy��8���Y/e�7�7���0ѩ��uj=?�wy���1/�����l��~0��Ê�b?���T�K�!E��~܂D73ғ�S֠�j��퓹
�Ņy,��k��T���I��x�mD��n�}pQ��J�_%�e~���0�\�n<��f��&���{��?]/7�x�93���/y��X�dMp~��8�c����Wp�����k`��k`���`���`���`���`���`��`��`��`��`��`���`�	��`�	��`�	��`�	��`�	�[`��[`��[`��[`��[`����~�o�m`�췁�6�����~�o��`�췃�v�����~;�o��`��`��`��`���gH�eח��-(�A�3;/b�'��� ��v��Z'�S��7�����#����0xoA��=H�{��� A�AރDВ-YВ-YВ-Yђ-Yђ-Yђѝ2A���*t�Lн2A�>:�������;Ŷ2�GUL��^��o�ϣr#��^�v�g����>+���>��9������6=�8��5*�}R�?
�Iv��]���T��_�n�^m�w����:�[׿�X?�}��dK����F���m��8�'e<F9�4Zk kҕ���_���o      g   L   x����0Cѳ1�ୗ�_GD.� RS���&i'�.��{���^o��P�k�*R���P��ի�� k�?      i   �  x�%�ۭ#1��a1�z�r��cI�gD���$����p?�.�>��~���K$����N4��j&����Ҹ�9�����y�j�h��4�]̀�f�C���n��݁˻��.�!�/B�;B����9�O�B�7B�B�/B^��0���Hy�Hy��+/�oȋBʋFʋAʋE�˃�����%/%/%/%/%/%/%/%�J^Z^]��r��
��J��*��j����Z��>hymy}1��1�:0�:1�0�1�z0�z1��`�a�����ʛ�ʛ�ʛ�ʛ�ʛ�ʛ��ۃ��;�2H\g�� s�A���m�;rwScڗh�y���K���D��%�/���5?l�w�+�]��{�{Ǝ�:��up��n����=��:�I�[%�����d�u�>�[(�L��;eo��2����? ��H��      k   F   x�-��� ���(�M.�?/��Z�e��2-Z�S��FWU�Ft�]̨���M>���ڰ��:x�t_#      n      x�3�4�4����� �Y      p      x������ � �      r      x������ � �      t      x�3�4�4����� 		]      v      x������ � �      x   3   x��I�0 ��.�N��G��?�J�bl����$�P�����a��r�����      z   h   x���� ����(�!�^���5Hk�K�2R�����h�(h'3��VNG|\�u�E�sc��;;���;����K��n7��7}���@f��1�g�=;��aW|WD��j�      |   �   x���!�N1'��l�u�x?)c�Je4���3&�c1W��þ�ٗɭt48�Q:\�Q�U}��j����&e���浧˰�i˾4���L70]!��;�.a�l��V�=���=�x�P�$�      ~   !   x�3�4�4�2�F\@�1�1�4����� 4�u      �      x�3�4�4�2�F\&�F��\1z\\\ !��      �      x������ � �      �      x������ � �      �      x������ � �      �      x��][��Fv~�Eoc7��L�jٞ��h%;��k	� H$m�C�ts�M�${F#e ?�`���?ا}���I�J��Y�&{ZRm���x�T��:u����<Y/�tfi��j�
�`�
��I�XAgMiu����(�Vqzt��b�%�p��tGӣ�Q2=�����tQN��N���ip���QU����$N*T�OJ�R~�c���o��7oLWA�~���V����z��o/,��������KLUATe���v�������$.�o�$8F	~�C���l��%~�7��IH,�a��?ȓ D�,a��gqK�JR+&w5i���QXA,��1xlh�0��*F%ħT:�
y�ۓ )v��/�L� �+����Bލ�"#����[�*i��`���"a��
E�@�m
{1��{t%�.�����kS8
�2�n^	��"[WTh��D�Ֆ~�W��'(	���P
��/޲/.�ﻗu�����A󢪀�o)5T��k�����Q��^������6�tL7l�Ўe�hM�f>މ9c�m�q���X�	;�B������l�ʛҸɢ\<�*}'�*Q�.V0�I8�����Ѣ�%k<M�U����7ȁPu� ��ۭ��H�d�Pʟ�y��'�0w����1�tcF:�3�lTc��i�,e;1kMۀ ���2uV���i]6�qWb�.�O����g1�
��PPv��ey�h�D�(�ކ��¨��,;E����w��^,0)��-��+����.��=쇜�zW����D�i���	��X�c�>�q����EQ4��6��Be�(�>Hkl�မVg���ш����+{ �����-�;��?cx��x���6ޭ�&!����"l * ��d���w"����)�e��ս�|#����|��P��̀��ʣN��M���x��������&Bݼ�Y"������D�E�U�a�$�67�7��ޯ�
_q@��p'���1�c�hG��4��aѡ�<r��F�w�0��V�<ɂh.��.�Gx4V񛀍	��e9n�R�Jy̞��*{TĸU�
��i�ެ�����
7��wR2B�h ��A�J��Jr��������ڢ���]�/Y"<��=��8O�_˪ʏ�_��٭��/f_ܞ����/nܸqC�uܻ�uN�z�&V��=�O.�"@��D)�g�i���a��:(�0�
� �{�,[p�f�W�'F����Z���8b���9�qu��Q��*���N���4�Vm��L�0$D���<�*�VV�D�AX���H$+-� �񪅉�� l��#4ϋ���Y�*����Y�ޑ��_
W�C�K���d<�S<����*��'���$����� �)�AaSTR��l��U��o`W�r}e�G��.f���0[��	���L�)��T(⾉������֎E?���V]PI�-���!�S`?C��cK ��GT�<�!s�-\S�<��vZ��p�j�7BdjLخ��V�3�y.1M�,�ٺ���\�>3$��jRC��P����r��p�K�������Xv� 1J�@\bG����K�	"��򀇵Տ����|zJ�8K٤uȐ�c���VU�+�~��ț�1<ĸSb���Q��06ߤ�ٔX����:.�W�f�nEN�JM��$�Xҡv!Q�d����[�{�J
f��r�����b�ҋg٣Q�;��?���[�*(T�=}��"s <M���d(��߶3��H�3�C���E\)�9#~��8}�Tʋ������&��;�dJ^c�3���t��i>�P��C�"��)b��k��Z	-�����Q�����8LBE!~�H�� yH��#�T�!���"=N���H���㍢uީ�y���L��Uc��?���HS��1�˹Y�)�Q6NNx�{w�p�a���5{&�C񶤵�^�Y,&�ɤH�$�mDI����t#A��D����D�Mwm'��=��ß�Y�L����ڜ1�f��u(C�高r���as[/��,o����6�öY�O7�h4��>��(���EҮ�O,�OP�� u�s� �*��	��TU��mr/6KOY��� ���v�M'�\�WA�sE�tC.�������.�l�̢�߸?ln�7z8�p�^���.A�u�����B��k��:��;js����J�:���I�ӯ�`C[�ú�TF�������t+R�I��	�Ac��X�^�B:���p� :�҄H��:I�0$�$����Yw�]�vC���rߡ�A�ϋ�{k1��'*<�H�+x-��J��0�&�΢_��A�e����y KV�`a��>��ln�Sy(�P�������Q\�R6�=S�. ���#uNG��ԕ{�2d��Jb�����m�- P��4��Q�G#i�c�+6��X�N�:=��:��e�7���C}6 ��7�I���Y�5��[-A����mL��w�Āl-N���)��c�W��Q�tu�p�%�˪�'Y�
*�DKB?(���[��Z��|"���1�(�WA����H6o;/�Y�Ο;Ӡ�dg1�M[e�b��7�8�,i[@4+�e=��S�v��k��q��� [ �ڏ�
O����L������M�h�F�5l� !�	����}�y����֥�$���.���h�N��W���(z�荢7��Q�~��1�u��I�	{��p��gF�IM=��Bk�A�j���48g����M�Ò�0�Q�� ���$��w���4񻓷�U��9)��{sy�5i�v�K���"���H����~)��F�Wʋ�T�t�$H&��ܻ����������^�� �.J�7�SYa�l_{���8�~O�t�����][����x�c�b�e��-�ް��ʠ��C���ky�Gr7E���R�AiY��"Ӗ����/�X���*��=�r�M�mv��9{`��g�/��G1$'�]y�t��ʔz�������˖�N?gS/AU�hX�r��z��4�p�4*���^=^'1Yni_��*X�e���_���n�	q��&��v]p�Ĉ�M�Jd5���	Ni�C.�>�a���0q�t�)</1�����;�&�V��B�tڭ����8��omJ�ՑaG)jw�H��*q��Û��n��oH�!�������qD�^���r}p��������*X̤�I�m i)�ޛ��ZVe��&������?��%� ���:6��qX��M�	�`s3��:3�F�^Q���स��eER�H��2;�=�72�k���mzKޟ����=(*����I�Ȥ������砵��$��QD�&ī`�؝yp���$V׳�0�d)Cg0����x]�Y	HC�{X=$�?��S�pJ�Ll��|ל�Dϝ����ty�xH����&��i=Ҏ���;w���o�ls���Ҕ7C���l��砑3�%6]
��=��H &A6��>'�ϛ����{��\����zRo"Q���;I7SoiPUV���+J��4�+A�3�Z������܀�����l��*�"݈�S�����م�M��Ό�1.�k��/��Kp���������������_��ۻ�x��w�M])��ȏ�#?�~��~��O�׃�/�����7��ߒ/ȏW��/ɏ��_��W��W��oȏ_��ӿ��$?�&?���?����~��ig�4��-;�4�Y�h��'��h�����،�]�3hi�u*��W-׫�T���[po�=�z0�`�5�n?����ن���l�[m��,���==5�N+�0���/�"� (��X{%[��zi.�[���˽��6pM�"����q��a!r[��%w_P�<��K�aM|�Z�7���(���pr_*�	yOȃ��� ���4D;.n�Λ�`�g�wQW�v-$��i����!�ע�2uM{5���K�(m�ݝU:ꍞ7z^}6W��aX�n(�����s	��/tC�I�\�K/P&/u$u�t��I�s�lBt�\�    ,�l��$�$�j�/��96�Y:烰a��AG��u�/���S�덾-\��2�Y���K�����j��D�����t�pH%�A��9�]�|sچ�{/����h��&�R�)��q��I��	���*�8����'1�棷\���P^�Yz�b��|���>�,s��)s�rlO�CS����I\J0�U���a���yx��Cx��B���m�m6T6��s�Zs�u6�M�u�r���ǳ������{Vs=��Jݨ�	�)�c��B
r���N�=Zq� y��Wlv�$�����̿@7�ʛN��$���`������G?��/vx=
}]�2@�D�v|Xe�b�iP)>���כ�/�6�)�R?��8Q������l�u�րIa���_#5n��m�[n�
\��$�d\�M����`�={ �@��� N�ʠ����=��Td'��8O��@a��7(��V��
z��
�y��Qڶv���-��c�&�n��J3�6SrT/���r��k��w��qZN��u��6##�γj���~��w`���n�k�Ǩ��[�!�t��l[*I�P�)E�\,#�/����Ym���6��(mS�ǌ�$%�����C{��T���ҫ�W�v������`IAC�XK��l�s���6��l���v��?��2͋�����D�N k��É`L,����c|3vBY��qWJrw���gh��Y��R�3��]�b�i�o�MS͡pJ�����HX{Il��Ŷ����!%D�W�l��ڗڕp��@��]5 �� ��:h ��i�dNv? ���Xۙ��y�˹��%�.&��ӊЂ���4qB���Tq��]$���<������ơ���h��Y�w�@ٜ8'�z�iZ3���b	K�j̱��y������7j�l�'���巃�y�w߽���w�{�ݻ��}��w���}�`t�"�Ƈ�b��39 �Tt?�|�Ғ�t���@>n]nuv���{�(��3��us����d�u$7[o�'w�X� �ײ�G(�� �����L�������7r�VSi��\h����v0�NaS���-�l8��$���?#�<����_b�����J�ȱ�����T��`�,����N��M���'a��ֽd��Fy��Zݭ��OC|�MgW<�1�F�d4��Q��N๼���t����On޼�2��[s��xz:����D)����������UV=*���T^�9��
��p��$�,>���o� _?N��QB���nu$�iVTT*�Ǐ
z��������*�P�XTEq%ư�:��(!S�h
qUb���D�D�'U����F��e�0֦���3N؅7�8]�Eu}axNU�2����V��-t��J[���#�a�~��e�j��g`ˎ]���萴"8d7�zB�hZsc]��C�)C9d�.�����Bԅ�X��ɫLޅW�7�ym
G�U&��+��_d�J��/D:u���ݽ|u�i��,�-����W�O�D�!X��W��/���:ze��7�,+֪�`_��O��{	�Ý�b5�@v�����/~�nC���AR����o�Cp'���Btk@5��֧�`�7n�,�EڸQ�����Û�ؕeg.-Gi@r��j@�^� ��f?mM���md	�{��,A���W� ��Ϛ�5[������`�]x�O�����A]���
�Q7��w����;!j����G���`\CAWHE�i��A�4T��
e���O�w��s�j#�aM���&/��"\����q]S�F��Q8��o�jR�����cC%莤A
;�tc�����(`��E��0{����(�.��}2+]I� 6�z)�wN�/TJ���p���I"e��KB���ބ�ڂc`���V�<�΂4D�!t����R��n^��9r.��
�VŊ�i��7�����V�:Ij�0��#za1�ߐ|�����kaV�9M#����׼��><6��ϲ'5�����i�Xθ��nM�P�qWfǇ�����N^2 ������{<_Jg�<�5Fw_݅����=�;��;�f��ݑJǐ����C�@���V/��'#X��pTh����6[�P�BQ��|E��`��t��:-%��);��0}�<�9F׍5m׬΢\��<7�I�{��'rO+��3�VA�Z\�[�6��9������U{�Q16��:�B;�ڠ�(ـ����-hR���@�5�;B1јǯ}�/!O�+5� ��V#�ֵ�-�U�$�9��LQi��
�^�0d�S�A��3KB�^e�4�pB���P#��`�����yUK�EV0���{K/��w�%c0X�v��$#�a0 $��ౡ�6-Y%����Q�v�X=�6�k�*��q����S�� M���f��|����[C�:���s�?�t6�nܲe!�W^6�5�>|΅���pSiL��V� �
�x2�@��s��܌��8�M�T:�	���i�N˸�m���G�w	x�@X_r?
��'���{��J������`eSXZ�a� .䀙��
�@c2��+��Sո��E�]�w6_����.�����髟O��=�������ؓnj6�/�φ��@��=�P*�$b���/�:�ob�;7����Wn)���L��%��^i7����Kvz��+ ��:
x9�.���F����"����i�&@�s=�	��cEr�{k,`��.h�VKZ�$�W̠A4`>��Y��n�Ӯ�X�N���S��L�t?| CT�ߡp��.'����7(��S��q�K�?�S��<�SxЛ�q^�N��2@T��F����c�׏�81�A�Z��u��*� ��&@�K�Đ ���;�r���܎���_�7b��Zf�HA�I�eC�aip�*H��g/F��f�X;�"�=fҝ)����{���^�)�cW�d�y� ��/]�	Ƃ�
C�9S&[HHj��A��5{@�~�;�ެ�e�Зi��)��`v|m _E?ET>�Y�e��gj�uX+�ꊫ���l�l݇�d\�1�bB4��tTډkR_m$�"v_����R�WLI�r�(��j=�S��R�w��_k��D�6k�{C������]P�w����x��qi�ᦫ5v"RF�N�BǕ%WpY�&wy��m���xW+�J���0�u3�z�7�7���Ӏ�v�3K�=;���,5w��-�cx�w�ɍ��2xk/��퍻 �t���+Q4�As �d̙.8����vP3}z�>��ħp�+g���Ȋ����M��e�R*��x�Ɓ��^jˇ֫\e�z�B��M�ô��ݻ;QNi���y�U�`N�����!��F]�!��h���o
w�E�����{��#{��6�cN�3-�$���٠$� ���G�۴�-���s�؈���v�2�}vˌ�����b�'�:
�3Q_�P?�X��-��9�CL������貽�����9��X��Sts��~��iD���d&k�~s�y��mw��ˊ���}IS��Imt�uI���3b���[��?�3cm�F�>��y+�tS�x!_�4�)]�EQ=&�� �}9@���tw6��ۺ'�toc�0����	�t���u�d7��BX�����wrC�����Q\PF�;�{�rۯ�M��3�S��u���s��B���nI`FUnԷ)�S�DE��-�:M.��K�����l���ɭۓ_���5e;����z����w?�{��7>����;zS77w�I��z����6�?� �kHa_�}�Y7����u�a�݊�t��=U�w.ݝ$�)F٨����r�4D�%5���k�x^�O��ޱ��Q�:Fe��[,G�[ �F$]}1�h�}_�f��UK��N��� � �CC�ф�>�.����	��ṕ��i�jV>��'�i�j���i��Zc1ӛ�&nM�V��2V}^Ţ�GF�)K��-���/�'�9y`�Q�[x�Y��vb��-�`4#&w�؁]��3BF9c�S����]����AY�8*� �  ��9̭&��EX�w�ٮj�2�`;nK��}��^���1�@3=� ���q�6�.�'Yx
3*��`����Ԑ�pK���%�m�m�x�Ɔ�e� ��C,��:�9�m�GY�im���{�cK��p
d�<bٹ1Ol~t�d%�4R�%��5��˶+"(��]ox�&�K�)]��~W�W�J�z�>+�#� �$	>h?ZT�2Vj�چcn�2;�=����U�付L�n���P�Qޗh��{U�<uF��2q�._d�,���9�n\�Ar?��'hI���t��f��Y�&g���@���ךq���u�g%�2j��xoZp�/�<���
[��yJ�W��`�,�uG�)�� Bf~s��W�������cV#���H
�	 A�����6efK�$�#���m��`&���P������x�C6R�Y�5*G׎3<RA��."ˬ�Z)���@d�(R�o�^��f��^Kc�eN����s.����ĚCfVߐ:�
����iU�qHU��H�)Y��vzRd+6�����!�sD$j�xĿ�o5�tߠ���u��/�)�kJ&ne�%��2��i�&�X��+�Ic^&��=��㡙���bR�'��ś���he��D!��e�a`��Qj%�^V� ����9ٗ��&�IR�Z�4�Մ�HN0�L)^�Y�=k�NM�s79�+<v_^Ͽ���+�������������e0Y�䫗/�_����'�O~��o�M_��}���.�������k��Az�ؚ�k.��[E�^�C�D��a��:��f����{�"<�,� EI���(O.�����Y�M��^HwjO4�9z��=�`���dŤ@�KF�_(��ϸ�28C�*��Kń�;	��lP�Mc��;L��t�{Q-ф��[��\�����9��������$է���#i`�r��'��?-Ջ      �   �  x��]˒۶]�_��z�����kv)'���&��"!	��%�y8�H��$�DSb���F�s������?+A�>�W��g�=]=�b��9.����Tl��͊}���Ym�G��C_�\�'��&�y2�x��nD�4�$m	È�I��zQBo�J��_�K�ݐ�_��!H|�fp��K�{�/	b��V�����Q�G)ꨃ���JY���LZ��'�'�,@�Q�_�<�f?M/(+ �"4xb��,F��y�_+��L�;�/�j��!vC�s��FqY��1�F��)���4a�"֜��f��x{8!��,��v�N�H�$�z���a��y\U-zU���-�IB�GR���Ԃ�)oV�Ј.���/��S*�.����W�S����/?����_���y�Ζ�+d�`2P����.��	#.�Z0��.<&rȢ�c�T�+5M�27q�i�_��uYj竇�a��9N�D�-*0tK�)m��][���\\p����	� �,���'y@ED��;��	~i�`�A����~���3�<�2"*��NQ�#�#Eu�ݲt(�zF��X��S����e)k���(C�j̒q���$�&d�j�6����"�>�+�Ê��a@/��P��؞���|��n�B졯��k��|:���=
�m%Sp[�)"��#&O��%�K#M��/�4����tL��؉y���L�O���64I`����]��^A��a������|N�lW�F�h��6K��L����IB���4���G#'$b�di� �|N1tP8U�Y�(�M1"@L�TnA�=!�H���E '�ЄǦ}���<�B��x'!��EH��	���w�݀lH{���}����#��,��ۛ;�{	1v��'F��b��2�G/��SA�# �Ȩ:sX��X�cfK�!M\z]�e���-e���	])KT���uX4`m�1�N�3��R]��t 
flf�uS��Tk=�
F�N��.�)�l�L-�M$���q��)�evOL#d������˳�g�y��`S�u
Ϛ=���g�a��?4����3ry�a�*�,��Ґ� �qΈ�N�ȁfF�%uY�sN�,���R�A"w�m [E�QM? Ub�X3�#P�.(��D��y�Ρ�5>�Gb�BC��q}�|%U^�ǃ<�@����&Q�cT[��W�t�#�|Ke��t}�P
��G���>�R��Y�;��?�#�S'�\8�����.EbpT��g*�0�/f�a�vXJ���N��4h��0��,)����GS3�i�.ٯ[Wp��`_�A�8|��r�< D#\��TqA�O��b��<�O{�4Ȃ y9���s�}N%XS��j
��	1���a� xU����C-��_Aܾ%��g�G	Ʈy��z���"͗
ny�f1m�b
���x,��&�n2˴ZL�H_ޔd[M�ۚS���u�U]�bϘ?I���&Xb��ςG#f��Tx�m��`��rb=�D����3=�h����VSelXKgĚc���!�]S^C|���
�%�t롍r-�9>$�����&�,G���j����!�1}��FX�H��=�QlO!��b�A�-�Z��R�4��`�� N���*eB+� �ĦF�WW�W�I��{��
g�B�1�i��Q�*.���u2��86m�͂X�8/�1���`�lG�a�������m&38�	�t�˓�w����,�`��l)wX����L6��U$vxPg�|�J/��D0�T�6�W,]�C/$"K*	��$����t"l�v�6���)�/O���'UxA������;a�2,��}�2����!g��~�'~x𺯓z�Eϖp&SMv�$�ry,��v��v�n����U�gӧ����}9Z�L֌TzŰ�%*�<�Lѭ�٫���JH���??���o+#5�V<�ѥ��"��'�n�h[܋p�X2�cW���V��S;�4i���"�ͺ-1E\:Vd�AB��W���Kx��nYLW�&�F�2�2� ��WA}
��`MT����?DD���;K;�~6H��(ܩ�w�lYJ�h�Ժ� Mk˄_�����ys�SJV �J�Q��9����!/���u�����O|'��	FAv�;�6�j���R�vٴ��h�r.�I���'C���*��Ȳ�F������p�g��ŏZ#�Kk*Q�\cQ-:��J�t�FX���+u�� �5qx|yr��	GMv囀��:��YB�
-�2=X{-��g���)���M�gl�G�yZ3�#�u�]�bh�݀��s����&�T_S�ʙ��B^�[Xi\T*�.J��QԨ�-���Մ�8�]Vٔ�ƥq�5A�~����FS�a���NC�0rA�W~$C�^�0z0<"� ´�PN�ǭ��[>J,��a��ʳ�2�4 S��L�8�Єj=6�����32hĈ�;m�)g�����=aL	�G�`�OR�
T���+=p�Ų��<�nr:���K���+��`IWC|HA�kV����Ѹ�(�7���P�o��I[�>�":I�L4����n��#,;B&�T�c��Ѻ(XU{�k��w.X{��@���@*́#�>3}��K�����SK�m�t�T3��b~-�N�,0� �%��b����#��2���0jJҴ��K7e�e�Q�Ջ�����mM��=B�TWG�%i%nA(���ZUy;O�4W�Ո�VI�Ek���)�3�A�lI��̳4����W%��k=5��*���a�b'�X]Q�xl<rQ�o��B�l��`��>g۟���*�[�w@�jb�-s,��"0B,����G��E/n� ����/}P��jO�(�4�,������j`�Q;����Ge�y ����?[6��@�+Ű�̏��ȡ�� �V�U��n���	�9��g�մ�a{gqS�U����z����j����_U�h�F,��ۓ��xT��l�@�̮�����^�R.��0��R<˛ONm)v�����!���*�FcKS;tl����y��h�y�U�����h�SH��5�����0�RcM��/WX����n�y7�l�:�6�� �:�@�\��y`5�ٮc�Wg%�@��^Rm	�v�UC���˙��R3n�?v|}|�:rhêKF���l6 +�.pm���`�ͻ��0�'�o�z�L�Qr=��4����Vs��.��-@���e�c���U���#�O����{r��
 �w>0�u��@�I��V X ��#��\��0i���ZD��T�^�����tCǚ��yȚu��qFN�wʲ�E���leП�l�P�0y�T;�	OXUr��<�j4��{$��y��jH10����f�3gK���u��@&���Sʛp/�Ua�]�9��X���s��g}������ݏ��?���p��������?}�{���݇���v?���~�|���w�m>ݮ?}�p{����޾}�/�@"�      �      x������ � �      �      x������ � �      �   �   x���ˉ�0��s\���*"�<��0r���a}H�N?F6��z��Ɉ~���<�Pfq�Mc2�S�h�߽9Tm�w��x� ���3A���CW���䅑%����@Q[�c�N�"~g#�U�n"G��?B\6^��*O�<�[CY�I�G���KaZ�I�����cb�r��e�D�O�L�j���l�>�RJ�ݥ�      �   d  x���[n�0��f� �rY���B��A%��L��I��D�r|F�Z��G����җ�=��,O��d�㱙���&R��?��N��KKR�|�RQJZ��(�Y��~-_;���#�#e�-�j�����vxn��
�0^���>4Ӭ�H��ؕ�����|��I'c��Iݷ���N,�M�����Rd�.�m�Lȯ�����ӱ���ǣ�fr��)W�ID�ٶZ���������T��pY��3f
?�,�������\��Q8�~Q�9�m_W�u���`J�!8�xs��ɀ�GL��#�6�qh��4jr��)7���B�mu�Y����}<��雛�������ӯ��4t��������x��i)a�[�̈́<f§��S��)����S��. +H �3��t �t�q�.��H�" I��"�ʂ�" ʷQTZBl���$���
���̭��󴵸=�-*O	�k�4���̭��܍����v�+h��3��K5��\�LVX�͋�4�.�)�.���v�饹�v&饝�N\�����r$�MDr�+'.3ˍ��a7N��o��	�n��9X��D���������������23j}xH�����v�ҋ��Q�>�]�_�b��E/��<�ߑvnNV5����uX?���J(���iI�˅�6nh�u����n�a��q���!�1yrEX�[��"��o�f�}�˷{��%��_�-�IB���,��~��{EXq��*ha7�TL���賷��p�=s����3���p����6����$��v,���Ue��
�A�5�ĸ����a3{O*��m�=���%v�8c�q���4GSX����%��L.6�}#�����>      �   S  x��˭�0Dѵo0��7����
��c�}��N'?�.��`ߙ�{��/Ӆ�tc�xa�J�Tb���Uk��2q!V����F9�T[\�\������<�~�r=�r�y���5�ys�r��\n���[J�ҹ�|�*�8�$LY��ۄ�;�����8��0B^8!/.!/��Iʋ"�E��bHy���<��4R^�)��K�ˠ�eR�(yٔ�J^.%�%���WNɫ7Wy��JZ^-����-���Ӈ��F�i���e�t0��d�u1��f~u�h����;��|��w��7��7o��L�r�XyӬ�V}β�o��\c��:�}ً-̾<oſ}�|��[����Jj�      �   �   x�u�A
�0�ur�\�!3��$;ѵx�nb�Z(�����b�>�y0�ms�i���٨EXƑrDK;�z�Q	��*�Y��#;�c�6l�>wIġ��>B/� r�s��>��O�$�=D�n��[T$�\	��4��H�r�m>/�q�ԯlZ��7�Y�%��	�/X�      �   �   x�%�O�0��ۧ��us�9�l�"23���Q�� .�ӧ������X���d�7?��A�
u}�w���N�~{��y��a��8�.e����R'53K���ө��f�(K��H#�8'L��ʕ�4���]�|�]%�e��~qF1�_7-T      �      x�3�4�4����� 	^      �      x������ � �      �      x������ � �     