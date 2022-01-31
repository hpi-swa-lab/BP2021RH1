module.exports = {
  async beforeUpdate(event) {
    const { data } = event.params;

    console.log(event);

    if (!data) return;

    if (!data.title || !data.title.customUpdate) return;

    const titleQuery = strapi.db.query("api::title.title");
    const titleService = strapi.service("api::title.title");

    let newTitleId;
    const newTitleInDB = await titleQuery.findOne({
      where: {
        text: {
          $containsi: data.title.text,
        },
      },
    });
    console.log("New title already in DB: " + newTitleInDB);

    if (newTitleInDB) {
      newTitleId = newTitleInDB.id;
      console.log("Use of existing title, id: " + newTitleInDB.id);
    } else {
      const createdTitle = await titleService.create({
        data: {
          text: data.title.text,
        },
      });
      if (createdTitle) newTitleId = createdTitle.id;
      console.log("Use of created title, id: " + createdTitle.id);
    }

    // delete old title entity if picture was the only one related to it
    event.params.data.title = newTitleId;
  },
};
