module.exports = {
  async beforeUpdate(event) {
    const { data } = event.params;

    console.log(data);

    if (!data) return;

    if (!data.title) return;

    const titleObject = JSON.parse(data.title);
    console.log(titleObject);

    if (!titleObject.customUpload) return;

    const titleQuery = strapi.db.query("api::title.title");
    const titleService = strapi.service("api::title.title");

    let newTitleId;
    const newTitleInDB = await titleQuery.findOne({
      where: {
        text: {
          $containsi: titleObject.text,
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
          text: titleObject.text,
        },
      });
      if (createdTitle) newTitleId = createdTitle.id;
      console.log("Use of created title, id: " + createdTitle.id);
    }

    // delete old title entity if picture was the only one related to it
    event.params.data.title = newTitleId;
  },
};
