const { ApplicationError  } = require('@strapi/utils').errors;

const VERIFIED_PREFIX = 'verified_';
const withVerifiedPrefix = (relationKey) => `${VERIFIED_PREFIX}${relationKey}`;

const DESCRIPTIONS_KEY = 'descriptions';
const KEYWORD_TAGS_KEY = 'keyword_tags';
const LOCATION_TAGS_KEY = 'location_tags';
const PERSON_TAGS_KEY = 'person_tags';
const TIME_RANGE_TAG_KEY = 'time_range_tag';

const getQueryEngineAndServiceForTag = (tagKeyInPictureRelation) => {
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

  return {
    tagQuery: strapi.db.query(`api::${tagKeyForApi}.${tagKeyForApi}`),
    tagService: strapi.service(`api::${tagKeyForApi}.${tagKeyForApi}`),
  };
};

const getPreviousPictureInfo = async (pictureQuery, pictureId) => {
  const currentPicture = await pictureQuery.findOne({
    where: { id: pictureId },
    populate: [
      DESCRIPTIONS_KEY,
      KEYWORD_TAGS_KEY,
      withVerifiedPrefix(KEYWORD_TAGS_KEY),
      LOCATION_TAGS_KEY,
      withVerifiedPrefix(LOCATION_TAGS_KEY),
      PERSON_TAGS_KEY,
      withVerifiedPrefix(PERSON_TAGS_KEY),
      TIME_RANGE_TAG_KEY,
      withVerifiedPrefix(TIME_RANGE_TAG_KEY),
    ],
  });

  return {
    previousDescriptions: currentPicture[DESCRIPTIONS_KEY],
    previousKeywordTags: currentPicture[KEYWORD_TAGS_KEY],
    previousVerifiedKeywordTags: currentPicture[withVerifiedPrefix(KEYWORD_TAGS_KEY)],
    previousLocationTags: currentPicture[LOCATION_TAGS_KEY],
    previousVerifiedLocationTags: currentPicture[withVerifiedPrefix(LOCATION_TAGS_KEY)],
    previousPersonTags: currentPicture[PERSON_TAGS_KEY],
    previousVerifiedPersonTags: currentPicture[withVerifiedPrefix(PERSON_TAGS_KEY)],
    previousTimeRangeTag: currentPicture[TIME_RANGE_TAG_KEY],
    previousVerifiedTimeRangeTag: currentPicture[withVerifiedPrefix(TIME_RANGE_TAG_KEY)],
  };
};

const getNewTagId = async (tagQuery, tagService, tagKeyInPictureRelation, newTagValueData, previousTagId) => {
  let newTagId;
  const newTagAlreadyInDB = await tagQuery.findOne({ where: newTagValueData });

  if (newTagAlreadyInDB) {
    newTagId = newTagAlreadyInDB.id;
    strapi.log.debug(`New ${tagKeyInPictureRelation} already exists with id ${newTagAlreadyInDB.id}`);
  } else if (!newTagAlreadyInDB && !previousTagId) {
    const createdTag = await tagService.create({ data: newTagValueData });
    newTagId = createdTag.id;
    strapi.log.debug(`Created new ${tagKeyInPictureRelation} with id ${createdTag.id}`);
  } else {
    await tagQuery.update({ where: { id: previousTagId }, data: newTagValueData });
    strapi.log.debug(`Updated previous ${tagKeyInPictureRelation} with id ${previousTagId}`);
    newTagId = previousTagId;
  }

  return newTagId;
};

