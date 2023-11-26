import {
  Comment,
  Exhibition,
  ExhibitionPicture,
  ExhibitionSection,
  FaceTag,
  Link,
  ParameterizedPermission,
  Picture,
} from './db-types';

type Query<T> = {
  findOne(params: any): Promise<T | null>;
  findMany(params: { where: any }): Promise<T[] | null>;
};

export type ID = number | undefined;

export class Loader<T> {
  private cache: Map<ID, T | null> = new Map();

  public constructor(
    private query: Query<T>,
    private populate?: Partial<Record<keyof T, boolean>>
  ) {}

  public async load(id: ID) {
    const cached = this.cache.get(id);
    if (cached) {
      return cached;
    }
    const queried = await this.query.findOne({
      where: {
        // prevent `Undefined binding(s)` errors
        id: id ?? -1,
      },
      populate: this.populate,
    });
    this.cache.set(id, queried);
    return queried;
  }

  public async where(filters: any) {
    return await this.query.findMany({
      where: filters,
    });
  }
}

export class DB {
  private pictureLoader: Loader<Picture>;
  private commentLoader: Loader<Comment>;
  private faceTagLoader: Loader<FaceTag>;
  private linkLoader: Loader<Link>;
  private permissionLoader: Loader<ParameterizedPermission>;
  private exhibitionLoader: Loader<Exhibition>;
  private exhibitionSectionLoader: Loader<ExhibitionSection>;
  private exhibitionPictureLoader: Loader<ExhibitionPicture>;

  public constructor(queries: {
    picture: Query<Picture>;
    comment: Query<Comment>;
    faceTag: Query<FaceTag>;
    link: Query<Link>;
    permission: Query<ParameterizedPermission>;
    exhibition: Query<Exhibition>;
    exhibitionSection: Query<ExhibitionSection>;
    exhibitionPicture: Query<ExhibitionPicture>;
  }) {
    this.pictureLoader = new Loader(queries.picture, { archive_tag: true });
    this.commentLoader = new Loader(queries.comment, { picture: true });
    this.faceTagLoader = new Loader(queries.faceTag, { picture: true });
    this.linkLoader = new Loader(queries.link, { archive_tag: true });
    this.permissionLoader = new Loader(queries.permission, {
      users_permissions_user: true,
      archive_tag: true,
    });
    this.exhibitionLoader = new Loader(queries.exhibition, {
      archive_tag: true,
    });
    this.exhibitionSectionLoader = new Loader(queries.exhibitionSection, {
      exhibition: true,
    });
    this.exhibitionPictureLoader = new Loader(queries.exhibitionPicture, {
      exhibition_section: true,
    });
  }

  public async pictureToArchive(pictureId: ID) {
    return (await this.pictureLoader.load(pictureId))?.archive_tag?.id;
  }

  public async commentToPicture(commentId: ID) {
    return (await this.commentLoader.load(commentId))?.picture?.id;
  }

  public async commentToArchive(commentId: ID) {
    return await this.pictureToArchive(await this.commentToPicture(commentId));
  }

  public async faceTagToPicture(faceTagId: ID) {
    return (await this.faceTagLoader.load(faceTagId))?.picture?.id;
  }

  public async faceTagToArchive(faceTagId: ID) {
    return await this.pictureToArchive(await this.faceTagToPicture(faceTagId));
  }

  public async linkToArchive(linkId: ID) {
    return (await this.linkLoader.load(linkId))?.archive_tag?.id;
  }

  public async exhibitionToArchive(exhibitionId: ID) {
    return (await this.exhibitionLoader.load(exhibitionId))?.archive_tag?.id;
  }

  public async exhibitionSectionToExhibition(exhibitionSectionId: ID) {
    return (await this.exhibitionSectionLoader.load(exhibitionSectionId))?.exhibition?.id;
  }

  public async exhibitionSectionToArchive(exhibitionSectionId: ID) {
    return await this.exhibitionToArchive(
      await this.exhibitionSectionToExhibition(exhibitionSectionId)
    );
  }

  public async exhibitionPictureToExhibitionSection(exhibitionPictureId: ID) {
    return (await this.exhibitionPictureLoader.load(exhibitionPictureId))?.exhibition_section?.id;
  }

  public async exhibitionPictureToArchive(exhibitionPictureId: ID) {
    return await this.exhibitionSectionToArchive(
      await this.exhibitionPictureToExhibitionSection(exhibitionPictureId)
    );
  }

  public async mediaToPictures(mediaId: ID) {
    return (
      await this.pictureLoader.where({
        media: {
          id: {
            $eq: mediaId,
          },
        },
      })
    )?.map(picture => picture.id);
  }

  public async loadPermission(permissionId: ID) {
    return await this.permissionLoader.load(permissionId);
  }
}
