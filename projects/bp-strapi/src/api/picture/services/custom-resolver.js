"use strict";

const neededTablesWithVerifiedHandling = [
  "keyword_tag",
  "location_tag",
  // "time_range_tag",
  "person_tag",
];

const neededTablesWithoutVerifiedHandling = [
  "description",
  "collection"
];

const buildJoins = (knexEngine) => {
  for (const singularTableName of neededTablesWithVerifiedHandling) {

    const verifiedLinkTable = singularTableName === "time_range_tag" ? `pictures_verified_${singularTableName}_links` : `pictures_verified_${singularTableName}s_links`;
    const unverifiedLinkTable = singularTableName === "time_range_tag" ? `pictures_${singularTableName}_links` : `pictures_${singularTableName}s_links`;

    knexEngine = knexEngine.leftJoin(unverifiedLinkTable, "pictures.id", `${unverifiedLinkTable}.picture_id`);
    knexEngine = knexEngine.leftJoin(verifiedLinkTable, "pictures.id", `${verifiedLinkTable}.picture_id`);

    knexEngine = knexEngine.leftJoin(`${singularTableName}s`, function() {
      this.on(`${verifiedLinkTable}.${singularTableName}_id`, "=", `${singularTableName}s.id`)
        .orOn(`${unverifiedLinkTable}.${singularTableName}_id`, "=", `${singularTableName}s.id`)
    });
  }

  for (const singularTableName of neededTablesWithoutVerifiedHandling) {
    const linkTable = `pictures_${singularTableName}s_links`;

    knexEngine = knexEngine.leftJoin(linkTable, "pictures.id", `${linkTable}.picture_id`);
    knexEngine = knexEngine.leftJoin(`${singularTableName}s`, `${linkTable}.${singularTableName}_id`, `${singularTableName}s.id`);
  }

  return knexEngine;
};

const buildWhere = (knexEngine, searchTerms) => {
  for (const searchTerm of searchTerms) {
    // Function syntax for where in order to use correct bracing in the query
    knexEngine = knexEngine.where(qb => {
      for (const singularTableName of neededTablesWithVerifiedHandling) {
        qb = qb.orWhereILike(`${singularTableName}s.name`, `%${searchTerm}%`);
      }

      qb = qb.orWhereILike("collections.name", `%${searchTerm}%`);
      qb = qb.orWhereILike("descriptions.text", `%${searchTerm}%`);

      return qb;
    })
  }

  return knexEngine;
};

const buildQueryForAllSearch = (knexEngine, searchTerms, pagination = { start: 0, limit: 100 }) => {
  const withSelect = knexEngine.distinct("pictures.*").from("pictures");

  const withJoins = buildJoins(withSelect);

  const withWhere = buildWhere(withJoins, searchTerms);

  const withOrder = withWhere.orderBy("pictures.published_at", "asc");

  return withOrder.limit(pagination.limit).offset(pagination.start);
};

const buildQueryForMediaFiles = (knexEngine, pictureIds) => {
  const withSelect = knexEngine.distinct(
    "files_related_morphs.order",
    "files.*",
    "files_related_morphs.related_id",
    "files_related_morphs.related_type"
  ).from("files");

  const withJoin = withSelect.leftJoin("files_related_morphs", "files.id", "files_related_morphs.file_id");

  // Function syntax for where in order to use correct bracing in the query
  const withWhere = withJoin.where(qb =>
    qb.whereIn("files_related_morphs.related_id", pictureIds)
      // Only use media files related to the picture content type
      .andWhere("files_related_morphs.related_type", "api::picture.picture")
      // The field on the file relation on the picture content type is called 'media'
      .andWhere("files_related_morphs.field", "media")
  );

  return withWhere.orderBy("files_related_morphs.order", "asc");
};

const preparePictureDataForFrontend = (pictures, mediaFiles) => {
  return pictures.map(picture => {
    const mediaFileForPicture = mediaFiles.find(file => file.related_id === picture.id);

    return {
      id: picture.id,
      attributes: {
        media: {
          data: {
            id: mediaFileForPicture.id,
            attributes: {
              ...mediaFileForPicture,
            },
          },
        },
      },
    };
  });
};

module.exports = {
  buildQueryForAllSearch,
  buildQueryForMediaFiles,
  preparePictureDataForFrontend,
};