const getVerifiedStatusForTagAndPictureRelation = async (tagQuery, tagKeyInPictureRelation, currentPictureId, tagId) => {
  const unchangedTagInDB = await tagQuery.findOne({
    where: { id: tagId },
    populate: {
      pictures: {
        select: ['id']
      },
      verified_pictures: {
        select: ['id']
      }
    }
  });

  if (unchangedTagInDB.pictures.map(picture => picture.id).includes(parseInt(currentPictureId))) {
    strapi.log.debug(`Keep unchanged ${tagKeyInPictureRelation} with id ${tagId} in an unverified relation to picture with id ${currentPictureId}`);
    return false;
  } else if (unchangedTagInDB.verified_pictures.map(picture => picture.id).includes(parseInt(currentPictureId))) {
    strapi.log.debug(`Keep unchanged ${tagKeyInPictureRelation} with id ${tagId} in a verified relation to picture with id ${currentPictureId}`);
    return true;
  } else {
    strapi.log.debug(`Relate the (for the picture with id ${currentPictureId}) new, but already existing ${tagKeyInPictureRelation} with id ${tagId} as verified`);
    return true;
  }
};

// TODO
// const getAdditionalPicturesToUpdate = (meta) => {
//   let additionalPicturesToUpdate = [];
//
//   // If additional picture ids are specified whose pictures should be updated as well, then these are relevant for a recursive update later.
//   // Note that Array.isArray() is undefined safe, so if `updateAdditionalPictures` is undefined, the if statement will result in false.
//   if (Array.isArray(meta.updateAdditionalPictures)) {
//     additionalPicturesToUpdate = meta.updateAdditionalPictures;
//   }
//
//   return additionalPicturesToUpdate;
// };

// Filter out duplicates and the id of the current picture (which shouldn't be updated again)
// const filterAdditionalPictures = (additionalPicturesToUpdate, currentPictureId) =>
//   [...new Set(additionalPicturesToUpdate)].filter(id => id !== currentPictureId);

// TODO
// const updateAdditionalPictures = async (pictureQuery, additionalPicturesToUpdate, tagKeyInPictureRelation, newTagValueData, previousTagId) => {
//   // If additional picture ids are specified that should be updated as well,
//   // fire a recursive update for those pictures (which each trigger this whole lifecycle).
//   if (additionalPicturesToUpdate.length) {
//     const data = {};
//     data[tagKeyInPictureRelation] = JSON.stringify({
//       ...newTagValueData,
//       // Don't trigger further recursive calls.
//       meta: {},
//     });
//
//     for (const pictureId of additionalPicturesToUpdate) {
//       await pictureQuery.update({ where: { id: pictureId }, data });
//     }
//   }
// };

// TODO
// const handleAdditionalPictureUpdates = async (pictureQuery, currentPictureId, tagKeyInPictureRelation, newTagValueData, meta, previousTagId) => {
//   const additionalPicturesToUpdate = filterAdditionalPictures(getAdditionalPicturesToUpdate(meta), currentPictureId);
//   await updateAdditionalPictures(pictureQuery, additionalPicturesToUpdate, tagKeyInPictureRelation, newTagValueData, previousTagId);
// };

const deletePreviousTagIfNeeded = async (pictureQuery, tagQuery, tagKeyInPictureRelation, previousTagId) => {
  if (!previousTagId) return;

  const pictureQueryObject = { where: { $or: [] } };
  pictureQueryObject.where.$or = [
    { [tagKeyInPictureRelation]: previousTagId },
    { [withVerifiedPrefix(tagKeyInPictureRelation)]: previousTagId }
  ];
  const picturesWithPreviousTag = await pictureQuery.findMany(pictureQueryObject);

  // No cleanup needed when there are still pictures related to the previous tag.
  // We need to use 2 here, because we are still in the beforeUpdate hook,
  // so after the hook the regular update will un-relate one picture if we get here.
  if (picturesWithPreviousTag.length >= 2) return;

  // Otherwise, clean up the previous tag
  await tagQuery.delete({ where: { id: previousTagId } });
  strapi.log.debug(`Deleted the previous ${tagKeyInPictureRelation} with id ${previousTagId} as its not related anymore`);
};

const processUpdateForSingleTag = async (pictureQuery, currentPictureId, tagKeyInPictureRelation, tagQuery, tagService, newTagValueData, meta, previousTagId) => {
  const newTagId = await getNewTagId(tagQuery, tagService, tagKeyInPictureRelation, newTagValueData, previousTagId);
  // await handleAdditionalPictureUpdates(pictureQuery, currentPictureId, tagKeyInPictureRelation, newTagValueData, meta, previousTagId);
  return newTagId;
};

