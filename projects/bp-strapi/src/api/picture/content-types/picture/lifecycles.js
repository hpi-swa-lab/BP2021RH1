module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    if (!data || !data.title) return;

    // That will fail here, if you don't escape the double quotes
    // so e.g. like "{\"customUpdate\":true,\"text\":\"1975\"}"
    // Maybe we need to fallback on the old title in a try/catch block then.
    const parsedTitleObject = JSON.parse(data.title);
    if (!parsedTitleObject.customUpdate) return;
    const newTitleText = parsedTitleObject.text;

    const titleQuery = strapi.db.query("api::title.title");
    const titleService = strapi.service("api::title.title");
    const pictureQuery = strapi.db.query("api::picture.picture");

    const pictureToUpdate = await pictureQuery.findOne({
      populate: ['title'],
      where: { id: where.id },
    });
    strapi.log.info(`Custom title update for picture with id ${pictureToUpdate.id}`);

    const oldTitleInDB = pictureToUpdate.title;
    strapi.log.debug(oldTitleInDB
      ? `Old title "${oldTitleInDB.text}" with id ${oldTitleInDB.id}`
      : `Picture with id ${pictureToUpdate.id} previously had no title`
    );

    let titleIdForUpdate;
    const newTitleAlreadyInDB = await titleQuery.findOne({
      //  implicit $eq filter on the text here
      where: { text: newTitleText },
    });

    if (newTitleAlreadyInDB) {
      titleIdForUpdate = newTitleAlreadyInDB.id;
      strapi.log.debug(`New title "${newTitleAlreadyInDB.text}" already exists in DB with id ${newTitleAlreadyInDB.id}`);
    } else {
      const createdTitle = await titleService.create({
        data: { text: parsedTitleObject.text },
      });
      titleIdForUpdate = createdTitle.id;
      strapi.log.debug(`Created new title "${createdTitle.text}" in DB with id ${createdTitle.id}`);
    }

    event.params.data.title = titleIdForUpdate;

    // There is no cleanup needed if the picture previously didn't have a title.
    if (!oldTitleInDB) return;

    const picturesWithOldTitle = await pictureQuery.findMany({
      where: { title: oldTitleInDB.id },
    });

    // Cleanup old title if it is going to be unrelated after our custom update
    if (titleIdForUpdate !== oldTitleInDB.id && picturesWithOldTitle.length < 2) {
      await titleQuery.delete({
        where: { id: oldTitleInDB.id },
      });
      strapi.log.debug(`Deleted the old title "${oldTitleInDB.text}" with id ${oldTitleInDB.id} as its not related anymore`);
    }
  },
};
