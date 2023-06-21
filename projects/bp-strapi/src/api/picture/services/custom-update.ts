import { QueryFromContentType } from "@strapi/database";
import type { KnexEngine, StrapiExtended } from "../../../types";
import { plural, singular, table } from "../../helper";

const { ApplicationError } = require("@strapi/utils").errors;

const VERIFIED_PREFIX = "verified_";
const withVerifiedPrefix = (tagKeyInPictureRelation: string) =>
  `${VERIFIED_PREFIX}${tagKeyInPictureRelation}`;

const PICTURES_KEY = "pictures";
const DESCRIPTIONS_KEY = "descriptions";
const KEYWORD_TAGS_KEY = "keyword_tags";
const LOCATION_TAGS_KEY = "location_tags";
const PERSON_TAGS_KEY = "person_tags";
const TIME_RANGE_TAG_KEY = "time_range_tag";
const ARCHIVE_TAG_KEY = "archive_tag";
const IS_TEXT_KEY = "is_text";
const LINKED_PICTURES_KEY = "linked_pictures";
const LINKED_TEXTS_KEY = "linked_texts";
const COLLECTIONS_KEY = "collections";
const PICTURE_GEO_INFO_KEY = "picture_geo_infos";

/**
 * Returns the key of the tag type that is used for the API (so e.g. "person-tag")
 * based on the key of the relation to this tag type in the picture type (so e.g. "person_tags").<br>
 * <i>Currently, only used for prettier/cleaner log statements.</i>
 */
const getTagKeyForApiFromRelationKey = (tagKeyInPictureRelation: string) => {
  let tagKeyForApi;

  switch (tagKeyInPictureRelation) {
    case DESCRIPTIONS_KEY:
      tagKeyForApi = "description";
      break;
    case KEYWORD_TAGS_KEY:
      tagKeyForApi = "keyword-tag";
      break;
    case TIME_RANGE_TAG_KEY:
      tagKeyForApi = "time-range-tag";
      break;
    case LOCATION_TAGS_KEY:
      tagKeyForApi = "location-tag";
      break;
    case PERSON_TAGS_KEY:
      tagKeyForApi = "person-tag";
      break;
    default:
      throw new ApplicationError(
        `There exists no relation field on a picture called ${tagKeyInPictureRelation}`
      );
  }

  return tagKeyForApi;
};

/**
 * Returns the Strapi internal query engine and service for the tag type
 * based on the key of the relation to this tag type in the picture relation (so e.g. "person_tags").
 */
const getQueryEngineAndServiceForTag = (tagKeyInPictureRelation: string) => {
  const tagKeyForApi = getTagKeyForApiFromRelationKey(tagKeyInPictureRelation);
  return {
    tagQuery: strapi.db.query(`api::${tagKeyForApi}.${tagKeyForApi}`),
    tagService: strapi.service(`api::${tagKeyForApi}.${tagKeyForApi}`),
  };
};

/**
 * Checks if a tag already exists with the new data or otherwise creates a new one.
 * Afterwards, it returns the tag id to be used for the update.
 */
const findExistingOrCreateNewTag = async (
  tagQuery: any,
  tagService: any,
  tagKeyInPictureRelation: string,
  newTagValueData: { text?: any; start?: any; end?: any; isEstimate?: any }
) => {
  const tagKeyForApi = getTagKeyForApiFromRelationKey(tagKeyInPictureRelation); // just for prettier logs
  const newTagAlreadyInDB = await tagQuery.findOne({ where: newTagValueData });

  let newTagId;
  if (newTagAlreadyInDB) {
    newTagId = newTagAlreadyInDB.id;
    strapi.log.debug(
      `New ${tagKeyForApi} already exists with id ${newTagAlreadyInDB.id}`
    );
  } else {
    const createdTag = await tagService.create({ data: newTagValueData });
    newTagId = createdTag.id;
    strapi.log.debug(`Created new ${tagKeyForApi} with id ${createdTag.id}`);
  }

  return newTagId;
};