const processUpdatesForDescriptions = async (pictureQuery, currentPictureId, data) => {
  // Check whether we actually need to update stuff for that type.
  if (!data[DESCRIPTIONS_KEY]) return;

  const { tagQuery, tagService } = getQueryEngineAndServiceForTag(DESCRIPTIONS_KEY);

  const newDescriptions = [];
  for (const description of data[DESCRIPTIONS_KEY]) {
    const parsedDescription = JSON.parse(description);

    // Here we make sure that it is really our custom handling that triggered the update.
    if (!parsedDescription.meta) {
      // If not, then it is already a valid ID here that needs to be kept.
      newDescriptions.push(parsedDescription);
      continue;
    }

    const newDescriptionData = {
      text: parsedDescription.text
    };

    const newDescriptionId = await processUpdateForSingleTag(
      pictureQuery,
      currentPictureId,
      DESCRIPTIONS_KEY,
      tagQuery,
      tagService,
      newDescriptionData,
      parsedDescription.meta,
      parsedDescription.prevId
    );

    newDescriptions.push(newDescriptionId);
  }

  data[DESCRIPTIONS_KEY] = newDescriptions;

  // Delete previous descriptions that will be unrelated after the current picture update
  const { previousDescriptions } = await getPreviousPictureInfo(pictureQuery, currentPictureId);
  const previousDescriptionsToDelete = [...previousDescriptions]
    // Description is defined
    .filter(description => description)
    // Description will be unrelated to the current picture afterwards
    .filter(description => !newDescriptions.includes(description.id))
  for (const descriptionToDelete of previousDescriptionsToDelete) {
    await deletePreviousTagIfNeeded(pictureQuery, tagQuery, DESCRIPTIONS_KEY, descriptionToDelete.id);
  }
};

const processUpdatesForKeywordTags = async (pictureQuery, currentPictureId, data) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[KEYWORD_TAGS_KEY]) return;

  const { tagQuery, tagService } = getQueryEngineAndServiceForTag(KEYWORD_TAGS_KEY);

  const newKeywordTags = [];
  const newVerifiedKeywordTags = [];
  for (const keywordTag of data[KEYWORD_TAGS_KEY]) {
    const parsedKeywordTag = JSON.parse(keywordTag);

    // Here we make sure that it is really our custom handling that triggered the update.
    if (!parsedKeywordTag.meta) {
      // If not, then it is already a valid ID here that needs to be kept.
      // But it needs to be queried whether it should be in a verified or unverified relation first.
      const shouldBeInVerifiedRelation = await getVerifiedStatusForTagAndPictureRelation(
        tagQuery,
        KEYWORD_TAGS_KEY,
        currentPictureId,
        parsedKeywordTag
      );
      (shouldBeInVerifiedRelation ? newVerifiedKeywordTags : newKeywordTags).push(parsedKeywordTag);
      continue;
    }

    const newKeywordTagData = {
      name: parsedKeywordTag.name
    };

    const newKeywordTagId = await processUpdateForSingleTag(
      pictureQuery,
      currentPictureId,
      KEYWORD_TAGS_KEY,
      tagQuery,
      tagService,
      newKeywordTagData,
      parsedKeywordTag.meta,
      parsedKeywordTag.prevId
    );

    (parsedKeywordTag.verified ? newVerifiedKeywordTags : newKeywordTags).push(newKeywordTagId);
  }

  data[KEYWORD_TAGS_KEY] = newKeywordTags;
  data[withVerifiedPrefix(KEYWORD_TAGS_KEY)] = newVerifiedKeywordTags;

  // Delete previous tags that will be unrelated after the current picture update
  const { previousKeywordTags, previousVerifiedKeywordTags } = await getPreviousPictureInfo(pictureQuery, currentPictureId);
  const previousTagsToDelete = [...previousKeywordTags, ...previousVerifiedKeywordTags]
    // Tag is defined
    .filter(tag => tag)
    // Tag will be unrelated to the current picture afterwards
    .filter(tag => !newKeywordTags.includes(tag.id) && !newVerifiedKeywordTags.includes(tag.id))
  for (const tagToDelete of previousTagsToDelete) {
    await deletePreviousTagIfNeeded(pictureQuery, tagQuery, KEYWORD_TAGS_KEY, tagToDelete.id);
  }
};

