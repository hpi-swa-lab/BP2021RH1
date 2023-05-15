"use strict";
import { KnexEngine, QueryBuilder } from "../../../types";
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
  queryBuilder: QueryBuilder,
  singularTableName: string,
  verifiedLinkTable: string,
  unverifiedLinkTable: string
) => {
  queryBuilder = queryBuilder.leftJoin(
    unverifiedLinkTable,
    "pictures.id",
    `${unverifiedLinkTable}.picture_id`
  );
  queryBuilder = queryBuilder.leftJoin(
    verifiedLinkTable,
    "pictures.id",
    `${verifiedLinkTable}.picture_id`
  );

  // This special join syntax is needed in order to only join the tag table once to the aggregate
  queryBuilder = queryBuilder.leftJoin(
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

  return queryBuilder;
};

const buildJoinsForTableWithoutVerifiedHandling = (
  queryBuilder: QueryBuilder,
  singularTableName: string,
  linkTable: string
) => {
  queryBuilder = queryBuilder.leftJoin(
    linkTable,
    "pictures.id",
    `${linkTable}.picture_id`
  );
  queryBuilder = queryBuilder.leftJoin(
    table(plural(singularTableName)),
    `${linkTable}.${singularTableName}_id`,
    `${plural(singularTableName)}.id`
  );
  return queryBuilder;
};

const buildJoins = (queryBuilder: QueryBuilder) => {
  for (const singularTableName of manyToManyWithVerified) {
    const verifiedLinkTable = table(
      `pictures_verified_${plural(singularTableName)}_links`
    );
    const unverifiedLinkTable = table(
      `pictures_${plural(singularTableName)}_links`
    );
    queryBuilder = buildJoinsForTableWithVerifiedHandling(
      queryBuilder,
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
  queryBuilder = buildJoinsForTableWithVerifiedHandling(
    queryBuilder,
    "time_range_tag",
    verifiedTimeRangeLinkTable,
    unverifiedTimeRangeLinkTable
  );

  for (const singularTableName of manyToManyWithoutVerified) {
    const linkTable = table(`pictures_${plural(singularTableName)}_links`);
    queryBuilder = buildJoinsForTableWithoutVerifiedHandling(
      queryBuilder,
      singularTableName,
      linkTable
    );
  }

  // Special handling for our archive-tags as these are in 1:n relation to the picture type
  // and don't have a special verified relation.
  const archiveTagLinkTable = table("pictures_archive_tag_links");
  queryBuilder = buildJoinsForTableWithoutVerifiedHandling(
    queryBuilder,
    "archive_tag",
    archiveTagLinkTable
  );

  return queryBuilder;
};

type Score = {
  column: string;
  matches: {
    regex: (escapedSearchTerm: string) => string;
    score: number;
  }[];
};

//regex for the different types of matches
const wholeString = (escapedSearchTerm: string) => `^${escapedSearchTerm}$`;

const wholeWord = (escapedSearchTerm: string) =>
  `[[:<:]]${escapedSearchTerm}[[:>:]]`;

const startOfWord = (escapedSearchTerm: string) =>
  `[[:<:]]${escapedSearchTerm}`;

const anywhere = (escapedSearchTerm: string) => escapedSearchTerm;

//scoring table, the scores are all separated by a factor of 100 to make sure a more important match cannot
//be trumped by the sum of smaller matches
//the additional factor is used in scoreMatches to enable a prioritization according to
//where the searchterm was matched (tags/description/collection/archive)
//all of these values are rather arbitrary and may need some tweaking, but work fine for now
const exponentialMatches = (factor: number) => [
  {
    regex: wholeString,
    score: 1000000 * factor,
  },
  {
    regex: wholeWord,
    score: 10000 * factor,
  },
  {
    regex: startOfWord,
    score: 100 * factor,
  },
  {
    regex: anywhere,
    score: 1 * factor,
  },
];

const scoreMatches: Score[] = [
  ...manyToManyWithVerified.map((singularTableName) => ({
    column: `${plural(singularTableName)}.name`,
    matches: exponentialMatches(8),
  })),
  {
    column: "descriptions.text",
    matches: exponentialMatches(4),
  },
  {
    column: "collections.name",
    matches: exponentialMatches(2),
  },
  {
    column: "archive_tags.name",
    matches: [
      {
        regex: wholeWord,
        score: 1,
      },
    ],
  },
];

const escapeRegex = (searchTerm: string) => {
  return searchTerm.replace(/([()[{*+.$^\\|?])/g, "\\$1");
};

const alternatePairs = [
  ["ß", "ss"],
  ["ä", "ae"],
  ["ö", "oe"],
  ["ü", "ue"],
];

const acceptAlternatePairs = (searchTerm: string) => {
  let term = searchTerm;
  for (const [a, b] of alternatePairs) {
    term = term.replace(new RegExp(`${a}|${b}`, "g"), `(?:${a}|${b})`);
  }
  return term;
};

const SCORE_COLUMN_NAME = "score";

const buildScore = (knexEngine: KnexEngine, searchTerms: string[]) => {
  const scores = searchTerms.flatMap((term) =>
    scoreMatches.flatMap((score) =>
      score.matches.map((match) => ({
        expression: `CASE WHEN ${score.column} ~* ? THEN ${match.score} ELSE 0 END`,
        bindings: [match.regex(acceptAlternatePairs(escapeRegex(term)))],
      }))
    )
  );
  const scoreSum = scores.map((score) => score.expression).join(" + ");
  const bindings = scores.flatMap((score) => score.bindings);
  return knexEngine.raw(`${scoreSum} as ${SCORE_COLUMN_NAME}`, bindings);
};

// Our custom format for search times looks like this:
// ["1954", "1954-01-01T00:00:00.000Z", "1954-12-31T23:59:59.000Z"].
type SearchTime = [string, string, string];

const buildWhereForTimeRanges = (
  queryBuilder: QueryBuilder,
  searchTimes: SearchTime[],
  filterOutTexts: boolean
) => {
  for (const searchTime of searchTimes) {
    // Function syntax for where in order to use correct bracing in the query
    queryBuilder = queryBuilder.where((qb) => {
      qb = qb.orWhere((timeRangeQb) => {
        timeRangeQb = timeRangeQb.where(
          "time_range_tags.start",
          ">=",
          searchTime[1]
        );
        timeRangeQb = timeRangeQb.andWhere(
          "time_range_tags.end",
          "<=",
          searchTime[2]
        );
        return timeRangeQb;
      });
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
  knexEngine: KnexEngine,
  searchTerms: string[],
  searchTimes: SearchTime[],
  filterOutTexts: boolean,
  pagination = { start: 0, limit: 100 }
) => {
  const score = buildScore(knexEngine, searchTerms);

  const withSelect = knexEngine
    .distinct("pictures.*")
    .column(score)
    .from(table("pictures"));

  const withJoins = buildJoins(withSelect);

  const withWhere = buildWhereForTimeRanges(
    withJoins,
    searchTimes,
    filterOutTexts
  );

  const withOrder = withWhere.orderBy([
    {
      column: SCORE_COLUMN_NAME,
      order: "desc",
    },
    {
      column: "pictures.published_at",
      order: "asc",
    },
  ]);

  const innerQueryAlias = "inner";
  const withoutScore0 = knexEngine
    .with(innerQueryAlias, withOrder)
    .select("*")
    .from(innerQueryAlias)
    .where(SCORE_COLUMN_NAME, ">", 0);

  return withoutScore0.limit(pagination.limit).offset(pagination.start);
};

type Pagination = {
  start: number;
  limit: number;
};

/**
 * Encapsulates all logic that is necessary for the custom GraphQL query for the All-Search.
 *
 * Note that the Knex Query Builder is so designed, that built queries just need to be awaited
 * in order to execute the associated SQL queries on the underlying database.
 */
const findPicturesByAllSearch = async (
  knexEngine: KnexEngine,
  searchTerms: string[],
  searchTimes: SearchTime[],
  filterOutTexts: boolean,
  pagination: Pagination
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