/**
 * Updates the previous description with the new text or, if there already exists a description with that data,
 * merges the two descriptions together (with prioritization of the already existing one).<br>
 * Afterwards, it returns the description id to be used for the update of the current picture.
 */
const updatePreviousOrMergeWithExistingDescription = async (
  pictureQuery: any,
  currentPictureId: number,
  descriptionQuery: QueryFromContentType<`api::${string}.${string}`>,
  previousDescriptionId: any,
  newDescriptionData: { text: any }
) => {
  const descriptionKeyForApi = getTagKeyForApiFromRelationKey(DESCRIPTIONS_KEY); // just for prettier logs
  const newDescriptionAlreadyInDb = await descriptionQuery.findOne({
    where: newDescriptionData,
    populate: ["pictures"],
  });

  let updatedDescriptionId;
  if (!newDescriptionAlreadyInDb) {
    await descriptionQuery.update({
      where: {
        id: previousDescriptionId,
      },
      data: newDescriptionData,
    });
    strapi.log.debug(
      `Updated previous ${descriptionKeyForApi} with id ${previousDescriptionId}`
    );
    updatedDescriptionId = previousDescriptionId;
  } else {
    if (newDescriptionAlreadyInDb.id === previousDescriptionId) return;
    const picturesWithPreviousDescriptions = await pictureQuery.findMany({
      where: {
        [DESCRIPTIONS_KEY]: previousDescriptionId,
      },
      populate: [DESCRIPTIONS_KEY],
    });

    strapi.log.debug(
      `New ${descriptionKeyForApi} already exists with id ${newDescriptionAlreadyInDb.id}`
    );
    strapi.log.debug(
      `Now merging the previous ${descriptionKeyForApi} with id ${previousDescriptionId} with the existing one`
    );

    // Filter out the current picture (as this gets updated separately, because we are still in the beforeUpdate hook)
    const newPicturesForTheExistingDescription =
      picturesWithPreviousDescriptions.filter(
        (picture: { id: number }) => picture.id !== currentPictureId
      );
    strapi.log.debug(
      `The merging process will also effect the following pictures: [${newPicturesForTheExistingDescription.map(
        (o: { id: number }) => o.id
      )}]`
    );

    // Relate all pictures (but the current one) to the existing description
    await descriptionQuery.update({
      where: {
        id: newDescriptionAlreadyInDb.id,
      },
      data: {
        pictures: [
          ...newDescriptionAlreadyInDb.pictures.map(
            (picture: { id: number }) => picture.id
          ),
          ...newPicturesForTheExistingDescription,
        ],
      },
    });

    // Un-relate every picture from the previous description
    await descriptionQuery.update({
      where: {
        id: previousDescriptionId,
      },
      data: {
        pictures: [],
      },
    });

    updatedDescriptionId = newDescriptionAlreadyInDb.id;
  }

  return updatedDescriptionId;
};

/**
 * Deletes the given tag, if it will be completely unrelated after the custom update.
 */
const deletePreviousTagIfNeeded = async (
  pictureQuery: any,
  tagQuery: QueryFromContentType<`api::${string}.${string}`>,
  tagKeyInPictureRelation: string,
  previousTagId: number,
  tagHasVerifiedHandling = true
) => {
  if (!previousTagId) return;

  const pictureQueryObject = {
    where: {
      $or: [{ [tagKeyInPictureRelation]: previousTagId }],
    },
  };

  if (tagHasVerifiedHandling) {
    // We also need to query for pictures in verified relation to the tag here.
    pictureQueryObject.where.$or.push({
      [withVerifiedPrefix(tagKeyInPictureRelation)]: previousTagId,
    });
  }

  const picturesWithPreviousTag = await pictureQuery.findMany(
    pictureQueryObject
  );

  // No cleanup needed when there are still pictures related to the previous tag.
  // We need to use 2 here, because we are still in the beforeUpdate phase,
  // so after this phase the regular update will un-relate one picture if we get here.
  if (picturesWithPreviousTag.length >= 2) return;

  // Otherwise, clean up the previous tag.
  await tagQuery.delete({ where: { id: previousTagId } });

  const tagKeyForApi = getTagKeyForApiFromRelationKey(tagKeyInPictureRelation); // just for prettier logs
  strapi.log.debug(
    `Deleted the previous ${tagKeyForApi} with id ${previousTagId} as its not related anymore`
  );
};