const processUpdatesForLocationTags = async (pictureQuery, currentPictureId, data) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[LOCATION_TAGS_KEY]) return;

  const { tagQuery, tagService } = getQueryEngineAndServiceForTag(LOCATION_TAGS_KEY);

  const newLocationTags = [];
  const newVerifiedLocationTags = [];
  for (const locationTag of data[LOCATION_TAGS_KEY]) {
    const parsedLocationTag = JSON.parse(locationTag);

    // Here we make sure that it is really our custom handling that triggered the update.
    if (!parsedLocationTag.meta) {
      // If not, then it is already a valid ID here that needs to be kept.
      // But it needs to be queried whether it should be in a verified or unverified relation first.
      const shouldBeInVerifiedRelation = await getVerifiedStatusForTagAndPictureRelation(
        tagQuery,
        LOCATION_TAGS_KEY,
        currentPictureId,
        parsedLocationTag
      );
      (shouldBeInVerifiedRelation ? newVerifiedLocationTags : newLocationTags).push(parsedLocationTag);
      continue;
    }

    const newLocationTagData = {
      name: parsedLocationTag.name
    };
    if (parsedLocationTag.coordinates) {
      newLocationTagData.coordinates = {
        latitude: parsedLocationTag.coordinates.latitude,
        longitude: parsedLocationTag.coordinates.longitude
      };
    }

    const newLocationTagId = await processUpdateForSingleTag(
      pictureQuery,
      currentPictureId,
      LOCATION_TAGS_KEY,
      tagQuery,
      tagService,
      newLocationTagData,
      parsedLocationTag.meta,
      parsedLocationTag.prevId
    );

    (parsedLocationTag.verified ? newVerifiedLocationTags : newLocationTags).push(newLocationTagId);
  }

  data[LOCATION_TAGS_KEY] = newLocationTags;
  data[withVerifiedPrefix(LOCATION_TAGS_KEY)] = newVerifiedLocationTags;

  // Delete previous tags that will be unrelated after the current picture update
  const { previousLocationTags, previousVerifiedLocationTags } = await getPreviousPictureInfo(pictureQuery, currentPictureId);
  const previousTagsToDelete = [...previousLocationTags, ...previousVerifiedLocationTags]
    // Tag is defined
    .filter(tag => tag)
    // Tag will be unrelated to the current picture afterwards
    .filter(tag => !newLocationTags.includes(tag.id) && !newVerifiedLocationTags.includes(tag.id))
  for (const tagToDelete of previousTagsToDelete) {
    await deletePreviousTagIfNeeded(pictureQuery, tagQuery, LOCATION_TAGS_KEY, tagToDelete.id);
  }
};

