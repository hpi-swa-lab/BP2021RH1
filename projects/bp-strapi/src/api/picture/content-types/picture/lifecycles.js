const { ApplicationError  } = require('@strapi/utils').errors;

const VERIFIED_PREFIX = 'verified_';
const withVerifiedPrefix = (tagKeyInPictureRelation) => `${VERIFIED_PREFIX}${tagKeyInPictureRelation}`;

const DESCRIPTIONS_KEY = 'descriptions';
const KEYWORD_TAGS_KEY = 'keyword_tags';
const LOCATION_TAGS_KEY = 'location_tags';
const PERSON_TAGS_KEY = 'person_tags';
const TIME_RANGE_TAG_KEY = 'time_range_tag';

/**
 * Returns the key of the tag type that is used for the API (so e.g. "person-tag")
 * based on the key of the relation to this tag type in the picture type (so e.g. "person_tags").<br>
 * <i>Currently, only used for prettier/cleaner log statements.</i>
 */
const getTagKeyForApiFromRelationKey = tagKeyInPictureRelation => {
  let tagKeyForApi;

  switch (tagKeyInPictureRelation) {
    case DESCRIPTIONS_KEY:
      tagKeyForApi = 'description';
      break;
    case KEYWORD_TAGS_KEY:
      tagKeyForApi = 'keyword-tag';
      break;
    case TIME_RANGE_TAG_KEY:
      tagKeyForApi = 'time-range-tag';
      break;
    case LOCATION_TAGS_KEY:
      tagKeyForApi = 'location-tag';
      break;
    case PERSON_TAGS_KEY:
      tagKeyForApi = 'person-tag';
      break;
    default:
      throw new ApplicationError(`There exists no relation field on a picture called ${tagKeyInPictureRelation}`);
  }

  return tagKeyForApi;
}

/**
 * Returns the Strapi internal query engine and service for the tag type
 * based on the key of the relation to this tag type in the picture relation (so e.g. "person_tags").
 */
