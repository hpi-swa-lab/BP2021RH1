"use strict";
import { KnexEngine } from "../../../types";
import { bulkEdit, like, updatePictureWithTagCleanup } from "./custom-update";
const { plural, table } = require("../../helper");
/**
 * These are the (singular) table names of tags related to the pictures type in a many-to-many manner
 * in both a verified and an unverified relation.
 */
const manyToManyWithVerified = ["keyword_tag", "location_tag", "person_tag"];

/**
 * These are the (singular) table names of tags related to the pictures type in a many-to-many manner
 * in just a regular relation.
 */
const manyToManyWithoutVerified = ["description", "collection"];

const buildJoinsForTableWithVerifiedHandling = (
  knexEngine,
  singularTableName,
  verifiedLinkTable,
  unverifiedLinkTable
) => {
  knexEngine = knexEngine.leftJoin(
    unverifiedLinkTable,
    "pictures.id",
    `${unverifiedLinkTable}.picture_id`
  );
  knexEngine = knexEngine.leftJoin(
    verifiedLinkTable,
    "pictures.id",
    `${verifiedLinkTable}.picture_id`
  );

  // This special join syntax is needed in order to only join the tag table once to the aggregate
  knexEngine = knexEngine.leftJoin(
    table(plural(singularTableName)),
    function () {
      this.on(
        `${verifiedLinkTable}.${singularTableName}_id`,
        "=",
        `${plural(singularTableName)}.id`
      ).orOn(
        `${unverifiedLinkTable}.${singularTableName}_id`,
        "=",
        `${plural(singularTableName)}.id`
      );
    }
  );

  return knexEngine;
};

const buildJoinsForTableWithoutVerifiedHandling = (
  knexEngine,
  singularTableName,
  linkTable
) => {
  knexEngine = knexEngine.leftJoin(
    linkTable,
    "pictures.id",
    `${linkTable}.picture_id`
  );
  knexEngine = knexEngine.leftJoin(
    table(plural(singularTableName)),
    `${linkTable}.${singularTableName}_id`,
    `${plural(singularTableName)}.id`
  );
  return knexEngine;
};

const buildJoins = (knexEngine) => {
  for (const singularTableName of manyToManyWithVerified) {
    const verifiedLinkTable = table(
      `pictures_verified_${plural(singularTableName)}_links`
    );
    const unverifiedLinkTable = table(
      `pictures_${plural(singularTableName)}_links`
    );
    knexEngine = buildJoinsForTableWithVerifiedHandling(
      knexEngine,
      singularTableName,
      verifiedLinkTable,
      unverifiedLinkTable
    );
  }

  // Special handling for time-range-tags as these are in 1:n relation to the picture type
  const verifiedTimeRangeLinkTable = table(
    "pictures_verified_time_range_tag_links"
  );
  const unverifiedTimeRangeLinkTable = table("pictures_time_range_tag_links");
  knexEngine = buildJoinsForTableWithVerifiedHandling(
    knexEngine,
    "time_range_tag",
    verifiedTimeRangeLinkTable,
    unverifiedTimeRangeLinkTable
  );

  for (const singularTableName of manyToManyWithoutVerified) {
    const linkTable = table(`pictures_${plural(singularTableName)}_links`);
    knexEngine = buildJoinsForTableWithoutVerifiedHandling(
      knexEngine,
      singularTableName,
      linkTable
    );
  }

  // Special handling for our archive-tags as these are in 1:n relation to the picture type
  // and don't have a special verified relation.
  const archiveTagLinkTable = table("pictures_archive_tag_links");
  knexEngine = buildJoinsForTableWithoutVerifiedHandling(
    knexEngine,
    "archive_tag",
    archiveTagLinkTable
  );

  return knexEngine;
};

const buildLikeWhereForSearchTerm = (knexEngine, searchTerm) => {
  const searchTermForLikeQuery = `%${searchTerm}%`;
  for (const singularTableName of manyToManyWithVerified) {
    knexEngine = knexEngine.orWhereILike(
      `${plural(singularTableName)}.name`,
      searchTermForLikeQuery
    );
  }

  knexEngine = knexEngine.orWhereILike(
    "collections.name",
    searchTermForLikeQuery
  );
  knexEngine = knexEngine.orWhereILike(
    "archive_tags.name",
    searchTermForLikeQuery
  );
  knexEngine = knexEngine.orWhereILike(
    "descriptions.text",
    searchTermForLikeQuery
  );

  return knexEngine;
};