const processUpdatesForPersonTags = async (pictureQuery, currentPictureId, data) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[PERSON_TAGS_KEY]) return;

  const { tagQuery, tagService } = getQueryEngineAndServiceForTag(PERSON_TAGS_KEY);

  const newPersonTags = [];
  const newVerifiedPersonTags = [];
  for (const personTag of data[PERSON_TAGS_KEY]) {
    const parsedPersonTag = JSON.parse(personTag);

    // Here we make sure that it is really our custom handling that triggered the update.
    if (!parsedPersonTag.meta) {
      // If not, then it is already a valid ID here that needs to be kept.
      // But it needs to be queried whether it should be in a verified or unverified relation first.
      const shouldBeInVerifiedRelation = await getVerifiedStatusForTagAndPictureRelation(
        tagQuery,
        PERSON_TAGS_KEY,
        currentPictureId,
        parsedPersonTag
      );
      (shouldBeInVerifiedRelation ? newVerifiedPersonTags : newPersonTags).push(parsedPersonTag);
      continue;
    }

    const newPersonTagData = {
      name: parsedPersonTag.name
    };

    const newPersonTagId = await processUpdateForSingleTag(
      pictureQuery,
      currentPictureId,
      PERSON_TAGS_KEY,
      tagQuery,
      tagService,
      newPersonTagData,
      parsedPersonTag.meta,
      parsedPersonTag.prevId
    );

    (parsedPersonTag.verified ? newVerifiedPersonTags : newPersonTags).push(newPersonTagId);
  }

  data[PERSON_TAGS_KEY] = newPersonTags;
  data[withVerifiedPrefix(PERSON_TAGS_KEY)] = newVerifiedPersonTags;

  // Delete previous tags that will be unrelated after the current picture update
  const { previousPersonTags, previousVerifiedPersonTags } = await getPreviousPictureInfo(pictureQuery, currentPictureId);
  const previousTagsToDelete = [...previousPersonTags, ...previousVerifiedPersonTags]
    // Tag is defined
    .filter(tag => tag)
    // Tag will be unrelated to the current picture afterwards
    .filter(tag => !newPersonTags.includes(tag.id) && !newVerifiedPersonTags.includes(tag.id))
  for (const tagToDelete of previousTagsToDelete) {
    await deletePreviousTagIfNeeded(pictureQuery, tagQuery, PERSON_TAGS_KEY, tagToDelete.id);
  }
};

const processUpdatesForTimeRangeTag = async (pictureQuery, currentPictureId, data) => {
  // Check whether we actually need to update stuff for that tag type.
  if (!data[TIME_RANGE_TAG_KEY]) return;

  const { tagQuery, tagService } = getQueryEngineAndServiceForTag(TIME_RANGE_TAG_KEY);

  const parsedTimeRangeTag = JSON.parse(data[TIME_RANGE_TAG_KEY]);

  // Here we make sure that it is really our custom handling that triggered the update.
  if (!parsedTimeRangeTag.meta) return;

  const newTimeRangeTagData = {
    start: parsedTimeRangeTag.start,
    end: parsedTimeRangeTag.end,
  };

  const newTimeRangeTagId = await processUpdateForSingleTag(
    pictureQuery,
    currentPictureId,
    TIME_RANGE_TAG_KEY,
    tagQuery,
    tagService,
    newTimeRangeTagData,
    parsedTimeRangeTag.meta,
    parsedTimeRangeTag.prevId
  )

  // Assert the picture only gets one time-range-tag assigned (independent of the verified status)
  data[TIME_RANGE_TAG_KEY] = parsedTimeRangeTag.verified ? null : newTimeRangeTagId;
  data[withVerifiedPrefix(TIME_RANGE_TAG_KEY)] = parsedTimeRangeTag.verified ? newTimeRangeTagId : null;

  // Delete previous tags that will be unrelated after the current picture update
  const { previousTimeRangeTag, previousVerifiedTimeRangeTag } = await getPreviousPictureInfo(pictureQuery, currentPictureId);
  const previousTagsToDelete = [previousTimeRangeTag, previousVerifiedTimeRangeTag]
    // Tag is defined
    .filter(tag => tag)
    // Tag will be unrelated to the current picture afterwards
    .filter(tag => tag.id !== newTimeRangeTagId)
  for (const tagToDelete of previousTagsToDelete) {
    await deletePreviousTagIfNeeded(pictureQuery, tagQuery, TIME_RANGE_TAG_KEY, tagToDelete.id);
  }
};

const processUpdates = async (pictureQuery, currentPictureId, data) => {
  await processUpdatesForDescriptions(pictureQuery, currentPictureId, data);
  await processUpdatesForKeywordTags(pictureQuery, currentPictureId, data);
  await processUpdatesForLocationTags(pictureQuery, currentPictureId, data);
  await processUpdatesForPersonTags(pictureQuery, currentPictureId, data);
  await processUpdatesForTimeRangeTag(pictureQuery, currentPictureId, data);
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
    await processUpdates(pictureQuery, where.id, data);
  },
};