/**
 * Updates the descriptions related to the current picture. There are following use-cases:
 * <ul>
 *   <li>Update the previous description with a new text.</li>
 *   <li>Create a new description with this text.</li>
 *   <li>Use an existing description in both cases, if there is any.</li>
 *   <li>Delete previous related descriptions if those will be unrelated after the update.</li>
 *   <li>But also make it possible to just pass simple ids for descriptions that didn't change.</li>
 * </ul>
 */
const processUpdatesForDescriptions = async (
  pictureQuery: any,
  currentPictureId: any,
  data: { [x: string]: any[] }
) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[DESCRIPTIONS_KEY]) return;

  const previousDescriptions =
    (
      await pictureQuery.findOne({
        where: {
          id: currentPictureId,
        },
        populate: {
          descriptions: {
            select: ["id"],
          },
        },
      })
    )?.descriptions ?? [];

  const { tagQuery, tagService } =
    getQueryEngineAndServiceForTag(DESCRIPTIONS_KEY);

  const newDescriptions: any[] = [];
  for (const description of data[DESCRIPTIONS_KEY]) {
    // Check if custom data is present.
    if (!description.text) {
      // If not, then it is already a valid ID here that needs to be kept.
      newDescriptions.push(description);
      continue;
    }

    const newDescriptionData = {
      text: description.text,
    };

    let newDescriptionId;
    if (description.updatePrevious) {
      newDescriptionId = await updatePreviousOrMergeWithExistingDescription(
        pictureQuery,
        currentPictureId,
        tagQuery,
        description.id,
        newDescriptionData
      );
    } else {
      newDescriptionId = await findExistingOrCreateNewTag(
        tagQuery,
        tagService,
        DESCRIPTIONS_KEY,
        newDescriptionData
      );
    }

    newDescriptions.push(newDescriptionId);

    // Delete previous description if it will be unrelated after the current picture update
    if (Number(newDescriptionId) !== Number(description.id)) {
      await deletePreviousTagIfNeeded(
        pictureQuery,
        tagQuery,
        DESCRIPTIONS_KEY,
        description.id,
        false
      );
    }
  }

  // Delete all descriptions that were assigned to the picture before and are not needed anymore
  const unused = previousDescriptions
    .filter(
      (description: { id: any }) => !newDescriptions.includes(description.id)
    )
    .map((description: { id: any }) => description.id);
  for (const unusedId of unused) {
    await deletePreviousTagIfNeeded(
      pictureQuery,
      tagQuery,
      DESCRIPTIONS_KEY,
      unusedId,
      false
    );
  }

  data[DESCRIPTIONS_KEY] = newDescriptions;

  strapi.log.debug(`New ${DESCRIPTIONS_KEY}: [${newDescriptions}]`);
};

/**
 * Updates the time-range-tag related to the current picture. There are following use-cases:
 * <ul>
 *   <li>Create a new time-range-tag with new data.</li>
 *   <li>Use an existing time-range-tag with that data, if there is any.</li>
 *   <li>Delete the previous related time-range-tag if it will be unrelated after the update.</li>
 * </ul>
 */