const buildWhere = (
  queryBuilder,
  searchTerms,
  searchTimes,
  filterOutTexts,
  knexEngine: KnexEngine
) => {
  for (const searchObject of [...searchTerms, ...searchTimes]) {
    // Function syntax for where in order to use correct bracing in the query
    queryBuilder = queryBuilder.where((qb) => {
      if (typeof searchObject === "string") {
        qb = buildLikeWhereForSearchTerm(qb, searchObject);
      } else if (Array.isArray(searchObject)) {
        //the timestamps of the time range tags are incorrectly saved in the data bank due to time zone shenanigans
        //wich caused some searches not return results even though they should e.g. if a picture was tagged with
        //just the year 1954, the start of its timerange would be saved as 1953-12-31T23:00:00 instead of
        //1954-01-01T00:00:00 which would cause searches for '1954' to not return this picture even though
        //they should
        //by shifting the bounds of the search time range backward by 1 hour the search should now work
        //correctly without having to migrate the whole data base

        //the parser kept throwing syntax errors when i tried to use the knexEngine.raw() method as intended, since
        // the method did not correctly build this part of the query, but with these prebuild strings it seems to work fine
        const startDateCorrection =
          "timestamp '" + searchObject[1] + "' - interval '1 hour'";
        const endDateCorrection =
          "timestamp '" + searchObject[2] + "' - interval '1 hour'";
        // If the search object is an array, it must be our custom format for search times
        // e.g. ["1954", "1954-01-01T00:00:00.000Z", "1954-12-31T23:59:59.000Z"].
        qb = buildLikeWhereForSearchTerm(qb, searchObject[0]);
        qb = qb.orWhere((timeRangeQb) => {
          timeRangeQb = timeRangeQb.where(
            "time_range_tags.start",
            ">=",
            knexEngine.raw(startDateCorrection)
          );
          timeRangeQb = timeRangeQb.andWhere(
            "time_range_tags.end",
            "<=",
            knexEngine.raw(endDateCorrection)
          );
          return timeRangeQb;
        });
      }
      return qb;
    });
  }

  // Only retrieve published pictures
  queryBuilder = queryBuilder.whereNotNull("pictures.published_at");

  if (filterOutTexts) {
    queryBuilder = queryBuilder.where((qb) => {
      qb.where("pictures.is_text", false);
      qb.orWhereNull("pictures.is_text");
    });
  }

  return queryBuilder;
};

/**
 * Uses the passed knexEngine instance to build the complete query for retrieving the matched picture entities
 * for the given search terms, time-related search input and the given pagination arguments.
 */
const buildQueryForAllSearch = (
  knexEngine,
  searchTerms,
  searchTimes,
  filterOutTexts,
  pagination = { start: 0, limit: 100 }
) => {
  const withSelect = knexEngine.distinct("pictures.*").from(table("pictures"));

  const withJoins = buildJoins(withSelect);

  const withWhere = buildWhere(
    withJoins,
    searchTerms,
    searchTimes,
    filterOutTexts,
    knexEngine
  );

  const withOrder = withWhere.orderBy("pictures.published_at", "asc");

  return withOrder.limit(pagination.limit).offset(pagination.start);
};

/**
 * Encapsulates all logic that is necessary for the custom GraphQL query for the All-Search.
 *
 * Note that the Knex Query Builder is so designed, that built queries just need to be awaited
 * in order to execute the associated SQL queries on the underlying database.
 */
const findPicturesByAllSearch = async (
  knexEngine,
  searchTerms,
  searchTimes,
  filterOutTexts,
  pagination
) => {
  const matchingPictures = await buildQueryForAllSearch(
    knexEngine,
    searchTerms,
    searchTimes,
    filterOutTexts,
    pagination
  );
  return matchingPictures.map((picture) => ({
    id: picture.id,
    is_text: picture.is_text,
    likes: picture.likes,
  }));
};

export { findPicturesByAllSearch, updatePictureWithTagCleanup, bulkEdit, like };
