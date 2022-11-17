const { ApplicationError } = require("@strapi/utils").errors;

const VERIFIED_PREFIX = "verified_";
const withVerifiedPrefix = (tagKeyInPictureRelation) =>
  `${VERIFIED_PREFIX}${tagKeyInPictureRelation}`;

const DATABASE_SCHEMA = process.env.DATABASE_SCHEMA;

const PICTURES_KEY = "pictures";
const DESCRIPTIONS_KEY = "descriptions";
const KEYWORD_TAGS_KEY = "keyword_tags";
const LOCATION_TAGS_KEY = "location_tags";
const PERSON_TAGS_KEY = "person_tags";
const TIME_RANGE_TAG_KEY = "time_range_tag";
const ARCHIVE_TAG = "archive_tag";

const singular = key => {
  if (key[key.length - 1] !== "s") {
    return key;
  }
  return key.slice(0, -1);
}

const table = name => {
  return DATABASE_SCHEMA + "." + name;
};

/**
 * Returns the key of the tag type that is used for the API (so e.g. "person-tag")
 * based on the key of the relation to this tag type in the picture type (so e.g. "person_tags").<br>
 * <i>Currently, only used for prettier/cleaner log statements.</i>
 */
const getTagKeyForApiFromRelationKey = (tagKeyInPictureRelation) => {
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
const getQueryEngineAndServiceForTag = (tagKeyInPictureRelation) => {
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
  tagQuery,
  tagService,
  tagKeyInPictureRelation,
  newTagValueData
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
  pictureQuery,
  currentPictureId,
  descriptionQuery,
  previousDescriptionId,
  newDescriptionData
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
        (picture) => picture.id !== currentPictureId
      );
    strapi.log.debug(
      `The merging process will also effect the following pictures: [${newPicturesForTheExistingDescription.map(
        (o) => o.id
      )}]`
    );

    // Relate all pictures (but the current one) to the existing description
    await descriptionQuery.update({
      where: {
        id: newDescriptionAlreadyInDb.id,
      },
      data: {
        pictures: [
          ...newDescriptionAlreadyInDb.pictures.map((picture) => picture.id),
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
  pictureQuery,
  tagQuery,
  tagKeyInPictureRelation,
  previousTagId,
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
  pictureQuery,
  currentPictureId,
  data
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

  const newDescriptions = [];
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
    .filter((description) => !newDescriptions.includes(description.id))
    .map((description) => description.id);
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
const processUpdatesForTimeRangeTag = async (pictureQuery, data) => {
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
  };

  const newTimeRangeTagId = await findExistingOrCreateNewTag(
    tagQuery,
    tagService,
    TIME_RANGE_TAG_KEY,
    newTimeRangeTagData
  );

  // Assert the picture only gets one time-range-tag assigned (independent of the verified status).
  data[TIME_RANGE_TAG_KEY] = timeRangeTag.verified
    ? null
    : newTimeRangeTagId;
  data[withVerifiedPrefix(TIME_RANGE_TAG_KEY)] = timeRangeTag.verified
    ? newTimeRangeTagId
    : null;

  strapi.log.debug(
    `New ${timeRangeTag.verified ? "verified " : ""
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
  tagKeyInPictureRelation,
  data
) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[tagKeyInPictureRelation]) return;

  const newTags = [];
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
    const verified =
      tag.verified === undefined ? true : tag.verified;
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

const processUpdatesForKeywordTags = async (data) =>
  processSimpleTagRelationUpdates(KEYWORD_TAGS_KEY, data);

const processUpdatesForLocationTags = async (data) =>
  processSimpleTagRelationUpdates(LOCATION_TAGS_KEY, data);

const processUpdatesForPersonTags = async (data) =>
  processSimpleTagRelationUpdates(PERSON_TAGS_KEY, data);

const processTagUpdates = async (pictureQuery, currentPictureId, data) => {
  // Process updates of tag relations with additional editing capabilities.
  await processUpdatesForDescriptions(pictureQuery, currentPictureId, data);
  await processUpdatesForTimeRangeTag(pictureQuery, data);

  // Process simple updates of tag relations without further editing capabilities.
  await processUpdatesForKeywordTags(data);
  await processUpdatesForLocationTags(data);
  await processUpdatesForPersonTags(data);
};

const updatePictureWithTagCleanup = async (id, data) => {
  // No special handling needed if no data is passed.
  if (!data) return;

  strapi.log.debug(`Custom tag updates for the picture with id ${id}`);
  const pictureQuery = strapi.db.query("api::picture.picture");

  // Process tag updates for the picture before actually updating the picture itself.
  await processTagUpdates(pictureQuery, id, data);

  // Actually update the picture.
  await pictureQuery.update({
    where: { id },
    data,
  });

  return id;
};

// return a new object, only keeping the specified keys from the original object
const pick = (original, keys) => {
  const picked = {};
  for (const key of keys) {
    if (key in original) {
      picked[key] = original[key];
    }
  }
  return picked;
};

const bulkEditSingleTags = async (pictureQuery, pictureIds, data) => {
  strapi.log.debug("single tags");
  const singleData = pick(data, [TIME_RANGE_TAG_KEY, ARCHIVE_TAG]);
  await processUpdatesForTimeRangeTag(pictureQuery, singleData);
  strapi.log.debug(JSON.stringify([pictureIds, singleData]));
  await pictureQuery.updateMany({
    where: {
      id: {
        $in: pictureIds,
      },
    },
    data: singleData,
  });
};

const knexIdArray = (knexEngine, ids, name) => {
  return knexEngine.raw(`(VALUES ${ids.map(_ => "(?::integer)").join(", ")}) ${name}`, [...ids]);
};

const insertCrossProductIgnoreDuplicates = async (knexEngine, linksTable, leftIdKey, rightIdKey, leftIds, rightIds) => {
  if (leftIds.length === 0 || rightIds.length === 0) {
    return;
  }
  await knexEngine(linksTable)
    .insert(
      knexEngine.select(leftIdKey, rightIdKey)
        .from(knexIdArray(knexEngine, leftIds, `a(${leftIdKey})`))
        .crossJoin(knexIdArray(knexEngine, rightIds, `b(${rightIdKey})`))
        .whereNotIn([leftIdKey, rightIdKey], knexEngine(linksTable).select("*"))
    );
};

const bulkEditDescriptions = async (knexEngine, pictureIds, data) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[DESCRIPTIONS_KEY]) return;

  const diff = data[DESCRIPTIONS_KEY];

  const linksTable = table(`${PICTURES_KEY}_${DESCRIPTIONS_KEY}_links`);

  // delete relations to be removed (don't remove the actual descriptions yet)
  const removedIds = diff.removed.map(removed => removed.id);
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

  await insertCrossProductIgnoreDuplicates(knexEngine, linksTable, "picture_id", "description_id", pictureIds, addedIds);

  // clean up unused descriptions
  const count = await knexEngine(table(DESCRIPTIONS_KEY))
    .whereIn("id", removedIds)
    .whereNotExists(knexEngine(linksTable).select("*").whereRaw("description_id = id"))
    .del();
  if (count > 0) {
    strapi.log.debug(`Removed ${count} unused descriptions`);
  }
};

const bulkEditTags = async (knexEngine, pictureIds, data, updatedAt, tagsKey) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[tagsKey]) return;

  const diff = data[tagsKey];

  const singularIdKey = `${singular(tagsKey)}_id`;

  const unverifiedLinksTable = table(`${PICTURES_KEY}_${tagsKey}_links`);
  const verifiedLinksTable = table(`${PICTURES_KEY}_${withVerifiedPrefix(tagsKey)}_links`);

  const removedUnverified = diff.removed.filter(removed => !removed.verified);
  const removedVerified = diff.removed.filter(removed => removed.verified);

  for (const [removed, linksTable] of [
    [removedUnverified, unverifiedLinksTable],
    [removedVerified, verifiedLinksTable]
  ]) {
    const removedIds = removed.map(removed => removed.id);
    await knexEngine(linksTable)
      .whereIn("picture_id", pictureIds)
      .whereIn(singularIdKey, removedIds)
      .del();
  }

  const addedUnverified = diff.added.filter(added => !added.verified);
  const addedVerified = diff.added.filter(added => added.verified);

  for (const [added, linksTable] of [
    [addedUnverified, unverifiedLinksTable],
    [addedVerified, verifiedLinksTable]
  ]) {
    const addedIds = added.map(added => added.id);
    await insertCrossProductIgnoreDuplicates(knexEngine, linksTable, "picture_id", singularIdKey, pictureIds, addedIds);
  }
};

const bulkEdit = async (knexEngine, ids, data) => {
  strapi.log.debug(`bulkEdit called with ${ids.toString()} and data ${JSON.stringify(data)} `);
  const pictureQuery = strapi.db.query("api::picture.picture");

  const updatedAt = Date.now();

  await bulkEditSingleTags(pictureQuery, ids, data);

  // knex expects integers
  ids = ids.map(id => parseInt(id));

  await bulkEditDescriptions(knexEngine, ids, data);
  await bulkEditTags(knexEngine, ids, data, updatedAt, PERSON_TAGS_KEY);
  await bulkEditTags(knexEngine, ids, data, updatedAt, LOCATION_TAGS_KEY);
  await bulkEditTags(knexEngine, ids, data, updatedAt, KEYWORD_TAGS_KEY);
  return 42;
};

module.exports = {
  updatePictureWithTagCleanup,
  bulkEdit,
};