const processUpdatesForTimeRangeTag = async (
  pictureQuery: any,
  data: { [x: string]: any }
) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[TIME_RANGE_TAG_KEY]) return;

  const { tagQuery, tagService } =
    getQueryEngineAndServiceForTag(TIME_RANGE_TAG_KEY);

  const timeRangeTag = data[TIME_RANGE_TAG_KEY];

  // Check if custom data is present.
  if (!timeRangeTag.start || !timeRangeTag.end) return;

  const newTimeRangeTagData = {
    start: timeRangeTag.start,
    end: timeRangeTag.end,
    isEstimate: timeRangeTag.isEstimate,
  };

  const newTimeRangeTagId = await findExistingOrCreateNewTag(
    tagQuery,
    tagService,
    TIME_RANGE_TAG_KEY,
    newTimeRangeTagData
  );

  // Assert the picture only gets one time-range-tag assigned (independent of the verified status).
  data[TIME_RANGE_TAG_KEY] = timeRangeTag.verified ? null : newTimeRangeTagId;
  data[withVerifiedPrefix(TIME_RANGE_TAG_KEY)] = timeRangeTag.verified
    ? newTimeRangeTagId
    : null;

  strapi.log.debug(
    `New ${
      timeRangeTag.verified ? "verified " : ""
    }${TIME_RANGE_TAG_KEY}: ${newTimeRangeTagId}`
  );

  // Delete previous tag if it will be unrelated after the current picture update.
  if (Number(timeRangeTag.id) !== Number(newTimeRangeTagId)) {
    await deletePreviousTagIfNeeded(
      pictureQuery,
      tagQuery,
      TIME_RANGE_TAG_KEY,
      timeRangeTag.id,
      true
    );
  }
};

/**
 * Updates tag relations to the current picture without further editing capabilities.
 * Thereby, it checks whether a tag should be in a verified or unverified relation.<br>
 * <i>Currently, it is suitable for keyword, location and person tags.</i>
 */
const processSimpleTagRelationUpdates = async (
  tagKeyInPictureRelation: string,
  data: { [x: string]: any[] }
) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[tagKeyInPictureRelation]) return;

  const newTags: never[] = [];
  const newVerifiedTags = [];
  const newlyAddedTags = [];
  for (const tag of data[tagKeyInPictureRelation]) {
    // Check if custom data is present.
    if (!tag.id) {
      // If not, then it is already a valid tag id here that needs to be kept.
      // Per default these will be in a verified relation to the current picture.
      newVerifiedTags.push(tag);
      continue;
    }

    if (tag.isNew) {
      newlyAddedTags.push(tag.id);
    }

    // Relate the tag in a verified relation to the current picture if not specified otherwise.
    const verified = tag.verified === undefined ? true : tag.verified;
    (verified ? newVerifiedTags : newTags).push(tag.id);
  }

  data[tagKeyInPictureRelation] = newTags;
  data[withVerifiedPrefix(tagKeyInPictureRelation)] = newVerifiedTags;

  const { tagQuery } = getQueryEngineAndServiceForTag(tagKeyInPictureRelation);
  // Set updatedAt on newly added tags
  for (const newTag of newlyAddedTags) {
    await tagQuery.update({
      where: {
        id: newTag,
      },
      data: {},
    });
  }

  strapi.log.debug(`New ${tagKeyInPictureRelation}: [${newTags}]`);
  strapi.log.debug(
    `New verified ${tagKeyInPictureRelation}: [${newVerifiedTags}]`
  );
};

const processUpdatesForKeywordTags = async (data: any) =>
  processSimpleTagRelationUpdates(KEYWORD_TAGS_KEY, data);

const processUpdatesForLocationTags = async (data: any) =>
  processSimpleTagRelationUpdates(LOCATION_TAGS_KEY, data);

const processUpdatesForPersonTags = async (data: any) =>
  processSimpleTagRelationUpdates(PERSON_TAGS_KEY, data);

const processTagUpdates = async (
  pictureQuery: QueryFromContentType<"api::picture.picture">,
  currentPictureId: string,
  data: any
) => {
  // Process updates of tag relations with additional editing capabilities.
  await processUpdatesForDescriptions(pictureQuery, currentPictureId, data);
  await processUpdatesForTimeRangeTag(pictureQuery, data);

  // Process simple updates of tag relations without further editing capabilities.
  await processUpdatesForKeywordTags(data);
  await processUpdatesForLocationTags(data);
  await processUpdatesForPersonTags(data);
};

