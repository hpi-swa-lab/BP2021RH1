const retrieveOldPictureInfo = async (pictureQuery, pictureId) => {
  const currentPictureToUpdate = await pictureQuery.findOne({
    where: { id: pictureId },
    populate: ['title'],
  });
  strapi.log.info(`Custom title update for picture with id ${currentPictureToUpdate.id}`);

  const oldTitleInDB = currentPictureToUpdate.title;
  strapi.log.debug(oldTitleInDB
    ? `Old title "${oldTitleInDB.text}" with id ${oldTitleInDB.id}`
    : `Picture with id ${currentPictureToUpdate.id} previously had no title`
  );

  return {
    currentPictureToUpdate,
    oldTitleInDB,
  };
}

const findOrCreateTitle = async (titleQuery, titleService, text) => {
  let newTitleId;
  const newTitleAlreadyInDB = await titleQuery.findOne({ where: { text } });

  if (newTitleAlreadyInDB) {
    newTitleId = newTitleAlreadyInDB.id;
    strapi.log.debug(`New title "${newTitleAlreadyInDB.text}" already exists in DB with id ${newTitleAlreadyInDB.id}`);
  } else {
    const createdTitle = await titleService.create({ data: { text } });
    newTitleId = createdTitle.id;
    strapi.log.debug(`Created new title "${createdTitle.text}" in DB with id ${createdTitle.id}`);
  }

  return newTitleId;
};

const deleteOldTitleIfNeeded = async (pictureQuery, titleQuery, oldTitleInDB, newTitleId) => {
  if (!oldTitleInDB) return;

  const picturesWithOldTitle = await pictureQuery.findMany({ where: { title: oldTitleInDB.id } });

  // No cleanup needed when there are still pictures related to the old title
  if (newTitleId === oldTitleInDB.id || picturesWithOldTitle.length >= 2) return;

  // Otherwise clean up the old title
  await titleQuery.delete({ where: { id: oldTitleInDB.id } });
  strapi.log.debug(`Deleted the old title "${oldTitleInDB.text}" with id ${oldTitleInDB.id} as its not related anymore`);
};

const getAdditionalPicturesToUpdate = async (pictureQuery, meta, oldTitleInDB) => {
  let additionalPicturesToUpdate = [];

  // If additional picture ids are specified whose pictures should be updated as well,
  // then these are relevant for a recursive update later.
  // Note that Array.isArray() is undefined safe, so if `updateAdditionalPictures` is undefined,
  // the if statement will result in false.
  if (Array.isArray(meta.updateAdditionalPictures)) {
    additionalPicturesToUpdate = meta.updateAdditionalPictures;
  }

  if (!oldTitleInDB) return additionalPicturesToUpdate;

  const picturesWithOldTitle = await pictureQuery.findMany({ where: { title: oldTitleInDB.id } });

  // If its also specified that all pictures related to the old title should be updated as well,
  // then the ids of those pictures are also relevant for a recursive update later.
  if (meta.updateAllRelatedPictures) {
    additionalPicturesToUpdate = additionalPicturesToUpdate.concat(
      picturesWithOldTitle.map(picture => picture.id)
    );
  }

  return additionalPicturesToUpdate;
}

// Filter out duplicates and the id of the current picture (which shouldn't be updated again)
const filterAdditionalPictures = (additionalPicturesToUpdate, currentPictureToUpdate) =>
  [...new Set(additionalPicturesToUpdate)].filter(id => id !== currentPictureToUpdate.id);

const updateAdditionalPictures = async (pictureQuery, additionalPicturesToUpdate, text) => {
  // If additional picture ids are specified that should be updated as well,
  // fire an recursive update for those pictures (which each trigger this whole lifecycle).
  if (additionalPicturesToUpdate.length) {
    // Use of sequential awaiting of promises to run the picture updates one by one
    // see https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/
    additionalPicturesToUpdate.reduce(async (previousPictureUpdatePromise, nextPictureId) => {
      await previousPictureUpdatePromise;
      // The strapi query operations each return a promise,
      // that will be awaited in the next iteration of the reduce process.
      return pictureQuery.update({
        where: { id: nextPictureId },
        data: {
          // Also stringify the stuff here, as that is what the lifecycle expects
          title: JSON.stringify({
            text,
            // don't trigger further recursive calls down here
            meta: {},
          }),
        }
      });
    }, Promise.resolve());
  }
};

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    if (!data || !data.title) return;

    // That will fail here, if you don't escape the double quotes
    // so e.g. like "{\"text\":\"1975\",\"meta\":{}}}"
    // Maybe we need to fallback on the old title in a try/catch block then.
    const parsedNewTitleObject = JSON.parse(data.title);

    // Here we make sure that it is really our custom handling that triggered the update.
    if (!parsedNewTitleObject.meta) return;

    const titleQuery = strapi.db.query("api::title.title");
    const titleService = strapi.service("api::title.title");
    const pictureQuery = strapi.db.query("api::picture.picture");

    const { currentPictureToUpdate, oldTitleInDB } = await retrieveOldPictureInfo(pictureQuery, where.id);

    const { text, meta } = parsedNewTitleObject;

    const newTitleId = await findOrCreateTitle(titleQuery, titleService, text);
    // Overwrite our custom params from the frontend in order to make the actual update work
    event.params.data.title = newTitleId;

    const additionalPicturesToUpdate = filterAdditionalPictures(
      await getAdditionalPicturesToUpdate(pictureQuery, meta, oldTitleInDB),
      currentPictureToUpdate
    );

    await updateAdditionalPictures(pictureQuery, additionalPicturesToUpdate, text);

    await deleteOldTitleIfNeeded(pictureQuery, titleQuery, oldTitleInDB, newTitleId);
  },
};
