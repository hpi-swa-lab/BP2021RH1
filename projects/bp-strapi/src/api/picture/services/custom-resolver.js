"use strict";

/**
 * These are the (singular) table names of tags related to the pictures type in a many-to-many manner
 * in both a verified and an unverified relation.
 */
const manyToManyWithVerified = [
  "keyword_tag",
  "location_tag",
  "person_tag",
];

/**
 * These are the (singular) table names of tags related to the pictures type in a many-to-many manner
 * in just a regular relation.
 */
const manyToManyWithoutVerified = [
  "description",
  "collection",
];

const buildJoinsForTableWithVerifiedHandling = (knexEngine, singularTableName, verifiedLinkTable, unverifiedLinkTable) => {
  knexEngine = knexEngine.leftJoin(unverifiedLinkTable, "pictures.id", `${unverifiedLinkTable}.picture_id`);
  knexEngine = knexEngine.leftJoin(verifiedLinkTable, "pictures.id", `${verifiedLinkTable}.picture_id`);

  // This special join syntax is needed in order to only join the tag table once to the aggregate
  knexEngine = knexEngine.leftJoin(`${singularTableName}s`, function() {
    this.on(`${verifiedLinkTable}.${singularTableName}_id`, "=", `${singularTableName}s.id`)
      .orOn(`${unverifiedLinkTable}.${singularTableName}_id`, "=", `${singularTableName}s.id`)
  });

  return knexEngine;
};

const buildJoinsForTableWithoutVerifiedHandling = (knexEngine, singularTableName, linkTable) => {
  knexEngine = knexEngine.leftJoin(linkTable, "pictures.id", `${linkTable}.picture_id`);
  knexEngine = knexEngine.leftJoin(`${singularTableName}s`, `${linkTable}.${singularTableName}_id`, `${singularTableName}s.id`);
  return knexEngine;
};

const buildJoins = (knexEngine) => {
  for (const singularTableName of manyToManyWithVerified) {
    const verifiedLinkTable = `pictures_verified_${singularTableName}s_links`;
    const unverifiedLinkTable = `pictures_${singularTableName}s_links`;
    knexEngine = buildJoinsForTableWithVerifiedHandling(knexEngine, singularTableName, verifiedLinkTable, unverifiedLinkTable);
  }

  // Special handling for time-range-tags as these are in 1:n relation to the picture type
  const verifiedTimeRangeLinkTable = "pictures_verified_time_range_tag_links";
  const unverifiedTimeRangeLinkTable = "pictures_time_range_tag_links";
  knexEngine = buildJoinsForTableWithVerifiedHandling(knexEngine, "time_range_tag", verifiedTimeRangeLinkTable, unverifiedTimeRangeLinkTable);

  for (const singularTableName of manyToManyWithoutVerified) {
    const linkTable = `pictures_${singularTableName}s_links`;
    knexEngine = buildJoinsForTableWithoutVerifiedHandling(knexEngine, singularTableName, linkTable);
  }

  // Special handling for our archive-tags as these are in 1:n relation to the picture type
  // and don't have a special verified relation.
  const archiveTagLinkTable = "pictures_archive_tag_links";
  knexEngine = buildJoinsForTableWithoutVerifiedHandling(knexEngine, "archive_tag", archiveTagLinkTable);

  return knexEngine;
};

const buildLikeWhereForSearchTerm = (knexEngine, searchTerm) => {
  const searchTermForLikeQuery = `%${searchTerm}%`;
  for (const singularTableName of manyToManyWithVerified) {
    knexEngine = knexEngine.orWhereILike(`${singularTableName}s.name`, searchTermForLikeQuery);
  }

  knexEngine = knexEngine.orWhereILike("collections.name", searchTermForLikeQuery);
  knexEngine = knexEngine.orWhereILike("archive_tags.name", searchTermForLikeQuery);
  knexEngine = knexEngine.orWhereILike("descriptions.text", searchTermForLikeQuery);

  return knexEngine;
}

const buildWhere = (knexEngine, searchTerms, searchTimes) => {
  for (const searchObject of [...searchTerms, ...searchTimes]) {
    // Function syntax for where in order to use correct bracing in the query
    knexEngine = knexEngine.where(qb => {
      if (typeof searchObject === "string") {
        qb = buildLikeWhereForSearchTerm(qb, searchObject);
      } else if (Array.isArray(searchObject)) {
        // If the search object is an array, it must be our custom format for search times
        // e.g. ["1954", "1954-01-01T00:00:00.000Z", "1954-12-31T23:59:59.000Z"].
        qb = buildLikeWhereForSearchTerm(qb, searchObject[0]);
        qb = qb.orWhere(timeRangeQb => {
          timeRangeQb = timeRangeQb.where("time_range_tags.start", ">=", searchObject[1]);
          timeRangeQb = timeRangeQb.andWhere("time_range_tags.end", "<=", searchObject[2]);
          return timeRangeQb;
        });
      }
      return qb;
    })
  }

  // Only retrieve published pictures
  knexEngine = knexEngine.whereNotNull("pictures.published_at");

  return knexEngine;
};

/**
 * Uses the passed knexEngine instance to build the complete query for retrieving the matched picture entities
 * for the given search terms, time-related search input and the given pagination arguments.
 */
const buildQueryForAllSearch = (knexEngine, searchTerms, searchTimes, pagination = { start: 0, limit: 100 }) => {
  const withSelect = knexEngine.distinct("pictures.*").from("pictures");

  const withJoins = buildJoins(withSelect);

  const withWhere = buildWhere(withJoins, searchTerms, searchTimes);

  const withOrder = withWhere.orderBy("pictures.published_at", "asc");

  return withOrder.limit(pagination.limit).offset(pagination.start);
};

/**
 * Uses the passed knexEngine instance to build the complete query for retrieving the actual media files
 * associated to the prior retrieved picture entities.
 */
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

/**
 * Encapsulates the result data in the "Unified Response Format" of Strapi v4 and thereby combines
 * the retrieved picture entities with their associated media files.
 *
 * This was implemented in order to simplify the registration of the custom GraphQL query, as in that way,
 * its return type can be just a list of PictureEntity's (which is a type that already exists in the schema).
 */
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

/**
 * Encapsulates all logic that is necessary for the custom GraphQL query for the All-Search.
 *
 * Note that the Knex Query Builder is so designed, that built queries just need to be awaited
 * in order to execute the associated SQL queries on the underlying database.
 */
const findPicturesByAllSearch = async (knexEngine, searchTerms, searchTimes, pagination) => {
  const matchingPictures = await buildQueryForAllSearch(knexEngine, searchTerms, searchTimes, pagination);
  const mediaFilesForPictures = await buildQueryForMediaFiles(knexEngine, matchingPictures.map(pic => pic.id));
  return preparePictureDataForFrontend(matchingPictures, mediaFilesForPictures);
};

const { updatePictureWithTagCleanup } = require("./custom-update");

module.exports = {
  findPicturesByAllSearch,
  updatePictureWithTagCleanup,
};