const protectIsTextKey = async (
  pictureQuery: QueryFromContentType<"api::picture.picture">,
  pictureIds: string[] | number[],
  data: { [x: string]: any }
) => {
  // By using == instead of === we check both null and undefined
  if (data[IS_TEXT_KEY] == null) return;

  if (await anyPictureHasLinks(pictureQuery, pictureIds)) {
    delete data[IS_TEXT_KEY];
  }
};

const anyPictureHasLinks = async (
  pictureQuery: {
    findMany: (arg0: {
      where: { id: { $in: any } };
      populate: string[];
    }) => any;
  },
  pictureIds: any
) => {
  const linkKeys = [LINKED_PICTURES_KEY, LINKED_TEXTS_KEY];
  const pictures = await pictureQuery.findMany({
    where: {
      id: {
        $in: pictureIds,
      },
    },
    populate: linkKeys,
  });
  for (const picture of pictures) {
    for (const linkKey of linkKeys) {
      if (picture[linkKey].length > 0) {
        return true;
      }
    }
  }
  return false;
};

const removeUnusedPictureSequences = async (strapi: StrapiExtended) => {
  const knexEngine = strapi.db.connection;
  const sequencesTable = table("picture_sequences");
  const linksTable = table("pictures_picture_sequence_links");
  // remove links to sequences of length 1
  const count = await knexEngine(linksTable)
    .whereIn(
      "picture_sequence_id",
      knexEngine(linksTable)
        .select("picture_sequence_id")
        .groupBy("picture_sequence_id")
        .havingRaw("count(picture_sequence_id) <= 1")
    )
    .del();
  console.log("deleted", count, "links");
  // remove sequences without links
  await knexEngine(sequencesTable)
    .whereNotExists(
      knexEngine(linksTable).whereRaw(
        `${linksTable}.picture_sequence_id = ${sequencesTable}.id`
      )
    )
    .del();
};

const updatePictureWithTagCleanup = async (id: string, data: any) => {
  // No special handling needed if no data is passed.
  if (!data) return;

  strapi.log.debug(`Custom tag updates for the picture with id ${id}`);
  const pictureQuery = strapi.db.query("api::picture.picture");

  // Process tag updates for the picture before actually updating the picture itself.
  await processTagUpdates(pictureQuery, id, data);

  await protectIsTextKey(pictureQuery, [id], data);

  // Actually update the picture.
  await pictureQuery.update({
    where: { id },
    data,
  });

  await removeUnusedPictureSequences(strapi as StrapiExtended);

  return id;
};

// return a new object, only keeping the specified keys from the original object
const pick = <T extends Record<string, any>>(
  original: T,
  keys: (keyof T)[]
) => {
  const picked: Partial<T> = {};
  for (const key of keys) {
    if (key in original) {
      picked[key] = original[key];
    }
  }
  return picked;
};

const knexIdArray = (knexEngine: KnexEngine, ids: number[], name: string) => {
  return knexEngine.raw(
    `(VALUES ${ids.map((_) => "(?::integer)").join(", ")}) ${name}`,
    [...ids]
  );
};

const insertCrossProductIgnoreDuplicates = async (
  knexEngine: KnexEngine,
  linksTable: string,
  leftIdKey: string,
  rightIdKey: string,
  leftIds: number[],
  rightIds: number[]
) => {
  if (leftIds.length === 0 || rightIds.length === 0) {
    return;
  }
  // use ?? (??, ??) to map the column indices of the subquery to the correct columns in the target table
  await knexEngine
    .from(knexEngine.raw("?? (??, ??)", [linksTable, leftIdKey, rightIdKey]))
    .insert(
      knexEngine
        .select(leftIdKey, rightIdKey)
        .from(knexIdArray(knexEngine, leftIds, `a(${leftIdKey})`))
        .crossJoin(knexIdArray(knexEngine, rightIds, `b(${rightIdKey})`))
        .whereNotIn(
          [leftIdKey, rightIdKey],
          knexEngine(linksTable).select(leftIdKey, rightIdKey)
        )
    );
};