const getQueryEngineAndServiceForTag = tagKeyInPictureRelation => {
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
const findExistingOrCreateNewTag = async (tagQuery, tagService, tagKeyInPictureRelation, newTagValueData) => {
  const tagKeyForApi = getTagKeyForApiFromRelationKey(tagKeyInPictureRelation); // just for prettier logs
  const newTagAlreadyInDB = await tagQuery.findOne({ where: newTagValueData });

  let newTagId;
  if (newTagAlreadyInDB) {
    newTagId = newTagAlreadyInDB.id;
    strapi.log.debug(`New ${tagKeyForApi} already exists with id ${newTagAlreadyInDB.id}`);
  } else {
    const createdTag = await tagService.create({ data: newTagValueData });
    newTagId = createdTag.id;
    strapi.log.debug(`Created new ${tagKeyForApi} with id ${createdTag.id}`);
  }

  return newTagId;
};

/**
 * Updates the previous tag with the new data or, if there already exists a tag with that data,
 * merges the two tags together. Afterwards, it returns the tag id to be used for the update.
 */
const updatePreviousOrMergeWithExistingTag = async (tagQuery, tagKeyInPictureRelation, previousTagId, newTagValueData) => {
  const tagKeyForApi = getTagKeyForApiFromRelationKey(tagKeyInPictureRelation); // just for prettier logs
  const newTagAlreadyInDB = await tagQuery.findOne({ where: newTagValueData });

  let updatedTagId;
  if (!newTagAlreadyInDB) {
    await tagQuery.update({ where: { id: previousTagId }, data: newTagValueData });
    strapi.log.debug(`Updated previous ${tagKeyForApi} with id ${previousTagId}`);
    updatedTagId = previousTagId;
  } else {
    // TODO implement merging of the tag that should be updated (previousTagId) with the existing one
  }

  return updatedTagId;
};

/**
 * Deletes the given tag, if it will be completely unrelated after the custom update.
 */
const deletePreviousTagIfNeeded = async (pictureQuery, tagQuery, tagKeyInPictureRelation, previousTagId, tagHasVerifiedHandling = true) => {
  if (!previousTagId) return;

  const pictureQueryObject = {
    where: {
      $or: [
        { [tagKeyInPictureRelation]: previousTagId },
      ],
    }
  };

  if (tagHasVerifiedHandling) {
    // We also need to query for pictures in verified relation to the tag here.
    pictureQueryObject.where.$or.push({ [withVerifiedPrefix(tagKeyInPictureRelation)]: previousTagId });
  }

  const picturesWithPreviousTag = await pictureQuery.findMany(pictureQueryObject);

  // No cleanup needed when there are still pictures related to the previous tag.
  // We need to use 2 here, because we are still in the beforeUpdate hook,
  // so after the hook the regular update will un-relate one picture if we get here.
  if (picturesWithPreviousTag.length >= 2) return;

  // Otherwise, clean up the previous tag.
  await tagQuery.delete({ where: { id: previousTagId } });

  const tagKeyForApi = getTagKeyForApiFromRelationKey(tagKeyInPictureRelation); // just for prettier logs
  strapi.log.debug(`Deleted the previous ${tagKeyForApi} with id ${previousTagId} as its not related anymore`);
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
const processUpdatesForDescriptions = async (pictureQuery, data) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[DESCRIPTIONS_KEY]) return;

  const { tagQuery, tagService } = getQueryEngineAndServiceForTag(DESCRIPTIONS_KEY);

  const newDescriptions = [];
  for (const description of data[DESCRIPTIONS_KEY]) {
    const parsedDescription = JSON.parse(description);

    // Check if custom data is present.
    if (!parsedDescription.text) {
      // If not, then it is already a valid ID here that needs to be kept.
      newDescriptions.push(parsedDescription);
      continue;
    }

    const newDescriptionData = {
      text: parsedDescription.text
    };

    let newDescriptionId;
    if (parsedDescription.updatePrevious) {
      newDescriptionId = await updatePreviousOrMergeWithExistingTag(tagQuery, DESCRIPTIONS_KEY, parsedDescription.id, newDescriptionData);
    } else {
      newDescriptionId = await findExistingOrCreateNewTag(tagQuery, tagService, DESCRIPTIONS_KEY, newDescriptionData);
    }

    newDescriptions.push(newDescriptionId);

    // Delete previous description if it will be unrelated after the current picture update
    await deletePreviousTagIfNeeded(pictureQuery, tagQuery, DESCRIPTIONS_KEY, parsedDescription.id, false);
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

  const { tagQuery, tagService } = getQueryEngineAndServiceForTag(TIME_RANGE_TAG_KEY);

  const parsedTimeRangeTag = JSON.parse(data[TIME_RANGE_TAG_KEY]);

  // Check if custom data is present.
  if (!parsedTimeRangeTag.start || !parsedTimeRangeTag.end) return;

  const newTimeRangeTagData = {
    start: parsedTimeRangeTag.start,
    end: parsedTimeRangeTag.end,
  };

  const newTimeRangeTagId = await findExistingOrCreateNewTag(tagQuery, tagService, TIME_RANGE_TAG_KEY, newTimeRangeTagData);

  // Assert the picture only gets one time-range-tag assigned (independent of the verified status).
  data[TIME_RANGE_TAG_KEY] = parsedTimeRangeTag.verified ? null : newTimeRangeTagId;
  data[withVerifiedPrefix(TIME_RANGE_TAG_KEY)] = parsedTimeRangeTag.verified ? newTimeRangeTagId : null;

  strapi.log.debug(`New ${parsedTimeRangeTag.verified ? 'verified ' : ''}${TIME_RANGE_TAG_KEY}: ${newTimeRangeTagId}`);

  // Delete previous tag if it will be unrelated after the current picture update.
  await deletePreviousTagIfNeeded(pictureQuery, tagQuery, TIME_RANGE_TAG_KEY, parsedTimeRangeTag.id, true);
};

/**
 * Updates tag relations to the current picture without further editing capabilities.
 * Thereby, it checks whether a tag should be in a verified or unverified relation.<br>
 * <i>Currently, it is suitable for keyword, location and person tags.</i>
 */
const processSimpleTagRelationUpdates = (tagKeyInPictureRelation, data) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[tagKeyInPictureRelation]) return;

  const newTags = [];
  const newVerifiedTags = [];
  for (const tag of data[tagKeyInPictureRelation]) {
    const parsedTag = JSON.parse(tag);

    // Check if custom data is present.
    if (!parsedTag.id) {
      // If not, then it is already a valid tag id here that needs to be kept.
      // Per default these will be in a verified relation to the current picture.
      newVerifiedTags.push(parsedTag);
      continue;
    }

    // Relate the tag in a verified relation to the current picture if not specified otherwise.
    const verified = parsedTag.verified === undefined ? true : parsedTag.verified;
    (verified ? newVerifiedTags : newTags).push(parsedTag.id);
  }

  data[tagKeyInPictureRelation] = newTags;
  data[withVerifiedPrefix(tagKeyInPictureRelation)] = newVerifiedTags;

  strapi.log.debug(`New ${tagKeyInPictureRelation}: [${newTags}]`);
  strapi.log.debug(`New verified ${tagKeyInPictureRelation}: [${newVerifiedTags}]`);
};

const processUpdatesForKeywordTags = data => processSimpleTagRelationUpdates(KEYWORD_TAGS_KEY, data);

const processUpdatesForLocationTags = data => processSimpleTagRelationUpdates(LOCATION_TAGS_KEY, data);

const processUpdatesForPersonTags = data => processSimpleTagRelationUpdates(PERSON_TAGS_KEY, data);

const processTagUpdates = async (pictureQuery, data) => {
  // Process updates of tag relations with additional editing capabilities.
  await processUpdatesForDescriptions(pictureQuery, data);
  await processUpdatesForTimeRangeTag(pictureQuery, data);

  // Process simple updates of tag relations without further editing capabilities.
  processUpdatesForKeywordTags(data);
  processUpdatesForLocationTags(data);
  processUpdatesForPersonTags(data);
};

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // No special handling needed if no data is passed.
    if (!data) return;

    // TODO: does this correctly detect that it was the Admin-Panel that triggered the update?
    if (data.updatedBy) return;

    strapi.log.debug(`Custom tag updates for the picture with id ${where.id}`);
    const pictureQuery = strapi.db.query('api::picture.picture');
    await processTagUpdates(pictureQuery, data);
  },
};
