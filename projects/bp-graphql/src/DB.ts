import { Comment, FaceTag, Link, ParameterizedPermission, Picture } from './db-types';

type Query<T> = {
  findOne(params: any): Promise<T>;
};

export type ID = number | undefined;

export class Loader<T> {
  private cache: Map<ID, T> = new Map();

  public constructor(private query: Query<T>, private populate: any = undefined) {}

  public async load(id: ID) {
    const cached = this.cache.get(id);
    if (cached) {
      return cached;
    }
    const queried = await this.query.findOne({
      where: {
        id,
      },
      populate: this.populate,
    });
    this.cache.set(id, queried);
    return queried;
  }
}

export class DB {
  private pictureLoader: Loader<Picture>;
  private commentLoader: Loader<Comment>;
  private faceTagLoader: Loader<FaceTag>;
  private linkLoader: Loader<Link>;
  private permissionLoader: Loader<ParameterizedPermission>;

  public constructor(queries: {
    picture: Query<Picture>;
    comment: Query<Comment>;
    faceTag: Query<FaceTag>;
    link: Query<Link>;
    permission: Query<ParameterizedPermission>;
  }) {
    this.pictureLoader = new Loader(queries.picture, { archive_tag: true });
    this.commentLoader = new Loader(queries.comment, { picture: true });
    this.faceTagLoader = new Loader(queries.faceTag, { picture: true });
    this.linkLoader = new Loader(queries.link, { archive_tag: true });
    this.permissionLoader = new Loader(queries.permission, {
      users_permissions_user: true,
      archive_tag: true,
    });
  }

  public async pictureToArchive(pictureId: ID) {
    return (await this.pictureLoader.load(pictureId)).archive_tag?.id;
  }

  public async commentToPicture(commentId: ID) {
    return (await this.commentLoader.load(commentId)).picture?.id;
  }

  public async commentToArchive(commentId: ID) {
    return await this.pictureToArchive(await this.commentToPicture(commentId));
  }

  public async faceTagToPicture(faceTagId: ID) {
    return (await this.faceTagLoader.load(faceTagId)).picture?.id;
  }

  public async faceTagToArchive(faceTagId: ID) {
    return await this.pictureToArchive(await this.faceTagToPicture(faceTagId));
  }

  public async linkToArchive(linkId: ID) {
    return (await this.linkLoader.load(linkId)).archive_tag?.id;
  }

  public async loadPermission(permissionId: ID) {
    return await this.permissionLoader.load(permissionId);
  }
}