const bulkEditTimeRangeTag = async (
  knexEngine: KnexEngine,
  pictureQuery: QueryFromContentType<"api::picture.picture">,
  pictureIds: number[],
  data: { [x: string]: any }
) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[TIME_RANGE_TAG_KEY]) return 0;

  const timeRangeTagData = pick(data, [TIME_RANGE_TAG_KEY]);
  await processUpdatesForTimeRangeTag(pictureQuery, timeRangeTagData);
  const unverifiedLinksTable = table(
    `${PICTURES_KEY}_${TIME_RANGE_TAG_KEY}_links`
  );
  const verifiedLinksTable = table(
    `${PICTURES_KEY}_${withVerifiedPrefix(TIME_RANGE_TAG_KEY)}_links`
  );

  const removedIds = [];

  for (const [linksTable, dataKey] of [
    [unverifiedLinksTable, TIME_RANGE_TAG_KEY],
    [verifiedLinksTable, withVerifiedPrefix(TIME_RANGE_TAG_KEY)],
  ]) {
    removedIds.push(
      ...(
        await knexEngine(linksTable)
          .select("time_range_tag_id")
          .distinct()
          .whereIn("picture_id", pictureIds)
      ).map((removed) => removed.time_range_tag_id)
    );

    await knexEngine(linksTable).whereIn("picture_id", pictureIds).del();
    const newTimeRangeTagId = timeRangeTagData[dataKey];
    if (newTimeRangeTagId !== null) {
      await knexEngine(linksTable).insert(
        knexEngine
          .select("picture_id", knexEngine.raw("?", [newTimeRangeTagId]))
          .from(knexIdArray(knexEngine, pictureIds, "a(picture_id)"))
      );
    }
  }

  // clean up unused descriptions
  let deleteQuery = knexEngine(table(plural(TIME_RANGE_TAG_KEY))).whereIn(
    "id",
    removedIds
  );
  for (const linksTable of [unverifiedLinksTable, verifiedLinksTable]) {
    deleteQuery = deleteQuery.whereNotExists(
      knexEngine(linksTable).select("*").whereRaw("time_range_tag_id = id")
    );
  }
  const count = await deleteQuery.del();
  if (count > 0) {
    strapi.log.debug(`Removed ${count} unused time_range_tags`);
  }

  return 1;
};

const bulkEditArchiveTag = async (
  knexEngine: KnexEngine,
  pictureIds: number[],
  data: { [x: string]: any }
) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!(ARCHIVE_TAG_KEY in data)) return 0;

  const linksTable = table(`${PICTURES_KEY}_${ARCHIVE_TAG_KEY}_links`);
  await knexEngine(linksTable).whereIn("picture_id", pictureIds).del();
  const newArchiveId = data[ARCHIVE_TAG_KEY];
  if (newArchiveId !== null) {
    await knexEngine(linksTable).insert(
      knexEngine
        .select("picture_id", knexEngine.raw("?", [newArchiveId]))
        .from(knexIdArray(knexEngine, pictureIds, "a(picture_id)"))
    );
  }

  return 1;
};

const bulkEditDescriptions = async (
  knexEngine: KnexEngine,
  pictureIds: number[],
  data: { [x: string]: any }
) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[DESCRIPTIONS_KEY]) return 0;

  const diff = data[DESCRIPTIONS_KEY];

  if (diff.added.length === 0 && diff.removed.length === 0) return 0;

  const linksTable = table(`${PICTURES_KEY}_${DESCRIPTIONS_KEY}_links`);

  // delete relations to be removed (don't remove the actual descriptions yet)
  const removedIds = diff.removed.map((removed: { id: any }) => removed.id);
  await knexEngine(linksTable)
    .whereIn("picture_id", pictureIds)
    .whereIn("description_id", removedIds)
    .del();

  const { tagQuery, tagService } =
    getQueryEngineAndServiceForTag(DESCRIPTIONS_KEY);

  // create new descriptions
  const addedIds = [];
  for (const added of diff.added) {
    const newData = pick(added, ["text"]);
    const newId = await findExistingOrCreateNewTag(
      tagQuery,
      tagService,
      DESCRIPTIONS_KEY,
      newData
    );
    addedIds.push(newId);
  }

  await insertCrossProductIgnoreDuplicates(
    knexEngine,
    linksTable,
    "picture_id",
    "description_id",
    pictureIds,
    addedIds
  );

  // clean up unused descriptions
  const count = await knexEngine(table(DESCRIPTIONS_KEY))
    .whereIn("id", removedIds)
    .whereNotExists(
      knexEngine(linksTable).select("*").whereRaw("description_id = id")
    )
    .del();
  if (count > 0) {
    strapi.log.debug(`Removed ${count} unused descriptions`);
  }

  return 1;
};

const bulkEditIsText = async (
  knexEngine: KnexEngine,
  pictureIds: number[],
  data: { [x: string]: any }
) => {
  // Check whether we actually need to update stuff for that type.
  // By using == instead of === we check both null and undefined
  if (data[IS_TEXT_KEY] == null) return 0;

  await knexEngine(table(PICTURES_KEY))
    .whereIn("id", pictureIds)
    .update(IS_TEXT_KEY, knexEngine.raw("?::boolean", [data[IS_TEXT_KEY]]));

  return 1;
};

const bulkEditTags = async (
  knexEngine: KnexEngine,
  pictureIds: number[],
  data: any,
  tagsKey: string,
  hasVerifiedVersion = true
) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[tagsKey]) return 0;

  const diff = data[tagsKey];

  if (diff.added.length === 0 && diff.removed.length === 0) return 0;

  const singularIdKey = `${singular(tagsKey)}_id`;

  const unverifiedLinksTable = table(`${PICTURES_KEY}_${tagsKey}_links`);
  const verifiedLinksTable = table(
    `${PICTURES_KEY}_${withVerifiedPrefix(tagsKey)}_links`
  );

  const removedUnverified = diff.removed.filter(
    (removed: { verified: any }) => !removed.verified
  );
  const removedVerified = diff.removed.filter(
    (removed: { verified: any }) => removed.verified
  );

  const toRemove = hasVerifiedVersion
    ? [
        [removedUnverified, unverifiedLinksTable],
        [removedVerified, verifiedLinksTable],
      ]
    : [[diff.removed, unverifiedLinksTable]];

  for (const [removed, linksTable] of toRemove) {
    const removedIds = removed.map((removed: { id: any }) => removed.id);
    await knexEngine(linksTable)
      .whereIn("picture_id", pictureIds)
      .whereIn(singularIdKey, removedIds)
      .del();
  }

  const addedUnverified = diff.added.filter(
    (added: { verified: any }) => !added.verified
  );
  const addedVerified = diff.added.filter(
    (added: { verified: any }) => added.verified
  );

  const toAdd = hasVerifiedVersion
    ? [
        [addedUnverified, unverifiedLinksTable],
        [addedVerified, verifiedLinksTable],
      ]
    : [[diff.added, unverifiedLinksTable]];

  for (const [added, linksTable] of toAdd) {
    const addedIds = added.map((added: { id: any }) => added.id);
    await insertCrossProductIgnoreDuplicates(
      knexEngine,
      linksTable,
      "picture_id",
      singularIdKey,
      pictureIds,
      addedIds
    );
  }

  return 1;
};

const bulkEditLinks = async (
  knexEngine: KnexEngine,
  pictureIds: number[],
  data: { [x: string]: any },
  linksKey: string,
  isInverse: boolean
) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[linksKey]) return 0;

  const diff = data[linksKey];

  if (diff.added.length === 0 && diff.removed.length === 0) return 0;

  const columnNames = ["picture_id", "inv_picture_id"];
  const [left, right] = isInverse ? columnNames.reverse() : columnNames;

  const linksTable = table("pictures_linked_pictures_links");

  const removedIds = diff.removed.map((picture: { id: any }) => picture.id);

  await knexEngine(linksTable)
    .whereIn(left, pictureIds)
    .whereIn(right, removedIds)
    .del();

  const addedIds = diff.added.map((picture: { id: any }) => picture.id);

  console.log(
    "inserting",
    linksKey,
    linksTable,
    left,
    right,
    pictureIds,
    addedIds
  );
  insertCrossProductIgnoreDuplicates(
    knexEngine,
    linksTable,
    left,
    right,
    pictureIds,
    addedIds
  );

  return 1;
};

const bulkEdit = async (
  knexEngine: KnexEngine,
  pictureIds: number[],
  data: any
) => {
  strapi.log.debug(
    `BulkEdit called on pictures [${pictureIds.toString()}] with data ${JSON.stringify(
      data
    )} `
  );
  const pictureQuery = strapi.db.query("api::picture.picture");

  await protectIsTextKey(pictureQuery, pictureIds, data);

  // should be a boolean (false), but we use | (bitwise or),
  // so it's a number representing a boolean instead (0 -> false, 1 -> true)
  let shouldWriteUpdatedAt = 0;

  // each function returns a boolean indicating whether anything was changed
  shouldWriteUpdatedAt |= await bulkEditTimeRangeTag(
    knexEngine,
    pictureQuery,
    pictureIds,
    data
  );
  shouldWriteUpdatedAt |= await bulkEditArchiveTag(
    knexEngine,
    pictureIds,
    data
  );
  shouldWriteUpdatedAt |= await bulkEditDescriptions(
    knexEngine,
    pictureIds,
    data
  );
  shouldWriteUpdatedAt |= await bulkEditIsText(knexEngine, pictureIds, data);
  shouldWriteUpdatedAt |= await bulkEditTags(
    knexEngine,
    pictureIds,
    data,
    PERSON_TAGS_KEY
  );
  shouldWriteUpdatedAt |= await bulkEditTags(
    knexEngine,
    pictureIds,
    data,
    LOCATION_TAGS_KEY
  );
  shouldWriteUpdatedAt |= await bulkEditTags(
    knexEngine,
    pictureIds,
    data,
    KEYWORD_TAGS_KEY
  );
  shouldWriteUpdatedAt |= await bulkEditLinks(
    knexEngine,
    pictureIds,
    data,
    LINKED_PICTURES_KEY,
    false
  );
  shouldWriteUpdatedAt |= await bulkEditLinks(
    knexEngine,
    pictureIds,
    data,
    LINKED_TEXTS_KEY,
    true
  );
  shouldWriteUpdatedAt |= await bulkEditTags(
    knexEngine,
    pictureIds,
    data,
    COLLECTIONS_KEY,
    false
  );

  if (shouldWriteUpdatedAt) {
    const updatedAt = new Date();

    await knexEngine(table(PICTURES_KEY))
      .whereIn("id", pictureIds)
      .update("updated_at", knexEngine.raw("?::date", [updatedAt]));

    strapi.log.debug(`Updated updated_at to ${updatedAt.toISOString()}`);
  } else {
    strapi.log.debug(`No changes`);
  }
  return 0;
};

const like = async (
  knexEngine: KnexEngine,
  pictureId: number,
  dislike?: boolean
) => {
  const pictureResult = knexEngine(table(PICTURES_KEY)).where("id", pictureId);
  await pictureResult.update(
    "likes",
    knexEngine.raw(
      dislike ? "GREATEST(COALESCE(likes, 0) - 1, 0)" : "COALESCE(likes, 0) + 1"
    )
  );
};

const incNotAPlaceCount = async (knexEngine: KnexEngine, pictureId: number) => {
  const pictureResult = knexEngine(table(PICTURES_KEY)).where("id", pictureId);
  await pictureResult.update(
    "is_not_a_place_count",
    knexEngine.raw("COALESCE(is_not_a_place_count, 0) + 1")
  );
};

export { updatePictureWithTagCleanup, bulkEdit, like, incNotAPlaceCount };
